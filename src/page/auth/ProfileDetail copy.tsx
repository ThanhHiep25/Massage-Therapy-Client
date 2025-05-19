import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { Edit, FileCopy, Share, Save, Cancel } from "@mui/icons-material";
import { Backdrop, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Button, Snackbar } from "@mui/material";
import { Mail, MapPinHouse, Phone } from "lucide-react";

const actions = [
  { icon: <FileCopy />, name: 'Copy' },
  { icon: <Edit />, name: 'Edit' },
  { icon: <Share />, name: 'Share' },
];

const ProfileDetail: React.FC = () => {
  const { login, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(user);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setUserData(user);
  };

  const handleSave = () => {
    if (userData) {
      login(userData);
    }
    setEditMode(false);
    localStorage.setItem("user", JSON.stringify(userData));
    setSnackbar({ open: true, message: 'Đã lưu thông tin!' });
  };

  const handleCopy = () => {
    const textToCopy = `${userData?.name}\n: ${userData?.email}\n: ${userData?.phone}\n: ${userData?.address}\n: ${userData?.description}`;
    navigator.clipboard.writeText(textToCopy);
    setSnackbar({ open: true, message: 'Đã sao chép thông tin!' });
  };

  const handleShare = () => {
    try {
      const dataToShare = {
        idUser: userData?.id || '',
        imageUrl: userData?.imageUrl || '',
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        address: userData?.address || '',
        description: userData?.description || '',
      };

      // Chuyển đổi dữ liệu Unicode sang Base64 an toàn
      const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(dataToShare))));

      const shareLink = `${window.location.origin}/profile?data=${encodedData}`;

      navigator.clipboard.writeText(shareLink).then(() => {
        setSnackbar({ open: true, message: '✅ Đã sao chép link chia sẻ!' });
      }).catch((err) => {
        console.error('❌ Lỗi khi sao chép link:', err);
        setSnackbar({ open: true, message: '❌ Không thể sao chép link!' });
      });

    } catch (error) {
      console.error('❌ Lỗi khi tạo link chia sẻ:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không xác định';
      setSnackbar({ open: true, message: `❌ Lỗi: ${errorMessage}` });
    }
  };



  useEffect(() => {
    const encodedData = params.get('data');

    if (encodedData) {
      try {
        // Giải mã Base64 và xử lý Unicode
        const decodedData = JSON.parse(decodeURIComponent(escape(atob(encodedData))));
        setUserData(decodedData);
      } catch (error) {
        console.error('❌ Lỗi khi giải mã dữ liệu:', error);
        setSnackbar({ open: true, message: '❌ Link chia sẻ không hợp lệ!' });
      }
    }
  }, [params]);



  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        login(JSON.parse(storedUser));
      }
    }
  }, [user, login]);

  return (
    <div className="flex flex-col items-center justify-center p-9 h-screen w-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">

      <div className="sm:w-[50vw] w-[500px] max-w-full h-screen relative bg-white backdrop-blur-lg shadow-lg p-6 rounded-2xl" >
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #e5e7eb',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: '1.2',
          width: '100%',
          maxWidth: '400px'
        }}>Thông tin cá nhân</h2>

        <div className="mt-2">
          <div className="sm:w-[100%] flex flex-col items-center mt-8">
            <img src={userData?.imageUrl || params?.get('imageUrl')} alt="Avatar"
              className="sm:h-40 sm:w-40 w-[100px] h-[100px] rounded-full object-cover border-yellow-200" />
            <p className="px-6 py-1 bg-amber-300 bg- w-[100px] flex items-center justify-center rounded-full shadow-lg mt-1 ">{userData?.description} {params?.get('description')}</p>
          </div>

          {editMode ? (
            <div className="bg-white/60 backdrop-blur-lg  p-4 mt-2 rounded-2xl" >
              <TextField label="Tên" name="name" value={userData?.name} fullWidth margin="normal" variant="outlined" />
              <TextField label="Email" name="email" value={userData?.email}  fullWidth margin="normal" variant="outlined" />
              <TextField label="Số điện thoại" name="phone" value={userData?.phone}  fullWidth margin="normal" variant="outlined" />
              <TextField label="Địa chỉ" name="address" value={userData?.address}  fullWidth margin="normal" variant="outlined" />
              <TextField label="Loại khách hàng " name="description" value={userData?.description} fullWidth margin="normal" variant="outlined" multiline rows={2} />
              <div className="flex justify-between mt-4">
                <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave}>Lưu</Button>
                <Button variant="text" color="error" startIcon={<Cancel />} onClick={handleCancel}>Hủy</Button>
              </div>
            </div>
          ) : (
            <div className="sm:flex sm:flex-col  mt-10 w-full sm:items-center sm:gap-y-9 gap-y-3 bg-white/20 shadow-xl rounded-2xl p-6">
              <p className="mt-3 sm:text-3xl text-lg">{userData?.name} {params?.get('name')}</p>
              <p className="mt-3 flex items-center gap-6 sm:text-xl tex-lg"><Mail /> {userData?.email} {params?.get('email')}</p>
              <p className="mt-3 flex items-center gap-6 sm:text-xl text-lg"><Phone /> {userData?.phone} {params?.get('phone')}</p>
              <p className="mt-3 flex items-center gap-6 sm:text-xl text-lg"><MapPinHouse /> {userData?.address} {params?.get('address')}</p>
            </div>
          )}
        </div>



        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", height: 100, width: "100%" }}>
          <Backdrop open={open} />
          <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            sx={{ position: 'absolute', bottom: 10, right: 16 }}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={() => {
                  if (action.name === 'Edit') handleEdit();
                  if (action.name === 'Copy') handleCopy();
                  if (action.name === 'Share') handleShare();
                  handleClose();
                }}
              />
            ))}
          </SpeedDial>
        </Box>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />
    </div>
  );
};

export default ProfileDetail;
