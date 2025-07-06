import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import { checkLogin } from "../../action/login";

function PrivateRoute() {
  const dispatch = useDispatch();
  const token = getCookie("token");

  if (token) {
    dispatch(checkLogin(true));
  }

  const isLogin = useSelector(state => state.loginReducer);

  return isLogin ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;