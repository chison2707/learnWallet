import { NavLink } from "react-router-dom";

const Register = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Ký</h2>
          <form >
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-left text-sm font-medium text-gray-700 mb-4">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Nhập họ và tên của bạn"
                required
              />
            </div>
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
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-left text-sm font-medium text-gray-700 mb-4">
                Xác nhận lại mật Khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-left text-sm font-medium text-gray-700 mb-4">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-sm font-medium text-gray-700 mb-4">
                Loại tài khoản
              </label>
              <div className="flex items-center justify-center gap-6">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <span className="ml-2 text-gray-700">Học sinh</span>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="parent"
                    className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <span className="ml-2 text-gray-700">Phụ huynh</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Đăng Ký
            </button>
            <div className="mt-4 text-center">
              <NavLink to="/login" className="text-sm text-blue-600 hover:underline">
                Đã có tài khoản
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register