import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Import eye icons

interface CHangePasswordProfileProps {
    userId: number;
    onSave: (userId: number, oldPass: string, newPass: string) => Promise<boolean>; // Returns true on success
}

const CHangePassword_Profile: React.FC<CHangePasswordProfileProps> = ({ userId, onSave }) => {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!oldPass || !newPass) {
            alert("Vui lòng nhập cả mật khẩu cũ và mật khẩu mới.");
            return;
        }
        setIsSubmitting(true);
        const success = await onSave(userId, oldPass, newPass);
        setIsSubmitting(false);
        if (success) {
            setOldPass('');
            setNewPass('');
            setShowOldPassword(false); // Reset visibility on success
            setShowNewPassword(false); // Reset visibility on success
        }
    };

    const handleCancel = () => {
        setOldPass('');
        setNewPass('');
        setShowOldPassword(false);
        setShowNewPassword(false);
    };

    return (
        <div className="mt-5 w-full text-left">
            <details>
                <motion.summary
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer hover:text-blue-600 sm:text-sm text-[12px] font-medium"
                >
                    Đổi mật khẩu
                    <hr className="mt-1 border-gray-300" />
                </motion.summary>

                <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                    <div>
                        <label htmlFor={`oldPass-${userId}`} className="block sm:text-sm text-[12px] font-medium text-gray-700">Mật khẩu cũ:</label>
                        <div className="relative mt-1">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                name="oldPass"
                                id={`oldPass-${userId}`}
                                value={oldPass}
                                onChange={(e) => setOldPass(e.target.value)}
                                className="block w-[68%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10" // Added pr-10 for icon space
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                aria-label={showOldPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showOldPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor={`newPass-${userId}`} className="block sm:text-sm text-[12px] font-medium text-gray-700">Mật khẩu mới:</label>
                        <div className="relative mt-1">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPass"
                                id={`newPass-${userId}`}
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                className="block w-[68%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10" // Added pr-10 for icon space
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showNewPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-1/2 flex justify-center sm:py-2 sm:px-4 p-1 border border-transparent rounded-md shadow-sm sm:text-sm text-[12px] font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Đang lưu...' : 'Xác nhận'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="w-1/2 flex justify-center sm:py-2 sm:px-4 p-1 border border-gray-300 rounded-md shadow-sm sm:text-sm text-[12px] font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </details>
        </div>
    );
};

export default CHangePassword_Profile;