import { useEffect, useState } from "react";
import { getEmployees } from "../../service/apiStaff";
import { StaffDataFull } from "../../interface/StaffData_interface";

import { AssignmentFormData, AssignmentStaffData } from "../../interface/AssignmentStaff_interface";
import { createAssignmentStaff, deleteAssignmentStaff, getAssignmentStaff, updateAssignmentStaff } from "../../service/apiAssignmentStaff";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion'
import EmployeeList from "../../components/staff/assignmentStaff/EmployeeList";
import ServiceList from "../../components/staff/assignmentStaff/ServiceList";
import AssignmentForm from "../../components/staff/assignmentStaff/AssignmentForm";
import AssignmentTable from "../../components/staff/assignmentStaff/AssignmentTable";
import Pagination from "../../components/staff/assignmentStaff/Pagination";
import { getAppointmentScheduled } from "../../service/apiAppoinment";
import { AppointmentResponse } from "../../interface/Appointment_interface";
import { getDepartments } from "../../service/apiDepartment";
import { DepartmentResponse } from "../../interface/Department_interface";
import Department from "../../components/staff/department/Department";
import { FaLeaf } from "react-icons/fa";


// Danh sách ngày lễ (chuẩn định dạng YYYY-MM-DD)
const holidays = ["2025-04-30", "2025-05-01", "2025-09-02"];
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];



/**
 * Component để phân công nhân viên
 * 
 * Trang này có 3 phần:
 * 1. Danh sách nhân viên
 * 2. Danh sách dịch vụ
 * 3. Form để tạo phân công mới
 * 
 * Sau khi tạo phân công, sẽ được thêm vào danh sách phân công
 * 
 * Nhấn vào nút "Xóa" để xóa phân công
 * Nhấn vào nút "Cập nhật" để cập nhật phân công
 * 
 * Có thể thay đổi kích thước trang và số lượng phân công trên 1 trang
 * 
 * @returns React component
 */
