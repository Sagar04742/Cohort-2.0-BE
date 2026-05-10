import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCurrentUser = async () => {
      setLoading(true);
      try {
        const response = await getMe();
        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, setLoading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
