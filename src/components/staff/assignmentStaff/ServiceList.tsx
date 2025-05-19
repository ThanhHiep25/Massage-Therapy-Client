import { Listbox } from "@headlessui/react";
import { AppointmentResponse } from "../../../interface/Appointment_interface";

interface AppointmentListProps {
  appointments: AppointmentResponse[];
  formData: { appointmentId?: number }; // Cho phép appointmentId là optional
  setFormData: (data: { appointmentId?: number }) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  formData,
  setFormData,
  searchTerm,
  setSearchTerm,
}) => {
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) || appointment.gustName?.toString().includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="block text-sm mb-2 font-semibold">Danh sách lịch hẹn:</p>
      <Listbox value={formData.appointmentId} onChange={(val) => setFormData({ ...formData, appointmentId: val })}>
        <div className="relative w-full">
          <Listbox.Button className="border p-2 w-full text-left rounded-md flex items-center gap-3">
            {formData.appointmentId ? (
              <>
                <div className="w-20 h-12 rounded-md outline outline-blue-400 flex items-center justify-center bg-gray-100">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col ml-5">
                  <span className="font-semibold">
                    {appointments.find((appt) => appt.id === formData.appointmentId)?.userId?.name || appointments.find((appt) => appt.id === formData.appointmentId)?.gustName}
                  </span>
                  <span>
                    Thời gian:{" "}
                    {new Date(
                      appointments.find((appt) => appt.id === formData.appointmentId)?.appointmentDateTime || ""
                    ).toLocaleString("vi-VN")}
                  </span>
                  <span>
                    Dịch vụ:{" "}
                    {appointments
                      .find((appt) => appt.id === formData.appointmentId)?.serviceIds.map((s) => s.name)
                      .join(", ") || "Không có dịch vụ"}
                  </span>
                  <span className="flex gap-2">Trạng thái: {appointments.find((appt) => appt.id === formData.appointmentId)?.status === "SCHEDULED" ? 
                    <div>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md">Đặt lịch</span>
                  </div> : "Không đặt lịch"}</span>
                </div>
              </>
            ) : (
              "Chọn lịch hẹn"
            )}
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 w-full border mt-1 bg-white max-h-60 overflow-y-auto rounded-md shadow-md">
            <div className="p-2">
              <input
                type="text"
                placeholder="Tìm theo tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Listbox.Option
                  key={appointment.id}
                  value={appointment.id}
                  className="cursor-pointer flex items-center gap-2 px-2 py-2 hover:bg-gray-100"
                >
                  <div className="w-20 h-12 rounded-md outline outline-blue-400 flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <div className="font-semibold">{appointment.userId?.name || appointment.gustName}</div>
                    <div className="text-sm text-gray-500">
                      Thời gian: {new Date(appointment.appointmentDateTime).toLocaleString("vi-VN")}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      Dịch vụ: {appointment.serviceIds.map((s) => s.name).join(", ") || "Không có dịch vụ"}
                    </div>
                    <div className="text-sm text-gray-500">Trạng thái: {appointment.status === "SCHEDULED" ? "Đã đặt" : "Huy"}</div>
                  </div>
                </Listbox.Option>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400 text-sm">Không tìm thấy lịch hẹn nào.</div>
            )}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default AppointmentList;