import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { useAuth } from "../../Context/AuthContext";

const StudentFees = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`/fee/student/${user.id}`)
      .then((res) => setData(res.data?.data || null))
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load fee details");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p>Loading fee details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data || data.fees.length === 0) {
    return (
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">💰 My Fees</h1>
        <p className="text-gray-500">
          No fee record found yet — your school hasn't set a fee amount for your class.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">💰 My Fees</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Total Fee</p>
          <p className="text-xl font-bold">₹{data.totalDue}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Paid So Far</p>
          <p className="text-xl font-bold text-green-600">₹{data.totalPaid}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Balance Due</p>
          <p className="text-xl font-bold text-red-600">₹{data.balance}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Month</th>
              <th className="p-2 text-left">Amount Due</th>
              <th className="p-2 text-left">Amount Paid</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Paid On</th>
            </tr>
          </thead>
          <tbody>
            {data.fees.map((f) => {
              const paid = f.amountPaid >= f.amountDue && f.amountDue > 0;
              return (
                <tr key={f._id} className="border-t">
                  <td className="p-2 font-medium">{f.month}</td>
                  <td className="p-2">₹{f.amountDue}</td>
                  <td className="p-2">₹{f.amountPaid}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        paid
                          ? "bg-green-100 text-green-700"
                          : f.amountPaid > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {paid ? "Paid" : f.amountPaid > 0 ? "Partial" : "Due"}
                    </span>
                  </td>
                  <td className="p-2 text-gray-500">
                    {f.paidOn ? new Date(f.paidOn).toLocaleDateString() : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFees;