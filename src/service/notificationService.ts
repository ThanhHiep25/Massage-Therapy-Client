import axios from "axios";
import { AppointmentResponse } from "../interface/Appointment_interface";

//const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

const notificationService = {
  subscribeToAppointments: (
    onNotification: (notification: AppointmentResponse) => void,
    onError: (error: unknown) => void
  ) => {
    const eventSource = new EventSource(
      `${api}/notifications/subscribe`,
      {
        withCredentials: true, // Thử gửi credentials (cookies)
      }
    );

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data: AppointmentResponse = JSON.parse(event.data);
        onNotification(data);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
        onError(error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      onError(error);
    };

    return () => {
      eventSource.close();
    };
  },
};

export default notificationService;
