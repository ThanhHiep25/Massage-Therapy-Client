import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { AppointmentResponse } from "../../interface/Appointment_interface";
import { useAuth } from "../../hooks/AuthContext";

interface AppointmentCardProps {
  item: AppointmentResponse & { isNew?: boolean };
  statusMap: Record<string, { label: string; color: string }>;
  handleOpenModal: (appointment: AppointmentResponse) => void;
  handleOpenPaymentModal: (appointment: AppointmentResponse) => void
  handleDeleted: (id: number) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  item,
  statusMap,
  handleOpenModal,
  handleDeleted,
  handleOpenPaymentModal
}) => {

 const { user } = useAuth();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      key={item.id}
      className="sm:p-4 p-2 bg-white border rounded-2xl shadow hover:shadow-md transition hover:bg-blue-200/20 relative"
    >
      <div className="flex items-center gap-4 sm:mt-10 mt-6">
        {item.isNew && (
          <span className="absolute top-1 left-1 inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white">
            New ✨
          </span>
        )}
        {
          item.userId != null ?
            <img src={item.userId?.imageUrl} alt="avatar" className="w-10 h-10 object-cover rounded-full" /> :
            <UserRound className="outline w-10 h-10 text-gray-500 outline-2 outline-gray-400 rounded-full" />
        }

        <div className="flex flex-col gap-1 line-clamp-1">
          <p className="font-semibold sm:text-lg text-[14px]">{item.userId?.name || item.gustName + " " + item.id}</p>
          <p className="sm:text-sm text-[12px] text-gray-600">{item.userId?.email || ""}</p>
          <p className="sm:text-sm text-[12px]">{item.userId?.phone || ""}</p>
        </div>
      </div>

      <div className="sm:mt-4 mt-2 flex flex-col gap-1">
        <p className="sm:text-sm text-[12px] text-gray-700">
          <span className="font-medium">Ngày hẹn:</span>
          {new Date(item.appointmentDateTime).toLocaleString("vi-VN", {
            weekday: 'long', // Hiển thị tên thứ đầy đủ (Thứ Bảy)
            hour: 'numeric',   // Hiển thị giờ (11)
            minute: '2-digit', // Hiển thị phút với 2 chữ số (00)
            second: '2-digit', // Hiển thị giây với 2 chữ số (00)
            day: '2-digit',    // Hiển thị ngày với 2 chữ số (26)
            month: '2-digit',  // Hiển thị tháng với 2 chữ số (04)
            year: 'numeric',   // Hiển thị năm đầy đủ (2025)
          })}
        </p>

        <p className="absolute sm:top-1 top-0 right-0">
          <span className={statusMap[item.status]?.color}>
            {statusMap[item.status]?.label || "Không xác định"}
          </span>
        </p>

        <p className="sm:text-sm text-[12px] text-gray-700">
          <span className="font-medium">Tổng tiền:</span>
          {item.totalPrice.toLocaleString("vi-VN")}đ
        </p>
      </div>

      <div className="sm:mt-2 flex flex-col gap-1">
        <p className="font-medium sm:text-sm text-[12px]">Dịch vụ đã chọn:</p>
        <ul className="list-disc list-inside text-sm sm:h-20 h-18  gap-y-1 flex flex-col">
          {item.serviceIds.slice(0, 2).map((service) => (
            <li key={service.id} className="flex items-center gap-2">
              <img
                src={service.images[0]}
                alt={service.name}
                className="w-8 h-8 object-cover rounded-md"
              />
              <span className="sm:text-sm text-[12px]">{service.name}</span>
            </li>
          ))}
          {item.serviceIds.length > 2 && (
            <li className="text-gray-500 italic sm:text-sm text-[12px]">
              ... và {item.serviceIds.length - 2} dịch vụ khác
            </li>
          )}
        </ul>
      </div>

      <div className="sm:mt-10 mt-4 flex gap-2 items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleOpenModal(item)}
          className="bg-blue-100 sm:text-[14px] text-[12px] text-gray-500 sm:px-4 p-2 py-1 rounded-full hover:bg-blue-500 hover:text-white"
        >
          Chi tiết
        </motion.button>

        {
          item.status != "PAID" && item.status != "COMPLETED" && item.status != "SCHEDULED" && user?.roles === "admin" ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => handleDeleted(item.id)}
              className="bg-red-100 sm:text-[14px] text-[12px] text-gray-500 sm:px-4 p-2 py-1 rounded-full hover:bg-red-500 hover:text-white"
            >
              Xóa lịch hẹn
            </motion.button>
          ) : null
        }

        {
          item.status != "PAID" && item.status != "CANCELLED" && item.status != "PENDING" ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => handleOpenPaymentModal(item)} // Gọi hàm mở modal thanh toán
              className="bg-green-100 sm:text-[14px] text-[12px] text-gray-500 sm:px-4 p-2 py-1 rounded-full hover:bg-green-500 hover:text-white"
            >
              Thanh toán
            </motion.button>
          ) : null
        }

        {/* <motion.button // Nút thanh toán mới
          whileHover={{ scale: 1.1 }}
          onClick={() => handleOpenPaymentModal(item)} // Gọi hàm mở modal thanh toán
          className="bg-green-100 text-[14px] text-gray-500 px-4 py-1 rounded-full hover:bg-green-500 hover:text-white"
        >
          Thanh toán
        </motion.button> */}
      </div>
    </motion.div>
  );
};

export default AppointmentCard;