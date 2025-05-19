import { Pagination } from "@mui/material";
import RenderNotFound from "../notFound/renderNotFound";
import AppointmentCard from "./AppointmentCard";
import { AppointmentResponse } from "../../interface/Appointment_interface";

interface AnonymousAppointmentListProps {
  appointments: AppointmentResponse[];
  statusMap: Record<string, { label: string; color: string }>;
  handleOpenModal: (appointment: AppointmentResponse) => void;
  handleOpenPaymentModal: (appointment: AppointmentResponse) => void;
  handleDeleted: (id: number) => void;
  currentPage: number;
  pageSize: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const AnonymousAppointmentList: React.FC<AnonymousAppointmentListProps> = ({
  appointments,
  statusMap,
  handleOpenModal,
  handleOpenPaymentModal,
  handleDeleted,
  currentPage,
  pageSize,
  handlePageChange,
}) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedAppointmentsAmonyus = appointments.slice(startIndex, endIndex);
  return (
    <div>
      {displayedAppointmentsAmonyus.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:gap-4 gap-2 sm:bg-white/70 sm:p-3 rounded-2xl">
          {displayedAppointmentsAmonyus.map((item) => (
            <AppointmentCard
              key={item.id}
              item={item}
              statusMap={statusMap}
              handleOpenModal={handleOpenModal}
              handleOpenPaymentModal={handleOpenPaymentModal}
              handleDeleted={handleDeleted}
            />
          ))}
        </div>
      ) : (
        <RenderNotFound />
      )}
      {
        displayedAppointmentsAmonyus.length > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination
              count={Math.ceil(appointments.length / pageSize)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        )
      }
    </div>
  );
};

export default AnonymousAppointmentList;