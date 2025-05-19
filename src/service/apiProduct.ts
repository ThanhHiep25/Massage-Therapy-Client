
import axios from "axios";
import { ProductForm } from "../interface/Products_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});


// Thêm sản phẩm

export const createProduct = (data: ProductForm) => {
  try {
    return api.post("/products/create", data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};


// Lấy sản phẩm
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
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
export const exportProductsToExcel = async () => {
  try {
    const response = await api.get("/products/export/excel", {
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
    const filename = `Danh_sach_san_pham_${year}${month}${day}.xlsx`;
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
export const deleteProduct = async (id: number) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};


// Cập nhật sản phẩm
export const updateProduct = async (id: number, data: ProductForm) => {
  try {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// activate sản phảm
export const activateProduct = async (id: number) => {
  try {
    const response = await api.put(`/products/${id}/activate`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};


// deactivate sản phẩm
export const deactivateProduct = async (id: number) => {
  try {
    const response = await api.put(`/products/${id}/deactivate`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// set trạng thái sale sản phẩm
export const saleProduct = async (id: number) => {
  try {
    const response = await api.put(`/products/${id}/sale`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// cập nhạt lại số lượng sản phảm khi đặt

export const updatesaleProduct = async (id: number, quantity:number) => {
  try {
    const response = await api.put(`/products/${id}/sale/${quantity}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

