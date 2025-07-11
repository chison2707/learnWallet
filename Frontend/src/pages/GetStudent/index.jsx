import { useEffect, useState } from "react";
import { getStudent } from "../../../services/userService";
import { getCookie } from "../../helpers/cookie";
import { useNavigate } from "react-router-dom";

const GetStudent = () => {
  const token = getCookie("token");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const result = await getStudent(token);
      setData(result.students);
    }

    fetchDashboard();
  }, []);

  return (
    <>
      <div className="min-h-screen p-6 flex justify-center">
        <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Danh sách học viên</h2>

          {data.length === 0 ? (
            <p className="text-center text-gray-500">Không có học viên nào.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Họ tên</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Số điện thoại</th>
                </tr>
              </thead>
              <tbody>
                {data.map((student, index) => (
                  <tr key={student.id} onClick={() => navigate(`/studentProgess/${student.id}`)}
                    className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-800">{student.fullName}</td>
                    <td className="p-3 text-gray-600">{student.email}</td>
                    <td className="p-3 text-gray-600">{student.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
export default GetStudent;