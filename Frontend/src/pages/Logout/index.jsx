import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAllCookie } from "../../helpers/cookie";
import { logout } from "../../action/login";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  deleteAllCookie();
  dispatch(logout());
  navigate("/login", { replace: true });

  return (
    <></>
  )
}

export default Logout