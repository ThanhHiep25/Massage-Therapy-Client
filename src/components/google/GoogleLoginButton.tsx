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
    <div className="mt-4 w-5/12">
    <button
      onClick={handleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 w-full"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png" className="w-6 h-6" />
      <span>Google</span>
    </button>
  </div>
  );
};

export default GoogleLoginButton;
