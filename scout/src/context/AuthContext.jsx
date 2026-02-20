import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";

function isExpired(decoded) {
  // exp vem em segundos (epoch)
  if (!decoded?.exp) return false; // se não existir exp, não força logout
  return decoded.exp * 1000 <= Date.now();
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // carrega user/token do storage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);

    if (!stored) {
      setToken("");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(stored);

      if (isExpired(decoded)) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setUser(null);
      } else {
        setToken(stored);
        setUser(decoded.sub ?? null); // sub normalmente é o username
      }
    } catch (err) {
      console.error("Token inválido", err);
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  function login(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);

    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded.sub ?? null);
    } catch (err) {
      console.error("Token inválido", err);
      // se o token é inválido, limpa tudo
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setUser(null);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}