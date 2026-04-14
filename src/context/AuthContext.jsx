import { createContext, useContext, useState, useEffect } from "react";
import { getToken, setToken as saveToken, removeToken } from "../utils/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);

  // load token on refresh
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const login = (token, userData) => {
    saveToken(token);
    setTokenState(token);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
