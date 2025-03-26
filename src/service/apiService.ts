import axios from "axios";
import CustomerData from "../interface/CustomerData";

// Khởi tạo axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Auth - Đăng nhập, Đăng ký, Đăng xuất -----------------------------------------------------------------------------------------------------------

// Đăng ký người dùng
interface RegisterUserData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
}
interface VerifyOtpData {
  email: string;
  otp: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

export const registerUser = (data: RegisterUserData) =>
  api.post("/auth/register", data);

export const verifyOtp = (data: VerifyOtpData) =>
  api.post("/auth/verify-otp", data);

// Đăng nhập người dùng
export const loginUser = (data: LoginUserData) => api.post("/auth/login", data);

// Lấy thông tin người dùng từ ID
export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/auth/users/${id}`, {
      // Không cần thêm header 'Authorization' nếu backend kiểm tra cookie trực tiếp
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch user data.");
    }
  }
};

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

/// Staffs - Nhân Viên -----------------------------------------------------------------------------------------------------------

// Lấy danh sách nhân viên
export const getEmployees = async () => {
  try {
    const response = await api.get("/staffs");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch employees.");
    }
  }
};

// Thêm nhân viên
export const addEmployee = async (data: any) => {
  try {
    const response = await api.post("/staffs", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to add employee.");
    }
  }
};

// Xoá nhân viên
export const deleteEmployee = async (id: number) => {
  try {
    const response = await api.delete(`/staffs/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to delete employee.");
    }
  }
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (id: number, data: any) => {
  try {
    const response = await api.put(`/staffs/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to update employee.");
    }
  }
};

// Thêm nhân viên bằng maảng json
export const addEmployees = async (data: any) => {
  try {
    const response = await api.post("/staffs/import-json", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to add employees.");
    }
  }
};

// Active nhân viên
export const activeEmp = async (id: number) => {
  try {
    const response = await api.put(`/staffs/${id}/activate`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to active employee.");
    }
  }
};

// Deactive nhân viên
export const deactiveEmp = async (id: number) => {
  try {
    const response = await api.put(`/staffs/${id}/deactivate`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to deactive employee.");
    }
  }
};

// Thêm nhân viên bằng file

export const addEmployeeByFile = async (formData: any) => {
  try {
    const response = await api.post("/staffs/import-file", formData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to add employees.");
    }
  }
};

// Positions - Chức Vụ -----------------------------------------------------------------------------------------------------------
// Lấy danh sách chức vụ
export const getPositions = async () => {
  try {
    const response = await api.get("/positions");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch positions.");
    }
  }
};

// Thêm chức vụ
export const addPosition = async (data: any) => {
  try {
    const response = await api.post("/positions", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to add position.");
    }
  }
};

// Xoá chức vụ
export const deletePosition = async (id: number) => {
  try {
    const response = await api.delete(`/positions/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to delete position.");
    }
  }
};

// Cập nhật thông tin chức vụ
export const updatePosition = async (id: number, data: any) => {
  try {
    const response = await api.put(`/positions/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to update position.");
    }
  }
};

//Role - Quyền -----------------------------------------------------------------------------------------------------------
// Lấy danh sách quyền
export const getRoles = async () => {
  try {
    const response = await api.get("/roles");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch roles.");
    }
  }
};

// Customers - Khách Hàng -----------------------------------------------------------------------------------------------------------
// Lấy danh sách khách hàng
export const getCustomers = async () => {
  try {
    const response = await api.get("/auth/all");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch customers.");
    }
  }
};

// Khách hàng đăng ký tài khoản
export const addCustomer = async (data: any) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to add customer.");
    }
  }
};

// Thêm khách hàng
export const addCustomerNoOTP = async (data: CustomerData) => {
  try {
    const response = await api.post("/auth/create", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error; // ⚡ Throw toàn bộ lỗi để giữ nguyên context
    } else {
      throw new Error("Failed to add customer.");
    }
  }
};

// Xoá khách hàng
export const deleteCustomer = async (id: number) => {
  try {
    const response = await api.delete(`/auth/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to delete customer.");
    }
  }
};

// Khóa tài khoản
export const blockCustomer = async (id: number
  ) => {
  try {
    const response = await api.delete(`/auth/block/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch customer.");
    }
  }
};

// Cập nhật thông tin khách hàng
export const updateCustomer = async (id: number, data: any) => {
  try {
    const response = await api.put(`/auth/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to update customer.");
    }
  }
};

// Activate customer
export const activeCus = async (id: number) => {
  try {
    const response = await api.put(`/auth/${id}/activate`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to active customer.");
    }
  }
};

// Deactive customer

export const deactiveCus = async (id: number) => {
  try {
    const response = await api.put(`/auth/${id}/deactivate`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to deactive customer.");
    }
  }
};
