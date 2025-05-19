import StatusDropdown from "./StatusDropdown";
import { AssignmentStaffData } from "../../../interface/AssignmentStaff_interface";
import { Edit, Save, Trash, X } from "lucide-react";
import { useState } from "react";
import { DepartmentResponse } from "../../../interface/Department_interface";


interface AssignmentTableProps {
    assignments: AssignmentStaffData[];
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    editFormData: { assignedDate: string; departmentId: number; note: string }; // Include departmentId in editFormData
    setEditFormData: (data: { assignedDate: string; departmentId: number; note: string }) => void; // Include departmentId in setEditFormData
    handleDelete: (id: number) => void;
    handleUpdate: (id: number) => void;
    department: DepartmentResponse[]
}

const statuses = [
    { value: "Unassigned", label: "Chưa phân công", color: "text-orange-500" },
    { value: "Assigning", label: "Đang phân công", color: "text-yellow-500" },
    { value: "Assigned", label: "Đã phân công", color: "text-blue-500" },
    { value: "Completed", label: "Đã hoàn thành", color: "text-blue-500" },
    { value: "Approval", label: "Chờ phê duyệt", color: "text-red-500" },
    { value: "Overdue", label: "Quá thời hạn", color: "text-red-500" },
    { value: "Cancelled", label: "Đã hủy", color: "text-red-500" },
];

const AssignmentTable: React.FC<AssignmentTableProps> = ({
    assignments,
    editingId,
    setEditingId,
    editFormData,
    setEditFormData,
    handleDelete,
    handleUpdate,
    department
}) => {

    const [fillterItem, setFillterItem] = useState('');
    const [fillterStatus, setFillterStatus] = useState('');

    const filterAssignment = assignments.filter((assignment) => {
        const matchStaffName = assignment.staff.name.toLowerCase().includes(fillterItem.toLowerCase());

        const matchServiceName = assignment.appointment.serviceIds.some((service) =>
            service.name.toLowerCase().includes(fillterItem.toLowerCase())
        );

        const matchStatus = fillterStatus === "" || assignment.status === fillterStatus;

        return (matchStaffName || matchServiceName) && matchStatus;
    });


    return (
        <div className="relative dark:text-black b">

            <div className=" mt-2">
                <label className="flex items-center sm:text-[16px] text-sm dark:text-white">Bộ lọc:</label>
                <div className="flex items-center gap-2">
                    <select
                        className="border sm:p-4 px-1 py-4 mt-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none sm:text-[16px] text-sm"
                        value={fillterStatus}
                        onChange={(e) => setFillterStatus(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        {statuses.map((status) => (
                            <option value={status.value}>{status.label}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={fillterItem}
                        onChange={(e) => setFillterItem(e.target.value)}
                        className="w-full mt-2 sm:p-4 px-1 py-4 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none sm:text-[16px] text-sm"
                    />
                </div>

            </div>

            <table className=" w-full border mt-6 rounded-xl shadow-md sm:overflow-hidden">
                <thead >
                    <tr className="bg-gray-100 p-4 h-12 sm:text-[16px] text-sm">
                        <th className="text-left pl-4 ">ID</th>
                        <th className="text-left">Nhân viên</th>
                        <th className="text-left">Khách hàng</th>
                        <th className="text-left">Dịch vụ</th>
                        <th className="text-left">Ngày phân công</th>
                        <th className="text-left">Phòng</th>
                        <th className="text-left">Ghi chú</th>
                        <th className="text-left">Trạng thái công việc</th>
                        <th className="text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-600 dark:text-white bg-white">
                    {filterAssignment.map((item) => (
                        <tr key={item.id} className="h-12 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                            <td className="pl-4">{item.id}</td>
                            <td>{item.staff.name}</td>
                            <td>{item.appointment.gustName || item.appointment.userId?.name}</td>
                            <td>{item.appointment.serviceIds.map((service) => service.name).join(", ")}</td>
                            <td>
                                {editingId === item.id ? (
                                    <input
                                        type="date"
                                        value={editFormData.assignedDate}
                                        onChange={(e) =>
                                            setEditFormData({ ...editFormData, assignedDate: e.target.value })
                                        }
                                        className="border rounded p-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                ) : (
                                    item.assignedDate
                                )}
                            </td>
                            <td>
                                {editingId === item.id ? (
                                    <select
                                        value={editFormData.departmentId}
                                        onChange={(e) =>
                                            setEditFormData({ ...editFormData, departmentId: parseInt(e.target.value) })
                                        }
                                        className="border rounded p-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    >
                                        <option value={0}>Chọn phòng</option>
                                        {department.map((dept) => (
                                            <option key={dept.departmentId} value={dept.departmentId}>
                                                {dept.departmentName}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    item.department?.departmentName
                                )}
                            </td>
                            <td>
                                {editingId === item.id ? (
                                    <input
                                        type="text"
                                        value={editFormData.note}
                                        onChange={(e) =>
                                            setEditFormData({ ...editFormData, note: e.target.value })
                                        }
                                        className="border rounded p-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                ) : (
                                    item.note
                                )}
                            </td>
                            <td className="text-center">
                                <StatusDropdown
                                    currentStatus={item.status}
                                    itemId={item.id.toString()}
                                    onUpdated={() => assignments}
                                />

                            </td>
                            <td>
                                {editingId === item.id ? (
                                    <>
                                        <button
                                            className="text-green-600 mr-2 p-2 hover:bg-green-100 rounded-full"
                                            onClick={() => handleUpdate(item.id)}
                                        >
                                            <Save size={16} />
                                        </button>
                                        <button
                                            className="text-gray-500 p-2 hover:bg-gray-100 rounded-full"
                                            onClick={() => setEditingId(null)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </>

                                ) : (
                                    <>
                                        <button
                                            className="text-blue-500 mr-2 p-2 hover:bg-blue-100 rounded-full"
                                            onClick={() => {
                                                setEditingId(item.id);
                                                setEditFormData({
                                                    assignedDate: item.assignedDate,
                                                    departmentId: item.department?.departmentId || 0, // Initialize departmentId in edit form
                                                    note: item.note || "",
                                                });
                                            }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="text-red-500 p-2 hover:bg-red-100 rounded-full"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default AssignmentTable;