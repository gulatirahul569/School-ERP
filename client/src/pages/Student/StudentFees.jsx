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
  <div className="space-y-4 sm:space-y-6 p-3 sm:p-4">
    <h1 className="text-2xl sm:text-3xl font-bold">💰 My Fees</h1>

    {/* Summary Cards */}
    <div className="grid grid-cols-3 gap-1 sm:gap-4">
      <div className="bg-white p-2 sm:p-4 rounded-lg shadow text-center">
        <p className="text-[10px] sm:text-sm text-gray-500">
          Total Fee
        </p>
        <p className="text-base sm:text-xl font-bold">
          ₹{data.totalDue}
        </p>
      </div>

      <div className="bg-white p-2 sm:p-4 rounded-lg shadow text-center">
        <p className="text-[10px] sm:text-sm text-gray-500">
          Paid
        </p>
        <p className="text-base sm:text-xl font-bold text-green-600">
          ₹{data.totalPaid}
        </p>
      </div>

      <div className="bg-white p-2 sm:p-4 rounded-lg shadow text-center">
        <p className="text-[10px] sm:text-sm text-gray-500">
          Balance
        </p>
        <p className="text-base sm:text-xl font-bold text-red-600">
          ₹{data.balance}
        </p>
      </div>
    </div>

    {/* Table */}
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full table-fixed text-[10px] sm:text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-1 sm:px-3 py-2 text-left text-xl w-[20%]">
              Month
            </th>
            <th className="px-1 sm:px-3 py-2 text-center text-xl w-[18%]">
              Due
            </th>
            <th className="px-1 sm:px-3 py-2 text-center text-xl w-[18%]">
              Paid
            </th>
            <th className="px-1 sm:px-3 py-2 text-center text-xl w-[20%]">
              Status
            </th>
            <th className="px-1 sm:px-3 py-2 text-center text-xl w-[24%]">
              Date
            </th>
          </tr>
        </thead>

        <tbody>
          {data.fees.map((f) => {
            const paid =
              f.amountPaid >= f.amountDue &&
              f.amountDue > 0;

            return (
              <tr key={f._id} className="border-t">
                <td className="px-1 sm:px-3 py-2 text-sm font-medium">
                  {f.month}
                </td>

                <td className="px-1 sm:px-3 py-2 text-sm text-center">
                  ₹{f.amountDue}
                </td>

                <td className="px-1 sm:px-3 py-2 text-sm text-center">
                  ₹{f.amountPaid}
                </td>

                <td className="px-1 sm:px-3  py-2 text-sm text-center">
                  <span
                    className={`inline-block px-1 py-0.5  rounded text-[9px] sm:text-xs ${
                      paid
                        ? "bg-green-100 text-green-700"
                        : f.amountPaid > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {paid
                      ? "Paid"
                      : f.amountPaid > 0
                      ? "Partial"
                      : "Due"}
                  </span>
                </td>

                <td className="px-1 sm:px-3 py-2 text-sm text-center text-gray-500">
                  {f.paidOn
                    ? new Date(f.paidOn).toLocaleDateString()
                    : "—"}
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