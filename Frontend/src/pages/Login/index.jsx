import { NavLink, useNavigate } from "react-router-dom";
import { login } from "../../../services/userService";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { setCookie } from "../../helpers/cookie";
import { setUser } from "../../action/login";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    console.log(email, password);


    const result = await login({ email, password });

    if (result.status === 422) {
      result.errors.forEach(err => {
        toast.error(err);
      });
      return;
    }

    if (result.status === 400) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    navigate("/");
    setCookie("token", result.token, 1);
    dispatch(setUser(result.user));

  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-4">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-left text-sm font-medium text-gray-700 mb-4">
                Mật Khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Đăng Nhập
            </button>
            <div className="mt-4 text-center">
              <NavLink to="/register" className="text-sm text-blue-600 hover:underline">
                Đăng ký
              </NavLink>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
      />
    </>
  )
}

export default Login