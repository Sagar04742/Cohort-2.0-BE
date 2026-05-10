import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading, handleLogout } = context;

  const handleLogin = async (username, password) => {
    setLoading(true);
    const response = await login(username, password);
    setUser(response.user);
    setLoading(false);
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    const response = await register(username, email, password);
    setUser(response.user);
    setLoading(false);
  };

  const handleLogoutAction = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const handleGetme = async () => {
    setLoading(true);
    const response = await getMe();
    setUser(response.user);
    setLoading(false);
  };

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleGetme,
    handleLogout: handleLogoutAction,
  };
};
