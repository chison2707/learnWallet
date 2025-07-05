import { NavLink } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>
          <form >
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật Khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
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
    </>
  )
}

export default Login