import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.sub); // sub normalmente é o username
      } catch (err) {
        console.error("Token inválido");
        localStorage.removeItem("token");
      }
    }
  }, []);

  function login(token) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded.sub);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
