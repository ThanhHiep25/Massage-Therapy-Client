
import { Add, Delete, Edit, Save, Search } from '@mui/icons-material';
import { Avatar, Badge, Box, InputAdornment, styled, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';


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


const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'Hình ảnh',
    width: 150,
    renderCell: (params) => (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar alt={params.row.name}
          src={params.row.imageUrl} />
      </StyledBadge>
    ),
  },
  {
    field: 'name',
    headerName: 'Tên nhân viên',
    width: 150,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 150,
    editable: true,
  },
  {
    field: 'phone',
    headerName: 'Số điện thoại',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
  },
  {
    field: 'chucvu',
    headerName: 'Chức vụ',
    width: 150,
    editable: true,
  },
  {
    field: 'createdAt',
    headerName: 'Ngày tạo',
    width: 180,
    editable: false,
    valueFormatter: (params) => {
      return format(new Date(params), 'dd/MM/yyyy HH:mm:ss');
    }
  },
  {
    field: 'status',
    headerName: 'Trạng thái',
    width: 150,
    editable: true,
  }
];

const rows = [
  {
    id: 1, address: "HCM",
    createdAt: "2025-01-21T23:59:30.370998",
    description: "Quản lý phòng IT kiêm giám đốc gg",
    email: "ocmd56@gmail.com",
    imageUrl: "https://res.cloudinary.com/dokp7ig0u/image/upload/v1737478765/spa/Avatar2_9_bomvea.png",
    name: "Toán cao cấp",
    phone: "0987654321",
    roles: "superadmin",
    username: "admin"
  },
  {
    id: 2, address: "HCM",
    createdAt: "2025-01-21T23:59:30.370998",
    description: "Quản lý phòng IT kiêm giám đốc gg",
    email: "ocmd56@gmail.com",
    imageUrl: "https://res.cloudinary.com/dokp7ig0u/image/upload/v1737478765/spa/Avatar2_9_bomvea.png",
    name: "Toán cao cấp",
    phone: "0987654321",
    roles: "superadmin",
    username: "admin"
  },
  {
    id: 3, address: "HCM",
    createdAt: "2025-01-21T23:59:30.370998",
    description: "Quản lý phòng IT kiêm giám đốc gg",
    email: "ocmd56@gmail.com",
    imageUrl: "https://res.cloudinary.com/dokp7ig0u/image/upload/v1737478765/spa/Avatar2_9_bomvea.png",
    name: "Toán cao cấp",
    phone: "0987654321",
    roles: "superadmin",
    username: "admin"
  }
];

const DanhSachNV: React.FC = () => {


  return (
    <div className="flex flex-col items-center justify-center">
    <div className="">
      <h2 className="font-bold text-3xl">Danh sách nhân viên</h2>     
    </div>
    <div className="flex w-full mb-3 mt-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"><Add/> Thêm</button>
      <button className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-md"><Delete/> Xóa</button>
      <button className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"><Edit/> Sửa</button>
      <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"><Save/> Lưu</button>
      <button className="ml-2 bg-red-400 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-md">Đóng</button>
    </div>
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <Box sx={{ minWidth: 300 }}>
          <TextField
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </div>
    </div>
      <Box sx={{ height: 550, width: '99%', maxWidth: '78vw', paddingBottom: '50px' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          editMode="cell"
          onRowClick={(params) => console.log('Row clicked:', params.row)}
          disableRowSelectionOnClick
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </Box>
    </div>


  );
}

export default DanhSachNV;