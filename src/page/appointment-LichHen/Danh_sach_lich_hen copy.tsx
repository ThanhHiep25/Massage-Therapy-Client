// import { useEffect, useState } from "react";
// import { deleteAppointment, getAppointmentAll } from "../../service/apiAppoinment";
// import { AppointmentResponse } from '../../interface/Appointment_interface';
// import { Pagination } from "@mui/material";
// import RenderNotFound from "../../components/notFound/renderNotFound";
// import { Search, UserRound } from "lucide-react";
// import { motion } from 'framer-motion'
// import AppointmentDetailModal from "./AppointmentDetailModal";
// import { toast, ToastContainer } from "react-toastify";


// const pageSize = 8;

// const AppoinmentList: React.FC = () => {
//   const [appointment, setAppointment] = useState<AppointmentResponse[]>([]);
//   const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentPageAmonyus, setCurrentPageAmonyus] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchItemAmonyus, setSearchItemAmonyus] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [statusFilterAmonyus, setStatusFilterAmonyus] = useState("");

//   const statusMap: Record<
//     string,
//     { label: string; color: string }
//   > = {
//     SCHEDULED: { label: "Đã đặt lịch", color: "px-2 py-1 text-white rounded-full bg-blue-600/70" },
//     COMPLETED: { label: "Hoàn thành", color: "px-2 py-1 text-white rounded-full bg-green-600/70" },
//     CANCELLED: { label: "Đã hủy", color: "px-2 py-1 text-white rounded-full bg-red-500/70" },
//     PENDING: { label: "Chờ xác nhận", color: "px-2 py-1 text-white rounded-full bg-yellow-500/70" },
//   };



//   useEffect(() => {
//     fetchAppointment();
//   }, []);

//   const fetchAppointment = async () => {
//     try {
//       const response = await getAppointmentAll();
//       setAppointment(response);
//     } catch (error) {
//       console.error("Không thể lấy danh sách lịch hẹn:", error);
//     }
//   };

//   const filteredAppointment = appointment.filter((appoint) => {
//     return (
//       appoint.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (statusFilter === "" || appoint.status === statusFilter)
//     );
//   });

//   const fillteredAppointmentAmonyus = appointment.filter((apt) => {
//     return (apt.gustName?.toLowerCase().includes(searchItemAmonyus.toLowerCase()) &&
//       (statusFilterAmonyus === "" || apt.status === statusFilterAmonyus)
//     )
//   });


//   const paginatedAppointment = filteredAppointment.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const paginatedAppointmentAmonyus = fillteredAppointmentAmonyus.slice(
//     (currentPageAmonyus - 1) * pageSize,
//     currentPageAmonyus * pageSize
//   );

//   const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//   };

//   const handlePageChangeAmonyus = (_: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPageAmonyus(value);
//   };


//   // Xem chi tiết
//   const handleOpenModal = (appointment: AppointmentResponse) => {
//     setSelectedAppointment(appointment);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedAppointment(null);
//   };

//   const handleDeleted = async (id: number) => {
//     if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này ?')) return;

//     try {
//       await deleteAppointment(id)
//       toast.success(`Hủy dịch vụ thành công`)
//       fetchAppointment();
//     } catch (error) {
//       console.error(`Lỗi kích hoạt dịch vụ`, error);
//       toast.error("Xác nhận thất bại")
//     }
//   }


//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="p-4 mb-6">
//       <ToastContainer />
//       <h2 className="text-2xl font-bold mb-4">Danh sách lịch hẹn 🍃</h2>
//       {/* Hiển thi lịch hện ẩn danh */}
//       <div className="mt-10">

//         <details>
//           <summary className="text-[20px] text-gray-600 mb-4 bg-white  p-3 rounded-lg outline outline-2 outline-gray-300 shadow-lg cursor-pointer">
//             Khách hàng ẩn danh
//           </summary>
//           <div className="flex justify-between mb-4">
//             <div className="relative flex items-center w-full md:justify-center">
//               <input
//                 type="text"
//                 className="md:w-[50%] w-full p-4 pr-12 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
//                 placeholder="Tìm kiếm theo tên người dùng"
//                 value={searchItemAmonyus}
//                 onChange={(e) => setSearchItemAmonyus(e.target.value)}
//               />
//               <div className="absolute right-[calc(25%+1rem)] md:right-[calc(25%+1rem)] top-1/2 transform -translate-y-1/2 text-gray-500">
//                 <Search className="w-5 h-5" />
//               </div>
//             </div>
//             <select
//               className="border p-2 rounded-lg ml-2 shadow-lg"
//               value={statusFilterAmonyus}
//               onChange={(e) => setStatusFilterAmonyus(e.target.value)}
//             >
//               <option value="">Tất cả trạng thái</option>
//               <option value="SCHEDULED">Đã đặt lịch</option>
//               <option value="COMPLETED">Hoàn thành</option>
//               <option value="CANCELLED">Đã hủy</option>
//               <option value="PENDING">Chờ xác nhận</option>
//             </select>
//           </div>

