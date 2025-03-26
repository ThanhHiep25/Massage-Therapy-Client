
import React, { useState } from 'react';
import { Menu, Dashboard, People, NaturePeople, Spa, PendingActions, History } from '@mui/icons-material';
import { useAuth } from '../../hook/AuthContext';
import Details from '../home/Details';
import Footer from '../footer/Footer';

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
        setCurrentPage(page);
         setActiveIndex(index); 
        localStorage.setItem('currentPage', page);
    };

    return (
        <div className="flex h-screen w-screen dark:bg-gray-800 bg-white text-gray-900 dark:text-white">
            {/* Sidebar */}
            <div className={`h-screen flex flex-col ${drawerOpen ? 'w-96' : 'w-20'} transition-all duration-300`}>
                <div className="flex items-center justify-end px-2 py-2">
                    <button onClick={toggleDrawer} className="p-4 hover:rounded-full hover:bg-gray-300">
                        <Menu />
                    </button>
                </div>
                <div className="overflow-y-auto p-4 h-[70vh] max-h-full flex flex-col text-[18px]">
                    {(user?.roles === 'superadmin' || user?.roles === 'admin') && (
                        <div>
                            <button onClick={() => handleToggle('dashboard')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                <Dashboard />
                                <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Dashboard</span>
                            </button>
                            {open.dashboard && (
                                <div className="ml-6 border-b-4 p-4">
                                    <button className={`"block w-full p-2  hover:bg-gray-400 "  ${activeIndex === 1 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('hsnv',1)}>Hiệu suất nhân viên</button>
                                    <button className={`"block w-full p-2 mt-2 hover:bg-gray-400 "  ${activeIndex === 2 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('tktc',2)}>Tài chính</button>
                                    <button className={`"block w-full p-2 mt-2 hover:bg-gray-400 "  ${activeIndex === 33 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('dichvutk',33)}>Dịch vụ</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quản lý nhân viên */}
                    {(user?.roles === 'superadmin' || user?.roles === 'admin') && (
                        <div>
                            <button onClick={() => handleToggle('employees')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                <People />
                                <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý nhân viên</span>
                            </button>
                            {open.employees && (
                                <div className="ml-6 border-b-4 p-4">
                                    <button className={`"block w-full p-2  hover:bg-gray-400 hover:rounded-md"  ${activeIndex === 4 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('themNV',4)}>Thêm nhân viên mới</button>
                                    <button className={`"block w-full p-2 mt-2 hover:bg-gray-400 hover:rounded-md"  ${activeIndex === 5 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('danhsachNV',5)}>Danh sách nhân viên</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quản lý khách hàng */}
                    {(user?.roles === 'superadmin' || user?.roles === 'admin') && (
                        <div>
                            <button onClick={() => handleToggle('customers')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                                <NaturePeople />
                                <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý khách hàng</span>
                            </button>
                            {open.customers && (
                                <div className="ml-6 border-b-4 p-4">
                                    <button className={`"block w-full p-2  hover:bg-gray-400 "  ${activeIndex === 6 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('themKH',6)}>Thêm khách hàng mới</button>
                                    <button className={`"block w-full p-2 mt-2 hover:bg-gray-400 "  ${activeIndex === 7 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`} onClick={() => handleNavigation('danhsachKH',7)}>Danh sách khách hàng</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quản lý dịch vụ */}
                    <div>
                        <button onClick={() => handleToggle('services')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                            <Spa />
                            <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý dịch vụ</span>
                        </button>
                        {open.services && (
                            <div className="ml-6 border-b-4 p-4">
                                <button className={`"block w-full p-2  hover:bg-gray-400 "  ${activeIndex === 88 ? "bg-blue-500 text-white rounded-l-full" : "rounded-l-full"}`}>Danh sách dịch vụ</button>
                            </div>
                        )}
                    </div>

                    {/* Quản lý lịch hẹn */}
                    <div>
                        <button onClick={() => handleToggle('appointments')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                            <PendingActions />
                            <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Quản lý lịch hẹn</span>
                        </button>
                        {open.appointments && (
                            <div className="ml-6 border-b-4 p-4">
                                <button className="block w-full p-2  hover:bg-gray-400 ">Đặt lịch hẹn</button>
                            </div>
                        )}
                    </div>

                    {/* Lịch sử */}
                    <div>
                        <button onClick={() => handleToggle('history')} className="flex items-center w-full p-4 border-b-2 hover:bg-gray-400 hover:rounded-md">
                            <History />
                            <span className={`ml-3 ${drawerOpen ? 'block' : 'hidden'}`}>Lịch sử</span>
                        </button>
                        {open.history && (
                            <div className="ml-6 border-b-4 p-4">
                                <button className="block w-full p-2  hover:bg-gray-400 " onClick={() => handleNavigation('lsdv',20)}>Dịch vụ đã sử dụng</button>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>

            {/* Main Content */}
            <div className="w-screen max-w-fit-content">
                <Details currentPage={currentPage} />
            </div>
        </div>
    );
};

export default MenuDrawer;
