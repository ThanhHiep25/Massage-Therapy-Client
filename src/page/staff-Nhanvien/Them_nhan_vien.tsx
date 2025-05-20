import { useState, useEffect, useCallback } from "react";
import { addEmployee, addPosition,  getPositions } from "../../service/apiStaff";
import { CloudUpload } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion'
import { Positions } from "../../interface/Position_interface"; // Giả sử bạn có interface này

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const STAFF = import.meta.env.VITE_CLOUDINARY_UPLOAD_STAFF;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const AddStaffForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        imageUrl: "",
        description: "",
        startDate: "",
        positionId: "",
    });
    const [message, setMessage] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [positions, setPositions] = useState<{ positionId: number; positionName: string }[]>([]);
    // --- State để lưu lỗi validation ---
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // thêm postion mới
    const [positionName, setPositionName] = useState("");
    const [positionDescription, setPositionDescription] = useState("");

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = async () => {
        try {
            const response = await getPositions();
            if (Array.isArray(response)) {
                setPositions(response);
            } else {
                console.error("Dữ liệu từ API không hợp lệ:", response);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách chức vụ:", error);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2048576) { // 1MB
                setMessage("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 2MB.");
                toast.error("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 2MB.");
                setImageFile(null); // Xóa file nếu quá lớn
                setImagePreview(null); // Xóa preview
                e.target.value = ''; // Reset input file
                return;
            }
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setImageFile(file);
            setMessage("Ảnh đã được chọn. Ảnh sẽ được tải lên khi bạn nhấn 'Thêm mới'.");
        }
    };

    // --- Cập nhật formData và xóa lỗi khi người dùng nhập liệu ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Xóa lỗi của trường đang được chỉnh sửa
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "", // Xóa thông báo lỗi khi người dùng bắt đầu sửa
            }));
        }
    };

    // --- Hàm kiểm tra validation ---
    const validateField = useCallback((name: string, value: string): string => {
        value = value.trim();
        switch (name) {
            case 'name':
                if (!value) return "Vui lòng nhập họ và tên.";
                if (!/^[a-zA-Z\u00C0-\u1FFF\s]+$/.test(value)) return "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
                return "";
            case 'phone': // <<< CẬP NHẬT REGEX Ở ĐÂY
                if (!value) return "Vui lòng nhập số điện thoại.";
                // Regex mới: Bắt đầu bằng 0 và có tổng cộng 10 chữ số
                if (!/^0\d{9}$/.test(value)) {
                    return "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.";
                }
                return "";
            case 'email':
                if (!value) return "Vui lòng nhập email.";
                if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) return "Email không hợp lệ.";
                return "";
            case 'address':
                if (!value) return "Vui lòng nhập địa chỉ.";
                return "";
            case 'startDate':
                if (!value) return "Vui lòng chọn ngày bắt đầu.";
                try {

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const parts = value.split('-');
                    if (parts.length !== 3) return "Định dạng ngày không hợp lệ.";

                    const year = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const day = parseInt(parts[2], 10);

                    // Kiểm tra xem parse có thành công không
                    if (isNaN(year) || isNaN(month) || isNaN(day)) {
                        return "Định dạng ngày không hợp lệ.";
                    }

                    const selectedDate = new Date(year, month, day);
                    selectedDate.setHours(0, 0, 0, 0);

                    // So sánh ngày đã chọn với ngày hôm nay
                    if (selectedDate < today) {
                        return "Không thể chọn ngày đã qua.";
                    }
                } catch (error) {
                    // Xử lý nếu có lỗi khi parse Date
                    console.error("Lỗi parse ngày:", error);
                    return "Định dạng ngày không hợp lệ.";
                }
                return ""; // Hợp lệ 
            case 'positionId':
                if (!value) return "Vui lòng chọn chức vụ.";
                return "";
            default:
                return "";
        }
    }, []);

    // --- Xử lý khi một trường mất focus (onBlur) ---
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Chỉ validate các trường cần thiết khi blur
        if (['name', 'phone', 'email', 'address', 'startDate', 'positionId'].includes(name)) {
            const errorMessage = validateField(name, value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: errorMessage, 
            }));
        }
    };

    // --- Hàm kiểm tra validation cho toàn bộ form (khi submit) ---
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        // Kiểm tra từng trường bắt buộc bằng hàm validateField
        const fieldsToValidate: (keyof typeof formData)[] = ['name', 'phone', 'email', 'address', 'startDate', 'positionId'];

        fieldsToValidate.forEach(field => {
            const errorMessage = validateField(field, formData[field]);
            if (errorMessage) {
                newErrors[field] = errorMessage;
                isValid = false;
            }
        });


        setErrors(newErrors);
        return isValid;
    };

    // --- Xử lý khi submit form ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Chạy validation trước khi submit
        if (validateForm()) {

            // Nếu validation thành công
            setMessage("Đang xử lý..."); // Thông báo chờ
            try {
                let imageUrl = formData.imageUrl; // Giữ ảnh cũ nếu không có ảnh mới

                // Chỉ tải lên nếu có imageFile mới được chọn
                if (imageFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append("file", imageFile);
                    uploadFormData.append("upload_preset", UPLOAD_PRESET); // Sửa 'UPLOAD_PRESET' thành 'upload_preset'
                    uploadFormData.append("folder", STAFF); // Thêm folder nếu cần

                    const response = await axios.post(
                        CLOUDINARY_URL,
                        uploadFormData
                    );
                    imageUrl = response.data.secure_url;
                }

                // Đảm bảo positionId là number
                const payload = {
                    ...formData,
                    positionId: parseInt(formData.positionId, 10),
                    imageUrl: imageUrl // Sử dụng imageUrl đã được cập nhật
                };

                await addEmployee(payload);
                // Reset form và state sau khi thành công
                setFormData({ name: "", phone: "", email: "", address: "", imageUrl: "", description: "", startDate: "", positionId: "" });
                setImageFile(null);
                setImagePreview(null);
                setErrors({}); // Xóa lỗi
                setMessage(""); // Xóa thông báo chờ
                toast.success("Thêm nhân viên thành công!");

            } catch (error) {
                console.error("Error adding employee:", error);
                setMessage(""); // Xóa thông báo chờ
                toast.error("Thêm nhân viên thất bại!");
            }
        } else {
            // Nếu validation thất bại
            toast.error("Vui lòng kiểm tra lại thông tin đã nhập!");
        }
    };


    // Create Position
    const handleCreatePosition = async () => {
        if (positionName === "" ) {
            toast.error("Vui lòng nhập đầy đủ tên chức vụ!");
            return;
        }
        try {
            const newPosition: Positions = { positionName: positionName.trim(), description: positionDescription.trim() };
            await addPosition(newPosition);
            toast.success("Chức vụ mới được thêm thành công!");
            setPositionName("");
            setPositionDescription("");
            fetchPositions(); // Tải lại danh sách chức vụ
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.code === 1010) {
                toast.error("Chức vụ này đã tồn tại!");
            } else {
                toast.error("Có lỗi xảy ra khi thêm chức vụ.");
                console.error("Lỗi thêm chức vụ:", error);
            }
        }
    }

   

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center w-full dark:text-white sm:mt-0 mt-10">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Form thêm chức vụ */}
            <div className="w-full max-w-full bg-white dark:bg-gray-800/60 shadow-md rounded-lg p-6 sm:p-8 mb-6">
                <p className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">Thêm chức vụ mới</p>
                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="positionName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên chức vụ:</label>
                        <input
                            type="text"
                            name="positionName"
                            id="positionName"
                            value={positionName}
                            onChange={(e) => setPositionName(e.target.value)}
                            className="w-full sm:w-[50%] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required />
                    </div>
                    <div>
                        <label htmlFor="positionDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả:
                        <i>(Có thể có hoặc không)</i>
                        </label>
                        <input
                            type="text"
                            name="positionDescription"
                            id="positionDescription"
                            value={positionDescription}
                            onChange={(e) => setPositionDescription(e.target.value)}
                            className="w-full sm:w-[50%] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button
                        type="button" // Quan trọng: type="button" để không submit form lớn
                        className="w-full sm:w-auto max-w-[150px] bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        onClick={handleCreatePosition} >
                        Thêm chức vụ
                    </button>
                </div>
            </div>

            {/* Form thêm nhân viên */}
            <div className="w-full max-w-full bg-white dark:bg-gray-800/60 shadow-md rounded-lg p-6 sm:p-8 mb-10">
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl  font-bold text-gray-800 dark:text-white">Thêm nhân viên mới ✨</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Vui lòng điền đầy đủ thông tin để thêm nhân viên mới.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6">
                    {/* --- Hàng 1: Tên và Điện thoại --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            />
                            {/* Hiển thị lỗi */}
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại</label>
                            <input
                                type="tel" // Sử dụng type="tel" cho số điện thoại
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.phone ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            />
                            {/* Hiển thị lỗi */}
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>
                    </div>

                    {/* --- Hàng 2: Email và Địa chỉ --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            />
                            {/* Hiển thị lỗi */}
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.address ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            />
                            {/* Hiển thị lỗi */}
                            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                        </div>
                    </div>

                    {/* --- Hàng 3: Chức vụ và Ngày bắt đầu --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                        <div>
                            <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chức vụ</label>
                            <select
                                id="positionId"
                                name="positionId"
                                value={formData.positionId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.positionId ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}>
                                <option value="">-- Chọn chức vụ --</option>
                                {positions.length > 0 ? (
                                    positions.map((position) => (
                                        <option key={position.positionId} value={position.positionId}>{position.positionName}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Đang tải hoặc không có chức vụ</option>
                                )}
                            </select>
                            {/* Hiển thị lỗi */}
                            {errors.positionId && <p className="mt-1 text-xs text-red-500">{errors.positionId}</p>}
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày bắt đầu</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.startDate ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            />
                            {/* Hiển thị lỗi */}
                            {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
                        </div>
                    </div>

                    {/* --- Mô tả công việc --- */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả công việc (Tùy chọn)</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        ></textarea>
                        {/* Không cần validation lỗi cho trường tùy chọn */}
                    </div>

                    {/* --- Ảnh đại diện --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ảnh đại diện (Tùy chọn - dưới 1MB)</label>
                        <label htmlFor="file-upload" className={`flex flex-col items-center justify-center w-full h-40 p-4 border-2 border-dashed rounded-lg cursor-pointer transition duration-300 ${errors.image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600`}>
                            <CloudUpload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Kéo & thả hoặc nhấn để chọn ảnh</p>
                            <input
                                id="file-upload"
                                type="file"
                                name="avatar"
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/gif"
                                className="hidden"
                            />
                        </label>
                        {/* Hiển thị lỗi ảnh (nếu có validation cho ảnh) */}
                        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                        {/* Thông báo hoặc xem trước */}
                        {message && !imagePreview && ( // Chỉ hiển thị message nếu chưa có preview
                            <p className={`mt-2 text-center text-sm ${message.includes("lớn") ? 'text-red-500' : 'text-blue-600'}`}>{message}</p>
                        )}
                        {imagePreview && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ảnh xem trước:</p>
                                <img
                                    src={imagePreview}
                                    alt="Xem trước"
                                    className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg shadow-md mx-auto border border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        )}
                    </div>

                    {/* --- Nút Submit --- */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="w-full sm:w-[50%] bg-indigo-600 text-white py-2.5 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                            Thêm Nhân Viên
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddStaffForm;