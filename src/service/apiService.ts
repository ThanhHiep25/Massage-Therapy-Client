import axios from "axios";

// Khởi tạo axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Đăng ký người dùng
export const registerUser = (data: any) => api.post("/register", data);
export const verifyOtp = (data: any) => api.post("/verify-otp", data);

// Đăng nhập người dùng
export const loginUser = (data: any) => api.post("/login", data);

// Lấy thông tin người dùng từ ID
export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`, {
      // Không cần thêm header 'Authorization' nếu backend kiểm tra cookie trực tiếp
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user data."
    );
  }
};

export const logout = async () => {
  const response = await api.post("/logout", {});
  return response.data;
};

// Gửi email xác nhận đổi mật khẩu
export const sendResetPassword = async (email: string) => {
  try {
      const response = await api.post("/forgot-password", { email });
      return response.data;
  } catch (error: any) {
      throw new Error(error.response?.data || "Failed to send OTP.");
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
      const response = await api.post("/reset-password", { email, otp, newPassword });
      return response.data;
  } catch (error: any) {
      throw new Error(error.response?.data || "Failed to reset password.");
  }
};