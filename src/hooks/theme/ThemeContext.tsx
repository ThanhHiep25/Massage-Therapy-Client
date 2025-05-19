import { createContext, useContext, useEffect, useState } from "react";

// Tạo kiểu dữ liệu cho theme
type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Context mặc định
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider quản lý theme toàn bộ app
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });

  // Khi theme thay đổi -> cập nhật class của <html> và lưu vào localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook dùng theme dễ dàng trong component
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
