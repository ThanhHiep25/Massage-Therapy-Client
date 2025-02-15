import { useState } from "react";
import { registerUser, verifyOtp } from "../../service/apiService";
import axios from "axios";
import { CloudUpload } from "lucide-react";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone:"",
    password: "",
    address: "",
    imageUrl: "",// Lưu avatar dưới dạng URL từ Cloudinary
    description:"", 
  });
  const [message, setMessage] = useState<string>("");
  const [otp, setOtp] = useState<string>(""); // OTP state
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // Trạng thái OTP đã gửi
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false); // Trạng thái OTP đã xác thực
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái xử lý
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu trữ file ảnh
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const validateForm = () => {
    const nameRegex = /^[A-Za-zÀ-ỹ\s]{2,50}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const addressRegex = /^[A-Za-z0-9À-ỹ\s,.-]{5,100}$/;
  
    if (!nameRegex.test(formData.name)) {
      setMessage("Tên không hợp lệ (chỉ chữ cái và khoảng trắng, tối đa 50 ký tự).");
      return false;
    }
    if (!usernameRegex.test(formData.username)) {
      setMessage("Tên đăng nhập không hợp lệ (4-20 ký tự, không dấu cách).");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setMessage("Email không hợp lệ.");
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      setMessage("Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
      return false;
    }
    if (!addressRegex.test(formData.address)) {
      setMessage("Địa chỉ không hợp lệ (5-100 ký tự).");
      return false;
    }
    return true;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
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
        uploadFormData.append("upload_preset", "spamassage");

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
      if (error instanceof Error) {
        const err = error as any;
        setMessage(`Error: ${err.response?.data?.message || err.message}`);
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
    } catch (error: any) {
      setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-semibold text-center mb-6">Đăng ký</h2>

      {!isOtpSent ? (
        <>
          <div className="mb-4">
            <input
              name="name"
              placeholder="Tên"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="username"
              placeholder="Tên đăng nhập"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="phone"
              type="text"
              placeholder="Số điện thoại"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="description"
              placeholder="Mô tả cơ bản"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-40 p-4 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 border-gray-300 dark:border-gray-600"
            >
              <CloudUpload className="text-gray-500 dark:text-gray-400" fontSize="large" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Kéo & thả hoặc nhấn để chọn ảnh</p>
              <input
                id="file-upload"
                type="file"
                name="avatar"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ảnh xem trước:</p>
                <img
                  src={imagePreview}
                  alt="Xem trước"
                  className="w-40 h-40 object-cover rounded-xl shadow-md mx-auto border border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white p-3 rounded-md transition duration-200`}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </>
      ) : !isOtpVerified ? (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nhập OTP"
            value={otp}
            onChange={handleOtpChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            onClick={handleVerifyOtp}
            className={`w-full ${isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } text-white p-3 rounded-md transition duration-200 mt-4`}
            disabled={isLoading}
          >
            {isLoading ? "Đang xác thực..." : "Xác thực OTP"}
          </button>
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-green-500">
            Đăng ký hoàn tất! Bạn đã được đăng ký.
          </p>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
      )}
    </form>
  );
};

export default RegisterForm;
