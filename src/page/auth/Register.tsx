import { useState } from "react";
import { registerUser, verifyOtp } from "../../service/apiService";
import axios from "axios";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    imageUrl: "",// Lưu avatar dưới dạng URL từ Cloudinary

  });
  const [message, setMessage] = useState<string>("");
  const [otp, setOtp] = useState<string>(""); // OTP state
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // Trạng thái OTP đã gửi
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false); // Trạng thái OTP đã xác thực
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái xử lý
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu trữ file ảnh
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigation = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Kiểm tra kích thước ảnh
      if (file.size > 1048576) {
        setMessage("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 1MB.");
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

      await registerUser(userToRegister); // Gửi thông tin đăng ký
      setMessage("OTP đã được gửi đến email của bạn.");
      setIsOtpSent(true); // OTP đã được gửi

    } catch (error: unknown) {
      if (error) {
        const err = error as any;
        setMessage(`Error: ${err.response?.data?.message || err.message}`);
      } else if (axios.isAxiosError(error) && error.response?.data?.codecode === 1000) {
        setMessage("Email đã tồn tại");
        setIsOtpSent(false);
      } else {
        setMessage("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verifyOtp(
        new URLSearchParams({
          email: formData.email,
          otp: otp,
        })
      );
      if (response.data.message === "OTP verified successfully") {
        setIsOtpVerified(true);
        setMessage(
          "OTP đã được xác thực thành công. Bạn có thể hoàn tất đăng ký."
        );
      } else {
        setMessage("OTP không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
      } else {
        setMessage("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {/* Nút quay lại */}
      <div className="absolute top-4 left-4">
        <a className="text-white hover:underline cursor-pointer" onClick={() => navigation(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </div>

      {/* Hộp chứa nội dung */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center w-full md:w-[80%] lg:w-[65%] bg-white/10 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl text-white border border-white/20"
      >
        {/* Nội dung chào mừng */}
        <div className="flex flex-col items-center justify-center md:mr-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wider">Chào mừng đến với Spa</h1>
          <p className="text-sm sm:text-lg text-gray-300 mt-2">Nơi thư giãn tuyệt đối với liệu pháp chăm sóc tự nhiên.</p>
        </div>

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl text-white border border-white/20 mt-6 md:mt-0">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold">Đăng ký tài khoản</h1>
            <p className="text-gray-200">Vui lòng điền thông tin để đăng ký tài khoản.</p>
          </div>

          {!isOtpSent ? (
            <>
              {/* Upload avatar */}
              <div className="mb-6 flex justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 border-2 border-dashed rounded-full cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  {!imagePreview ? (
                    <>
                      <CloudUpload className="text-gray-300" fontSize="large" />
                      <p className="text-xs text-gray-200 mt-1">Nhấn để tải ảnh</p>
                    </>
                  ) : (
                    <img src={imagePreview} alt="Xem trước" className="w-full h-full object-cover rounded-full" />
                  )}
                  <input id="file-upload" type="file" name="avatar" onChange={handleFileChange} accept="image/*" className="hidden" />
                </label>
              </div>

              {/* Hiển thị lỗi nếu có */}
              {message && <p className="mt-4 mb-4 text-center text-red-300 text-sm">{message}</p>}

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

              {/* Nút đăng ký */}
              <button
                type="submit"
                className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white p-3 rounded-md transition duration-200`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </>
          ) : !isOtpVerified ? (
            <>
              {/* OTP Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Nhập OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className={`w-full ${isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white p-3 rounded-md transition duration-200`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xác thực..." : "Xác thực OTP"}
              </button>
            </>
          ) : (
            <div className="text-center mt-4">
              <p className="text-green-500">Đăng ký hoàn tất! Bạn đã được đăng ký.</p>
            </div>
          )}

        </form>
      </motion.div>
    </div>

  );
};

export default RegisterForm;
