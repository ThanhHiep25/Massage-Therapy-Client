import React, { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box
} from '@mui/material';
import { getAppointmentByServiceSPA } from '../../service/apiAppoinment';
import { getCountServiceSPAByCategory } from '../../service/apiService';
import axios from 'axios';
import { totalAmountPayment } from '../../service/apiPayment';
import { FaLeaf } from 'react-icons/fa';

interface ServiceUsageData {
    [key: string]: {
        count: number;
        totalPrice: number;
    };
}

interface CategoryCountData {
    [key: string]: number;
}

const DichVuTK: React.FC = () => {
    const [serviceUsage, setServiceUsage] = useState<ServiceUsageData>({});
    const [categoryCounts, setCategoryCounts] = useState<CategoryCountData>({});
    const colors = ['#4CAF50', '#FF9800', '#03A9F4', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3'];
    const [totalRevenueAmount, setTotalRevenueAmount] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)

        try {
            fetchData();
            fetchServiceUsage();
            fetchCategoryCounts();
        } catch (error: unknown) {
            console.error('Lỗi tải dữ liệu:', error);
        } finally {
            setLoading(false)
        }



    }, []);

    const fetchServiceUsage = async () => {
        try {
            const response = await getAppointmentByServiceSPA();
            setServiceUsage(response);
        } catch (error: unknown) {
            console.error('Lỗi khi tải thống kê dịch vụ:', error);
        }
    };

    const fetchCategoryCounts = async () => {
        try {
            const response = await getCountServiceSPAByCategory();
            setCategoryCounts(response);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Lỗi khi tải thống kê danh mục:', error.response.data);
            } else if (error instanceof Error) {
                console.error('Lỗi khi tải thống kê danh mục:', error.message);
            } else {
                console.error('Lỗi không xác định khi tải thống kê danh mục:', error);
            }
        }
    };

    const fetchData = async () => {
        const totalAmount = await totalAmountPayment();
        setTotalRevenueAmount(totalAmount);
    };

    // Chuẩn bị dữ liệu cho biểu đồ tròn (phân bố dịch vụ)
    const pieChartData = Object.entries(serviceUsage).map(([name, data]) => ({
        name,
        value: data.count,
        revenue: data.totalPrice,
    }));

    // Chuẩn bị dữ liệu cho biểu đồ cột (số lượng theo danh mục)
    const barChartData = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value,
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

    return (
        <div className="flex flex-col sm:p-6 gap-8 mb-20">

            {/* Row 1: Biểu đồ phân bố dịch vụ */}
            <Card className="shadow-md" style={{ height: 500 }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        gutterBottom
                        className="text-gray-800 font-medium"
                    >
                        Phân bố dịch vụ theo lượt đặt lịch hẹn
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {pieChartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => value} labelFormatter={(value) => `Lượt đặt: ${value}`} />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Row 2: Biểu đồ số lượng dịch vụ theo danh mục */}
            <Card className="shadow-md">
                <CardContent>
                    <Typography
                        variant="h6"
                        gutterBottom
                        className="text-gray-800 font-medium"
                    >
                        Số lượng dịch vụ theo danh mục
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                            <Bar dataKey="value" fill="#4CAF50" name="Số lượng dịch vụ" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Row 3: Bảng chi tiết dịch vụ theo lượt đặt và doanh thu */}
            <Card className="shadow-md">
                <CardContent>
                    <Typography
                        variant="h6"
                        gutterBottom
                        className="text-gray-800 font-medium"
                    >
                        Chi tiết dịch vụ theo lượt đặt và doanh thu
                    </Typography>
                    <Box className="overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="font-bold text-gray-600">Tên dịch vụ</TableCell>
                                    <TableCell className="font-bold text-gray-600">Lượt đặt</TableCell>
                                    <TableCell className="font-bold text-gray-600">Doanh thu (VNĐ)</TableCell>
                                    <TableCell className="font-bold text-gray-600">Tỉ lệ doanh thu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(serviceUsage).map(([name, data], index) => (
                                    <TableRow key={index} className="hover:bg-gray-100">
                                        <TableCell>{name}</TableCell>
                                        <TableCell>{data.count}</TableCell>
                                        <TableCell>{data.totalPrice.toLocaleString()}</TableCell>
                                        <TableCell>{(Number(data.totalPrice) / Number(totalRevenueAmount.replace(/[^0-9.-]+/g, '')) * 100).toFixed(2)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default DichVuTK;