import { useState } from "react";
import { loginUser } from "../../service/apiService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/AuthContext";
import GoogleButtonGoogleButton from "../../components/google/GoogleLoginButton";
import { motion } from 'framer-motion'
import { Eye, EyeOff } from "lucide-react";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Hiện trạng thái đang tải
    try {
      const response = await loginUser(formData);
      login(response.data.user);
      navigation("/");
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false); // Tắt trạng thái đang tải
    }
  };


  return (
    <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
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
      <div className="flex flex-col items-center justify-center mr-10">
        {/* Hiệu ứng ánh sáng */}
        <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-30 blur-3xl rounded-full top-20 left-10"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-400 opacity-20 blur-3xl rounded-full bottom-20 right-20"></div>

        {/* Nội dung chào mừng */}
        <div className="text-center text-white mb-10">
          <h1 className="text-4xl font-bold tracking-wider">Chào mừng đến với Spa</h1>
          <p className="text-lg text-gray-300 mt-2">Nơi thư giãn tuyệt đối với liệu pháp chăm sóc tự nhiên.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-white border border-white/20">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome Back !
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email" type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="relative w-full">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-5 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
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
            className={`w-full py-2 font-bold rounded-md transition duration-300 ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-500 text-center mt-4">{message}</p>
        <hr className="my-4 border-gray-300" />
        <p className="text-center text-gray-500">Bạn chưa có tài khoản ?</p>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigation("/register")}
            className="w-44 mt-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-3xl transition duration-300"
          >
            Register
          </button>

          <GoogleButtonGoogleButton />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
