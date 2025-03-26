import { useState, useEffect } from "react";
import { getEmployees, getPositions, updateEmployee, deleteEmployee, activeEmp, deactiveEmp } from "../../service/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit3 } from "lucide-react";
import { ContentPasteOffOutlined, ContentPasteOutlined, Delete } from "@mui/icons-material";
import { motion } from 'framer-motion'

const EmployeeList = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [editingRows, setEditingRows] = useState<{ [key: number]: any }>({});
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [backupData, setBackupData] = useState<{ [key: number]: any }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");


  useEffect(() => {
    fetchEmployees();
    fetchPositions();
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
  const handleEditChange = (staffId: number, field: string, value: any) => {
    if (field === "status") return;
    setEditingRows((prev) => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [field]: value,
      },
    }));
  };

  // Chọn để chỉnh sửa thông tin nhân viên
  const handleEdit = (staffId: number) => {
    setBackupData((prev) => ({ ...prev, [staffId]: employees.find(emp => emp.staffId === staffId) }));
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


      await updateEmployee(staffId, updatedData);
      await fetchEmployees();
      setEmployees((prev) =>
        prev.map((emp) => (emp.staffId === staffId ? { ...updatedData } : emp))
      );

      setEditingRows((prev) => {
        const newRows = { ...prev };
        delete newRows[staffId];
        return newRows;
      });
      setEditMode((prev) => ({ ...prev, [staffId]: false }));
      toast.success("Cập nhật thông tin nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin nhân viên:", error);
      toast.error("Cập nhật thất bại!");
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
    } catch (error: any) {
      console.error("🔥 Lỗi toàn bộ:", error);

      if (error?.data?.code === 1006) {
        toast.error("Không thể xóa nhân viên này đang liên quan đến dịch vụ nào đó!");
      } else {
        toast.error(error?.data?.message || "Xóa nhân viên thất bại!");
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


  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 w-full max-w-6xl mx-auto">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center">Danh Sách Nhân Viên</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="DEACTIVATED">Không hoạt động</option>
        </select>
      </div>
      <div className="grid gap-32 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ marginLeft: "-70px" }}>
        {filteredEmployees.map((employee) => (
          <div key={employee.staffId} className="bg-white p-4 rounded-lg shadow-md" style={{ width: "300px" }}>
            <img src={employee.imageUrl} alt="Ảnh" className="w-24 h-24 mx-auto rounded-full object-cover" />
            <div className="mt-4 text-center">
              {editMode[employee.staffId] ? (
                <>
                  <label className="block text-gray-600 text-sm m-1 text-justify">Họ và tên</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={editingRows[employee.staffId]?.name ?? employee.name}
                    onChange={(e) => handleEditChange(employee.staffId, "name", e.target.value)}
                  />
                  <label className="block text-gray-600 text-sm m-1 text-justify">Email</label>
                  <input
                    className="w-full border p-2 rounded mt-2"
                    value={editingRows[employee.staffId]?.email ?? employee.email}
                    onChange={(e) => handleEditChange(employee.staffId, "email", e.target.value)}
                  />
                  <label className="block text-gray-600 text-sm m-1 text-justify">Số điện thoại</label>
                  <input
                    className="w-full border p-2 rounded mt-2"
                    value={editingRows[employee.staffId]?.phone ?? employee.phone}
                    onChange={(e) => handleEditChange(employee.staffId, "phone", e.target.value)}
                  />
                  <label className="block text-gray-600 text-sm m-1 text-justify">Địa chỉ</label>
                  <input
                    className="w-full border p-2 rounded mt-2"
                    value={editingRows[employee.staffId]?.address ?? employee.address}
                    onChange={(e) => handleEditChange(employee.staffId, "address", e.target.value)}
                  />
                  <label className="block text-gray-600 text-sm m-1 text-justify">Chức vụ</label>
                  <select
                    className="w-full mt-2 border p-2 rounded"
                    value={editingRows[employee.staffId]?.positionId ?? employee.position?.positionId}
                    onChange={(e) => handleEditChange(employee.staffId, "positionId", Number(e.target.value))}
                  >
                    {positions.map((pos) => (
                      <option key={pos.positionId} value={pos.positionId}>{pos.positionName}</option>
                    ))}
                  </select>
                </>
              ) : (
                <div className="text-justify" style={{ height: "150px", lineHeight: "1.9" }}>
                  <p className="text-lg font-semibold">{employee.name}</p>
                  <p className=" text-gray-400">Email: {employee.email}</p>
                  <p className=" text-gray-400">{employee.phone}</p>
                  <p className=" text-gray-400">{employee.address}</p>
                  <p className=" text-gray-400">{employee.position?.positionName}</p>
                </div>


              )}
              <p className={`mt-2 px-2 py-1 rounded-2xl text-sm ${employee.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                <span className="animate-ping" style={{
                  width: "8px",
                  marginRight: "10px",
                  height: "8px",
                  borderRadius: "50%",
                  display: "inline-block",
                  backgroundColor: employee.status === "ACTIVE" ? "#10B981" : "#EF4444",
                }}></span>{employee.status === "ACTIVE" ? "Đang làm việc" : "Đã nghỉ việc"}
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {editMode[employee.staffId] ? (
                  <>
                    <button onClick={() => handleSaveEmployee(employee.staffId)} className="px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-500">Lưu</button>
                    <button onClick={() => handleCancelEdit(employee.staffId)} className="px-4 py-2 bg-gray-200 text-white rounded hover:bg-gray-500">Hoàn Tác</button>

                    {employee.status === "ACTIVE" && (
                      <button title="Ngừng làm việc" onClick={() => handleDeactivate(employee.staffId)} className="px-4 py-2 bg-red-200 text-white rounded hover:bg-red-500"><ContentPasteOffOutlined /></button>
                    )}

                    {employee.status === "DEACTIVATED" && (
                      <button title="Kích hoạt" onClick={() => handleActivate(employee.staffId)} className="px-4 py-2 bg-green-200 text-white rounded hover:bg-green-500"><ContentPasteOutlined /></button>
                    )}

                  </>
                ) : (
                  <div className="flex items-center gap-10">
                    <button onClick={() => handleEdit(employee.staffId)} className="px-3 py-3 bg-blue-300 text-white rounded-full hover:bg-blue-500"><Edit3 /></button>
                    <button onClick={() => handleDeleteEmployee(employee.staffId)} className="px-3 py-3 bg-red-300 text-white rounded-full hover:bg-red-500"><Delete /></button>
                  </div>

                )}
              </div>
            </div>
          </div>
        ))}
        {filteredEmployees.length === 0 &&
          <div className="text-center text-gray-400 col-span-full mt-10">Không tìm thấy nhân viên nào!
          </div>}

      </div>
    </motion.div>
  );
};

export default EmployeeList;