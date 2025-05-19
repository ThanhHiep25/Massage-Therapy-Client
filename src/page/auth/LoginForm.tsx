import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { motion } from 'framer-motion'
import { Eye, EyeOff,  LoaderCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginUser } from "../../service/apiAuth";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Xử lý riêng cho password
    if (name === 'password') {
      const errorMessage = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Hiện trạng thái đang tải
    if (!formData.email || !formData.password) {
      toast.error("Vui lòng nhập tài khoản hoặc mật khẩu!");
      setIsLoading(false); // Tắt trạng thái đang tải
      return;
    }
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại các thông tin đã nhập.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await loginUser(formData);
      login(response.data.user);
      navigation("/");
    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        if (errorMessage === "Blocked") {
          toast.warning("Tài khoản của bạn đã bị khóa!");
        } else if (errorMessage === "User not found") {
          toast.error("Email không tồn tại!");
        } else if (errorMessage === "Invalid username or password!") {
          toast.error("Sai email hoặc mật khẩu!");
        } else if (error.response?.data?.code === 1001) {
          toast.error("Sai mật khẩu!");
        } else {
          toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
        }
      }
    } finally {
      setIsLoading(false); // Tắt trạng thái đang tải
    }
  };


  // --- Hàm kiểm tra validation cho một trường cụ thể ---
  const validateField = useCallback((name: string, value: string): string => {
    const trimmedValue = value.trim();

    switch (name) {
      case 'email':
        if (!trimmedValue) return "Vui lòng nhập email.";
        // Regex email cơ bản
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return "Email không hợp lệ.";
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
    if (['email', 'password'].includes(name)) {
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
    const fieldsToValidate: (keyof typeof formData)[] = ['email', 'password'];

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



  return (
    <div className="overflow-hidden">
      <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <ToastContainer />
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
        <div className="flex flex-col items-center justify-center sm:mr-10">
          {/* Hiệu ứng ánh sáng */}
          <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-30 blur-3xl rounded-full top-20 left-10"></div>
          <div className="absolute w-[500px] h-[500px] bg-blue-400 opacity-20 blur-3xl rounded-full bottom-20 right-20"></div>

          {/* Nội dung chào mừng */}
          <div className="text-center text-white mb-10">
            <h1 className="sm:text-[30px] text-[20px] font-bold tracking-wider">Chào mừng đến với Spa Royal</h1>
            <p className="sm:text-lg text-sm text-gray-300 mt-2">Nơi thư giãn tuyệt đối với liệu pháp chăm sóc tự nhiên.</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-white border border-white/20">
          <h2 className="sm:text-2xl text-lg font-bold text-center text-gray-800 mb-4">
            Welcome Back !
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm">
              <input
                name="email" type="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="relative w-full text-sm">
              <>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-5 right-3 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </>
              {errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <a
                onClick={() => navigation("/forgot-password")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 font-medium rounded-md transition text-sm duration-300 flex items-center justify-center ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              {isLoading ? <LoaderCircle className="animate-spin text-center"/> : "Đăng nhập"}
            </button>
          </form>

          <hr className="my-4 border-gray-300" />
          <p className="text-center text-gray-800">Bạn chưa có tài khoản ?</p>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => navigation("/register")}
              className="w-44 mt-4 py-2 bg-gray-200 text-sm hover:bg-gray-300 text-gray-800 font-bold rounded-3xl transition duration-300"
            >
              Đăng ký tài khoản
            </button>

           
          </div>
        </motion.div>
      </div>
    </div>

  );
};

export default LoginForm;
