import { useCallback, useState } from "react";
import { addCustomerNoOTP } from "../../service/apiCustomer";
import axios from "axios";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CUSTOMER = import.meta.env.VITE_CLOUDINARY_UPLOAD_CUSTOMER;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const AddCustomerForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "Na12345678!",
        address: "",
        description: "",
        imageUrl: "",// Lưu avatar dưới dạng URL từ Cloudinary

    });
    const [message, setMessage] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái xử lý
    const [imageFile, setImageFile] = useState<File | null>(null); // Lưu trữ file ảnh
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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
                [name]: "",
            }));
        }
    };

    // --- Hàm kiểm tra validation cho một trường cụ thể ---
    const validateField = useCallback((name: string, value: string): string => {
        const trimmedValue = value.trim();

        switch (name) {
            case 'name':
                if (!trimmedValue) return "Vui lòng nhập họ và tên.";
                if (!/^[a-zA-Z\u00C0-\u1FFF\s]+$/.test(trimmedValue)) return "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
                return "";
            case 'email':
                if (!trimmedValue) return "Vui lòng nhập email.";
                // Regex email cơ bản
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return "Email không hợp lệ.";
                return "";
            case 'phone':
                if (!trimmedValue) return "Vui lòng nhập số điện thoại.";
                // Bắt đầu bằng 0, 10 chữ số
                if (!/^0\d{9}$/.test(trimmedValue)) return "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.";
                return "";
            default:
                return "";
        }
    }, []);

    // --- Xử lý khi một trường mất focus (onBlur) ---
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (['name', 'email', 'phone', 'address', 'description'].includes(name)) {
            const errorMessage = validateField(name, value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: errorMessage,
            }));
        }
        // Xử lý riêng cho password
        if (name === 'password') {
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

        // Danh sách các trường cần kiểm tra (có thể bỏ password nếu chấp nhận mặc định)
        const fieldsToValidate: (keyof typeof formData)[] = ['name', 'email', 'phone'];

        fieldsToValidate.forEach(field => {
            const value = formData[field];
            const errorMessage = validateField(field, value);
            if (errorMessage) {
                newErrors[field] = errorMessage;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Kiểm tra kích thước ảnh
            if (file.size > 2048576) {
                toast.warning("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 2MB.");
                return;
            }

            // Tạo URL preview ảnh
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl); // Cập nhật URL preview
            setImageFile(file); // Cập nhật file ảnh

            // Xóa ảnh trước đó (nếu có)
            if (formData.imageUrl) {
                try {
                    const publicId = formData.imageUrl.split("/").pop()?.split(".")[0];
                    await axios.post(
                        `https://api.cloudinary.com/v1_1/dokp7ig0u/delete_by_token`,
                        { public_id: publicId }
                    );
                } catch (error) {
                    console.error("Lỗi khi xóa ảnh cũ:", error);
                }
            }

            setMessage(
                "Ảnh đã được chọn. Ảnh sẽ được tải lên khi bạn nhấn 'Đăng ký'."
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        // --- Chạy validation trước khi submit ---
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại các thông tin đã nhập.");
            return;
        }

        setIsLoading(true);
        try {
            let imageUrl = formData.imageUrl;

            // Tải ảnh lên Cloudinary nếu có file
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);
                uploadFormData.append(UPLOAD_PRESET, CUSTOMER);

                const response = await axios.post(
                    CLOUDINARY_URL,
                    uploadFormData
                );
                imageUrl = response.data.secure_url; // Lấy URL ảnh
            }

            // Gửi thông tin đăng ký
            const userToRegister = {
                ...formData,
                imageUrl,
            };
            // Gửi yêu cầu đăng ký với thông tin avatar từ Cloudinary

            await addCustomerNoOTP(userToRegister); // Gửi thông tin đăng ký

            setIsLoading(false);
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                address: "",
                description: "",
                imageUrl: "",
            });
            toast.success("Thêm mới khách hàng thành công !!")
            setImageFile(null);
            setImagePreview(null);
            setMessage("")

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.code === 1011) {
                toast.warning("Email đã tồn tại");
                setFormData({ ...formData, email: "" })
            }
            else {
                toast.error("Đã xảy ra lỗi không xác định.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center sm:p-6 justify-center w-full md:h-full dark:text-white mb-10 sm:mt-0 mt-6">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="w-full h-full max-w-full bg-white dark:bg-gray-800 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 mt-6 md:mt-0 sm:mb-6">
                <div className="mb-6">
                    <h1 className="text-lg sm:text-2xl font-semibold mb-4">Đăng ký khách hàng mới ✨</h1>
                    <p className="mb-20">Vui lòng điền thông tin để đăng ký người dùng.</p>
                </div>
                <div className="flex justify-around gap-6 flex-col md:flex-row">
                    <div className="md:w-[70%]">
                        <div className="outline rounded-2xl outline-1 shadow-lg outline-gray-300 px-4 py-6 bg-gradient-to-br from-purple-800 via-blue-800 to-black">
                            <div className="flex items-center gap-10">
                                <label
                                    htmlFor="file-upload"
                                    className="relative flex flex-col items-center justify-center w-16 h-16 sm:w-24 sm:h-24 border-2 border-dashed rounded-full cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300
                                    outline outline-1 outline-gray-200
                                    "
                                >
                                    {!imagePreview ? (
                                        <>
                                            <CloudUpload className="text-gray-400 dark:text-gray-200" fontSize="large" />
                                        </>
                                    ) : (
                                        <img src={imagePreview} alt="Xem trước" className="w-full h-full object-cover rounded-full" />
                                    )}
                                    <input id="file-upload" type="file" name="avatar" onChange={handleFileChange} accept="image/*" className="hidden" />
                                </label>

                                <div className="">
                                    <p className="sm:text-[16px] text-[12px] text-gray-400">{formData.phone}</p>
                                    <p className="sm:text-[16px] text-[12px] text-gray-400">{formData.email}</p>
                                </div>
                            </div>
                            <div className="mt-10 ml-3">
                                <div className="flex items-center sm:gap-8 gap-3">
                                    <p className="sm:text-[16px] text-[12px] text-gray-400 ">{formData.name}</p>
                                    {formData.description === 'Đồng' && (
                                        <p className="text-gray-400 sm:text-[16px] text-[12px]">Thành viên:
                                            <span className='px-4 py-1 ml-2 bg-orange-600 rounded-full text-white'>{formData.description} 🥑</span>
                                        </p>
                                    )}
                                    {formData.description === 'Bạc' && (
                                        <p className="text-gray-400 sm:text-[16px] text-[12px]">Hội viên:
                                            <span className='px-4 py-1 ml-2  bg-slate-400 rounded-full text-white'>{formData.description} 🥑</span>
                                        </p>
                                    )}
                                    {formData.description === 'Vàng' && (
                                        <p className="text-gray-400 sm:text-[16px] text-[12px]">Hội viên:
                                            <span className='px-4 py-1 ml-2  bg-yellow-400 rounded-full text-white'>{formData.description} 🥑</span></p>
                                    )}
                                    {formData.description === 'Kim Cương' && (
                                        <p className="text-gray-400 sm:text-[16px] text-[12px]">Hội viên:
                                            <span className='px-4 py-1 ml-2  bg-emerald-400 rounded-full text-white'>{formData.description} 🥑</span></p>
                                    )}
                                    {formData.description === 'VIP' && (
                                        <p className="text-gray-400 sm:text-[16px] text-[12px]">Hội viên:
                                            <span className='px-4 py-1 ml-2 bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-full text-white'>{formData.description} 🥑</span></p>
                                    )}
                                    {formData.description === 'VIP++' && (
                                        <p className="text-gray-400 sm:text-[16px] text-[12px]">Hội viên:
                                            <span className='px-4 py-1 ml-2 
                                           bg-gradient-to-br text-[12px] from-yellow-500 via-blue-500 to-black rounded-full text-white'>{formData.description} 🥑</span>
                                        </p>
                                    )}
                                </div>

                                <p className="sm:text-[16px] text-[12px] mt-2 text-gray-400">{new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()}</p>
                                <p className="sm:text-[16px] text-[12px] mt-2 text-gray-400">{formData.address}</p>
                            </div>
                        </div>

                        {/* Hiển thị lỗi nếu có */}
                        {message && <p className="mt-4 mb-4 text-center text-red-500 text-sm">{message}</p>}
                    </div>
                    {/* Upload avatar */}


                    <div className="w-full">
                        {/* Email */}
                        <div className="mb-4">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full p-3 bg-white/60 dark:bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Name & Phone */}
                        <div className="mb-4 flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-1/2">
                                <input
                                    name="name"
                                    placeholder="Tên"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full p-3 bg-white/60 dark:bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="w-full sm:w-1/2">
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder="Số điện thoại"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full p-3 bg-white/60 dark:bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>

                        </div>

                        {/* Password */}
                        <div className="mb-4 flex flex-col">
                            <i className="text-[14px] text-gray-400">(Lưu ý: Mật khẩu sẽ được mặc định "Na12345678!" nếu để trống.)</i>
                            <input
                                name="password"
                                type="password"
                                placeholder="Mật khẩu"
                                onChange={handleChange}
                                className="w-full p-3 bg-white/60 dark:bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            // required
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <textarea
                                name="address"
                                placeholder="Địa chỉ"
                                onChange={handleChange}
                                className="w-full p-3 bg-white/60 dark:bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Loại khách hàng */}
                        <div className="mb-4">
                            <select
                                name="description"
                                onChange={handleChange}
                                className="w-[50%] p-3 sm:text-[16px] bg-white/60 dark:bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                        <div className="w-full mt-6">
                            {/* Nút đăng ký */}
                            <button
                                type="submit"
                                className={`sm:w-[40%] w-full ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white p-3 rounded-md transition duration-200`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Đăng ký"}
                            </button>
                        </div>

                    </div>

                </div>

            </form>
        </motion.div>
    );
}

export default AddCustomerForm;