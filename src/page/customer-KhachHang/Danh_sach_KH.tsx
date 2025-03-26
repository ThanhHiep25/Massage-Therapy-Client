import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { ContentPasteOffOutlined, ContentPasteOutlined, Delete, DoDisturb } from '@mui/icons-material';
import { Pagination } from '@mui/material'; // Import Pagination từ Material UI
import {
    activeCus, deactiveCus, deleteCustomer, getCustomers, getRoles, updateCustomer, blockCustomer
} from '../../service/apiService';

const CustomersList: React.FC = () => {
    const [cus, setCus] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [editingRows, setEditingRows] = useState<{ [key: number]: any }>({});
    const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
    const [backupData, setBackupData] = useState<{ [key: number]: any }>({});
    const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [itemsPerPage] = useState(6); // Số lượng item trên một trang

    useEffect(() => {
        fetchCustomer();
        fetchRoles();
    }, []);

    // Lấy danh sách khách hàng
    const fetchCustomer = async () => {
        try {
            const response = await getCustomers();
            setCus(response);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // Lấy danh sách quyền
    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            setRoles(response);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Chỉnh sửa thông tin khách hàng thay đổi giá trị
    const handleEditChange = (id: number, field: string, value: any) => {
        if (field === "status") return;
        setEditingRows((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    // Chọn để chỉnh sửa thông tin khách hàng
    const handleEdit = (id: number) => {
        setBackupData((prev) => ({ ...prev, [id]: cus.find(emp => emp.id === id) }));
        setEditMode((prev) => ({ ...prev, [id]: true }));
    };

    // Hủy chỉnh sửa thông tin khách hàng
    const handleCancelEdit = (id: number) => {
        setEditingRows((prev) => {
            const newRows = { ...prev };
            delete newRows[id];
            return newRows;
        });
        setEditMode((prev) => ({ ...prev, [id]: false }));
    };

    // Lưu thông tin khách hàng đã chỉnh sửa
    const handleSaveCus = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn cập nhật thông tin khách hàng này không?")) return;

        try {
            const updatedCus = cus.find((emp) => emp.id === id);
            if (!updatedCus) return;

            const updatedData = {
                ...updatedCus,
                ...editingRows[id],
            };

            // Nếu có ảnh mới thì upload lên Cloudinary trước
            if (editingRows[id]?.imageFile) {
                const formData = new FormData();
                formData.append("file", editingRows[id].imageFile);
                formData.append("upload_preset", "customer");

                try {
                    const uploadResponse = await axios.post(
                        "https://api.cloudinary.com/v1_1/dokp7ig0u/image/upload",
                        formData
                    );

                    updatedData.imageUrl = uploadResponse.data.secure_url;
                } catch (error: unknown) {
                    console.error("Lỗi khi tải ảnh lên:", error);
                    toast.error("Lỗi khi tải ảnh lên, vui lòng thử lại.");
                    return;
                }
            }

            // Cập nhật thông tin khách hàng lên database
            await updateCustomer(id, updatedData);

            // Refresh danh sách khách hàng
            await fetchCustomer();

            // Xóa ảnh tạm khỏi state
            setEditingRows((prev) => {
                const newRows = { ...prev };
                delete newRows[id];
                return newRows;
            });

            setEditMode((prev) => ({ ...prev, [id]: false }));

            toast.success("Cập nhật thông tin khách hàng thành công!");

        } catch (error: unknown) {
            console.error("Lỗi khi cập nhật thông tin khách hàng:", error);
            toast.error("Cập nhật thất bại!");
        }
    };



    // Xóa khách hàng
    const handleDeleted = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) return;
        try {
            await deleteCustomer(id);
            setCus((prev) => prev.filter((emp) => emp.id !== id));
            await fetchCustomer();
            toast.success("Xóa khách hàng thành công!");
        } catch (error: unknown) {
            console.error("Lỗi khi xóa nhân viên:", error);
            toast.error("Xóa nhân viên thất bại!");
        }
    };

    // block khách hàng
    const handleBlock = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn khóa tài khoản này không?")) return;
        try {
            await blockCustomer(id);
            setCus((prev) => prev.filter((emp) => emp.id !== id));
            await fetchCustomer();
            toast.success("Khóa tài khoản thành công!");
        } catch (error: unknown) {
            console.error("Lỗiỗi khi khóa tài khoản:", error);
            toast.error("Khóa tài khoản thất bại!");
        }
    }

    // Lọc danh sách nhân viên theo tên và trạng thái
    const filteredCus = cus.filter((emp) => {
        return (
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "" || emp.status === statusFilter)
        );
    });

    // Deactivate nhân viên
    const handleDeactivate = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn ngưng hoạt động taig khoản này?")) return;
        try {
            await deactiveCus(id);
            await fetchCustomer();
            toast.success("Ngưng hoạt động taig khoản thành công!");
        } catch (error: unknown) {
            console.error("Lỗi khi ngưng hoạt động taig khoản:", error);
            toast.error("Ngưng hoạt đọng thất bại!");
        }
    }

    // Activate nhân viên
    const handleActivate = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn kích hoạt tài khoản này không?")) return;
        try {
            await activeCus(id);
            await fetchCustomer();
            toast.success("Kích hoạt tài khoản thành công!");
        } catch (error: unknown) {
            console.error("Lỗi khi kích hoạt tài khoản:", error);
            toast.error("Kích hoạt thất bại!");
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Kiểm tra kích thước ảnh
            if (file.size > 1048576) {
                toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 1MB.");
                return;
            }

            // Tạo URL tạm để xem trước ảnh
            const previewUrl = URL.createObjectURL(file);

            setPreviewImages((prev) => ({
                ...prev,
                [id]: previewUrl,
            }));

            // Lưu file vào editingRows (không upload ngay)
            setEditingRows((prev) => ({
                ...prev,
                [id]: { ...prev[id], imageFile: file }
            }));
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCus.slice(indexOfFirstItem, indexOfLastItem);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };


    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="p-6 w-full max-w-6xl mx-auto">
            <ToastContainer />
            <h2 className="text-3xl font-bold mb-6 text-center">Danh Sách Khách Hàng</h2>
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
                    <option value="DELETED">Đã bị khóa</option>
                </select>
            </div>
            <div className="grid gap-36 gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ marginLeft: "-70px" }}>
                {currentItems.map((cus) => (
                    <div key={cus.id} className="bg-white p-4 rounded-lg shadow-md" style={{ width: "320px" }}>
                        <div className="mt-4 text-center">
                            {editMode[cus.id] ? (
                                <>
                                    <motion.img
                                    whileHover={{scale: 1.1}}
                                        src={previewImages[cus.id] || editingRows[cus.id]?.imageUrl || cus.imageUrl}
                                        alt="Ảnh"
                                        className="w-24 h-24 mx-auto rounded-full object-cover cursor-pointer"
                                        onClick={() => document.getElementById(`file-input-${cus.id}`)?.click()}
                                    />
                                    <input
                                        type="file"
                                        id={`file-input-${cus.id}`}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, cus.id)}
                                    />
                                    <label className="block text-gray-600 text-sm m-1 text-justify">Họ và tên</label>
                                    <input
                                        className="w-full border p-2 rounded"
                                        value={editingRows[cus.id]?.name ?? cus.name}
                                        onChange={(e) => handleEditChange(cus.id, "name", e.target.value)}
                                    />
                                    <label className="block text-gray-600 text-sm m-1 text-justify">Email</label>
                                    <input
                                        className="w-full border p-2 rounded mt-2"
                                        value={editingRows[cus.id]?.email ?? cus.email}
                                        onChange={(e) => handleEditChange(cus.id, "email", e.target.value)}
                                    />
                                    <label className="block text-gray-600 text-sm m-1 text-justify">Số điện thoại</label>
                                    <input
                                        className="w-full border p-2 rounded mt-2"
                                        value={editingRows[cus.id]?.phone ?? cus.phone}
                                        onChange={(e) => handleEditChange(cus.id, "phone", e.target.value)}
                                    />
                                    <label className="block text-gray-600 text-sm m-1 text-justify">Địa chỉ</label>
                                    <input
                                        className="w-full border p-2 rounded mt-2"
                                        value={editingRows[cus.id]?.address ?? cus.address}
                                        onChange={(e) => handleEditChange(cus.id, "address", e.target.value)}
                                    />
                                    <label className="block text-gray-600 text-sm m-1 text-justify">Mô tả</label>
                                    <input
                                        className="w-full border p-2 rounded mt-2"
                                        value={editingRows[cus.id]?.description ?? cus.description}
                                        onChange={(e) => handleEditChange(cus.id, "description", e.target.value)}
                                    />

                                </>
                            ) : (
                                <>
                                    <img src={cus.imageUrl} alt="Ảnh" className="w-24 h-24 mx-auto rounded-full object-cover" />
                                    <div className="text-start" style={{ height: "180px", lineHeight: "1.9" }}>
                                        <p className="text-lg font-semibold">{cus.name}</p>
                                        <p className=" text-gray-400">Email: {cus.email}</p>
                                        <p className=" text-gray-400">Sdt: {cus.phone}</p>
                                        <p className=" text-gray-400 line-clamp-2">Địa chỉ: {cus.address}</p>
                                        <p className=" text-gray-400">{cus.description}</p>
                                    </div>
                                </>



                            )}
                            <p className={`mt-2 px-2 py-1 rounded-2xl text-sm ${cus.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                <span className="animate-ping" style={{
                                    width: "8px",
                                    marginRight: "10px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    backgroundColor: cus.status === "ACTIVE" ? "#10B981" : "#EF4444",
                                }}></span>{cus.status === "ACTIVE"
                                    ? "Đang hoạt động"
                                    : cus.status === "DELETED"
                                        ? "Vô hiệu hóa"
                                        : "Ngừng hoạt động"}
                            </p>
                            <div className="mt-4 flex justify-center gap-2">
                                {editMode[cus.id] ? (
                                    <>
                                        <motion.button whileHover={{scale: 1.1}} onClick={() => handleSaveCus(cus.id)} className="px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-500">Lưu</motion.button>
                                        <motion.button whileHover={{scale: 1.1}} onClick={() => handleCancelEdit(cus.id)} className="px-4 py-2 bg-gray-200 text-white rounded hover:bg-gray-500">Hoàn Tác</motion.button>

                                        {cus.status === "ACTIVE" && (
                                            <motion.button whileHover={{scale: 1.1}} title="Vô hiệu" onClick={() => handleDeactivate(cus.id)} className="px-4 py-2 bg-red-200 text-white rounded hover:bg-red-500"><ContentPasteOffOutlined /></motion.button>
                                        )}

                                        {(cus.status === "DEACTIVATED" || cus.status === "DELETED") && (
                                            <motion.button whileHover={{scale: 1.1}} title="Kích hoạt" onClick={() => handleActivate(cus.id)} className="px-4 py-2 bg-green-200 text-white rounded hover:bg-green-500"><ContentPasteOutlined /></motion.button>
                                        )}

                                    </>
                                ) : (
                                    <div className="flex items-center gap-10">
                                        <motion.button whileHover={{scale: 1.1}} onClick={() => handleEdit(cus.id)} className="px-3 py-3 bg-blue-300 text-white rounded-full hover:bg-blue-500"><Edit3 /></motion.button>
                                        <motion.button whileHover={{scale: 1.1}} onClick={() => handleBlock(cus.id)} className="px-3 py-3  bg-orange-300 text-white rounded-full hover:bg-orange-500"><DoDisturb /></motion.button>
                                        <motion.button whileHover={{scale: 1.1}} onClick={() => handleDeleted(cus.id)} className="px-3 py-3 bg-red-300 text-white rounded-full hover:bg-red-500"><Delete /></motion.button>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCus.length === 0 &&
                    <div className="text-center text-gray-400 col-span-full mt-10">Không tìm thấy khách hàng nào!
                    </div>}

            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    count={Math.ceil(filteredCus.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                    shape="rounded"
                    size="large"
                />
            </div>
        </motion.div>
    );
};

export default CustomersList;