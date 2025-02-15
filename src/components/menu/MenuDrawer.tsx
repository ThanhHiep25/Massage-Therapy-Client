import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse, ListItemButton, IconButton, ListItemIcon, Box, Typography } from '@mui/material';
import { Dashboard, ExpandLess, ExpandMore, History, Menu, NaturePeople, PendingActions, People, Spa, SpaOutlined } from '@mui/icons-material';
import { useAuth } from '../../hook/AuthContext';
import Details from '../home/Details';
import Footer from '../footer/Footer';

const MenuDrawer: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<string>(() => {
        return localStorage.getItem('currentPage') || 'home';
      });
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [open, setOpen] = React.useState<{ [key: string]: boolean }>({
        dashboard: false,
        employees: false,
        customers: false,
        services: false,
        appointments: false,
        history: false,
    });

    const { user } = useAuth(); // Lấy role từ context (superadmin, admin, customer)
    const handleToggle = (menu: string) => {
        setOpen((prevState) => ({ ...prevState, [menu]: !prevState[menu] }));
    };

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);
    const handleNavigation = (page: string) => {
        setCurrentPage(page);
        localStorage.setItem('currentPage', page);
      }

    return (
        <> <Drawer variant="permanent" anchor="left" sx={{
            width: drawerOpen ? 280 : 90,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerOpen ? 280 : 90,
                transition: 'width 0.3s',   
                overflowX: 'hidden',
                bgcolor: 'background.default',
            },
        }} open={drawerOpen}>
            <div className="flex flex-shrink-0 items-center justify-between px-4 py-2 h-24 bg-gray-800 text-white">
                <SpaOutlined />
                <h1 className={`text-2xl  font-bold ${drawerOpen ? 'block' : 'hidden'}`}>SPA Royal</h1>
                <IconButton onClick={toggleDrawer} color="inherit">
                    <Menu />
                </IconButton>
            </div>
            <List sx={{ width: 280 }}>
                {/* Dashboard */}
                {(user?.roles === 'superadmin' || user?.roles === 'admin') && (
                    <ListItem>
                        <ListItemButton onClick={() => handleToggle('dashboard')}>
                            <ListItemIcon>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                            {open.dashboard ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                )}
                <Collapse in={open.dashboard} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('hsnv')}>
                            <Typography >Hiệu suất nhân viên</Typography>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('tktc')}>
                            <Typography>Tài chính</Typography>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('dichvutk')}>
                            <Typography>Dịch vụ</Typography>
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Quản lý nhân viên */}
                {(user?.roles === 'superadmin' || user?.roles === 'admin') && (
                    <ListItem>
                        <ListItemButton onClick={() => handleToggle('employees')}>
                            <ListItemIcon>
                                <People />
                            </ListItemIcon>
                            <ListItemText primary="Quản lý nhân viên" />
                            {open.employees ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                )}
                <Collapse in={open.employees} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('themNV')}>
                            <Typography>Thêm nhân viên mới</Typography>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('danhsachNV')}>
                            <Typography>Danh sách nhân viên</Typography>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                            <Typography>Phân công lịch làm việc</Typography>
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Quản lý khách hàng */}
                {(user?.roles === 'superadmin' || user?.roles === 'admin') && (
                    <ListItem>
                        <ListItemButton onClick={() => handleToggle('customers')}>
                            <ListItemIcon>
                                <NaturePeople />
                            </ListItemIcon>
                            <ListItemText primary="Quản lý khách hàng" />
                            {open.customers ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                )}
                <Collapse in={open.customers} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <Typography>Thêm khách hàng mới</Typography>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('danhsachKH')}>
                            <Typography>Danh sách khách hàng</Typography>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                            <Typography>Phân loại khách hàng</Typography>
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Quản lý dịch vụ */}
                <ListItem>
                    <ListItemButton onClick={() => handleToggle('services')}>
                        <ListItemIcon>
                            <Spa />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý dịch vụ" />
                        {open.services ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.services} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {(user?.roles === 'superadmin' || user?.roles === 'admin') && (
                            <ListItemButton sx={{ pl: 4 }}>
                                <Typography>Thêm dịch vụ mới</Typography>
                            </ListItemButton>
                        )}
                        <ListItemButton sx={{ pl: 4 }}>
                            <Typography>Danh sách dịch vụ</Typography>
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Quản lý lịch hẹn */}
                <ListItem>
                    <ListItemButton onClick={() => handleToggle('appointments')}>
                        <ListItemIcon>
                            <PendingActions />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý lịch hẹn" />
                        {open.appointments ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.appointments} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} >
                            <Typography>Đặt lịch hẹn</Typography>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                            <Typography>Danh sách lịch hẹn</Typography>
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Lịch sử */}
                <ListItem>
                    <ListItemButton onClick={() => handleToggle('history')}>
                        <ListItemIcon>
                            <History />
                        </ListItemIcon>
                        <ListItemText primary="Lịch sử" />
                        {open.history ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.history} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('lsdv')}>
                            <Typography>Dịch vụ đã sử dụng</Typography>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('lskh')}>
                            <Typography>Lịch sử khách hàng</Typography>
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
            <Box sx={{ bottom: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Footer />
            </Box>    
        </Drawer>
            <Box sx={{width:"100%" , height:"100vh"}}>
                <Details currentPage={currentPage}/>
            </Box>
        </>

    );
};

export default MenuDrawer;
