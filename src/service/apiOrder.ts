import axios from "axios";
import { Order } from "../interface/Order_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Thêm sản phẩm
export const createOrder = (data: Order) => {
  try {
    return api.post("/orders/create", data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Lấy sản phẩm
export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Xuất excel danh sách sản phẩm
export const exportOrdersToExcel = async () => {
  try {
    const response = await api.get("/orders/export/excel", {
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
    const filename = `Danh_sach_don_hang_${year}${month}${day}.xlsx`;
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


// Xóa sản phẩm
export const deleteOrder = async (id: number) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};


// Trạng thái đã giao
export const deliveredOrder = async (id: number) => {
  try {
    const response = await api.put(`/orders/${id}/delivered`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Cập nhật trạng thái hủy
export const cancelOrder = async (id: number) => {
  try {
    const response = await api.put(`/orders/${id}/cancelled`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};


// cập nhật trạng thái thanh toán
export const paidOrder = async (id: number) => {
  try {
    const response = await api.put(`/orders/${id}/paid`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};
