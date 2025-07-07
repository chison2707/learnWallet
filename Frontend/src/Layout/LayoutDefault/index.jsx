import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom";

const LayoutDefault = () => {
  const isLogin = useSelector(state => state.loginReducer);
  console.log(isLogin);

  return (
    <>
      <div className="max-w-screen-2xl text-base mx-auto px-8">
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
                <a href="#">Products</a>
              </li>
              <li className="top-menu-item">
                <a href="#">Blog</a>
              </li>
              <li className="top-menu-item">
                <a href="#">Contact</a>
              </li>
              <li className="top-menu-item">
                <a href="#">StyleGuide</a>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );

}

export default LayoutDefault