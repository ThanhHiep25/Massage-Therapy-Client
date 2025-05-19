import { Search } from "lucide-react";

interface AppointmentFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
  }
  
  const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  }) => {
    return (
      <div className="flex justify-between mb-4">
        <div className="relative flex items-center w-full md:justify-center">
          <input
            type="text"
            className="sm:w-[50%] w-full sm:p-4 p-2 sm:text-[16px] text-[14px] pr-12 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Tìm kiếm theo tên người dùng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-[calc(25%-2rem)] sm:right-[calc(25%+1rem)] top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search className="w-5 h-5" />
          </div>
        </div>
        <select
          className="border p-2 rounded-lg ml-2 shadow-lg sm:text-[16px] text-[14px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="SCHEDULED">Đã đặt lịch</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="PAID">Đã thanh toán</option>
        </select>
      </div>
    );
  };
  
  export default AppointmentFilters;