//           {appointment.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/70 p-3 rounded-2xl">
//               {paginatedAppointmentAmonyus.map((item) => (
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   key={item.id}
//                   className="p-4 bg-white border rounded-2xl shadow hover:shadow-md transition hover:bg-blue-200/20 relative"
//                 >
//                   <div className="flex items-center gap-4 mt-10">
//                     <UserRound className="outline w-10 h-10 text-gray-500 outline-2 outline-gray-400 rounded-full" />
//                     <div className="flex flex-col gap-1">
//                       <p className="font-semibold text-lg">{item.userId?.name || item.gustName} {item.id}</p>
//                       <p className="text-sm text-gray-600">{item.userId?.email || 'Không có'}</p>
//                       <p className="text-sm text-gray-600">{item.userId?.phone || 'Không có'}</p>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex flex-col gap-1">
//                     <p className="text-sm text-gray-700">
//                       <span className="font-medium">Ngày hẹn:</span>
//                       {new Date(item.appointmentDateTime).toLocaleString("vi-VN")}
//                     </p>


//                     <p className="absolute top-1 right-0">
//                       <span className={statusMap[item.status]?.color}>
//                         {statusMap[item.status]?.label || "Không xác định"}
//                       </span>
//                     </p>


//                     <p className="text-sm text-gray-700">
//                       <span className="font-medium">Tổng tiền:</span>
//                       {item.totalPrice.toLocaleString("vi-VN")}đ
//                     </p>
//                   </div>

//                   <div className="mt-2 flex flex-col gap-1">
//                     <p className="font-medium">Dịch vụ đã chọn:</p>
//                     <ul className="list-disc list-inside text-sm h-20 gap-y-1 flex flex-col">
//                       {item.serviceIds.slice(0, 2).map((service) => (
//                         <li key={service.id} className="flex items-center gap-2">
//                           <img
//                             src={service.images[0]}
//                             alt={service.name}
//                             className="w-8 h-8 object-cover rounded-md"
//                           />
//                           <span>{service.name}</span>
//                         </li>
//                       ))}
//                       {item.serviceIds.length > 2 && (
//                         <li className="text-gray-500 italic">... và {item.serviceIds.length - 2} dịch vụ khác</li>
//                       )}
//                     </ul>

//                   </div>

//                   {/* {item.notes && (
//                     <div className="mt-4 flex gap-1">
//                       <p className="font-medium text-sm">Ghi chú:</p>
//                       <p className="text-sm text-gray-600">{item.notes || 'Không có'}</p>
//                     </div>
//                   )} */}

//                   <div className="mt-10 flex gap-2 items-center">
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       onClick={() => handleOpenModal(item)}
//                       className="bg-blue-100 text-[14px] text-gray-500 px-4 py-1 rounded-full hover:bg-blue-500 hover:text-white"
//                     >
//                       Chi tiết
//                     </motion.button>

//                     <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     onClick={() => handleDeleted(item.id)}
//                     className="bg-red-100 text-[14px] text-gray-500 px-4 py-1 rounded-full hover:bg-red-500 hover:text-white"
//                   >
//                     Xóa lịch hẹn
//                   </motion.button>

//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <RenderNotFound />
//           )}
//           <div className="flex justify-center mt-6">
//             <Pagination
//               count={Math.ceil(fillteredAppointmentAmonyus.length / pageSize)}
//               page={currentPageAmonyus}
//               onChange={handlePageChangeAmonyus}
//               color="primary"
//             />
//           </div>
//         </details>

//       </div>

//       <details open className="mt-10">
//         <div className="flex justify-between mb-4">
//           <div className="relative flex items-center w-full md:justify-center">
//             <input
//               type="text"
//               className="md:w-[50%] w-full p-4 pr-12 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
//               placeholder="Tìm kiếm theo tên người dùng"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <div className="absolute right-[calc(25%+1rem)] md:right-[calc(25%+1rem)] top-1/2 transform -translate-y-1/2 text-gray-500">
//               <Search className="w-5 h-5" />
//             </div>
//           </div>
//           <select
//             className="border p-2 rounded-lg ml-2 shadow-lg"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">Tất cả trạng thái</option>
//             <option value="SCHEDULED">Đã đặt lịch</option>
//             <option value="COMPLETED">Hoàn thành</option>
//             <option value="CANCELLED">Đã hủy</option>
//             <option value="PENDING">Chờ xác nhận</option>
//           </select>

