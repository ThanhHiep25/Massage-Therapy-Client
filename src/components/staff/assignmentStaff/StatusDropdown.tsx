import { useEffect, useRef, useState } from "react";
import {
  approvalApi,
  assignedApi,
  assigningApi,
  cancelApi,
  completeApi,
  overdueApi,
  unassignApi,
} from "../../../service/apiAssignmentStaff";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statuses = [
  { value: "Unassigned", label: "Chưa phân công", color: "text-orange-500" },
  { value: "Assigning", label: "Đang phân công", color: "text-yellow-500" },
  { value: "Assigned", label: "Đã phân công", color: "text-blue-500" },
  { value: "Completed", label: "Đã hoàn thành", color: "text-blue-500" },
  { value: "Approval", label: "Chờ phê duyệt", color: "text-red-500" },
  { value: "Overdue", label: "Quá thời hạn", color: "text-red-500" },
  { value: "Cancelled", label: "Đã hủy", color: "text-red-500" },
];

const statusApiMap: Record<string, (id: string) => Promise<{ success: boolean; message?: string }>> = {
  Unassigned: unassignApi,
  Assigning: assigningApi,
  Assigned: assignedApi,
  Completed: completeApi,
  Approval: approvalApi,
  Overdue: overdueApi,
  Cancelled: cancelApi,
};

type Props = {
  currentStatus: string;
  itemId: string;
  onUpdated?: (newStatus: string) => void;
};

const StatusDropdown = ({ currentStatus, itemId, onUpdated }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [dropdownUpward, setDropdownUpward] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = statuses.find((s) => s.value === localStatus);

  const handleChangeStatus = async (newStatus: string) => {
    if (newStatus === localStatus) return setOpen(false);
    setLoading(true);
    try {
      const apiFunc = statusApiMap[newStatus];
      if (apiFunc) await apiFunc(itemId);
      setLocalStatus(newStatus);
      onUpdated?.(newStatus);
      toast.success(`Đã cập nhật trạng thái thành công`);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Kiểm tra nếu không đủ chỗ bên dưới thì render lên trên
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Giả định dropdown cao khoảng 200px
      setDropdownUpward(spaceBelow < 140 && spaceAbove > 160);
    }
  }, [open]);

  return (
    <div className=" text-left">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className={`font-semibold ${current?.color || "text-gray-500"} px-2 py-1 rounded hover:bg-gray-100`}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : current?.label || "Không rõ"}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 w-44  overflow-y-scroll h-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
            dropdownUpward ? "bottom-[calc(16%+8px)] mb-2" : "mt-2"
          }`}
        >
          <ul className="py-1 max-h-72 overflow-y-auto">
            {statuses.map((status) => (
              <li key={status.value}>
                <button
                  onClick={() => handleChangeStatus(status.value)}
                  className={`w-full text-left px-4 py-2 text-sm ${status.color} hover:bg-gray-100 ${
                    status.value === localStatus ? "font-bold bg-gray-50" : ""
                  }`}
                >
                  {status.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
