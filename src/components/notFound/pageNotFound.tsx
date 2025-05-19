import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleArrowLeft } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 to-white px-4 relative overflow-hidden" >

            {/* Mặt trời quay vòng */}
            <motion.img
                src="https://cdn-icons-png.flaticon.com/512/869/869869.png"
                alt="Sun"
                className="w-24 h-24 absolute top-10 right-10 opacity-80"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            />

            <motion.img
                src="../../../public/404.png"
                alt="Dancing Cat"
                className="w-44 md:w-52"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />




            <motion.h1
                className="text-4xl font-bold text-red-500 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                404 - Không tìm thấy trang
            </motion.h1>

            <motion.p
                className="text-gray-600 mt-3 text-center max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Trang này không tồn tại hoặc đã bị di chuyển. Mèo cũng không tìm ra đường 😿
            </motion.p>

            <motion.button
                onClick={() => navigate("/")}
                className="flex items-center gap-4 mt-6 bg-blue-600/40 text-white px-5 py-4 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
               <CircleArrowLeft/> Trở về trang chủ
            </motion.button>


        </div>
    );
};

export default NotFound;
