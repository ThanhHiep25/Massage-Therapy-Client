import axios from "axios";
import { StaffData } from "../interface/StaffData_interface";
import { Positions } from "../interface/Position_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

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

// Lấy danh sách tài khoản nhân viên
export const getAuthStaff = async () => {
  try {
    const response = await api.get("/auth/staffs");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch positions.");
    }
  }
};

// Thêm nhân viên
export const addEmployee = async (data: StaffData) => {
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
export const updateEmployee = async (id: number, data: StaffData) => {
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

// Xuất excel nhân viên
export const exportStaffToExcel = async () => {
  try {
    const response = await api.get("/staffs/export/excel", {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Lấy ngày tháng năm hiện tại
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(now.getDate()).padStart(2, '0');

    // Tạo tên file kết hợp
    const filename = `Danh_sach_nhan_vien_${year}${month}${day}.xlsx`;
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);

  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to export employees.");
    }
  }
};

// Thêm nhân viên bằng maảng json
export const addEmployees = async (data: StaffData) => {
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

export const addEmployeeByFile = async (formData: StaffData) => {
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
export const addPosition = async (data: Positions) => {
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
export const updatePosition = async (id: number, data: Positions) => {
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
