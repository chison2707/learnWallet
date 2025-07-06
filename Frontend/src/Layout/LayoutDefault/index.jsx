import { useSelector } from "react-redux"

const LayoutDefault = () => {
  const isLogin = useSelector(state => state.loginReducer);
  console.log(isLogin);

  return (
    <div>LayoutDefault</div>
  )
}

export default LayoutDefault