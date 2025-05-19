import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { revenueMonthly, totalAmountPayment, totalPayment } from '../../service/apiPayment'; // Import các API
import { revenueOrderMonthly, totalOrderAmountPayment, totalOrderPayment } from '../../service/apiPaymentOrder';
import { FaLeaf } from 'react-icons/fa';

interface MonthlyRevenue {
  month: number;
  year: number;
  totalRevenue: string;
}

const ThongKeTC: React.FC = () => {
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenue[]>([]);
  const [totalRevenueAmount, setTotalRevenueAmount] = useState<string>('');
  const [totalPaymentCount, setTotalPaymentCount] = useState<number>(0);
  const [monthlyRevenueOrderData, setMonthlyRevenueOrderData] = useState<MonthlyRevenue[]>([]);
  const [totalRevenueOrderAmount, setTotalRevenueOrderAmount] = useState<string>('');
  const [totalPaymentOrderCount, setTotalPaymentOrderCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true); 
      try {
        // Lấy dữ liệu thống kê thanh toán Dịch vụ
        const revenueData = await revenueMonthly();
        setMonthlyRevenueData(revenueData);

        const totalAmount = await totalAmountPayment();
        setTotalRevenueAmount(totalAmount);

        const paymentCount = await totalPayment();
        setTotalPaymentCount(paymentCount);

        // Lấy dữ liệu thống kê thanh toán Đơn hàng
        const revenueOrderData = await revenueOrderMonthly();
        setMonthlyRevenueOrderData(revenueOrderData);

        const totalAmountOrder = await totalOrderAmountPayment();
        setTotalRevenueOrderAmount(totalAmountOrder);

        const paymentOrderCount = await totalOrderPayment();
        setTotalPaymentOrderCount(paymentOrderCount);


      } catch (error: unknown) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
  
  };
  // Chuẩn bị dữ liệu cho biểu đồ doanh thu dịch vụ (Bar Chart)
  const barChartData = monthlyRevenueData.map((item) => ({
    month: `Tháng ${item.month}`,
    revenue: parseFloat(item.totalRevenue.replace(/,/g, '')), // Loại bỏ dấu phẩy và chuyển thành số
  }));

  // Chuẩn bị dữ liệu cho biểu đồ doanh thu đơn hàng (Bar Chart)
  const barChartDataOrder = monthlyRevenueOrderData.map((item) => ({
    month: `Tháng ${item.month}`,
    revenue: parseFloat(item.totalRevenue.replace(/,/g, '')), // Loại bỏ dấu phẩy và chuyển thành số
  }));

  // Chuẩn bị dữ liệu cho biểu đồ lợi nhuận (Line Chart) - Giả sử lợi nhuận bằng doanh thu
  const lineChartData = barChartData.map((item) => ({
    ...item,
    profit: item.revenue,
  }));

  // Chuẩn bị dữ liệu cho biểu đồ lợi nhuận đơn hàng (Line Chart) - Giả sử lợi nhuận bằng doanh thu
  const lineChartDataOrder = barChartDataOrder.map((item) => ({
    ...item,
    profit: item.revenue,
  }));


  if (loading) {
    return <div className="flex flex-col items-center justify-center h-[70vh] gap-y-4">
      <div className="relative h-[100px] w-[100px]">
        <div className="animate-spin rounded-full h-[90px] w-[90px] border-t-2 border-l-2 border-teal-400 absolute"></div>
        <div className="animate-spin rounded-full h-[80px] w-[80px] border-t-2 border-r-2 border-purple-400 absolute top-1 left-1"></div>
        <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-green-400 absolute top-2 left-2"></div>
        <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-blue-400 absolute top-2 left-2"></div>
        <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-red-400 absolute top-2 left-2"></div>
      </div>
      <div className="flex items-center">
        <FaLeaf className="animate-bounce text-green-400 text-xl mr-2" />
        <span className="text-gray-600 text-sm">Đang thư giãn và tải dữ liệu...</span>
      </div>
    </div>;
  }

  // if (error) {
  //   return <div>Lỗi: {error}</div>;
  // }

  return (
    <div className="flex flex-col sm:p-4 gap-6 pb-16">
      {/* Thông tin tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className='hover:bg-blue-50'>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tổng số thanh toán dịch vụ
            </Typography>
            <Typography variant="h5">{totalPaymentCount.toLocaleString()}</Typography>
          </CardContent>
        </Card>
        <Card className='hover:bg-blue-50'>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tổng doanh thu dịch vụ
            </Typography>
            <Typography variant="h5">{totalRevenueAmount} VND</Typography>
          </CardContent>
        </Card>
      </div>

      {/* Thông tin tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className='hover:bg-blue-50'>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tổng số thanh toán đơn hàng
            </Typography>
            <Typography variant="h5">{totalPaymentOrderCount.toLocaleString()}</Typography>
          </CardContent>
        </Card>
        <Card className='hover:bg-blue-50'>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tổng doanh thu đơn hàng
            </Typography>
            <Typography variant="h5">{totalRevenueOrderAmount} VND</Typography>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Biểu đồ doanh thu dịch vụ theo tháng */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Biểu đồ doanh thu dịch vụ theo tháng
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => value.toLocaleString()} /> {/* Định dạng số */}
              <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)} /> {/* Định dạng tiền tệ */}
              <Legend />
              <Bar dataKey="revenue" fill="#E9A8F2" name="Doanh thu dịch vụ (VNĐ)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 1: Biểu đồ doanh thu đơn hàng theo tháng */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Biểu đồ doanh thu đơn hàng theo tháng
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartDataOrder}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => value.toLocaleString()} /> {/* Định dạng số */}
              <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)} /> {/* Định dạng tiền tệ */}
              <Legend />
              <Bar dataKey="revenue" fill="#DC84F3" name="Doanh thu đơn hàng (VNĐ)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="flex sm:flex-row flex-col items-center gap-2">
        {/* Row 2: Biểu đồ lợi nhuận theo thời gian (hiện tại đang hiển thị doanh thu) */}
        <Card className="w-full">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Biểu đồ doanh thu dịch vụ theo thời gian
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => value.toLocaleString()} /> {/* Định dạng số */}
                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)} /> {/* Định dạng tiền tệ */}
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff7300" name="Doanh thu (VNĐ)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Row 2: Biểu đồ lợi nhuận theo thời gian (hiện tại đang hiển thị doanh thu) */}
        <Card className="w-full">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Biểu đồ doanh thu đơn hàng theo thời gian
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartDataOrder}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => value.toLocaleString()} /> {/* Định dạng số */}
                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)} /> {/* Định dạng tiền tệ */}
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff7300" name="Doanh thu (VNĐ)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      <div className="flex sm:flex-row flex-col items-center gap-2">
        {/* Row 3: Bảng chi tiết doanh thu theo tháng */}
        <Card className="w-full">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bảng chi tiết doanh thu dịch vụ theo tháng
            </Typography>
            <Box className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tháng</TableCell>
                    <TableCell>Doanh thu (VNĐ)</TableCell>
                    <TableCell>Tỉ lệ doanh thu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyRevenueData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{`Tháng ${row.month}/${row.year}`}</TableCell>
                      <TableCell>{row.totalRevenue}</TableCell>
                      <TableCell>{(Number(row.totalRevenue.replace(/[^0-9.-]+/g, '')) / Number(totalRevenueAmount.replace(/[^0-9.-]+/g, '')) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
        {/* Row 3: Bảng chi tiết doanh thu theo tháng */}
        <Card className="w-full">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bảng chi tiết doanh thu đơn hàng theo tháng
            </Typography>
            <Box className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tháng</TableCell>
                    <TableCell>Doanh thu (VNĐ)</TableCell>
                    <TableCell>Tỉ lệ doanh thu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyRevenueOrderData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{`Tháng ${row.month}/${row.year}`}</TableCell>
                      <TableCell>{row.totalRevenue}</TableCell>
                      <TableCell>{(Number(row.totalRevenue.replace(/[^0-9.-]+/g, '')) / Number(totalRevenueOrderAmount.replace(/[^0-9.-]+/g, '')) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThongKeTC;