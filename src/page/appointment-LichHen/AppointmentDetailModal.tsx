import { Check, Trash2, XIcon } from 'lucide-react';
import { AppointmentResponse } from '../../interface/Appointment_interface';
import { motion } from 'framer-motion';
import { updateStatusCancel, updateStatusComplete, updateStatusScheduled } from '../../service/apiAppoinment';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  appointment: AppointmentResponse | null;
  onUpdateSuccess?: () => void;
}

const AppointmentDetailModal: React.FC<Props> = ({ open, onClose, appointment, onUpdateSuccess }) => {
  const [canCancel, setCanCancel] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
      const appointmentTime = new Date(appointment.appointmentDateTime);
      const now = new Date();
      const timeDifference = appointmentTime.getTime() - now.getTime();
      const oneHourInMilliseconds = 60 * 60 * 1000;

      setCanCancel(appointment.status !== 'SCHEDULED' && timeDifference > oneHourInMilliseconds);

      // Đếm ngược thời gian
      if (timeDifference > 0 && appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && appointment.status !== 'PAID') {
        const intervalId = setInterval(() => {
          const currentTime = new Date().getTime();
          const remainingTime = appointmentTime.getTime() - currentTime;

          if (remainingTime <= 0) {
            clearInterval(intervalId);
            setTimeLeft("Đã đến giờ hẹn");
            setCanCancel(false); // Hết thời gian hủy
          } else {
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

            // Cập nhật trạng thái có thể hủy sau mỗi giây
            const updatedTimeDifference = appointmentTime.getTime() - new Date().getTime();
            setCanCancel(appointment.status !== 'SCHEDULED' && updatedTimeDifference > oneHourInMilliseconds);
          }
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup khi component unmount
      } else {
        setTimeLeft(null);
      }
    }
  }, [appointment]);

  if (!open || !appointment) return null;

  // Xác nhận lịch hẹn khách hàng đã đặt
  const handleStatusScheduled = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xác nhận lịch hẹn này ?')) return;

    if (appointment.status === 'SCHEDULED') {
      toast.warning('Lịch hẹn này đã được xác nhận');
      return;
    }

    try {
      await updateStatusScheduled(id);
      toast.success(`Xác nhận dịch vụ thành công`);
      onUpdateSuccess?.();
    } catch (error: unknown) {
      console.error(`Lỗi kích hoạt dịch vụ`, error);
      toast.error("Xác nhận thất bại");
    }
  };

  // Complete lịch hẹn
  const handleStatusComplete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xác nhận hoàn thành lịch hẹn này ?')) return;

    try {
      await updateStatusComplete(id);
      toast.success(`Hoàn thành dịch vụ thành công`);
      onUpdateSuccess?.();
    } catch (error) {
      console.error(`Lỗi kích hoạt dịch vụ`, error);
      toast.error("Xác nhận thất bại");
    }
  };

  // Hủy lịch hẹn
  const handleCancel = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này ?')) return;

    try {
      await updateStatusCancel(id);
      toast.success(`Hủy dịch vụ thành công`);
      onUpdateSuccess?.();
    } catch (error) {
      console.error(`Lỗi kích hoạt dịch vụ`, error);
      toast.error("Hủy thất bại");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative sm:m-0 m-3">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          <XIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Chi tiết lịch hẹn</h2>

        <div className="space-y-3">
          <div className='sm:text-[16px] text-[14px]'>
            <span className="font-medium ">Khách hàng:</span> {appointment.userId?.name || appointment.gustName}
          </div>
          <div className='sm:text-[16px] text-[14px]'>
            <span className="font-medium">Email:</span> {appointment.userId?.email || "Không có"}
          </div>
          <div className='sm:text-[16px] text-[14px]'>
            <span className="font-medium">Số điện thoại:</span> {appointment.userId?.phone || "Không có"}
          </div>
          <div className='sm:text-[16px] text-[14px]'>
            <span className="font-medium">Ngày hẹn:</span>
            {new Date(appointment.appointmentDateTime).toLocaleString("vi-VN", {
              weekday: 'long', // Hiển thị tên thứ đầy đủ (Thứ Bảy)
              hour: 'numeric',   // Hiển thị giờ (11)
              minute: '2-digit', // Hiển thị phút với 2 chữ số (00)
              second: '2-digit', // Hiển thị giây với 2 chữ số (00)
              day: '2-digit',    // Hiển thị ngày với 2 chữ số (26)
              month: '2-digit',  // Hiển thị tháng với 2 chữ số (04)
              year: 'numeric',   // Hiển thị năm đầy đủ (2025)
            })}
          </div>
          <div className='sm:text-[16px] text-[14px] text-blue-500'>
            <span className="font-medium">Tổng tiền:</span> {appointment.totalPrice.toLocaleString("vi-VN")}đ
          </div>

          <div className='sm:text-[16px] text-[14px]'>
            <span className="font-medium">Dịch vụ đã chọn:</span>
            <ul className="list-disc list-inside ml-4 mt-1 flex flex-col gap-y-2">
              {appointment.serviceIds.map((service) => (
                <li key={service.id} className="flex items-center gap-5 p-2 bg-green-200/50 rounded-lg">
                  <motion.img whileInView={{
                    x: 0,
                    y: 0,
                    transition: { duration: 0.3 },
                    scale: 1.1
                  }} src={service.images[0]} alt={service.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex flex-col ">
                    <span className="font-medium">{service.name}</span>
                    <span className='text-gray-600'>Thời gian thực hiện: {service.duration} phút</span>
                    <span className='text-gray-600'>Tag: {service.serviceType}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {appointment.notes && (
            <div>
              <span className="font-medium sm:text-[16px] text-[14px]">Ghi chú:</span> {appointment.notes}
            </div>
          )}

          <div className="flex flex-col pt-3">
            {timeLeft && (
              <div className="">
                <i className='text-gray-400 sm:text-[16px] text-[14px]'>Lưu ý : Bạn có hủy lịch hẹn trong thời gian còn hiệu lực.</i>
                <p className="text-orange-500 font-semibold sm:text-[16px] text-[14px]">
                  Thời gian đến hẹn: {timeLeft}
                </p>
              </div>

            )}
          </div>


        </div>
        <div className="mt-10 flex items-center gap-2 sm:text-[16px] text-[14px]">
          {appointment.status === "PENDING" && (
            <motion.button whileHover={{ scale: 1.05 }} className='flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-200 text-gray-500 hover:bg-blue-400 hover:text-white' onClick={() => handleStatusScheduled(appointment.id)}><Check className='sm:w-5 sm:h-5 w-4 h-4'/>Xác nhận lịch hẹn</motion.button>
          )}

          {
            appointment.status === "SCHEDULED" && (
              <motion.button whileHover={{ scale: 1.05 }} className='flex items-center justify-center gap-2 p-2 rounded-lg bg-green-200 text-gray-500 hover:bg-green-400 hover:text-white' onClick={() => handleStatusComplete(appointment.id)}><Check className='sm:w-5 sm:h-5 w-4 h-4'/>Hoàn thành</motion.button>
            )
          }

          {
            appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED" && appointment.status !== "PAID" && canCancel ? (
              <motion.button whileHover={{ scale: 1.05 }} className='flex items-center justify-center gap-2 p-2 rounded-lg bg-red-200 text-gray-500 hover:bg-red-400 hover:text-white' onClick={() => handleCancel(appointment.id)}><Trash2 className='sm:w-5 sm:h-5 w-4 h-4'/>Hủy lịch hẹn</motion.button>
            ) : (
              appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED" && appointment.status !== "PAID" && !canCancel && (
                <button className='flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed'><Trash2 className='sm:w-5 sm:h-5 w-4 h-4'/>Không thể hủy</button>
              )
            )
          }

        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;