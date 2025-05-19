import axios from "axios";
import { CustomerData, CustomerDataFull } from "../interface/CustomerData_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Customers - Khách Hàng -----------------------------------------------------------------------------------------------------------
// Lấy danh sách khách hàng
export const getCustomers = async () => {
    try {
      const response = await api.get("/auth/customers");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to fetch customers.");
      }
    }
  };

  // Xuất Excel danh sách khách hàng
  export const exportCustomersToExcel = async () => {
    try {
      const response = await api.get("/auth/export/excel", {
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
      const filename = `Danh_sach_khach_hang_${year}${month}${day}.xlsx`;
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
  
  // Khách hàng đăng ký tài khoản
  export const addCustomer = async (data: CustomerData) => {
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
  export const blockCustomer = async (id: number) => {
    try {
      const response = await api.put(`/auth/${id}/block`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to block customer.");
      }
    }
  };
  
  // Cập nhật thông tin khách hàng
  export const updateCustomer = async (id: number, data: CustomerDataFull) => {
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
      const response = await api.put(`/auth/${id}/deactivated`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to deactive customer.");
      }
    }
  };
  
  