import React, { useEffect, useState } from "react";
import axios from "../../services/api";

// Normalizes a stored phone number into the digits-only, country-coded
// format wa.me expects (e.g. "9876543210" -> "919876543210").
// Assumes India (+91) for bare 10-digit numbers; adjust COUNTRY_CODE if needed.
const COUNTRY_CODE = "91";
const toWhatsAppNumber = (rawPhone) => {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10) return `${COUNTRY_CODE}${digits}`;
  return digits; // already has a country code (or some other format)
};

// Fee.month is stored as a full English month name and Fee.year as the
// real calendar year that month falls in (see server/src/utils/academicMonths.js),
// so "this month's" record is just a name+year match against today's date.
const getCurrentMonthFee = (fees = []) => {
  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  return fees.find((f) => f.month === monthName && f.year === year) || null;
};

const CURRENT_MONTH_NAME = new Date().toLocaleString("en-US", { month: "long" });

// due | partial | paid | no-record (no fee generated for this month yet)
const getMonthStatus = (monthFee) => {
  if (!monthFee) return "no-record";
  if (monthFee.amountPaid <= 0) return "due";
  if (monthFee.amountPaid < monthFee.amountDue) return "partial";
  return "paid";
};

const buildReminderMessage = (studentName, monthFee, status) => {
  const due = monthFee?.amountDue ?? 0;
  const paid = monthFee?.amountPaid ?? 0;
  const balance = Math.max(due - paid, 0);

  if (status === "paid") {
    return (
      `Hello, this is regarding ${studentName}'s fees for ${CURRENT_MONTH_NAME}.\n` +
      `Your fee for this month has already been paid in full. Please ignore this message. Thank you.`
    );
  }

  if (status === "partial") {
    return (
      `Hello, this is a fee reminder for ${studentName} for ${CURRENT_MONTH_NAME}.\n` +
      `Amount Due: ₹${due}\n` +
      `Paid so far: ₹${paid}\n` +
      `Remaining Balance: ₹${balance}\n` +
      `A partial payment has been received — kindly clear the remaining balance at your earliest convenience. Thank you.`
    );
  }

  // "due" (nothing paid yet)
  return (
    `Hello, this is a fee reminder for ${studentName} for ${CURRENT_MONTH_NAME}.\n` +
    `Amount Due: ₹${due}\n` +
    `Please clear the pending fee at your earliest convenience. Thank you.`
  );
};

const STATUS_BADGE = {
  due: { label: "Due", cls: "bg-red-100 text-red-700" },
  partial: { label: "Partial", cls: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Paid", cls: "bg-green-100 text-green-700" },
  "no-record": { label: "No Record", cls: "bg-gray-100 text-gray-500" },
};

const BUTTON_LABEL = {
  due: "📲 Send Reminder",
  partial: "📲 Send Reminder (Partial)",
  paid: "✅ Notify (Paid)",
  "no-record": "📲 Send Reminder",
};

const openWhatsAppReminder = (student, monthFee, status) => {
  const number = toWhatsAppNumber(student.phone);
  if (!number) {
    alert(`No phone number on file for ${student.name}.`);
    return;
  }
  const text = buildReminderMessage(student.name, monthFee, status);
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const TeacherFees = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/class/my-classes")
      .then((res) => setClasses(res.data?.data || []))
      .catch((err) => console.log(err));
  }, []);

  const loadFees = async (id) => {
    if (!id) {
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`/fee/class/${id}`);
      setData(res.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load fee data");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const id = e.target.value;
    setClassId(id);
    loadFees(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">💰 Student Fees</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Fee status for students in your class
        </p>
      </div>

      <select
        value={classId}
        onChange={handleClassChange}
        className="w-full sm:w-auto border p-2 rounded"
      >
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} - {c.section}
          </option>
        ))}
      </select>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading...</p>}

      {data && data.students.length === 0 && (
        <div className="bg-white shadow rounded p-6 text-center text-gray-400">
          No students in this class yet.
        </div>
      )}

      {data && data.students.length > 0 && (
        <>
          {/* Mobile: stacked cards, no horizontal scroll */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {data.students.map(({ student, fees, totalDue, totalPaid, balance }) => {
              const monthFee = getCurrentMonthFee(fees);
              const status = getMonthStatus(monthFee);
              const badge = STATUS_BADGE[status];
              const buttonLabel = BUTTON_LABEL[status];

              return (
                <div
                  key={student._id}
                  className="bg-white shadow rounded p-4 space-y-3 break-words"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {student.phone || "No phone on file"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-1 text-xs rounded ${
                        balance === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {balance === 0 ? "Clear" : "Due"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Total Due</p>
                      <p className="font-medium">₹{totalDue}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Paid</p>
                      <p className="font-medium text-green-600">₹{totalPaid}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Balance</p>
                      <p className="font-semibold">₹{balance}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t">
                    <span className="text-xs text-gray-500">{CURRENT_MONTH_NAME}:</span>
                    <span className={`px-2 py-1 text-xs rounded ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>

                  <button
                    onClick={() => openWhatsAppReminder(student, monthFee, status)}
                    disabled={!student.phone}
                    title={
                      student.phone
                        ? "Open WhatsApp with a pre-filled message"
                        : "No phone number on file"
                    }
                    className={`w-full text-sm px-3 py-2 rounded ${
                      !student.phone
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : status === "paid"
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : status === "partial"
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Desktop/tablet: table */}
          <div className="hidden md:block bg-white shadow rounded overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Student</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Total Due</th>
                  <th className="p-2 text-left">Paid</th>
                  <th className="p-2 text-left">Balance</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">{CURRENT_MONTH_NAME} Fee</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map(({ student, fees, totalDue, totalPaid, balance }) => {
                  const monthFee = getCurrentMonthFee(fees);
                  const status = getMonthStatus(monthFee);
                  const badge = STATUS_BADGE[status];
                  const buttonLabel = BUTTON_LABEL[status];

                  return (
                    <tr key={student._id} className="border-t">
                      <td className="p-2 font-medium truncate">{student.name}</td>
                      <td className="p-2 text-gray-500 truncate">{student.phone || "—"}</td>
                      <td className="p-2">₹{totalDue}</td>
                      <td className="p-2 text-green-600">₹{totalPaid}</td>
                      <td className="p-2 font-semibold">₹{balance}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            balance === 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {balance === 0 ? "Clear" : "Due"}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 text-xs rounded ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => openWhatsAppReminder(student, monthFee, status)}
                          disabled={!student.phone}
                          title={
                            student.phone
                              ? "Open WhatsApp with a pre-filled message"
                              : "No phone number on file"
                          }
                          className={`text-xs px-3 py-1 rounded ${
                            !student.phone
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : status === "paid"
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : status === "partial"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {buttonLabel}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherFees;