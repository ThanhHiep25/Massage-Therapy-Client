import axios from "axios";
import { RegisterUserData } from "../interface/RegisterUserData_interface";
import { VerifyOtpData } from "../interface/VerifyOtpData_interface";
import { LoginUserData } from "../interface/LoginUserData_interface";
import { ChangePasswordData } from "../interface/ChangePassword_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});


// Đăng ký người dùng
export const registerUser =  async(data: RegisterUserData) =>{
  try {
    const response = await api.post("/auth/register", data);   
      return response.data;
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("Failed to register user.");
    }
  }
}

export const registerStaff =  async(data: RegisterUserData) =>{
  try {
    const response = await api.post("/auth/register-staff", data);   
      return response.data;
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("Failed to register user.");
    }
  }
}
  

export const verifyOtp = (data: VerifyOtpData) => 
  api.post("/auth/verify-otp", data);

// Đăng nhập người dùng
export const loginUser = (data: LoginUserData) => api.post("/auth/login", data);


export const logout = async () => {
  const response = await api.post("/auth/logout", {});
  return response.data;
};

// Gửi email xác nhận đổi mật khẩu
export const sendResetPassword = async (email: string) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to send OTP.");
    }
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to reset password.");
    }
  }
};


// Đổi mật khẩu
export const changePassword = async (data: ChangePasswordData) => {
  try {
    const { userId, oldPassword, newPassword } = data;
    const encodedOldPassword = encodeURIComponent(oldPassword);
    const encodedNewPassword = encodeURIComponent(newPassword);

    const url = `/auth/change-password?userId=${userId}&oldPassword=${encodedOldPassword}&newPassword=${encodedNewPassword}`;
    const response = await api.put(url, null);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      console.error("Non-Axios error in changePassword:", error);
      throw new Error("Failed to change password due to an unexpected error.");
    }
  }
};