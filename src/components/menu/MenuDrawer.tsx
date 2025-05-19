
import React, { useState } from 'react';
import { Menu, Dashboard, People, NaturePeople, Spa, PendingActions, History, ShoppingBagOutlined, ProductionQuantityLimits } from '@mui/icons-material';
import { useAuth } from '../../hooks/AuthContext';
import Details from '../home/Details';
import { ChevronRight } from 'lucide-react';
import { FaLeaf } from 'react-icons/fa';

const MenuDrawer: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<string>(() => {
        return localStorage.getItem('currentPage') || 'home';
    });
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [open, setOpen] = useState<{ [key: string]: boolean }>({
        dashboard: false,
        employees: false,
        customers: false,
        services: false,
        appointments: false,
        history: false,
    });

    const { user } = useAuth();
    const handleToggle = (menu: string) => {
        setOpen((prevState) => ({ ...prevState, [menu]: !prevState[menu] }));
    };

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);
    const handleNavigation = (page: string, index: number) => {
        if (window.innerWidth < 768) {
            setDrawerOpen(false);
        }
        setCurrentPage(page);
        setActiveIndex(index);
        localStorage.setItem('currentPage', page);
    };

    return (
        <div className=" flex sm:w-screen dark:bg-gray-800 bg-white text-gray-900 dark:text-white">
            {
                user?.roles === 'staff' || user?.roles === 'admin' ? (
                    <>
                        {/* Sidebar */}
                        <div className={`flex flex-col ${drawerOpen ? 'sm:w-96 w-screen h-screen' : 'relative w-0'} transition-all duration-300`}>
                            <div className="flex items-center justify-end px-2 py-2 ">
                                <button onClick={toggleDrawer} className={`p-4 rounded-full ${drawerOpen ? '' : 'absolute w-[70px] pl-8 top-0 left-[-20px]'} bg-white dark:bg-black hover:bg-gray-300`}>
                                    {drawerOpen ? <Menu /> : <ChevronRight />}
                                </button>
                            </div>
                            <div className={`overflow-y-auto  ${drawerOpen ? 'sm:h-[80vh] h-[60vh] p-4' : 'overflow-hidden'}  sm:h-[70vh] h-[60vh] max-h-full flex flex-col text-[18px]`}>
                                {(user?.roles === 'staff' || user?.roles === 'admin') && (
                                    <div className='text-[14px] sm:text-[16px]'>
                                        <button onClick={() => handleToggle('dashboard')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                            <Dashboard />
                                            <span className={` ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Dashboard</span>
                                        </button>
                                        {open.dashboard && (
                                            <div className="ml-6  p-4">

                                                <button
                                                    className={`"block w-full p-2 hover:bg-gray-400 "  ${activeIndex === 2 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                    onClick={() =>
                                                        handleNavigation('tktc', 2)}>Tài chính</button>
                                                <button
                                                    className={`"block w-full p-2 mt-2 hover:bg-gray-400 "  ${activeIndex === 33 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                    onClick={() =>
                                                        handleNavigation('dichvutk', 33)
                                                    }>Dịch vụ</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quản lý nhân viên */}
                                {(user?.roles === 'admin') && (
                                    <div className='text-[14px] sm:text-[16px]'>
                                        <button onClick={() => handleToggle('employees')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                            <People />
                                            <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý nhân viên</span>
                                        </button>
                                        {open.employees && (
                                            <div className="ml-6  p-4">
                                                <button className={`"block w-full p-2  hover:bg-gray-400 hover:rounded-md"  ${activeIndex === 4 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('themNV', 4)}>Thêm nhân viên mới</button>
                                                <button className={`"block w-full p-2 mt-2 hover:bg-gray-400 hover:rounded-md"  ${activeIndex === 5 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('danhsachNV', 5)}>Danh sách nhân viên</button>
                                                <button className={`"block w-full p-2 mt-2 hover:bg-gray-400 hover:rounded-md"  ${activeIndex === 21 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('danhsachTaiKhoanNV', 21)}>Danh sách tài khoản nhân viên</button>
                                                <button className={`"block w-full p-2 mt-2 hover:bg-gray-400 hover:rounded-md"  ${activeIndex === 6 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('phancongNV', 6)}>Phân công nhân viên</button>
                                            </div>
                                        )}
                                    </div>
                                )}


                                {/* Quản lý khách hàng */}
                                {(user?.roles === 'staff' || user?.roles === 'admin') && (
                                    <div className='text-[14px] sm:text-[16px]'>
                                        <button onClick={() => handleToggle('customers')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                            <NaturePeople />
                                            <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý khách hàng</span>
                                        </button>
                                        {open.customers && (
                                            <div className="ml-6  p-4">
                                                <button className={`"block w-full p-2  hover:bg-gray-400 "  ${activeIndex === 7 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('themKH', 7)}>Thêm khách hàng mới</button>
                                                <button className={`"block w-full p-2 mt-2 hover:bg-gray-400 "  ${activeIndex === 8 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('danhsachKH', 8)}>Danh sách khách hàng</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quản lý dịch vụ */}
                                <div className='text-[14px] sm:text-[16px]'>
                                    <button onClick={() => handleToggle('services')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                        <Spa />
                                        <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý dịch vụ</span>
                                    </button>
                                    {open.services && (
                                        <div className="ml-6  p-4">
                                            {
                                                user?.roles === 'admin' && (
                                                    <button className={`"block w-full p-2  hover:bg-gray-400 "  ${activeIndex === 9 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('themSPA', 9)}>Thêm dịch vụ mới</button>
                                                )
                                            }

                                            <button className={`"block w-full p-2  mt-2 hover:bg-gray-400"  ${activeIndex === 10 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('dichvuSPA', 10)}>Danh sách dịch vụ</button>
                                        </div>
                                    )}
                                </div>

                                {/* Quản lý lịch hẹn */}
                                <div className='text-[14px] sm:text-[16px]'>
                                    <button onClick={() => handleToggle('appointments')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                        <PendingActions />
                                        <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý lịch hẹn</span>
                                    </button>
                                    {open.appointments && (
                                        <div className="ml-6  p-4">
                                            <button
                                                className={`"block w-full p-2  hover:bg-gray-400 "  ${activeIndex === 11 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                onClick={() => handleNavigation('themLH', 11)}>
                                                Đặt lịch hẹn
                                            </button>
                                            <button
                                                className={`"block w-full p-2 mt-2  hover:bg-gray-400 "  ${activeIndex === 12 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                onClick={() => handleNavigation('danhsachLH', 12)}>Danh sách lịch hẹn</button>
                                        </div>
                                    )}
                                </div>

                                {/* Quản lý sản phẩm */}
                                <div className='text-[14px] sm:text-[16px]'>
                                    <button onClick={() => handleToggle('products')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                        <ProductionQuantityLimits />
                                        <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý sản phẩm</span>
                                    </button>
                                    {open.products && (
                                        <div className="ml-6  p-4">
                                            {
                                                user?.roles === 'admin' && (
                                                    <button
                                                        className={`"block w-full p-2  hover:bg-gray-400 "  ${activeIndex === 13 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                        onClick={() => handleNavigation('themSP', 13)}>
                                                        Thêm sản phẩm
                                                    </button>
                                                )
                                            }
                                            <button
                                                className={`"block w-full p-2 mt-2  hover:bg-gray-400 "  ${activeIndex === 14 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                onClick={() => handleNavigation('danhsachSP', 14)}>Danh sách sản phẩm</button>
                                        </div>
                                    )}
                                </div>

                                {/* Quản lý đơn hàng */}
                                <div className='text-[14px] sm:text-[16px]'>
                                    <button onClick={() => handleToggle('orders')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                        <ShoppingBagOutlined />
                                        <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý đơn hàng</span>
                                    </button>
                                    {open.orders && (
                                        <div className="ml-6  p-4">
                                            <button
                                                className={`"block w-full p-2  hover:bg-gray-400 "  ${activeIndex === 15 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                onClick={() => handleNavigation('themDH', 15)}>
                                                Giỏ hàng
                                            </button>
                                            <button
                                                className={`"block w-full p-2 mt-2  hover:bg-gray-400 "  ${activeIndex === 16 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                onClick={() => handleNavigation('danhsachDH', 16)}>Danh sách đơn hàng</button>
                                        </div>
                                    )}
                                </div>

                                {/* Lịch sử */}
                                <div className='text-[14px] sm:text-[16px]'>
                                    <button onClick={() => handleToggle('history')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                        <History />
                                        <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Lịch sử</span>
                                    </button>
                                    {open.history && (
                                        <div className="ml-6  p-4">
                                            <button className={`"block w-full p-2 mt-2  hover:bg-gray-400 "  ${activeIndex === 40 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                onClick={() => handleNavigation('lsdv', 40)}>Thanh toán dịch vụ</button>
                                            <button className={`"block w-full p-2 mt-2  hover:bg-gray-400 "  ${activeIndex === 41 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}
                                                onClick={() => handleNavigation('lsdh', 41)}>Thanh toán đơn hàng</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Main Content */}
                        <div className="w-screen max-w-fit-content">
                            <Details currentPage={currentPage} />
                        </div>

                    </>
                ) : (
                    <div className="w-full sm:ml-0 ml-3 h-[70vh] flex items-center justify-center">               
                            <FaLeaf className="animate-bounce text-green-400 size-8 mr-2" />
                            <span className="text-gray-600 text-lg">Bạn không có quyền truy cập trang này</span>
                       
                    </div>
                )
            }

        </div>
    );
};

export default MenuDrawer;
