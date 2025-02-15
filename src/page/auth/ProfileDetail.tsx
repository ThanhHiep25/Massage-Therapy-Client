import { useEffect, useState } from "react";
import { useAuth } from "../../hook/AuthContext";
import { Edit, FileCopy, Share, Save, Cancel } from "@mui/icons-material";
import { Backdrop, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Button, Snackbar } from "@mui/material";

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

  const params = new URLSearchParams(window.location.search);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setUserData(user);
  };

  const handleSave = () => {
    login(userData);
    setEditMode(false);
    localStorage.setItem("user", JSON.stringify(userData));
    setSnackbar({ open: true, message: 'Đã lưu thông tin!' });
  };

  const handleCopy = () => {
    const textToCopy = `Tên: ${userData?.name}\nEmail: ${userData?.email}\nSĐT: ${userData?.phone}\nĐịa chỉ: ${userData?.address}\nMô tả: ${userData?.description}`;
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
      setSnackbar({ open: true, message: `❌ Lỗi: ${error.message}` });
    }
  };
  
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
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
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-9" style={{
      borderRadius: '10px',
      height: '100%',
      maxHeight:"100%",
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    }}>

      <div className="w-full max-w-md" style={{ borderRadius: '10px', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', position: "relative" }}>
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

        <img src={userData?.imageUrl || params?.get('imageUrl')} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: "20px", objectFit:'cover'}} />

        {editMode ? (
          <div className="bg-white p-2 mt-2 rounded-2xl" >
            <TextField label="Tên" name="name" value={userData?.name} onChange={handleChange} fullWidth margin="normal" variant="outlined" />
            <TextField label="Email" name="email" value={userData?.email} onChange={handleChange} fullWidth margin="normal" variant="outlined" />
            <TextField label="Số điện thoại" name="phone" value={userData?.phone} onChange={handleChange} fullWidth margin="normal" variant="outlined" />
            <TextField label="Địa chỉ" name="address" value={userData?.address} onChange={handleChange} fullWidth margin="normal" variant="outlined" />
            <TextField label="Mô tả" name="description" value={userData?.description} onChange={handleChange} fullWidth margin="normal" variant="outlined" multiline rows={3} />
            <div className="flex justify-between mt-4">
              <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave}>Lưu</Button>
              <Button variant="text" color="error" startIcon={<Cancel />} onClick={handleCancel}>Hủy</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-3">{userData?.name} {params?.get('name')}</p>
            <p className="mt-3">Email: {userData?.email} {params?.get('email')}</p>
            <p className="mt-3">Số điện thoại: {userData?.phone} {params?.get('phone')}</p>
            <p className="mt-3">Địa chỉ: {userData?.address} {params?.get('address')}</p>
            <p className="mt-3">Mô tả: {userData?.description} {params?.get('description')}</p>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", height: 120, width: "100%" }}>
          <Backdrop open={open} />
          <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
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
