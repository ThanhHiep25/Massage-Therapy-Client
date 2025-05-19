import axios from "axios";

// Khởi tạo axios instance
const api = axios.create({
    //baseURL: "https://massage-therapy-production.up.railway.app/api",
    baseURL: import.meta.env.VITE_URL_SERVER,
    withCredentials: true, // Đảm bảo gửi cookie tự động
  });


  /// Payment - Thanh Toán -----------------------------------------------------------------------------------------------------------
export const createPaymentOrder = async (data: any) => {
  try {
    const response = await api.post("/payment-order/vnpay", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to create payment.");
    }
  } 
} 

// Google Pay
export const saveGooglePayPaymentInfo = async (payload: any) => {
  try {
    const response = await api.post("/google-pay/save-payment-info", payload);
    return response; // Return the entire response to check status
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to save Google Pay payment info.");
    }
  }
};


// Lay giao dich theo id
export const getTransactionById = async (id: number) => {
  try {
    const response = await api.get(`/payment-order/vnpay/transaction/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to get transaction.");
    }
  } 
}



// Lay danh sach giao dich
export const getAllOrderPayment = async () => {
  try {
    const response = await api.get("/payment-order/vnpay/transactions");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to get transactions.");
    }
  } 
}

// Lay tong so tien khách hàng đã thanh toán
export const totalOrderAmountPayment = async () => {
  try {
    const response = await api.get("/payment-order/amountOrder/total");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to get total amount.");
    }
  } 
}

// Lay tong số lượng thanh toán
export const totalOrderPayment = async () => {
  try {
    const response = await api.get("/payment-order/vnpayOrder/total");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to get total amount.");
    }
  } 
}

// Thống kê doanh thu tháng
export const revenueOrderMonthly = async () => {
  try {
    const response = await api.get("/payment-order/revenueOrder/monthly");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to get total amount.");
    }
  } 
}