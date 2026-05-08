import { RouterProvider } from "react-router";
import { routers } from "./app.routes";

import "./features/shared/globel.scss";
import { AuthProvider } from "./features/auth/auth.context";
import { PostContextProvider } from "./features/post/post.context";

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <RouterProvider router={routers} />
      </PostContextProvider>
    </AuthProvider>
  );
};

export default App;
