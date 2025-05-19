import { useCallback, useState } from "react";
import axios from "axios";
import { CloudUpload, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerStaff, verifyOtp } from "../../service/apiAuth";


const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const STAFF = import.meta.env.VITE_CLOUDINARY_UPLOAD_STAFF;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    imageUrl: "",// Lưu avatar dưới dạng URL từ Cloudinary

  });
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [otp, setOtp] = useState<string>(""); // OTP state
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // Trạng thái OTP đã gửi
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false); // Trạng thái OTP đã xác thực
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái xử lý
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu trữ file ảnh
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigation = useNavigate();

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

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
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
      case 'password':
        if (!trimmedValue) return "Vui lòng nhập mật khẩu.";
        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(trimmedValue)) {
          return "Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất một chữ hoa và một ký tự đặc biệt.";
        }
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
        setMessage("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 2MB.");
        toast.error("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 2MB.");
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
      toast.success("Ảnh đã được chọn. Ảnh sẽ được tải lên khi bạn nhấn 'Đăng ký'.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        uploadFormData.append(UPLOAD_PRESET, STAFF);

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
      await registerStaff(userToRegister); // Gửi thông tin đăng ký
      setMessage("OTP đã được gửi đến email của bạn.");
      toast.success("OTP đã được gửi đến email của bạn.");
      setIsOtpSent(true); // OTP đã được gửi

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Kiểm tra nếu API trả về mã lỗi 1000
        if (error.response?.data?.code === 1011) {
          toast.warning("Email đã tồn tại")
          setIsOtpSent(false);
        } else {
          // Xử lý lỗi chung từ API
          setMessage(`Lỗi: ${error.response?.data?.message || "Có lỗi xảy ra."}`);
        }
      } else {
        // Xử lý lỗi không xác định
        setMessage("Đã xảy ra lỗi không xác định.");
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const response = await verifyOtp(
      //   new URLSearchParams({
      //     email: formData.email,
      //     otp: otp,
      //   })
      // );

      const response = await verifyOtp(
        {
          email: formData.email,
          otp: otp,
        }
      );

      if (response.data.message === "OTP verified successfully") {
        setIsOtpVerified(true);
        setMessage(
          "OTP đã được xác thực thành công. Bạn có thể hoàn tất đăng ký."
        );
        toast.success("OTP đã được xác thực thành công. Bạn có thể hoàn tất đăng ký.");
        setTimeout(() => {
           navigation("/login");
        }, 2000);     
      } else {
        setMessage("OTP không hợp lệ hoặc đã hết hạn.");
        toast.error("OTP không hợp lệ hoặc đã hết hạn.");
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
      <ToastContainer />

      {/* Nút quay lại */}
      <div className="absolute top-10 left-5">
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
        <div className="hidden sm:flex flex-col  justify-center md:mr-10 text-center md:text-left">
          <p className="text-3xl sm:text-[30px] font-bold tracking-wider">Chào mừng đến với Spa</p>
          <p className="text-sm sm:text-lg text-justify text-gray-300 mt-2">Nơi thư giãn tuyệt đối với liệu pháp chăm sóc tự nhiên.</p>
        </div>

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="w-full max-w-md sm:bg-white/10 sm:backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl text-white sm:border  sm:border-white/20 mt-6 md:mt-0">
          <div className="mb-6 text-center">
            <p className="text-lg sm:text-[30px[ font-medium">Đăng ký tài khoản</p>
            <p className="text-gray-200 text-sm">Vui lòng điền thông tin để đăng ký tài khoản.</p>
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
              <div className="mb-4 text-sm">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-3 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Name & Phone */}
              <div className="mb-4 flex flex-col sm:flex-row gap-4 text-sm">
                <div className="w-full sm:w-1/2">
                  <input
                    name="name"
                    placeholder="Tên"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full p-3 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

              </div>

              {/* Password */}
              <div className="mb-4 text-sm">
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-6 right-3 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Nút đăng ký */}
              <button
                type="submit"
                className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500 text-sm hover:bg-blue-600"} text-white p-3 rounded-md transition duration-200`}
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
                  className="w-full p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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


