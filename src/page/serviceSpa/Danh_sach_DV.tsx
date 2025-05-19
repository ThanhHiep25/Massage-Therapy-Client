import { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { getServiceSPA, deleteServiceSPA, activateServiceSPA, deactivateServiceSPA, exportServiceSPAToExcel, updateServiceSPA, getCategories } from "../../service/apiService";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { AlarmClock, Ban, Edit, ShieldCheck, Trash2 } from "lucide-react";
import { motion } from 'framer-motion'
import { Category, ServiceFull, ServiceSPAFormUpdate } from "../../interface/ServiceSPA_interface";
import RenderNotFound from "../../components/notFound/renderNotFound";
import { useAuth } from "../../hooks/AuthContext";
import { FaFileExcel, FaLeaf } from "react-icons/fa";
import ServiceSpaDetailModal from "../../components/servicespa/ServiceSpaDetailModal";
import ServiceSpaEditModal from "../../components/servicespa/ServiceSpaEditModal";




const pageSize = 8;

/**
 * Trang danh sách dịch vụ
 * 
 * Hiển thị danh sách các dịch vụ đã được tạo. Cho phép người dùng xem chi tiết, xóa, ngừng kích hoạt, kích hoạt, chỉnh sửa và xuất Excel.
 * 
 * @returns {JSX.Element} 
 */
const ServiceList: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState<ServiceFull[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1); //State currenPage
    const [open, setOpen] = useState(false); // State để kiểm soát việc hiển thị Dialog
    const [selectedService, setSelectedService] = useState<ServiceFull | null>(null); // State để lưu thông tin dịch vụ được chọn
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState<string>(""); // Lọc theo khoảng giá
    const [editService, setEditService] = useState<ServiceFull | null>(null); // Dịch vụ đang chỉnh sửa
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Kiểm soát hiển thị Dialog chỉnh sửa
    const [steps, setSteps] = useState(editService?.steps || []);


    useEffect(() => {
        setLoading(true);

        try {
            fetchServices();
            fetchCategory();
        } catch (error) {
            console.error("Lỗi tải danh sách dịch vụ:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (editService) {
            setSteps(editService.steps || []); // Lấy danh sách các bước từ dịch vụ đang chỉnh sửa
        }
    }, [editService]);


    // Tải danh sách dịch vụ
    const fetchServices = async () => {
        try {
            const response = await getServiceSPA(); // Thay thế bằng API thực tế
            const now = Date.now();
            const sortServices = response.sort((a: ServiceFull, b: ServiceFull) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            })
            setServices(sortServices.map((ser: ServiceFull) => ({
                ...ser,
                isNew: (now - new Date(ser.createdAt).getTime()) / 1000 < 60,
            })));
        } catch (error) {
            console.error("Lỗi tải danh sách dịch vụ:", error);
        }
    };


    const fetchCategory = async () => {
        try {
            const response = await getCategories(); // Thay thế bằng API thực tế
            setCategories(response);
        } catch (error) {
            console.error("Lỗi tải danh sách dịch vụ:", error);
        }
    };

    const filteredSer = services.filter((ser) => {
        const matchesSearch = ser.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "" || ser.status === statusFilter;

        const priceRanges: { [key: string]: (price: number) => boolean } = {
            low: (price) => price < 100000,
            "low-medium": (price) => price >= 100000 && price <= 500000,
            medium: (price) => price > 500000 && price <= 1000000,
            "medium-high": (price) => price > 1000000 && price <= 5000000,
            high: (price) => price > 5000000,
        };

        const matchesPrice = priceFilter
            ? priceRanges[priceFilter]?.(ser.price) ?? true
            : true;

        return matchesSearch && matchesStatus && matchesPrice;
    });


    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };


    // Render danh sách dịch vụ theo Page
    const paginatedServices = filteredSer.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Hiển thị Dialog
    const handleOpenDialog = (service: ServiceFull) => {
        setSelectedService(service);
        setOpen(true);
    };



    // Đóng Dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedService(null); // Reset thông tin dịch vụ
    };

    const handleOpenEditDialog = (service: ServiceFull) => {
        setEditService(service);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditService(null);
        setIsEditDialogOpen(false);
    };

    const handleStepChange = (index: number, description: string) => {
        setSteps((prev) =>
            prev.map((step, i) => (i === index ? { ...step, description } : step))
        );
    };

    const handleAddStep = () => {
        setSteps((prev) => [...prev, { stepId: 0, stepOrder: prev.length + 1, description: "" }]);
    };

    const handleRemoveStep = (index: number) => {
        setSteps((prev) => prev.filter((_, i) => i !== index));
    };

    //Delete service
    const handleDeleteService = async (serviceId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;
        try {
            await deleteServiceSPA(serviceId);
            toast.success('Xóa dịch vụ thành công.')
            fetchServices();
        } catch (error: unknown) {
            if ((error as { response?: { data?: { code?: number } } })?.response?.data?.code === 1000) {
                toast.warning("Dịch vụ đang được đặt không thể xóa!");
            } else {
                console.error(`Lỗi xóa dịch vụ:`, error);
                toast.error("Xóa dịch vụ thất bại!");
            }
        }
    };

    // Activate service
    const handleActivateService = async (serviceId: number, name: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn kích hoạt dịch vụ này không?")) return;
        try {
            await activateServiceSPA(serviceId);
            toast.success(`Kích hoạt dịch vụ ${name} thành công.`)
            fetchServices();
        } catch (error) {
            console.error(`Lỗi kích hoạt dịch vụ ${name}:`, error);
            toast.error("Ngừng kích hoạt thất bại!");
        }
    };

    // Deactivate service
    const handleDeactivateService = async (serviceId: number, name: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn ngừng kích hoạt dịch vụ này không?")) return;
        try {
            await deactivateServiceSPA(serviceId);
            toast.success(`Ngừng kích hoạt dịch vụ ${name} thành công.`)
            fetchServices();
        } catch (error) {
            console.error(`Lỗi ngừng kích hoạt dịch vụ ${name}:`, error);
            toast.error("Ngừng kích hoạt thất bại!");
        }
    };


    // Update service
    const handleUpdateService = async (serviceId: number, dataToUpdate: ServiceSPAFormUpdate) => {
        try {
            console.log("Dữ liệu gửi lên API để cập nhật:", dataToUpdate); // LOG ĐỂ DEBUG
            await updateServiceSPA(serviceId, dataToUpdate);
            toast.success("Cập nhật dịch vụ thành công!");
            fetchServices(); // Tải lại danh sách dịch vụ
            handleCloseEditDialog(); // Đóng Dialog
        } catch (error: unknown) { // Bắt lỗi chi tiết hơn
            if ((error as { response?: { data?: { code?: number } } })?.response?.data?.code === 999) {
                toast.warning("Dịch vụ đang được đặt không thể cập nhật!");
            }
        }
    };

    // Xuất excel lịch hẹn
    const exportExcel = async () => {
        try {
            await exportServiceSPAToExcel();
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
            className="sm:p-6 sm:mb-4 mb-20 sm:mt-0 mt-10">
            <ToastContainer />
            <p className="sm:text-2xl text-lg font-bold mb-4 ">Danh sách dịch vụ 🍃</p>

            <div className="flex sm:gap-4 gap-1 mb-2 sm:flex-row dark:text-black">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    className="border p-4 rounded-full w-full  text-[12px] sm:text-[16px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border sm:p-4 p-1 rounded-full text-[10px] sm:text-[16px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVATE">Hoạt động</option>
                    <option value="DEACTIVATED">Không hoạt động</option>
                </select>
                <select
                    className="border sm:p-4 p-1 rounded-full text-[10px] sm:text-[16px]"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                >
                    <option value="">Tất cả giá</option>
                    <option value="low">Dưới 100,000</option>
                    <option value="low-medium">100,000 - 500,000</option>
                    <option value="medium">500,000 - 1,000,000</option>
                    <option value="medium-high">1,000,000 - 5,000,000</option>
                    <option value="high">Trên 5,000,000</option>
                </select>
            </div>



            <div className="flex items-center justify-end mb-3">
                <button className="flex items-center justify-center sm:gap-2 gap-1 bg-green-500 hover:bg-green-600 text-white sm:p-2 p-1 rounded-lg sm:w-[150px] w-[120px]"
                    onClick={exportExcel}
                >
                    <FaFileExcel size={20} /> Xuất excel
                </button>
            </div>
            {paginatedServices.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 sm:gap-6 gap-2">
                    {paginatedServices.map((service) => (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            key={service.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:bg-blue-50 transition-shadow"
                        >
                            <img
                                src={service.images[0] || "https://via.placeholder.com/300"}
                                alt={service.name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="sm:p-4 p-2">
                                <h3 className="sm:text-lg text-[14px] font-semibold text-gray-900">{service.name}</h3>
                                {/* <p className="sm:text-sm text-[12px] text-gray-600 line-clamp-2">{service.description}</p> */}
                                <div className="mt-2 flex sm:justify-between sm:flex-row flex-col sm:text-sm text-[12px] text-gray-500">
                                    <span>Giá: {service.price.toLocaleString("vi-VN")} VND</span>
                                    <span className="flex items-center gap-2"><AlarmClock className="w-4 h-4" /> {service.duration} phút</span>
                                </div>
                                <p className={`text-center rounded-full sm:text-sm text-[12px] sm:p-2 p-1 m-2 font-bold ${service.status === 'ACTIVATE' ? "bg-green-200 text-green-600" : "bg-orange-200 text-orange-600"}`}>
                                    <span className="animate-ping" style={{
                                        width: "8px",
                                        marginRight: "10px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        backgroundColor: service.status === "ACTIVATE" ? "#10B981" : "#EF4444",
                                    }}></span>
                                    {service.status === "ACTIVATE" ? "Đã kích hoạt" : "Ngừng kích hoạt"}</p>
                                {
                                    user?.roles === "admin" && (
                                        <div className="flex sm:mt-6 sm:gap-6 gap-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                title="Xóa dịch vụ"
                                                className="flex items-center justify-center text-red-400 bg-red-100 w-[40px] h-[40px] rounded-full hover:bg-red-500 
                                    hover:text-white"
                                                onClick={() => handleDeleteService(service.id)}
                                            >
                                                <Trash2 className="sm:w-5 sm:h-5 w-4 h-4" />
                                            </motion.button>
                                            {service.status === "ACTIVATE" ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    title="Ngừng kích hoạt dịch vụ"
                                                    className="flex items-center justify-center text-red-600 w-[40px] h-[40px] bg-orange-100 rounded-full
                                        hover:bg-orange-500 hover:text-white"
                                                    onClick={() => handleDeactivateService(service.id, service.name)}
                                                >
                                                    <Ban className="sm:w-5 sm:h-5 w-4 h-4" />
                                                </motion.button>

                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    title="Kích hoạt dịch vụ"
                                                    className="flex items-center justify-center text-blue-600 w-[40px] h-[40px] bg-blue-100 rounded-full
                                        hover:bg-blue-600 hover:text-white"
                                                    onClick={() => handleActivateService(service.id, service.name)}
                                                >
                                                    <ShieldCheck className="sm:w-5 sm:h-5 w-4 h-4" />
                                                </motion.button>
                                            )}

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                title="Chỉnh sửa dịch vụ"
                                                className="flex items-center justify-center text-blue-600 bg-blue-100 w-[40px] h-[40px] rounded-full hover:bg-blue-500 hover:text-white"
                                                onClick={() => handleOpenEditDialog(service)}
                                            >
                                                <Edit className="sm:w-5 sm:h-5 w-4 h-4" />
                                            </motion.button>

                                        </div>
                                    )
                                }
                                <button className="sm:mt-4 mt-2 sm:w-ful w-full sm:text-sm text-[12px] bg-blue-500 text-white px-1 py-2 rounded-lg hover:bg-blue-600" onClick={() => handleOpenDialog(service)}>
                                    Xem chi tiết
                                </button>

                            </div>
                        </motion.div>
                    ))
                    }
                </div>
            ) : (
                <RenderNotFound />
            )}

            {/* Phân trang */}
            {filteredSer.length > pageSize && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        count={Math.ceil(filteredSer.length / pageSize)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>
            )}

            {/* Dialog xem chi tiết */}
            <ServiceSpaDetailModal open={open} handleCloseDialog={handleCloseDialog} selectedService={selectedService} />
            <ServiceSpaEditModal
                isEditDialogOpen={isEditDialogOpen}
                handleCloseEditDialog={handleCloseEditDialog}
                editService={editService}
                steps={steps}
                handleUpdateService={handleUpdateService}
                handleStepChange={handleStepChange}
                handleRemoveStep={handleRemoveStep}
                handleAddStep={handleAddStep}
                categories={categories}
            />

        </motion.div>
    );
}

export default ServiceList;