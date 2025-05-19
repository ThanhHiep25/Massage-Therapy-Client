import axios from "axios";
import { DepartmentIS } from "../interface/Department_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Departments
export const getDepartments = async () => {
  try {
    const response = await api.get("/department");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};

// Add Department
export const addDepartment = async (data: DepartmentIS) => {
  try {
    const response = await api.post("/department/create", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};

// Update Department
export const updateDepartment = async (id: number, data: DepartmentIS) => {
  try {
    const response = await api.put(`/department/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};

// Delete Department
export const deleteDepartment = async (id: number) => {
  try {
    const response = await api.delete(`/department/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};

// activate Department
export const activateDepartment = async (id: number) => {
  try {
    const response = await api.put(`/department/${id}/activate`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};

// deactivate Department
export const deactivateDepartment = async (id: number) => {
  try {
    const response = await api.put(`/department/${id}/deactivate`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};