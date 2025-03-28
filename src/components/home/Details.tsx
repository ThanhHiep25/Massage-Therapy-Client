
import PageDetail from "../../page/auth/PageDetails";
import CustomersList from "../../page/customer-KhachHang/Danh_sach_KH";
import AddCustomerForm from "../../page/customer-KhachHang/Them_khach_hang";
import DichVuTK from "../../page/dashboard-ThongKe/Dich_Vu_TK";
import HieuSuatNV from "../../page/dashboard-ThongKe/Hieu_suat_NV";
import ThongKeTC from "../../page/dashboard-ThongKe/Thong_Ke_TC";
import LichSuDichVu from "../../page/history/LS_Dichvu";
import LichSuKhachHang from "../../page/history/LS_Khachhang";
import EmployeeList from "../../page/staff-Nhanvien/Danh_sach_NV";
import ThemMoiNV from "../../page/staff-Nhanvien/Them_nhan_vien";


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

            {/* Khach hang */}
            {currentPage === 'themKH' && <AddCustomerForm />}
            {currentPage === "danhsachKH" && <CustomersList/>}

            {/* Lịch hẹn */}
            

            {/* Lịch sử */}
            {currentPage === 'lsdv' && <LichSuDichVu />}
            {currentPage === "lskh" && <LichSuKhachHang/>}
        </div>
    );
}

export default Details;