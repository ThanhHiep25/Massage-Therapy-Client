import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Captions, CaptionsOff, Edit3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Delete, DoDisturb } from '@mui/icons-material';
import { Pagination } from '@mui/material'; // Import Pagination từ Material UI
import {
    activeCus, deactiveCus, deleteCustomer, getCustomers, updateCustomer, blockCustomer,
    exportCustomersToExcel
} from '../../service/apiCustomer';
import { CustomerDataFull } from '../../interface/CustomerData_interface';
import RenderNotFound from '../../components/notFound/renderNotFound';
import { FaFileExcel, FaLeaf } from 'react-icons/fa';
import { useAuth } from '../../hooks/AuthContext';


const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CUSTOMER = import.meta.env.VITE_CLOUDINARY_UPLOAD_CUSTOMER;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const pageSize = 10;

const CustomersList: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [cus, setCus] = useState<CustomerDataFull[]>([]);
    const [editingRows, setEditingRows] = useState<{ [key: number]: Partial<CustomerDataFull & { imageFile?: File }> }>({});
    const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
    //const [backupData, setBackupData] = useState<{ [key: number]: CustomerDataFull | undefined }>({});
    const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [des, setDes] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    useEffect(() => {
        setLoading(true);
        try {
            fetchCustomer();
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy danh sách khách hàng
    const fetchCustomer = async () => {
        try {
            const response = await getCustomers();
            const now = new Date();
            const sortedCus = response.sort((a: CustomerDataFull, b: CustomerDataFull) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            })
            setCus(sortedCus.map((cus: CustomerDataFull) => ({
                ...cus,
                isNew: (now.getTime() - new Date(cus.createdAt).getTime()) / 1000 < 120,
            })));
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };


    // Chỉnh sửa thông tin khách hàng thay đổi giá trị
    const handleEditChange = (id: number, field: string, value: string | number | File | null) => {
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
        // setBackupData((prev) => ({ ...prev, [id]: cus.find(emp => emp.id === id) }));
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
                formData.append(UPLOAD_PRESET, CUSTOMER);

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
            const customer = cus.find((emp) => emp.id === id);
            if (customer?.status === "BLOCKED") {
                toast.warning("Tài khoản đã vô hiệu hóa không thể thực hiện thao tác này.");
                return;
            }
            await blockCustomer(id);
            setCus((prev) => prev.filter((emp) => emp.id !== id));
            await fetchCustomer();
            toast.success("Khóa tài khoản thành công!");
        } catch (error: unknown) {
            console.error("Lỗi khi khóa tài khoản:", error);
            toast.error("Khóa tài khoản thất bại!");
        }
    }

    // Lọc danh sách nhân viên theo tên và trạng thái
    const filteredCus = cus.filter((emp) => {
        return (
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "" || emp.status === statusFilter) && (des === "" || emp.description === des)
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
            console.error("Lỗi khi ngưng hoạt động tài khoản:", error);
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
            if (file.size > 2048576) {
                toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
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

    // Render danh sách khách hàng theo Page
    const paginatedServices = filteredCus.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );


    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };


    // Xuất excel nhân viên
    const exportExcel = async () => {
        try {
            await exportCustomersToExcel();
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="sm:p-6 sm:mt-0 mt-10 sm:mb-4 mb-20">
            <ToastContainer />
            <h2 className="sm:text-2xl text-lg font-bold mb-6">Danh sách khách hàng 🍃</h2>
            <div className="flex sm:gap-4 gap-1 mb-2 sm:flex-row">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    className="border p-4 rounded-full w-full  text-[12px] sm:text-[16px] dark:text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border sm:p-4 p-1 rounded-full text-[10px] sm:text-[16px] dark:text-black"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVATE">Hoạt động</option>
                    <option value="DEACTIVATED">Không hoạt động</option>
                    <option value="BLOCKED">Đã bị khóa</option>
                </select>

                <select
                    className="border sm:p-4 p-1 rounded-full text-[10px] sm:text-[16px] dark:text-black"
                    value={des}
                    onChange={(e) => setDes(e.target.value)}
                >
                    <option value="">Tất cả hội viên</option>
                    <option value="Đồng">Đồng</option>
                    <option value="Bạc">Bạc</option>
                    <option value="Vàng">Vàng</option>
                    <option value="Kim Cương">Kim Cương</option>
                    <option value="VIP">VIP</option>
                    <option value="VIP++">VIP ++</option>
                </select>
            </div>

            <div className="flex items-center justify-end mb-3">
                <button className="flex items-center justify-center sm:gap-2 gap-1 bg-green-500 hover:bg-green-600 text-white sm:p-2 p-1 rounded-lg sm:w-[150px] w-[120px]"
                    onClick={exportExcel}
                >
                    <FaFileExcel size={20} /> Xuất excel
                </button>
            </div>
            {cus.length > 0 ? (
                <div className="grid sm:gap-6 gap-2 sm:gap-y-10 gap-y-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {paginatedServices.map((cus) => (
                        <motion.div whileHover={{ scale: 1.05 }} key={cus.id} className="bg-white p-4 rounded-lg shadow-md" >
                            <div className="mt-4 text-center dark:text-black">
                                {editMode[cus.id] ? (
                                    <>
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            src={previewImages[cus.id] || editingRows[cus.id]?.imageUrl || cus.imageUrl}
                                            alt="Ảnh"
                                            className="sm:w-24 sm:h-24 w-16 h-16 mx-auto rounded-full object-cover outline outline-green-500 cursor-pointer"
                                            onClick={() => document.getElementById(`file-input-${cus.id}`)?.click()}
                                        />
                                        <input
                                            type="file"
                                            id={`file-input-${cus.id}`}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, cus.id)}
                                        />
                                        <label className="block text-gray-600 m-1 mt-2 text-justify sm:text-sm text-[12px]">Họ và tên</label>
                                        <input
                                            className="w-full border p-2 rounded  sm:text-sm text-[12px]"
                                            value={editingRows[cus.id]?.name ?? cus.name}
                                            onChange={(e) => handleEditChange(cus.id, "name", e.target.value)}
                                        />
                                        <label className="block text-gray-600 m-1 text-justify sm:text-sm text-[12px]">Email</label>
                                        <input
                                            className="w-full border p-2 rounded  sm:text-sm text-[12px]"
                                            value={editingRows[cus.id]?.email ?? cus.email}
                                            onChange={(e) => handleEditChange(cus.id, "email", e.target.value)}
                                        />
                                        <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-justify">Số điện thoại</label>
                                        <input
                                            className="w-full border p-2 rounded  sm:text-sm text-[12px]"
                                            value={editingRows[cus.id]?.phone ?? cus.phone}
                                            onChange={(e) => handleEditChange(cus.id, "phone", e.target.value)}
                                        />
                                        <label className="block text-gray-600  sm:text-sm text-[12px] m-1 text-justify">Địa chỉ</label>
                                        <input
                                            className="w-full border p-2 rounded  sm:text-sm text-[12px]"
                                            value={editingRows[cus.id]?.address ?? cus.address}
                                            onChange={(e) => handleEditChange(cus.id, "address", e.target.value)}
                                        />
                                        <label className="block text-gray-600  sm:text-sm text-[12px] m-1 text-justify">Hội viên</label>
                                        {/* Loại khách hàng */}
                                        <div className="mb-4">
                                            <select
                                                name="description"
                                                value={editingRows[cus.id]?.description ?? cus.description}
                                                onChange={(e) => handleEditChange(cus.id, "description", e.target.value)}
                                                className="w-full  sm:text-sm text-[12px] p-2 bg-white/60 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Chọn loại khách hàng</option>
                                                <option value="Đồng">Đồng</option>
                                                <option value="Bạc">Bạc</option>
                                                <option value="Vàng">Vàng</option>
                                                <option value="Kim Cương">Kim Cương</option>
                                                <option value="VIP">VIP</option>
                                                <option value="VIP++">VIP ++</option>
                                            </select>
                                        </div>

                                    </>
                                ) : (
                                    <div className="relative">
                                        {cus.isNew && (
                                            <span className="absolute top-2 left-2 inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white">
                                                New
                                            </span>
                                        )}
                                        <div className={`bg-green-400/20 py-2 rounded-md ${cus.status === 'BLOCKED' ? 'bg-red-400/20' : ''}
                                     ${cus.status === 'DEACTIVATED' ? 'bg-orange-400/20' : ''}
                                    `}>

                                            <img src={cus.imageUrl} alt="Ảnh" className={`sm:w-24 sm:h-24 w-16 h-16 mx-auto rounded-full object-cover outline outline-green-500 ${cus.status === 'BLOCKED' ? 'outline-red-500' : ''}
                                            ${cus.status === 'DEACTIVATED' ? 'outline-orange-500' : ''}
                                        `} />
                                        </div>

                                        <div className="text-start sm:w-[180px] w-[120px]" style={{ lineHeight: "1.9" }}>
                                            <p className="sm:text-lg text-[13px] mt-4 sm:line-clamp-none line-clamp-1">{cus.name}</p>
                                            <p className="sm:text-[14px] text-[12px] text-gray-400 sm:line-clamp-none line-clamp-1">Email: {cus.email}</p>
                                            <p className="sm:text-[14px] text-[12px] text-gray-400">Sdt: {cus.phone}</p>
                                            <p className="sm:text-[14px] text-[12px] text-gray-400 sm:line-clamp-2 line-clamp-1">Địa chỉ: {cus.address}</p>
                                            {cus.description === 'Đồng' && (
                                                <p className="sm:text-[14px] text-[10px] text-gray-400">Thành viên:
                                                    <span className='sm:px-4 px-1 py-1 sm:ml-2 ml-1 bg-orange-600 rounded-full text-white'>{cus.description} 🥑</span>
                                                </p>
                                            )}
                                            {cus.description === 'Bạc' && (
                                                <p className="sm:text-[14px] text-[10px] text-gray-400">Hội viên:
                                                    <span className='px-4 py-1 sm:ml-2 ml-1 bg-slate-400 rounded-full text-white'>{cus.description} 🥑</span>
                                                </p>
                                            )}
                                            {cus.description === 'Vàng' && (
                                                <p className="sm:text-[14px] text-[10px] text-gray-400">Hội viên:
                                                    <span className='px-4 py-1 sm:ml-2 ml-1 bg-yellow-400 rounded-full text-white'>{cus.description} 🥑</span></p>
                                            )}
                                            {cus.description === 'Kim Cương' && (
                                                <p className="sm:text-[14px] text-[10px] text-gray-400">Hội viên:
                                                    <span className='sm:px-4 px-1 py-1 sm:ml-2 ml-1 bg-emerald-400 rounded-full text-white'>{cus.description} 🥑</span></p>
                                            )}
                                            {cus.description === 'VIP' && (
                                                <p className="sm:text-[14px] text-[10px] text-gray-400">Hội viên:
                                                    <span className='px-4 py-1 sm:ml-2 ml-1 bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-full text-white'>{cus.description} 🥑</span></p>
                                            )}
                                            {cus.description === 'VIP++' && (
                                                <p className="sm:text-[14px] text-[10px] text-gray-400">Hội viên:
                                                    <span className='px-4 py-1 sm:ml-2 ml-1 
                                           bg-gradient-to-br from-yellow-500 via-blue-500 to-black rounded-full text-white'>{cus.description} 🥑</span>
                                                </p>
                                            )}


                                        </div>
                                    </div>

                                )}
                                <p className={`mt-2 px-2 py-1 rounded-2xl sm:text-sm text-[12px] ${cus.status === "ACTIVATE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                    <span className="animate-ping" style={{
                                        width: "8px",
                                        marginRight: "10px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        backgroundColor: cus.status === "ACTIVATE" ? "#10B981" : "#EF4444",
                                    }}></span>{cus.status === "ACTIVATE"
                                        ? "Đang hoạt động"
                                        : cus.status === "BLOCKED"
                                            ? "Tài khoản bị khóa"
                                            : "Ngừng hoạt động"}
                                </p>
                                <div className="mt-4 flex justify-center sm:gap-2 gap-[2px]">
                                    {editMode[cus.id] ? (
                                        <>
                                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleSaveCus(cus.id)} className="sm:px-4 sm:py-2 p-2  sm:text-sm text-[12px] bg-blue-200 text-white rounded hover:bg-blue-500">Lưu</motion.button>
                                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleCancelEdit(cus.id)} className="sm:px-4 sm:py-2 p-2  sm:text-sm text-[12px] bg-gray-200 text-white rounded hover:bg-gray-500">Hoàn Tác</motion.button>


                                            {cus.status === "ACTIVATE" && user?.roles === "admin" && (
                                                <motion.button whileHover={{ scale: 1.1 }} title="Ngừng hoạt động tạm thời" onClick={() => handleDeactivate(cus.id)} className="sm:px-4 sm:py-2 p-2 bg-red-200 text-white rounded hover:bg-red-500"><CaptionsOff className="sm:w-5 sm:h-5 w-4 h-4" /></motion.button>
                                            )}

                                            {(cus.status === "DEACTIVATED" || cus.status === "BLOCKED") && (
                                                <motion.button whileHover={{ scale: 1.1 }} title="Kích hoạt tài khoản" onClick={() => handleActivate(cus.id)} className="sm:px-4 sm:py-2 p-2 bg-green-200 text-white rounded hover:bg-green-500"><Captions className="sm:w-5 sm:h-5 w-4 h-4" /></motion.button>
                                            )}

                                        </>
                                    ) : (
                                        <div className="flex flex-col w-full">
                                            {
                                                user?.roles === "admin" && (
                                                    <div className='flex gap-3 mb-3'>
                                                        <motion.button whileHover={{ scale: 1.1 }} title='Khóa tài khoản khách hàng' onClick={() => handleBlock(cus.id)} className="sm:px-5 sm:py-2 p-1  bg-orange-300 text-white rounded hover:bg-orange-500"><DoDisturb /></motion.button>
                                                        <motion.button whileHover={{ scale: 1.1 }} title='Xóa khách hàng' onClick={() => handleDeleted(cus.id)} className="sm:px-5 sm:py-2 p-1 bg-red-300 text-white rounded hover:bg-red-500"><Delete /></motion.button>
                                                    </div>
                                                )
                                            }

                                            <motion.button onClick={() => handleEdit(cus.id)} className="sm:px-3 sm:py-2 p-1 sm:text-lg text-[12px] bg-blue-300 text-white rounded hover:bg-blue-500 flex items-center justify-center gap-2"><Edit3 className="sm:w-5 sm:h-5 w-4 h-4" /> Chỉnh sửa</motion.button>

                                        </div>

                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                </div>
            ) : (
                <RenderNotFound />
            )}

            {
                filteredCus.length === 0 && (
                    <RenderNotFound/>
                )
            }


            {/* Phân trang */}
          {
            filteredCus.length > pageSize && (
               <div className="flex justify-center mt-6">
                <Pagination
                    count={Math.ceil(filteredCus.length / pageSize)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                />
            </div>
            )
          }
           
            

        </motion.div>
    );
};

export default CustomersList;