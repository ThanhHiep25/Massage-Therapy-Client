import axios from "axios";
import { AppointmentForm } from "../interface/Appointment_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// thêm lịch hẹn
export const createAppointment = (data: AppointmentForm) => {
  try {
    return api.post("/appointments/create", data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Get danh sách lịch hẹn
export const getAppointmentAll = async () => {
  try {
    const response = await api.get("/appointments/");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Get lịch hẹn theo id
export const getAppointmentById = async (id: number) => {
  try {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

//Get tất cả lịch hẹn theo trạng thái SCHEDULED
export const getAppointmentScheduled = async () => {
  try {
    const response = await api.get("/appointments/status/SCHEDULED");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

 // Xuất Excel danh sách lịch hẹn
 export const exportAppointmentToExcel = async () => {
  try {
    const response = await api.get("/appointments/export/excel", {
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
    const filename = `Danh_sach_lich_hen_${year}${month}${day}.xlsx`;
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

// Xóa lịch hẹn
export const deleteAppointment = async (id: number) => {
  try {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// cập nhật lịch hẹn
export const updateAppointment = async (id: number, data: AppointmentForm) => {
  try {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// thay doi trang thai da dat lich
export const updateStatusScheduled = async (id: number) => {
  try {
    const response = await api.put(`/appointments/${id}/scheduled`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// thay đổi trạng thái complete
export const updateStatusComplete = async (id: number) => {
  try {
    const response = await api.put(`/appointments/${id}/complete`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};

// thay đổi trạng thái paid
export const updateStatusPaid = async (id: number) => {
  try {
    const response = await api.put(`/appointments/${id}/paid`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// huy lich hen
export const updateStatusCancel = async (id: number) => {
  try {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noidden server");
    }
  }
};


// Thống kê từng dịch vụ theo lịch hẹn
export const getAppointmentByServiceSPA = async () => {
  try {
    const response = await api.get('/appointments/service-usage-price');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};


// Thống kê thổng lịch hẹn
export const getTotalAppointments = async () => {
  try {
    const response = await api.get('/appointments/count-all');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

