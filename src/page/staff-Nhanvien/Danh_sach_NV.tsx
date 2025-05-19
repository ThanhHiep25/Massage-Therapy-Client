import { useState, useEffect } from "react";
import { getEmployees, getPositions, updateEmployee, deleteEmployee, activeEmp, deactiveEmp, exportStaffToExcel } from "../../service/apiStaff";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Captions, CaptionsOff, DeleteIcon, Edit3 } from "lucide-react";
import { motion } from 'framer-motion'
import { Position, StaffDataFull } from "../../interface/StaffData_interface";
import { Pagination } from "@mui/material";
import RenderNotFound from "../../components/notFound/renderNotFound";
import { FaFileExcel, FaLeaf } from "react-icons/fa";
import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const STAFF = import.meta.env.VITE_CLOUDINARY_UPLOAD_STAFF;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const pageSize = 6;
/**
 * EmployeeList là một component React chức năng quản lý và hiển thị 
 * danh sách nhân viên. Nó cung cấp các chức năng như lấy dữ liệu nhân viên 
 * và chức vụ, chỉnh sửa thông tin nhân viên, lọc danh sách theo tên và trạng thái, 
 * phân trang, và xuất dữ liệu nhân viên ra file Excel.
 * 
 * Biến trạng thái:
 * - employees: Một mảng chứa dữ liệu nhân viên.
 * - positions: Một mảng chứa dữ liệu chức vụ.
 * - editingRows: Một đối tượng để theo dõi các thay đổi trong dữ liệu nhân viên khi chỉnh sửa.
 * - editMode: Một đối tượng để theo dõi nhân viên nào đang được chỉnh sửa.
 * - backupData: Một đối tượng để lưu trữ dữ liệu gốc của nhân viên trước khi chỉnh sửa.
 * - searchTerm: Một chuỗi để lọc nhân viên theo tên.
 * - statusFilter: Một chuỗi để lọc nhân viên theo trạng thái.
 * - currentPage: Một số chỉ định trang hiện tại trong danh sách phân trang.
 * 
 * Hiệu ứng:
 * - useEffect để lấy dữ liệu nhân viên và chức vụ khi component được tải.
 * 
 * Phương thức:
 * - fetchEmployees: Lấy danh sách nhân viên từ server.
 * - fetchPositions: Lấy danh sách chức vụ từ server.
 * - handleEditChange: Cập nhật trạng thái editingRows khi chỉnh sửa dữ liệu nhân viên.
 * - handleEdit: Bật chế độ chỉnh sửa cho một nhân viên cụ thể.
 * - handleCancelEdit: Hủy chỉnh sửa cho một nhân viên cụ thể và khôi phục dữ liệu gốc.
 * - handleSaveEmployee: Lưu dữ liệu nhân viên đã chỉnh sửa lên server.
 * - handleDeleteEmployee: Xóa một nhân viên khỏi server và cập nhật danh sách cục bộ.
 * - handleDeactivate: Ngừng kích hoạt một nhân viên.
 * - handleActivate: Kích hoạt lại một nhân viên.
 * - exportExcel: Xuất danh sách nhân viên ra file Excel.
 * - handlePageChange: Cập nhật trạng thái currentPage để phân trang.
 */

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<StaffDataFull[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [editingRows, setEditingRows] = useState<{ [key: number]: any }>({});
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});


  useEffect(() => {
    setLoading(true);
    try {
      fetchEmployees();
      fetchPositions();
    } catch (error: unknown) {
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

  // Lấy danh sách chức vụ
  const fetchPositions = async () => {
    try {
      const response = await getPositions();
      setPositions(response);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  // Chỉnh sửa thông tin nhân viên - thay đổi giá trị
  const handleEditChange = async (staffId: number, field: string, value: string | number) => {
    if (field === "status") return;
    setEditingRows((prev) => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [field]: value,
      },
    }))
    await fetchEmployees()
  };

  // Chọn để chỉnh sửa thông tin nhân viên
  const handleEdit = (staffId: number) => {
    setEditMode((prev) => ({ ...prev, [staffId]: true }));
  };

  // Hủy chỉnh sửa thông tin nhân viên
  const handleCancelEdit = (staffId: number) => {
    setEditingRows((prev) => {
      const newRows = { ...prev };
      delete newRows[staffId];
      return newRows;
    });
    setEditMode((prev) => ({ ...prev, [staffId]: false }));
  };

  // Lưu thông tin nhân viên đã chỉnh sửa
  const handleSaveEmployee = async (staffId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn cập nhật thông tin nhân viên này không?")) return;
    try {
      const updatedEmployee = employees.find((emp) => emp.staffId === staffId);
      if (!updatedEmployee) return;

      const updatedData = {
        ...updatedEmployee,
        ...editingRows[staffId],
        positionId: editingRows[staffId]?.positionId ?? updatedEmployee.position?.positionId,
        position: {
          ...updatedEmployee.position,
          positionId: editingRows[staffId]?.positionId ?? updatedEmployee.position?.positionId,
        }

      };

      // Nếu có ảnh mới thì upload lên Cloudinary trước
      if (editingRows[staffId]?.imageFile) {
        const formData = new FormData();
        formData.append("file", editingRows[staffId].imageFile);
        formData.append(UPLOAD_PRESET, STAFF);

        try {
          const uploadResponse = await axios.post(
            CLOUDINARY_URL,
            formData
          );

          updatedData.imageUrl = uploadResponse.data.secure_url;
        } catch (error: unknown) {
          console.error("Lỗi khi tải ảnh lên:", error);
          toast.error("Lỗi khi tải ảnh lên, vui lòng thử lại.");
          return;
        }
      }


      await updateEmployee(staffId, updatedData);

      setEmployees((prev) =>
        prev.map((emp) => (emp.staffId === staffId ? { ...updatedData } : emp))
      );

      setEditingRows((prev) => {
        const newRows = { ...prev };
        delete newRows[staffId];
        return newRows;
      });
      await fetchEmployees();
      setEditMode((prev) => ({ ...prev, [staffId]: false }));
      toast.success("Cập nhật thông tin nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin nhân viên:", error);
      toast.error("Cập nhật thất bại!");
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, staffId: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Kiểm tra kích thước ảnh
      if (file.size > 2048576) {
        toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }

      // Tạo URL tạm để xem trước ảnh
      const previewUrl = URL.createObjectURL(file);

      setPreviewImages((prev) => ({
        ...prev,
        [staffId]: previewUrl,
      }));

      // Lưu file vào editingRows (không upload ngay)
      setEditingRows((prev) => ({
        ...prev,
        [staffId]: { ...prev[staffId], imageFile: file }
      }));
    }
  };

  // Xóa nhân viên
  const handleDeleteEmployee = async (staffId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) return;
    try {

      const response = await deleteEmployee(staffId);
      setEmployees((prev) => prev.filter((emp) => emp.staffId !== staffId));
      return response;
      toast.success("Xóa nhân viên thành công!");
    } catch (error: unknown) {
      console.error("🔥 Lỗi toàn bộ:", error);

      if ((error as { response?: { data?: { code?: number } } }).response?.data?.code === 1006) {
        toast.error("Không thể xóa nhân viên này đang liên quan đến dịch vụ nào đó!");
      } else {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.error(errorMessage || "Xóa nhân viên thất bại!");
      }
    }

  };

  // Lọc danh sách nhân viên theo tên và trạng thái
  const filteredEmployees = employees.filter((emp) => {
    return (
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || emp.status === statusFilter)
    );
  });

  // Render danh sách nhân viên theo Page
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Deactivate nhân viên
  const handleDeactivate = async (staffId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn ngưng làm việc nhân viên này không?")) return;
    try {
      await deactiveEmp(staffId);
      await fetchEmployees();
      toast.success("Ngưng làm việc nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi ngưng làm việc nhân viên:", error);
      toast.error("Ngưng làm việc thất bại!");
    }
  }

  // Activate nhân viên
  const handleActivate = async (staffId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn kích hoạt nhân viên này không?")) return;
    try {
      await activeEmp(staffId);
      await fetchEmployees();
      toast.success("Kích hoạt nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi kích hoạt nhân viên:", error);
      toast.error("Kích hoạt thất bại!");
    }
  }

  // Xuất excel nhân viên
  const exportExcel = async () => {
    try {
      await exportStaffToExcel();
    } catch (error: unknown) {
      console.log('====================================');
      console.log("Lỗi khi xuat excel", error);
      console.log('====================================');
    }
  }

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
      className="sm:p-6 p-1 sm:mb-4 mb-20 sm:mt-0 mt-10 relative">
      <ToastContainer />
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Danh sách nhân viên 🍃</h2>
      <div className="flex sm:gap-4 gap-1 mb-2 sm:flex-row">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          className="border p-4 rounded-full w-full  text-[12px] sm:text-[16px] dark:text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border sm:p-4 p-1 rounded-full text-[12px] sm:text-[16px] dark:text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVATE">Hoạt động</option>
          <option value="DEACTIVATED">Không hoạt động</option>
        </select>

      </div>
      <div className="flex items-center justify-end mb-3">
        <button className="flex items-center justify-center sm:gap-2 gap-1 bg-green-500 hover:bg-green-600 text-white sm:p-2 p-1 rounded-lg sm:w-[150px] w-[120px]"
          onClick={exportExcel}
        >
          <FaFileExcel size={20} /> Xuất excel
        </button>
      </div>
      {employees.length > 0 ? (
        <div className="grid sm:gap-6 gap-2 sm:gap-y-10 gap-y-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedEmployees.map((employee) => (
            <motion.div whileHover={{ scale: 1.02 }} key={employee.staffId} className="bg-white sm:p-4 p-2  rounded-lg shadow-md">

              <div className="mt-4 text-center dark:text-black">
                {editMode[employee.staffId] ? (
                  <>
                    <div className={`bg-emerald-400/20 rounded-t-xl  ${employee.status == 'DEACTIVATED' ? 'bg-red-400/20' : ''}`}>
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={previewImages[employee.staffId] || editingRows[employee.staffId]?.imageUrl || employee.imageUrl}
                        alt="Ảnh"
                        className="sm:w-24 sm:h-24 w-16 h-16 mx-auto rounded-full object-cover cursor-pointer outline outline-green-300"
                        onClick={() => document.getElementById(`file-input-${employee.staffId}`)?.click()}
                      />
                      <input
                        type="file"
                        id={`file-input-${employee.staffId}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, employee.staffId)}
                      />
                    </div>


                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-justify">Họ và tên</label>
                    <input
                      className="w-full border p-2 rounded sm:text-sm text-[12px]"
                      value={editingRows[employee.staffId]?.name ?? employee.name}
                      onChange={(e) => handleEditChange(employee.staffId, "name", e.target.value)}
                    />
                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-justify">Email</label>
                    <input
                      className="w-full border p-2 rounded mt-1 sm:text-sm text-[12px]"
                      value={editingRows[employee.staffId]?.email ?? employee.email}
                      onChange={(e) => handleEditChange(employee.staffId, "email", e.target.value)}
                    />
                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-justify">Số điện thoại</label>
                    <input
                      className="w-full border p-2 rounded mt-1 sm:text-sm text-[12px]"
                      value={editingRows[employee.staffId]?.phone ?? employee.phone}
                      onChange={(e) => handleEditChange(employee.staffId, "phone", e.target.value)}
                    />
                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-justify">Địa chỉ</label>
                    <input
                      className="w-full border p-2 rounded mt-1 sm:text-sm text-[12px]"
                      value={editingRows[employee.staffId]?.address ?? employee.address}
                      onChange={(e) => handleEditChange(employee.staffId, "address", e.target.value)}
                    />
                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-justify">Chức vụ</label>
                    <select
                      className="w-full mt-1 border p-2 rounded sm:text-sm text-[12px]"
                      value={editingRows[employee.staffId]?.positionId ?? employee.position?.positionId}
                      onChange={(e) => handleEditChange(employee.staffId, "positionId", Number(e.target.value))}
                    >
                      {positions.map((pos) => (
                        <option key={pos.positionId} value={pos.positionId}>{pos.positionName}</option>
                      ))}
                    </select>
                  </>
                ) : (


                  <div className="sm:text-justify text-left" style={{ lineHeight: "1.9" }}>
                    <div className={`bg-emerald-400/20 rounded-t-xl ${employee.status == 'DEACTIVATED' ? 'bg-red-400/20' : ''}`}>
                      <img src={employee.imageUrl} alt="Ảnh" className={`sm:w-24 sm:h-24 w-16 h-16 mx-auto rounded-full object-cover outline outline-green-300 ${employee.status == 'DEACTIVATED' ? 'outline-red-300' : ''}`} />
                    </div>
                    <p className="sm:text-lg text-[13px] mt-4">{employee.name}</p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400 sm:line-clamp-none line-clamp-1">Email: {employee.email}</p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400">Số điện thoại: {employee.phone}</p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400">Ngày bắt đầu: {employee.startDate}</p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400">Địa chỉ: {employee.address}</p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400">Chưc vụ: {employee.position?.positionName}</p>
                  </div>


                )}
                <p className={`mt-2 sm:px-2 sm:py-2 rounded-2xl sm:text-sm text-[12px] ${employee.status === "ACTIVATE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                  <span className="animate-ping" style={{
                    width: "8px",
                    marginRight: "10px",
                    height: "8px",
                    borderRadius: "50%",
                    display: "inline-block",
                    backgroundColor: employee.status === "ACTIVATE" ? "#10B981" : "#EF4444",
                  }}></span>{employee.status === "ACTIVATE" ? "Đang làm việc" : "Đã nghỉ việc"}
                </p>
                <div className="sm:mt-4 mt-2 flex justify-center gap-2">
                  {editMode[employee.staffId] ? (
                    <>
                      <button onClick={() => handleSaveEmployee(employee.staffId)} className="sm:px-4 sm:py-2 p-2  sm:text-sm text-[12px] bg-blue-200 text-white rounded hover:bg-blue-500">Lưu</button>
                      <button onClick={() => handleCancelEdit(employee.staffId)} className="sm:px-4 sm:py-2 p-2  sm:text-sm text-[12px] bg-gray-200 text-white rounded hover:bg-gray-500">Hoàn Tác</button>
                    </>
                  ) : (
                    <div className="flex items-center sm:gap-4 gap-2">
                      <button onClick={() => handleEdit(employee.staffId)} className="sm:px-5 sm:py-2 p-1 bg-blue-300 text-white rounded hover:bg-blue-500"><Edit3 className="sm:w-5 sm:h-5 w-4 h-4" /></button>
                      {employee.status === "ACTIVATE" && (
                        <button title="Ngừng làm việc" onClick={() => handleDeactivate(employee.staffId)} className="sm:px-5 sm:py-2 p-1 bg-orange-200 text-white rounded hover:bg-orange-500"><CaptionsOff className="sm:w-5 sm:h-5 w-4 h-4" /></button>
                      )}

                      {employee.status === "DEACTIVATED" && (
                        <button title="Kích hoạt" onClick={() => handleActivate(employee.staffId)} className="sm:px-5 sm:py-2 p-1 bg-green-200 text-white rounded hover:bg-green-500"><Captions className="sm:w-5 sm:h-5 w-4 h-4" /></button>
                      )}
                      <button onClick={() => handleDeleteEmployee(employee.staffId)} className="sm:px-5 sm:py-2 p-1 bg-red-300 text-white rounded hover:bg-red-500"><DeleteIcon className="sm:w-5 sm:h-5 w-4 h-4" /></button>
                    </div>

                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredEmployees.length === 0 &&
            <div className="text-center text-gray-400 col-span-full mt-10">Không tìm thấy nhân viên nào!
            </div>}

        </div>
      ) : (
        <RenderNotFound />
      )}

      {
        filteredEmployees.length > pageSize && (
          <div className="flex justify-center mt-6">
            <Pagination
              count={Math.ceil(filteredEmployees.length / pageSize)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        )
      }


    </motion.div>
  );
};

export default EmployeeList;