import { AccountCircleOutlined, LogoutOutlined, NotificationsActiveOutlined, SettingsOutlined, SpaOutlined } from '@mui/icons-material';
import { Avatar, Badge, IconButton, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/AuthContext';
import { logout } from '../../service/apiService';
import { Leaf } from "lucide-react";

const Bar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [leaves, setLeaves] = useState<number[]>([]);
    const { login, user, logoutContext } = useAuth();
    const navigation = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setLeaves((prev) => {
                if (prev.length >= 3) return prev.slice(1); // Chỉ giữ tối đa 3 lá rơi cùng lúc
                return [...prev, Math.random()];
            });
        }, 2000); // Mỗi 2 giây có 1 lá rơi

        return () => clearInterval(interval);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleLogin = () => {
        navigation('/login');
    };

    const handleRegister = () => {
        navigation('/register');
    };

    const handleProfile = () => {
        navigation('/profile');
    }
    const handleSettings = () => {
        navigation('/settings');
    }
    const handleLogout = async () => {
        try {
            await logout();
            logoutContext();
            setIsMenuOpen(false);

        } catch (error: unknown) {
            console.log('====================================');
            if (error instanceof Error) {
                const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || error.message;
                console.log('Error:', errorMessage);
            } else {
                console.log('Unexpected error', error);
            }
            console.log('====================================');
        }
    };

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                login(JSON.parse(storedUser)); // Khôi phục user từ localStorage
            }
        }
    }, [user, login]);

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    return (
        <div className="flex justify-between items-center  bg-white dark:bg-gray-800  text-gray-900 dark:text-white p-4" style={{
            borderBottom: '1px solid #e5e7eb',
        }}>
            <>
                {leaves.map((_, index) => (
                    <div
                        key={index}
                        className="absolute text-yellow-500 opacity-80 animate-fall"
                        style={{
                            left: "0vw", // Bắt đầu từ góc trái
                            top: "-5vh", // Bắt đầu từ trên màn hình
                            animationDuration: `${4 + Math.random() * 20}s`, // Random tốc độ
                            fontSize: `${12 + Math.random() * 20}px`,
                            animationDelay: `${Math.random() * 2}s`, // Random độ trễ
                        }}
                    >
                        <Leaf />
                    </div>
                ))}
            </>

            <div className="flex items-center justify-between px-4 py-4 gap-6">
                <SpaOutlined sx={{
                    color: 'gray',
                    fontSize: '50px',
                    transition: 'color 0.3s',
                    '&:hover': {
                        color: 'blue',
                    },
                }} />
                <h1 className={`text-2xl font-bold`}>SPA Royal</h1>
            </div>
            {!user ? (
                <div className="flex space-x-4">
                    <button
                        onClick={handleLogin}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={handleRegister}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Đăng ký
                    </button>
                </div>
            ) : (
                <div className='flex items-center'>
                    <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        style={{ marginRight: '10px' }}
                    >
                        <Badge badgeContent={17} color="error">
                            <NotificationsActiveOutlined
                                style={{ color: 'gray', fontSize: '28px' }}
                            />
                        </Badge>
                    </IconButton>

                    <div className="relative">
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={toggleMenu}
                        >
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt="Remy Sharp" src={user?.imageUrl} />
                            </StyledBadge>
                            <p className="mt-1 text-sm font-medium">{user?.name || 'Guest'}!</p>
                        </div>

                        {isMenuOpen && (
                            <div
                                className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border"
                                style={{
                                    zIndex: 1000, // Đảm bảo dropdown nằm trên các phần tử khác
                                }}
                            >
                                <ul className="py-2">
                                    <li>
                                        <button className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={handleProfile}>
                                            <AccountCircleOutlined /> Thông tin cá nhân
                                        </button>
                                    </li>
                                    <li>
                                        <button className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={handleSettings}>
                                            <SettingsOutlined /> Cài đặt
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="block px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 w-full"
                                            onClick={handleLogout}
                                        >
                                            <LogoutOutlined /> Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default Bar;
