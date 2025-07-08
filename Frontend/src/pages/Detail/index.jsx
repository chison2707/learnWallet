
const Detail = () => {
  const user = {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0987654321",
    email: "nguyenvana@example.com",
    password: "•••••••••••", // Ẩn đi trong UI
    tokenUser: "abc123xyz456token789user",
    role: "student",
    status: "active",
    createdAt: "2025-07-08T09:00:00Z",
    updatedAt: "2025-07-08T10:00:00Z",
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Chi tiết người dùng</h2>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Họ tên:</p>
            <p className="text-gray-900">{user.fullName}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Email:</p>
            <p className="text-gray-900">{user.email}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Số điện thoại:</p>
            <p className="text-gray-900">{user.phone}</p>
          </div>

          <div className="mb-3">
            <p className="text-gray-600 font-semibold mb-3">Vai trò:</p>
            <span className={`inline-block px-3 py-2 rounded-full text-white text-sm ${user.role === 'student' ? 'bg-blue-500' : 'bg-green-500'
              }`}>
              {user.role}
            </span>
          </div >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <a href="/" className="rounded-full bg-blue-500 py-3 px-3 text-white">Trang chủ</a>
            </div>

            <div>
              <a href="/editUser" className="rounded-full bg-blue-500 py-3 px-3 text-white">Chỉnh sửa trang cá nhân</a>
            </div>
          </div>
        </div >
      </div >
    </>
  )
}

export default Detail