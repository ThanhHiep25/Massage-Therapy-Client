import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const HieuSuatNV: React.FC = () => {
  // Dữ liệu mẫu
  const pieChartData = [
    { id: 0, value: 40, label: 'Nhân viên' },
    { id: 1, value: 30, label: 'Quản lý' },
    { id: 2, value: 30, label: 'Nhân viên chính' },
  ];

  const barChartData = [
    { name: 'Tháng 1', KPIs: 75, TienDo: 80 },
    { name: 'Tháng 2', KPIs: 85, TienDo: 90 },
    { name: 'Tháng 3', KPIs: 90, TienDo: 95 },
  ];

  const tableData = [
    { ten: 'Nguyễn Văn A', chucVu: 'Nhân viên', KPIs: '85%', tienDo: '90%' },
    { ten: 'Lê Thị B', chucVu: 'Quản lý', KPIs: '95%', tienDo: '100%' },
    { ten: 'Trần Văn C', chucVu: 'Nhân viên chính', KPIs: '80%', tienDo: '85%' },
  ];

  return (
    <div className="flex flex-col p-1 sm:p-4 gap-6 pb-12">
      {/* Row 1: Pie Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Phân bố vai trò nhân viên
          </Typography>
          <PieChart
            series={[
              {
                data: pieChartData,
                innerRadius: 30,
                outerRadius: 120,
                paddingAngle: 5,
                cornerRadius: 8,
                startAngle: -90,
                endAngle: 270,
                cx: 150,
                cy: 120,
              },
            ]}
            width={500}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Row 2: Bar Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Hiệu suất KPI theo tháng
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="KPIs" fill="#8884d8" name="KPI" />
              <Bar dataKey="TienDo" fill="#82ca9d" name="Tiến độ" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 3: Bảng chi tiết */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Chi tiết hiệu suất nhân viên
          </Typography>
          <Box className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên nhân viên</TableCell>
                  <TableCell>Chức vụ</TableCell>
                  <TableCell>KPI</TableCell>
                  <TableCell>Tiến độ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.ten}</TableCell>
                    <TableCell>{row.chucVu}</TableCell>
                    <TableCell>{row.KPIs}</TableCell>
                    <TableCell>{row.tienDo}</TableCell>
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

export default HieuSuatNV;
