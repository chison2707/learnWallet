import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { deleteAllCookie, getCookie } from "../../helpers/cookie";
import { useEffect } from "react";
import { logout, setUser } from "../../action/login";
import { detail } from "../../../services/userService";

function PrivateRoute() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getCookie("token");
  const { isLogin } = useSelector((state) => state.loginReducer);
  console.log(isLogin);


  useEffect(() => {
    if (token && !isLogin) {
      const fetchUser = async () => {
        try {
          const result = await detail(token);
          console.log(result);
          if (result && result.infor) {
            dispatch(setUser(result.infor));
          }
          if (result.code === 401) {
            deleteAllCookie("token");
            dispatch(logout());
            navigate("/login", { replace: true });
            return;
          }
        } catch (error) {
          deleteAllCookie("token");
          dispatch(logout());
          navigate("/login", { replace: true });
          return;
        }
      };
      fetchUser();
    }
  }, [token, isLogin, dispatch, navigate]);


  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;