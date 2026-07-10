import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { ACADEMIC_MONTHS } from "../../constants/academicMonths";

// Derives a clear status from the two raw numbers instead of trusting
// a separate flag that could drift out of sync.
const getFeeStatus = (fee) => {
  const due = fee.amountDue || 0;
  const paid = fee.amountPaid || 0;
  const balance = Math.max(due - paid, 0);

  let label = "Unpaid";
  let classes = "bg-red-100 text-red-700";

  if (due === 0) {
    label = "No Fee";
    classes = "bg-gray-100 text-gray-500";
  } else if (balance === 0) {
    label = "Paid";
    classes = "bg-green-100 text-green-700";
  } else if (paid > 0) {
    label = "Partial";
    classes = "bg-yellow-100 text-yellow-700";
  }

  return { due, paid, balance, label, classes };
};

const AdminFees = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [totalFeeInput, setTotalFeeInput] = useState("");
  const [classFeeData, setClassFeeData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Inline edit box state — which fee record is open, and its draft values
  const [editingFeeId, setEditingFeeId] = useState(null);
  const [editDue, setEditDue] = useState("");
  const [editPaid, setEditPaid] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    axios
      .get("/class")
      .then((res) => setClasses(res.data?.data || res.data?.classes || []))
      .catch((err) => console.log(err));
  }, []);

  const loadClassFees = async (id) => {
    if (!id) {
      setClassFeeData(null);
      return;
    }
    try {
      const res = await axios.get(`/fee/class/${id}`);
      setClassFeeData(res.data?.data || null);
      setTotalFeeInput(res.data?.data?.totalFee ?? "");
    } catch (err) {
      console.log(err);
      setClassFeeData(null);
    }
  };

  const handleClassChange = (e) => {
    const id = e.target.value;
    setClassId(id);
    setMessage("");
    setEditingFeeId(null);
    loadClassFees(id);
  };

  const handleSetFee = async () => {
    if (!classId || totalFeeInput === "") {
      setMessage("Select a class and enter a total fee amount");
      return;
    }
    try {
      setSaving(true);
      await axios.post(`/fee/class/${classId}/set`, {
        totalFee: Number(totalFeeInput),
      });
      setMessage("Total fee saved — monthly records generated");
      await loadClassFees(classId);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save fee");
    } finally {
      setSaving(false);
    }
  };

  // ---- CRUD on a single month's fee record ----

  const startEdit = (fee) => {
    setEditingFeeId(fee._id);
    setEditDue(String(fee.amountDue ?? 0));
    setEditPaid(String(fee.amountPaid ?? 0)); // pre-fill with the REAL paid amount, not the due amount
    setMessage("");
  };

  const cancelEdit = () => setEditingFeeId(null);

  const saveEdit = async (fee) => {
    try {
      setBusy(true);
      await axios.put(`/fee/${fee._id}/pay`, {
        amountDue: Number(editDue),
        amountPaid: Number(editPaid),
      });
      setEditingFeeId(null);
      await loadClassFees(classId);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update fee record");
    } finally {
      setBusy(false);
    }
  };

  const resetPayment = async (fee) => {
    if (!window.confirm(`Reset ${fee.month} back to unpaid for this student?`)) return;
    try {
      setBusy(true);
      await axios.put(`/fee/${fee._id}/pay`, { amountPaid: 0 });
      setEditingFeeId(null);
      await loadClassFees(classId);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset payment");
    } finally {
      setBusy(false);
    }
  };

  const deleteRecord = async (fee) => {
    if (
      !window.confirm(
        `Delete the ${fee.month} fee record entirely for this student? This can't be undone.`
      )
    )
      return;
    try {
      setBusy(true);
      await axios.delete(`/fee/${fee._id}`);
      setEditingFeeId(null);
      await loadClassFees(classId);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete fee record");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Fee Management</h1>
        <p className="text-gray-500">Set class fees and track monthly payments</p>
      </div>

      {message && (
        <div className="p-3 bg-blue-100 text-blue-700 rounded">{message}</div>
      )}

      <div className="bg-white p-4 rounded shadow grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            value={classId}
            onChange={handleClassChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Total Fee (₹, for the full academic year)
          </label>
          <input
            type="number"
            min="0"
            value={totalFeeInput}
            onChange={(e) => setTotalFeeInput(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. 60000"
            disabled={!classId}
          />
        </div>

        <button
          onClick={handleSetFee}
          disabled={!classId || saving}
          className="bg-black text-white px-4 py-2 rounded font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & Generate Monthly Fees"}
        </button>
      </div>

      <p className="text-xs text-gray-400">
        This divides the total fee evenly across the 12 months of the academic
        year (April–March) for every student currently in the class. Existing
        months keep their payment record — only missing months are added and
        the due amount refreshes.
      </p>

      {classFeeData && (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left sticky left-0 bg-gray-100">Student</th>
                {ACADEMIC_MONTHS.map((m) => (
                  <th key={m} className="p-2 border">{m.slice(0, 3)}</th>
                ))}
                <th className="p-2 border">Total Paid</th>
                <th className="p-2 border">Balance Due</th>
              </tr>
            </thead>
            <tbody>
              {classFeeData.students.map(({ student, fees, totalPaid, balance }) => (
                <tr key={student._id} className="border-t align-top">
                  <td className="p-2 border font-medium sticky left-0 bg-white">
                    {student.name}
                  </td>
                  {ACADEMIC_MONTHS.map((m) => {
                    const fee = fees.find((f) => f.month === m);
                    if (!fee) {
                      return (
                        <td key={m} className="p-2 border text-center text-gray-300">—</td>
                      );
                    }

                    const status = getFeeStatus(fee);

                    return (
                      <td key={m} className="p-1 border text-center">
                        {editingFeeId === fee._id ? (
                          <div className="flex flex-col gap-1 items-stretch bg-gray-50 border rounded p-2 text-left w-36">
                            <label className="text-[10px] text-gray-500">Due (₹)</label>
                            <input
                              type="number"
                              min="0"
                              value={editDue}
                              onChange={(e) => setEditDue(e.target.value)}
                              className="border rounded p-1 text-xs"
                            />
                            <label className="text-[10px] text-gray-500">Paid (₹)</label>
                            <input
                              type="number"
                              min="0"
                              value={editPaid}
                              onChange={(e) => setEditPaid(e.target.value)}
                              className="border rounded p-1 text-xs"
                            />

                            <div className="flex gap-1 mt-1">
                              <button
                                onClick={() => saveEdit(fee)}
                                disabled={busy}
                                className="flex-1 text-[11px] bg-green-600 text-white py-1 rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex-1 text-[11px] border py-1 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => resetPayment(fee)}
                                disabled={busy}
                                className="flex-1 text-[11px] bg-yellow-100 text-yellow-700 py-1 rounded"
                              >
                                Reset
                              </button>
                              <button
                                onClick={() => deleteRecord(fee)}
                                disabled={busy}
                                className="flex-1 text-[11px] bg-red-100 text-red-700 py-1 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(fee)}
                            className="w-full text-left px-2 py-1 rounded hover:bg-gray-50"
                          >
                            <div className={`text-[11px] font-semibold px-1.5 py-0.5 rounded inline-block ${status.classes}`}>
                              {status.label}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1">
                              Paid ₹{status.paid} / ₹{status.due}
                            </div>
                            {status.balance > 0 && (
                              <div className="text-[10px] text-red-500">
                                ₹{status.balance} due
                              </div>
                            )}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-2 border text-center font-semibold text-green-700">
                    ₹{totalPaid}
                  </td>
                  <td className="p-2 border text-center font-semibold">₹{balance}</td>
                </tr>
              ))}

              {classFeeData.students.length === 0 && (
                <tr>
                  <td colSpan={15} className="p-4 text-center text-gray-400">
                    No students in this class yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFees;