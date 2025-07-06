import PrivateRoute from "../components/PrivateRoute"
import LayoutDefault from "../Layout/LayoutDefault"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"

export const routes = [
  {
    path: "login",
    element: <Login />
  },
  {
    path: "register",
    element: <Register />
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        element: <LayoutDefault />,
        children: [
          {
            path: "/",
            element: <Home />
          }
        ]
      }
    ]
  }
]