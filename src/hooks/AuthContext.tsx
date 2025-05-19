import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: { username: string; [key: string]: any } | null;
  login: (user: { username: string; [key: string]: any }) => void;
  logoutContext: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ username: string; [key: string]: any } | null>(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: { username: string; [key: string]: any }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Lưu vào localStorage
  };

  const logoutContext = () => {
    setUser(null);
    localStorage.removeItem("user"); // Xóa khỏi localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
