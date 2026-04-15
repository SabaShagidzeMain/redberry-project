import { createContext, useContext, useState, useEffect } from "react";
import { getToken, setToken as saveToken, removeToken } from "../utils/auth";
import { authApi } from "../api/auth.api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setTokenState(storedToken);

    authApi
      .me()
      .then((res) => {
        const fetchedUser = res.data?.data || res.data;
        setUser(fetchedUser);
      })
      .catch((err) => {
        console.log("ME ERROR:", err);

        removeToken();
        setTokenState(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (token, userData) => {
    if (!token) {
      console.error("❌ Missing token in login()");
      return;
    }

    if (!userData) {
      console.error("❌ Missing userData in login()");
      return;
    }

    saveToken(token);
    setTokenState(token);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
