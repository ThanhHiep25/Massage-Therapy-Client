import axios from "axios";
import { AssignmentFormData } from "../interface/AssignmentStaff_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Hien thi danh sách nhân viên
export const getAssignmentStaff = async () => {
  try {
    const response = await api.get("/assignment-staff");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch staffs.");
    }
  }
};

// Tạo phân công nhân viên mới
export const createAssignmentStaff = async (data: AssignmentFormData) => {
  try {
    const response = await api.post("/assignment-staff", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to create assignment staff.");
    }
  }
};

// Cập nhật phân công nhân viên
export const updateAssignmentStaff = async (
  id: number,
  data: AssignmentFormData
) => {
  try {
    const response = await api.put(`/assignment-staff/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to update assignment staff.");
    }
  }
};

// Xoá phân công nhân viên
export const deleteAssignmentStaff = async (id: number) => {
  try {
    const response = await api.delete(`/assignment-staff/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to delete assignment staff.");
    }
  }
};

// Unassigned, // Chưa phân công
export const unassignApi = async (id: string) => {
  try {
    const response = await api.put(`/assignment-staff/unassigned/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to unassign staff.");
    }
  }
}
// Assigning, // Đang phân công
export const assigningApi = async (id: string) => {
  try {
    const response = await api.put(`/assignment-staff/assigning/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to assigning staff.");
    }
  }
}
// Assigned, // Đã phân công
export const assignedApi = async (id: string) => {
  try {
    const response = await api.put(`/assignment-staff/assigned/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to assigned staff.");
    }
  }
}
// InProgress, // Đang thực hiện
  export const inProgressApi = async (id: string) => {
    try {
      const response = await api.put(`/assignment-staff/in-progress/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to in-progress staff.");
      }
    }
  }
// Completed, // Hoàn thành
export const completeApi = async (id: string) => {
  try {
    const response = await api.put(`/assignment-staff/completed/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to complete staff.");
    }
  }
}
// Cancelled, // Hủy phân công
  export const cancelApi = async (id: string) => {
    try {
      const response = await api.put(`/assignment-staff/cancelled/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Failed to cancel staff.");
      }
    }
  }
// Approval, // Chờ phê duyệt
export const approvalApi = async (id: string) => {
  try {
    const response = await api.put(`/assignment-staff/approval/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to approval staff.");
    }
  }
}
// Overdue, // Không hoàn thành (Quá thời hạn)

export const overdueApi = async (id: string) => {
  try {
    const response = await api.put(`/assignment-staff/overdue/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to overdue staff.");
    }
  }
}