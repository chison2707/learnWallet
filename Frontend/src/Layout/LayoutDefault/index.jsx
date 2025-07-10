import { useSelector } from "react-redux"
import { NavLink, Outlet } from "react-router-dom";

const LayoutDefault = () => {
  const { isLogin, user } = useSelector((state) => state.loginReducer);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="max-w-screen-2xl text-base mx-auto px-8 w-full">
          <header className="p-6 mx-auto">
            <nav className="flex items-center justify-between">
              <div className="text-xl font-semibold cursor-pointer">
                LearnWallet
              </div>
              <ul
                id="top-menu"
                className="hidden lg:flex items-center gap-8 uppercase text-sm text-gray-500 font-medium"
              >
                <li className="top-menu-item">
                  <a href="/">Home</a>
                </li>
                <li className="top-menu-item">
                  <a href="/courses">Khóa học</a>
                </li>
                <li className="top-menu-item">
                  <a href="#">Blog</a>
                </li>
                <li className="top-menu-item">
                  <a href="#">Contact</a>
                </li>
                {(isLogin && user) && (
                  <>
                    <li className="top-menu-item">
                      <a href="/profile">{user.fullName}</a>
                    </li>
                    <li className="top-menu-item">
                      <NavLink to="/logout" className="cursor-pointer uppercase">
                        Đăng xuất
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </header>
        </div>

        <main className="fflex-grow max-w-7xl mx-auto w-full px-6">
          <Outlet />
        </main>

        <footer className="w-full text-gray-700 mt-12 border-t border-gray-200">
          <div className="max-w-screen mx-auto px-8 text-sm">
            <div className="text-center uppercase">
              © 2025 LearnWallet. Made by Chí Sơn.
            </div>
          </div>
        </footer>
      </div>
    </>
  );


}

export default LayoutDefault