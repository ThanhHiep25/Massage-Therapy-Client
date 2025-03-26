import { useState } from "react";
import { addCustomerNoOTP } from "../../service/apiService";
import axios from "axios";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AddCustomerForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        description: "",
        imageUrl: "",// Lưu avatar dưới dạng URL từ Cloudinary

    });
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái xử lý
    const [imageFile, setImageFile] = useState<File | null>(null); // Lưu trữ file ảnh
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Kiểm tra kích thước ảnh
            if (file.size > 1048576) {
                toast.warning("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 1MB.");
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

        setIsLoading(true);
        try {
            let imageUrl = formData.imageUrl;

            // Tải ảnh lên Cloudinary nếu có file
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);
                uploadFormData.append("upload_preset", "spamassage");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dokp7ig0u/image/upload",
                    uploadFormData
                );
                imageUrl = response.data.secure_url; // Lấy URL ảnh
            }

            // Tải ảnh lên Cloudinary nếu có file
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);
                uploadFormData.append("upload_preset", "customer");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dokp7ig0u/image/upload",
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
            className="flex flex-col items-center justify-center w-full h-full dark:text-white">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="w-full max-w-full bg-white/40 dark:bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 mt-6 md:mt-0 sm:mb-6">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Đăng ký người dùng mới ✨</h1>
                    <p className="mb-20">Vui lòng điền thông tin để đăng ký người dùng.</p>
                </div>
                <div className="flex justify-around">
                    <div className="w-[60%]">
                        <div className="mb-6 flex justify-center">
                            <label
                                htmlFor="file-upload"
                                className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-40 sm:h-40 border-2 border-dashed rounded-full cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300"
                            >
                                {!imagePreview ? (
                                    <>
                                        <CloudUpload className="text-gray-400 dark:text-gray-200" fontSize="large" />
                                        <p className="text-xs text-gray-400 mt-1 dark:text-gray-200">Nhấn để tải ảnh</p>
                                    </>
                                ) : (
                                    <img src={imagePreview} alt="Xem trước" className="w-full h-full object-cover rounded-full" />
                                )}
                                <input id="file-upload" type="file" name="avatar" onChange={handleFileChange} accept="image/*" className="hidden" />
                            </label>
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
                                className="w-full p-3 bg-white/60 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Name & Phone */}
                        <div className="mb-4 flex flex-col sm:flex-row gap-4">
                            <input
                                name="name"
                                placeholder="Tên"
                                onChange={handleChange}
                                className="w-full sm:w-1/2 p-3 bg-white/60 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                name="phone"
                                type="text"
                                placeholder="Số điện thoại"
                                onChange={handleChange}
                                className="w-full sm:w-1/2 p-3 bg-white/60 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <input
                                name="password"
                                type="password"
                                placeholder="Mật khẩu"
                                onChange={handleChange}
                                className="w-full p-3 bg-white/60 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <textarea
                                name="address"
                                placeholder="Địa chỉ"
                                onChange={handleChange}
                                className="w-full p-3 bg-white/60 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Loại khách hàng */}
                        <div className="mb-4">
                            <select
                                name="description"
                                onChange={handleChange}
                                className="w-[50%] p-3 bg-white/60 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Chọn loại khách hàng</option>
                                <option value="dong">Đồng</option>
                                <option value="bac">Bạc</option>
                                <option value="vang">Vàng</option>
                                <option value="kimcuong">Kim cương</option>
                                <option value="vip">VIP</option>
                                <option value="vip++">VIP ++</option>
                            </select>
                        </div>

                    </div>

                </div>
                <div className="w-full flex items-center justify-center mt-6">
                    {/* Nút đăng ký */}
                    <button
                        type="submit"
                        className={`w-[40%] ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white p-3 rounded-md transition duration-200`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                </div>

            </form>
        </motion.div>
    );
}

export default AddCustomerForm;