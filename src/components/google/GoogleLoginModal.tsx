import { useState } from "react";
import { auth, provider } from "../../configs/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const GoogleLoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user);
      onClose(); // Đóng modal sau khi login thành công
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  if (!isOpen) return null; // Ẩn modal nếu không mở

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Đăng nhập bằng Google</h2>
        <button
          onClick={handleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 w-full"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png" className="w-6 h-6" />
          <span>Đăng nhập với Google</span>
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <button onClick={onClose} className="mt-4 text-gray-600">Đóng</button>
      </div>
    </div>
  );
};

export default GoogleLoginModal;
