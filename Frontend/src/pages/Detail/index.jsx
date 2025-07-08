import { useEffect, useState } from "react";
import { detail } from "../../../services/userService";
import { getCookie } from "../../helpers/cookie";
import { NavLink } from "react-router-dom";

const Detail = () => {
  const token = getCookie("token");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const result = await detail(token);
      setData(result.infor);
    }


    fetchDashboard();
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Chi tiết người dùng</h2>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Họ tên:</p>
            <p className="text-gray-900">{data.fullName}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Email:</p>
            <p className="text-gray-900">{data.email}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Số điện thoại:</p>
            <p className="text-gray-900">{data.phone}</p>
          </div>

          <div className="mb-3">
            <p className="text-gray-600 font-semibold mb-3">Vai trò:</p>
            <span className={`inline-block px-3 py-2 rounded-full text-white text-sm 
            ${data.role === 'student' ? 'bg-blue-500' : 'bg-green-500'}`}>
              {data.role}
            </span>
          </div >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <NavLink to="/" className="rounded-full bg-red-500 py-3 px-3 text-white hover:bg-red-600 cursor-pointer">Trang chủ</NavLink>
            </div>

            {data.role === 'parent' && (
              <>
                <div>
                  <NavLink to="/getStudents" className="rounded-full bg-yellow-500 py-3 px-3 text-white hover:bg-yellow-600 cursor-pointer">
                    Danh sách học viên</NavLink>
                </div>
              </>
            )}
          </div>
        </div >
      </div >
    </>
  )
}

export default Detail