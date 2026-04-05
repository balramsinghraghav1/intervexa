import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!localStorage.getItem("intervexa_token")) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.me();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("intervexa_token");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persist = (payload) => {
    localStorage.setItem("intervexa_token", payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem("intervexa_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        persist,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
