import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On every page load, ask the backend whether the cookie is still valid.
  // This is what keeps you logged in after refreshing or typing the URL again.
  useEffect(() => {
    let active = true;
    api
      .get("/admin/auth/me")
      .then((res) => active && setAdmin(res.data.admin))
      .catch(() => active && setAdmin(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/admin/auth/login", { email, password });
    setAdmin(data.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/admin/auth/logout");
    } finally {
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
