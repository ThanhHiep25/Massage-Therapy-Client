import React, { useState, useEffect } from 'react';
import { TextField, Button, Card, CardContent, Typography, InputAdornment, IconButton, Alert } from '@mui/material';
import { resetPassword, sendResetPassword } from '../../service/apiService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
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
    

    const handleResetPassword = async () => {
        if (attemptsLeft === 0) {
            setError("Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu OTP mới.");
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
        }else if(timer === 0) {
            setOtp('');
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent>
                    <Typography variant="h5" className="mb-4 text-center font-bold">
                        {step === 1 ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
                    </Typography>

                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                    {success && <Alert severity="success" className="mb-4">{success}</Alert>}

                    {step === 1 && (
                        <>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mb-4"
                                disabled={loading}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSendOtp}
                                disabled={!email || loading}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi OTP'}
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="flex flex-row items-center mb-4">
                                <TextField
                                    label="OTP"
                                    fullWidth
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="mb-4"
                                    disabled={loading}
                                />

                                <Typography className="text-red-400 text-center pl-4 mb-2 font-medium">
                                    {timer > 0 ? `${formatTime(timer)}` : 'OTP đã hết hạn.'}
                                </Typography>

                            </div>

                            <TextField
                                label="Mật khẩu mới"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mb-4"
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <div className=" flex flex-col items-center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleResetPassword}
                                    disabled={!otp || !newPassword || timer === 0 || loading}
                                    sx={{ mt: 2 }}
                                >
                                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                </Button>

                                {timer === 0 && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        fullWidth
                                        onClick={handleSendOtp}
                                        className="mt-2"
                                        disabled={loading}
                                        sx={{ mt: 2, width: '200px' }}
                                    >
                                        Gửi lại OTP
                                    </Button>
                                )}
                            </div>


                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
