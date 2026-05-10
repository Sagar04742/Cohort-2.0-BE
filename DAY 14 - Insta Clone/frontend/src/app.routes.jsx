import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/post/pages/Feed";
import CreatePost from "./features/post/pages/CreatePost";
import Profile from "./features/user/pages/Profile";

export const routers = createBrowserRouter([
    {
        path: '/',
        element: <Feed/>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path:'/create-post',
        element: <CreatePost/>
    },
    {
        path: '/profile',
        element: <Profile />
    }
])
