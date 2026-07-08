import { useEffect, useState } from "react";
import axios from "../../services/api";

const Result2 = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getGrade = (percentage) => {
    if (percentage >= 90)
      return {
        grade: "A+",
        color: "bg-green-100 text-green-700",
      };

    if (percentage >= 75)
      return {
        grade: "A",
        color: "bg-green-100 text-green-700",
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Results
          </h1>

          <p className="text-gray-500 mt-1">
            View your exam results
          </p>
        </div>

        <div className="bg-white rounded-xl shadow border">

          {loading ? (
            <div className="text-center py-12">
              Loading...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No Results Found
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="px-5 py-3 text-left">
                      Subject
                    </th>

                    <th className="px-5 py-3 text-left">
                      Exam
                    </th>

                    <th className="px-5 py-3 text-left">
                      Class
                    </th>

                    <th className="px-5 py-3 text-left">
                      Marks
                    </th>

                    <th className="px-5 py-3 text-left">
                      Percentage
                    </th>

                    <th className="px-5 py-3 text-left">
                      Grade
                    </th>

                    <th className="px-5 py-3 text-left">
                      Remarks
                    </th>
                    

                  </tr>

                </thead>

                <tbody>

                  {results.map((result, index) => {

                    const grade = getGrade(result.percentage);

                    return (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          {result.subject}
                        </td>

                        <td className="px-5 py-4">
                          {result.examType}
                        </td>

                        <td className="px-5 py-4">
                          {result.className}
                        </td>

                        <td className="px-5 py-4">
                          {result.marksObtained} / {result.maxMarks}
                        </td>

                        <td className="px-5 py-4">
                          {result.percentage}%
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`px-3 py-1 rounded-lg ${grade.color}`}
                          >
                            {grade.grade}
                          </span>

                        </td>

                        <td className="px-5 py-4">
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