//         </div>
//         {/* Hiển thị danh sách lịch hẹn */}
//         <summary className="text-[20px] text-gray-600 mb-4 bg-white p-3 rounded-lg outline outline-2 outline-gray-300 shadow-lg cursor-pointer">
//           Danh sách lịch hẹn
//         </summary>
//         {appointment.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  bg-white/70 p-3 rounded-2xl">
//             {paginatedAppointment.map((item) => (
//               <div
//                 key={item.id}
//                 className="relative p-4 bg-white border rounded-2xl shadow hover:shadow-md transition"
//               >
//                 <div className="flex items-center gap-4 mt-10">
//                   <img
//                     src={item.userId?.imageUrl || "https://via.placeholder.com/150"}
//                     alt={item.userId?.name || "Khách hàng"}
//                     className="w-16 h-16 rounded-full object-cover"
//                   />
//                   <div className="flex flex-col gap-1">
//                     <p className="font-semibold text-lg">{item.userId?.name || item.gustName}</p>
//                     <p className="text-sm text-gray-600">{item.userId?.email || 'Không có'}</p>
//                     <p className="text-sm text-gray-600">{item.userId?.phone || 'Không có'}</p>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex flex-col gap-1">
//                   <p className="text-sm text-gray-700">
//                     <span className="font-medium">Ngày hẹn:</span>
//                     {new Date(item.appointmentDateTime).toLocaleString("vi-VN")}
//                   </p>

//                   <p className="absolute top-1 right-0">
//                     <span className={statusMap[item.status]?.color}>
//                       {statusMap[item.status]?.label || "Không xác định"}
//                     </span>
//                   </p>


//                   <p className="text-sm text-gray-700">
//                     <span className="font-medium">Tổng tiền:</span>
//                     {item.totalPrice.toLocaleString("vi-VN")}đ
//                   </p>
//                 </div>

//                 <div className="mt-2 flex flex-col gap-1">
//                   <p className="font-medium">Dịch vụ đã chọn:</p>
//                   <ul className="list-disc list-inside text-sm h-20 gap-y-1 flex flex-col">
//                     {item.serviceIds.slice(0, 2).map((service) => (
//                       <li key={service.id} className="flex items-center gap-2">
//                         <img
//                           src={service.images[0]}
//                           alt={service.name}
//                           className="w-8 h-8 object-cover rounded-md"
//                         />
//                         <span>{service.name}</span>
//                       </li>
//                     ))}
//                     {item.serviceIds.length > 2 && (
//                       <li className="text-gray-500 italic">... và {item.serviceIds.length - 2} dịch vụ khác</li>
//                     )}
//                   </ul>

//                 </div>

//                 {/* {item.notes && (
//                   <div className="mt-4">
//                     <p className="font-medium text-sm">Ghi chú:</p>
//                     <p className="text-sm text-gray-600">{item.notes}</p>
//                   </div>
//                 )} */}
//                 <div className="mt-10 flex gap-2 items-center">
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     onClick={() => handleOpenModal(item)}
//                     className="bg-blue-100 text-[14px] text-gray-500 px-4 py-1 rounded-full hover:bg-blue-500 hover:text-white"
//                   >
//                     Chi tiết
//                   </motion.button>

//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     onClick={() => handleDeleted(item.id)}
//                     className="bg-red-100 text-[14px] text-gray-500 px-4 py-1 rounded-full hover:bg-red-500 hover:text-white"
//                   >
//                     Xóa lịch hẹn
//                   </motion.button>
//                 </div>
//               </div>

//             ))}

//           </div>
//         ) : (
//           <RenderNotFound />
//         )}

//         {/* Pagination */}
//         <div className="flex justify-center mt-6">
//           <Pagination
//             count={Math.ceil(filteredAppointment.length / pageSize)}
//             page={currentPage}
//             onChange={handlePageChange}
//             color="primary"
//           />
//         </div>
//       </details>

//       <AppointmentDetailModal
//         open={openModal}
//         onClose={handleCloseModal}
//         appointment={selectedAppointment}
//         onUpdateSuccess={fetchAppointment}
//       />


//     </motion.div>
//   );
// };

// export default AppoinmentList;
