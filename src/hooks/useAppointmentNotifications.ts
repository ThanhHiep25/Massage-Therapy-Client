// // src/hooks/useAppointmentNotifications.ts
// import { useEffect, useState } from "react";
// import { AppointmentResponse } from "../interface/Appointment_interface";
// import axios from "axios";


// const useAppointmentNotifications = () => {
//   const [notifications, setNotifications] = useState<AppointmentResponse[]>([]);

//   const api = axios.create({
//     //baseURL: "https://massage-therapy-production.up.railway.app/api",
//     baseURL: "http://localhost:5000/api/notifications/subscribe",
//     withCredentials: true, // Đảm bảo gửi cookie tự động
//   });

//   useEffect(() => {
//     const eventSource = new EventSource(api.defaults.baseURL || "");

//     eventSource.addEventListener("appointment-admin", (event: any) => {
//       const data: AppointmentResponse = JSON.parse(event.data);
//       setNotifications((prev) => [data, ...prev]);
//     });

//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   return {
//     notifications,
//     clearNotification: (id: number) =>
//       setNotifications((prev) => prev.filter((n) => n.id !== id)),
//   };
// };

// export default useAppointmentNotifications;
