import { useEffect, useMemo, useState } from "react";
import axios from "../../services/api";
import {
  Search,
  Trophy,
  BookOpen,
  CircleCheck,
  CircleX,
  BarChart3,
  Award,
} from "lucide-react";

const Result2 = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/result/student");

      setResults(res.data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Grade Helper
  // ==========================
  const getGrade = (percentage) => {
    if (percentage >= 90)
      return {
        grade: "A+",
        color: "bg-green-100 text-green-700",
      };

    if (percentage >= 75)
      return {
        grade: "A",
        color: "bg-emerald-100 text-emerald-700",
      };

    if (percentage >= 60)
      return {
        grade: "B",
        color: "bg-blue-100 text-blue-700",
      };

    if (percentage >= 40)
      return {
        grade: "C",
        color: "bg-yellow-100 text-yellow-700",
      };

    return {
      grade: "F",
      color: "bg-red-100 text-red-700",
    };
  };

  // ==========================
  // Search
  // ==========================
  const filteredResults = useMemo(() => {
    return results.filter((r) =>
      r.subject.toLowerCase().includes(search.toLowerCase())
    );
  }, [results, search]);

  // ==========================
  // Statistics
  // ==========================
  const overallPercentage =
    results.length > 0
      ? (
          results.reduce((sum, r) => sum + r.percentage, 0) /
          results.length
        ).toFixed(1)
      : 0;

  const passedSubjects = results.filter(
    (r) => r.percentage >= 40
  ).length;

  const failedSubjects = results.filter(
    (r) => r.percentage < 40
  ).length;

  const averageGrade = getGrade(overallPercentage).grade;
    return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* Left */}

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                My Results
              </h1>

              <p className="mt-2 text-gray-500">
                Track your academic performance and exam history.
              </p>

            </div>

            {/* Right */}

            <div className="text-right">

              <h2 className="text-3xl font-bold text-indigo-600">
                {results.length}
              </h2>

              <p className="text-sm text-gray-500">
                Total Results
              </p>

            </div>

          </div>

        </div>

        {/* ================= KPI CARDS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

          {/* Overall Percentage */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Overall %
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {overallPercentage}%
                </h2>

              </div>

              <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                <BarChart3
                  size={24}
                  className="text-indigo-600"
                />

              </div>

            </div>

          </div>

          {/* Average Grade */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Average Grade
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {averageGrade}
                </h2>

              </div>

              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">

                <Award
                  size={24}
                  className="text-green-600"
                />

              </div>

            </div>

          </div>

          {/* Passed */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Passed
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {passedSubjects}
                </h2>

              </div>

              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">

                <CircleCheck
                  size={24}
                  className="text-green-600"
                />

              </div>

            </div>

          </div>

          {/* Failed */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Failed
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {failedSubjects}
                </h2>

              </div>

              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">

                <CircleX
                  size={24}
                  className="text-red-600"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-6">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

          </div>

        </div>
                       {/* ================= RESULTS TABLE ================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {loading ? (

            <div className="p-8 space-y-4 animate-pulse">

              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gray-100"
                />
              ))}

            </div>

          ) : filteredResults.length === 0 ? (

            <div className="py-20 text-center">

              <div className="text-6xl">📄</div>

              <h2 className="mt-5 text-2xl font-semibold text-gray-800">
                No Results Available
              </h2>

              <p className="mt-2 text-gray-500">
                Your exam results will appear here once published.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Subject
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Exam
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Marks
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      %
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Grade
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Remarks
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredResults.map((result, index) => {

                    const grade = getGrade(result.percentage);

                    const passed = result.percentage >= 40;

                    return (

                      <tr
                        key={index}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-5">

                          <div className="font-semibold text-gray-800">
                            {result.subject}
                          </div>

                          <div className="text-xs text-gray-400 mt-1">
                            Class {result.className} 
                          </div>

                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {result.examType}
                        </td>

                        <td className="px-6 py-5">

                          <div className="font-semibold">
                            {result.marksObtained}
                            <span className="text-gray-400">
                              {" "} / {result.maxMarks}
                            </span>
                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <div className="font-semibold text-gray-800">
                            {result.percentage}%
                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${grade.color}`}
                          >
                            {grade.grade}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              passed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {passed ? "Passed" : "Failed"}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-gray-600">

                          {result.remarks || "-"}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );
};

export default Result2;