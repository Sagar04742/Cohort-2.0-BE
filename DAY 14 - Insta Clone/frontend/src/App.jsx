import React from "react";
import { RouterProvider } from "react-router";
import { routers } from "./app.routes";

import "./features/shared/globel.scss";
import { AuthProvider } from "./features/auth/auth.context";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routers} />
    </AuthProvider>
  );
};

export default App;
