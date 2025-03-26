import { useState, useEffect } from "react";
import { addEmployee, getPositions } from "../../service/apiService";
import { CloudUpload } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from 'framer-motion'

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

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await getPositions();
                console.log("Dữ liệu chức vụ:", response); // Kiểm tra dữ liệu API
                if (Array.isArray(response)) {
                    setPositions(response);
                } else {
                    console.error("Dữ liệu từ API không hợp lệ:", response);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chức vụ:", error);
            }
        };
        fetchPositions();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Kiểm tra kích thước ảnh
            if (file.size > 1048576) {
                setMessage("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 1MB.");
                toast.error("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 1MB.");
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
                "Ảnh đã được chọn. Ảnh sẽ được tải lên khi bạn nhấn 'Thêm mới'."
            );
            toast.success("Ảnh đã được chọn. Ảnh sẽ được tải lên khi bạn nhấn 'Thêm mới'.");
        }
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl = formData.imageUrl;

            // Tải ảnh lên Cloudinary nếu có file
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);
                uploadFormData.append("upload_preset", "staff-massage");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dokp7ig0u/image/upload",
                    uploadFormData
                );
                imageUrl = response.data.secure_url; // Lấy URL ảnh
            }

            const payload = { ...formData, positionId: parseInt(formData.positionId, 10), imageUrl };
            const response = await addEmployee(payload);
            console.log("Employee added:", response.data);
            setFormData({ name: "", phone: "", email: "", address: "", imageUrl: "", description: "", startDate: "", positionId: "" });
            setImageFile(null);
            setImagePreview(null);
            toast.success("Thêm nhân viên thành công!");
        } catch (error) {
            console.error("Error adding employee:", error);
            toast.error("Thêm nhân viên thất bại!");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer />
            <div className="w-full min-h-screen max-w-full bg-white shadow-md rounded-lg p-20">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Thêm Nhân Viên</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm mb-1">Họ và tên</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm mb-1">Số điện thoại</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm mb-1">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm mb-1">Địa chỉ</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm mb-1">Chức vụ</label>
                            <select name="positionId" value={formData.positionId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300">
                                <option value="">Chọn chức vụ</option>
                                {positions.length > 0 ? (
                                    positions.map((position) => (
                                        <option key={position.positionId} value={position.positionId}>{position.positionName}</option>
                                    ))
                                ) : (
                                    <option disabled>Không có chức vụ nào</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm mb-1">Ngày bắt đầu</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Mô tả công việc</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Ảnh đại diện</label>
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 p-4 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 border-gray-300">
                            <CloudUpload className="text-gray-500" fontSize="large" />
                            <p className="text-sm text-gray-600 mt-2">Kéo & thả hoặc nhấn để chọn ảnh</p>
                            <input id="file-upload" type="file" name="avatar" onChange={handleFileChange} accept="image/*" className="hidden" />
                        </label>
                        {imagePreview && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ảnh xem trước:</p>
                                <img
                                    src={imagePreview}
                                    alt="Xem trước"
                                    className="w-60 h-40 object-cover rounded-xl shadow-md mx-auto border border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        )}
                        {message && (
                            <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
                        )}
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">Thêm Nhân Viên</button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddStaffForm;
