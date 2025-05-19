import axios from "axios";
import { DiscountCodeRequest } from "../interface/DiscountCode_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// thêm mã giảm giá
export const addDiscountCode = async (discountCode: DiscountCodeRequest) => {
  try {
    const response = await api.post("/discount-code/create", discountCode);
    return response.data;
  } catch (error) {
     if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Lấy danh sách mã giảm giá
export const getDiscountCodes = async () => {
  try {
    const response = await api.get("/discount-code/all");
    return response.data;
  } catch (error) {
     if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Lấy mã giảm giá them code
export const getDiscountCodeByCode = async (code: string) => {
  try {
    const response = await api.get(`/discount-code/code/${code}`);
    return response.data;
  } catch (error) {
     if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};
