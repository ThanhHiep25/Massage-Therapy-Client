import { auth, provider } from "../../configs/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const GoogleLoginButton = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
    <button
      onClick={handleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 w-full"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png" className="w-6 h-6" />
      <span>Đăng nhập với Google</span>
    </button>
  </div>
  );
};

export default GoogleLoginButton;