const AssignmentStaff: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [employees, setEmployees] = useState<StaffDataFull[]>([]);
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
    const [department, setDepartment] = useState<DepartmentResponse[]>([]);
    const [assignments, setAssignments] = useState<AssignmentStaffData[]>([]);
    const [formData, setFormData] = useState<AssignmentFormData>({
        staffId: 0,
        appointmentId: 0,
        departmentId: 0,
        assignedDate: localDate,
        note: "",
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<{
        assignedDate: string;
        departmentId: number;
        note: string;
    }>({
        assignedDate: "",
        departmentId: 0,
        note: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [searchStaff, setSearchStaff] = useState("");

    useEffect(() => {
        setLoading(true);
        try {
            fetchEmployees();
            fetchServices();
            fetchAssignments();
            fetchDepartment();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);


    // Lấy danh sách nhân viên
    const fetchEmployees = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // Lấy danh sách phân công nhân viên
    const fetchAssignments = async () => {
        try {
            const response = await getAssignmentStaff();
            setAssignments(response);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    // Lấy danh sách phòng
    const fetchDepartment = async () => {
        try {
            const response = await getDepartments();
            setDepartment(response);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    }


    // Lấy danh sách dịch vụ
    const fetchServices = async () => {
        try {
            const response = await getAppointmentScheduled();
            setAppointments(response);
        } catch (error) {
            console.error("Lỗi tải danh sách dịch vụ:", error);
        }
    };

    // Tạo phân công nhân viên
    const handleCreate = async () => {
        try {

            const newAssignment = await createAssignmentStaff(formData);
            setAssignments((prev) => [...prev, newAssignment]);
            toast.success("Tạo phân công thành công!");
            setFormData({
                staffId: 0,
                appointmentId: 0,
                departmentId: 0,
                assignedDate: localDate,
                note: "",
            });
            setSearchTerm("");
            setSearchStaff("");
        }
        catch (error) {

            if ((error as { response?: { data?: { code?: number } } })?.response?.data?.code === 2001) {
                toast.warning("Nhân viên này đã được phân công!");
                return;
            }
            if ((error as { response?: { data?: { code?: number } } })?.response?.data?.code === 2000) {
                toast.warning("Nhân viên đã đặt giới hạn cho phòng này!");
                return;
            }
            if ((error as { response?: { data?: { code?: number } } })?.response?.data?.code === 404) {
                toast.error("Bạn chưa chọn phòng!");
                return;
            }

            toast.error("Phân công nhân viên thất bại!");
            console.error("Error creating assignment:", error);
        }

    };


    // Xóa phân công nhân viên
    const handleDelete = async (id: number) => {
        try {
            if (!window.confirm("Bạn có chắc chắn muốn xóa phân công này?")) return;
            await deleteAssignmentStaff(id);
            toast.success("Xóa phân công thành công!");
            setAssignments((prev) => prev.filter((item) => item.id !== id));
        }
        catch (error) {
            toast.error("Xóa phân công thất bại!");
            console.error("Error deleting assignment:", error);
        }
    };

    // Cập nhật thông tin phân công
    const handleUpdate = async (id: number) => {
        try {
            console.log('Bắt đầu handleUpdate cho ID:', id);
            console.log('editFormData khi update:', editFormData);
            await updateAssignmentStaff(id, {
                ...editFormData,
                staffId: assignments.find((a) => a.id === id)?.staff.staffId ?? 0,
                appointmentId: assignments.find((a) => a.id === id)?.appointment.id ?? 0,
                departmentId: editFormData.departmentId,
            });
            toast.success("Cập nhật thành công!");
            setEditingId(null);
            fetchAssignments();
        } catch (error) {
            toast.error("Cập nhật thất bại!");
            console.error("Error updating assignment:", error);
        }
    }

    // Tính số lượng trang tổng cộng
    const totalPages = Math.ceil(assignments.length / pageSize);

    // Cắt dữ liệu theo trang hiện tại
    const currentAssignments = assignments.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Thay đổi trang
    const handlePageChange = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    };

    // Thay đổi page size
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1); // Khi thay đổi kích thước trang, reset lại trang hiện tại
    };

    if (loading) {
        return <div className="flex flex-col items-center justify-center h-[70vh] gap-y-4">
            <div className="relative h-[100px] w-[100px]">
                <div className="animate-spin rounded-full h-[90px] w-[90px] border-t-2 border-l-2 border-teal-400 absolute"></div>
                <div className="animate-spin rounded-full h-[80px] w-[80px] border-t-2 border-r-2 border-purple-400 absolute top-1 left-1"></div>
                <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-green-400 absolute top-2 left-2"></div>
                <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-blue-400 absolute top-2 left-2"></div>
                <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-red-400 absolute top-2 left-2"></div>
            </div>
            <div className="flex items-center">
                <FaLeaf className="animate-bounce text-green-400 text-xl mr-2" />
                <span className="text-gray-600 text-sm">Đang thư giãn và tải dữ liệu...</span>
            </div>
        </div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:p-4 pt-0 space-y-3 mb-6 sm:mt-0 mt-10"
        >
            <ToastContainer />
            <p className="sm:text-2xl text-lg font-bold mb-6">Phân công nhân viên 🍃</p>

            <Department onReload={fetchDepartment}/>

            <div className="p-5 bg-white rounded-xl dark:text-black">
                <div className="flex sm:flex-row flex-col gap-4 mb-4">
                    <EmployeeList
                        employees={employees}
                        formData={{ staffId: formData.staffId }}
                        setFormData={(data) =>
                            setFormData((prev) => ({ ...prev, ...data }))
                        }
                        searchStaff={searchStaff}
                        setSearchStaff={setSearchStaff}
                    />
                    <ServiceList
                        appointments={appointments}
                        formData={formData}
                        setFormData={(data) =>
                            setFormData((prev) => ({ ...prev, ...data }))
                        }
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </div>
                <AssignmentForm
                    formData={formData}
                    setFormData={(data) =>
                        setFormData((prev) => ({ ...prev, ...data }))
                    }
                    handleCreate={handleCreate}
                    holidays={holidays}
                    department={department}
                />
            </div>
            <AssignmentTable
                assignments={currentAssignments}
                editingId={editingId}
                setEditingId={setEditingId}
                editFormData={editFormData}
                setEditFormData={(data) =>
                    setEditFormData((prev) => ({ ...prev, ...data }))
                }
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                department={department}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                handlePageSizeChange={handlePageSizeChange}
            />
        </motion.div>
    );

}

export default AssignmentStaff;