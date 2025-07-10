import PrivateRoute from "../components/PrivateRoute"
import LayoutDefault from "../Layout/LayoutDefault"
import Chapters from "../pages/Chapters"
import Courses from "../pages/Courses"
import Detail from "../pages/Detail"
import GetStudent from "../pages/GetStudent"
import Home from "../pages/Home"
import Lesson from "../pages/Lesson"
import Login from "../pages/Login"
import Logout from "../pages/Logout"
import Register from "../pages/Register"
import StudentProgess from "../pages/StudentProgess"

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
          },
          {
            path: "/logout",
            element: <Logout />
          },
          {
            path: "/profile",
            element: <Detail />
          },
          {
            path: "/getStudents",
            element: <GetStudent />
          },
          {
            path: "/studentProgess/:id",
            element: <StudentProgess />
          },
          {
            path: "/courses",
            element: <Courses />
          },
          {
            path: "/courses/:id",
            element: <Chapters />
          },
          {
            path: "/courses/chapter/:chapterId",
            element: <Lesson />
          },
        ]
      }
    ]
  }
]