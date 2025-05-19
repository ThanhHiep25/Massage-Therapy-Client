import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion'
import { resetPassword, sendResetPassword } from '../../service/apiAuth';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const navigation = useNavigate();

    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSendOtp = async () => {

        if (!email) {
            setError("Vui lòng nhập email.");
            return;
        }

        if (!isValidEmail(email)) {
            setError("Email không hợp lệ.");
            return;
        }

        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await sendResetPassword(email);
            setStep(2);
            setTimer(180);
            setSuccess("OTP đã được gửi tới email của bạn.");
        } catch (error: any) {
            console.error("Error sending OTP:", error);
            setError(error.response?.data?.message || "Gửi OTP thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = (password: string) => {
        if (!password) {
            return "Vui lòng nhập mật khẩu mới.";
        }
        // Ví dụ: Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường và chữ số
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường và chữ số và kí tự đặc biệt.";
        }
        return null; // Không có lỗi
    };

      const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        setNewPasswordError(validatePassword(e.target.value));
    };


    const handleResetPassword = async () => {
        
        if (newPasswordError) {
            setError(newPasswordError);
            return;
        }
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const response = await resetPassword(email, otp, newPassword);
            const message = response.message || '';

            // Kiểm tra message để xác định trạng thái
            if (message.includes('OTP hết hạn')) {
                setError('OTP đã hết hạn. Vui lòng yêu cầu OTP mới.');
            } else if (message.includes('OTP không chính xác')) {
                setError('OTP không chính xác. Vui lòng kiểm tra lại.');
            } else if (message.includes('Đặt lại mật khẩu thành công')) {
                setSuccess('Đặt lại mật khẩu thành công!');
                resetForm();
                setTimeout(() => {
                    navigation('/login');
                }, 3000);
            } else {
                setError('Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
            }
        } catch (error: any) {
            console.error('Error resetting password:', error);
            const message = error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';

            if (message.includes('OTP hết hạn')) {
                setError('OTP đã hết hạn. Vui lòng yêu cầu OTP mới.');
            } else if (message.includes('OTP không chính xác')) {
                setError('OTP không chính xác. Vui lòng kiểm tra lại.');
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };



    const resetForm = () => {
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setTimer(0);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setOtp('');
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
            {/* Nút quay lại */}
            <div className="absolute top-10 left-5" >
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
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-white border border-white/20">
                <div>
                    <h2 className="sm:text-2xl text-lg font-medium text-center mb-4">
                        {step === 1 ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
                    </h2>

                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                    {success && <Alert severity="success" className="mb-4">{success}</Alert>}

                    {step === 1 && (
                        <>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mb-4 w-full text-sm px-4 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                disabled={loading}
                            />
                            <button
                                type='submit'
                                className="w-full bg-blue-500 text-sm hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
                                onClick={handleSendOtp}
                                disabled={!email || loading}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi OTP'}
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="flex flex-row items-center mb-4">
                                <input
                                    type="text"
                                    placeholder="OTP"
                                    pattern="[0-9]{6}"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className=" w-full px-4 py-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    disabled={loading}
                                />

                                <p className="text-red-400 text-center pl-4 mb-2 font-medium">
                                    {timer > 0 ? `${formatTime(timer)}` : 'OTP đã hết hạn.'}
                                </p>

                            </div>
                            <div className="mb-3 text-sm">
                                <div className="relative w-full">
                                <input
                                    placeholder="Mật khẩu mới"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    disabled={loading}
                                    className="w-full px-4 py-4 text-black border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-7 right-3 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                             {newPasswordError && <p className="text-red-500 text-sm mb-2 mt-1">{newPasswordError}</p>}
                            </div>
                            
                            <div className=" flex flex-col items-center">
                                <button
                                    type='submit'
                                    className="w-full bg-blue-500 text-sm hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
                                    onClick={handleResetPassword}
                                    disabled={!otp || !newPassword || timer === 0 || loading}
                                >
                                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                </button>

                                {timer === 0 && (
                                    <button
                                        type='submit'
                                        className=" mt-4 w-full bg-purple-400 hover:bg-purple-600 text-white font-semibold py-2 rounded-md"
                                        onClick={handleSendOtp}
                                        disabled={loading}
                                    >
                                        Gửi lại OTP
                                    </button>
                                )}
                            </div>


                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
