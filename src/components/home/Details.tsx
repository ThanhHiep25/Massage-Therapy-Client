
import AppoinmentList from "../../page/appointment-LichHen/Danh_sach_lich_hen";
import BookingPage from "../../page/appointment-LichHen/DatLichhen";
import PageDetail from "../../page/auth/PageDetails";
import CustomersList from "../../page/customer-KhachHang/Danh_sach_KH";
import AddCustomerForm from "../../page/customer-KhachHang/Them_khach_hang";
import DichVuTK from "../../page/dashboard-ThongKe/Dich_Vu_TK";
import HieuSuatNV from "../../page/dashboard-ThongKe/Hieu_suat_NV";
import ThongKeTC from "../../page/dashboard-ThongKe/Thong_Ke_TC";
import ServicePaymentHistory from "../../page/history/LS_ServiceSpa";
import OrderAdd from "../../page/order-DonHang/OrderAdd";
import OrderList from "../../page/order-DonHang/OrderList";
import ProductAdd from "../../page/products-SanPham/ProductAdd";
import ProductList from "../../page/products-SanPham/ProductList";
import ServiceList from "../../page/serviceSpa/Danh_sach_DV";
import AddService from "../../page/serviceSpa/Them_dich_vu";
import EmployeeList from "../../page/staff-Nhanvien/Danh_sach_NV";
import AssignmentStaff from "../../page/staff-Nhanvien/Phan_Cong_NV";
import StaffAccounts from "../../page/staff-Nhanvien/StaffAccounts";
import ThemMoiNV from "../../page/staff-Nhanvien/Them_nhan_vien";
import OrderPaymentHistory from "../../page/history/LS_Order";


interface DetailsProps {
    currentPage: string;
}

const Details: React.FC<DetailsProps> = ({ currentPage }) => {
    return (
        <div className="overflow-y-auto p-4 pb-10 bg-gray-200 dark:bg-gray-800  text-gray-900 dark:text-white" style={{ height: 'calc(100vh - 64px)' }}>
            
            {/* Render chi tiết trang tùy thuộc vào currentPage */}
            
            {currentPage === 'home' && <PageDetail />}
            {currentPage === 'hsnv' && <HieuSuatNV />}
            {currentPage === 'tktc' && <ThongKeTC />}
            {currentPage === 'dichvutk' && <DichVuTK />}

            {/* Nhan vien */}
            {currentPage === 'themNV' && <ThemMoiNV/>}
            {currentPage === 'danhsachNV' && <EmployeeList/>}
            {currentPage === 'danhsachTaiKhoanNV' && <StaffAccounts/>}
            {currentPage === 'phancongNV' && <AssignmentStaff/>}

            {/* Khach hang */}
            {currentPage === 'themKH' && <AddCustomerForm />}
            {currentPage === "danhsachKH" && <CustomersList/>}

            {/* Dịch vụ */}
            {currentPage === 'themSPA' && <AddService />}
            {currentPage === 'dichvuSPA' && <ServiceList />}

            {/* Lịch hẹn */}
            {currentPage === 'themLH' && <BookingPage />}
            {currentPage === 'danhsachLH' && <AppoinmentList/>}

            {/* Sản phẩm */}
            {currentPage === 'themSP' && <ProductAdd />}
            {currentPage === 'danhsachSP' && <ProductList />}

            {/* Đơn hàng */}
            {currentPage === 'themDH' && <OrderAdd />}
            {currentPage === 'danhsachDH' && <OrderList />}

            {/* Lịch sử */}
            {currentPage === 'lsdv' && <ServicePaymentHistory />}
            {currentPage === "lsdh" && <OrderPaymentHistory/>}
        </div>
    );
}

export default Details;