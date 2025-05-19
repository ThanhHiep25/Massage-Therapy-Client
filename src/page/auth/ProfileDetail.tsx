import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { FileCopy, Share, Save, Cancel } from "@mui/icons-material";
import { Backdrop, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Button, Snackbar } from "@mui/material";
import { ChevronLeft, Mail, MapPinHouse, Phone } from "lucide-react";
import { motion } from 'framer-motion'
import { useNavigate } from "react-router-dom";

const actions = [
  { icon: <FileCopy />, name: 'Copy' },
  { icon: <Share />, name: 'Share' },
];

const ProfileDetail: React.FC = () => {
  const { login, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(user);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
    <div className="relative flex flex-col items-center justify-center h-screen">
      <p className="absolute top-10 left-5 cursor-pointer w-10 h-10 rounded-full dark:bg-slate-600 bg-slate-200 hover:bg-slate-300/80 flex items-center justify-center" onClick={() => navigate(-1)} title="Quay lập">
        <ChevronLeft />
      </p>
      <div className="sm:w-[50vw] w-[500px] max-w-full relative bg-white dark:bg-slate-600 backdrop-blur-lg shadow-lg p-6 rounded-2xl" >
        <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>

        <div className="mt-2">
          <div className="sm:w-[100%] flex flex-col items-center sm:mt-8 mt-4">
            <img src={userData?.imageUrl || params?.get('imageUrl')} alt="Avatar"
              className="sm:h-40 sm:w-40 w-[80px] h-[80px] rounded-full object-cover border-yellow-200 outline-dotted outline-gray-400" />
          </div>

          {editMode ? (
            <div className="bg-white/60 backdrop-blur-lg  p-4 mt-2 rounded-2xl" >
              <TextField label="Tên" name="name" value={userData?.name} fullWidth margin="normal" variant="outlined" />
              <TextField label="Email" name="email" value={userData?.email} fullWidth margin="normal" variant="outlined" />
              <TextField label="Số điện thoại" name="phone" value={userData?.phone} fullWidth margin="normal" variant="outlined" />
              <TextField label="Địa chỉ" name="address" value={userData?.address} fullWidth margin="normal" variant="outlined" />
              <div className="flex justify-between mt-4">
                <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave}>Lưu</Button>
                <Button variant="text" color="error" startIcon={<Cancel />} onClick={handleCancel}>Hủy</Button>
              </div>
            </div>
          ) : (
            <div className="sm:flex sm:flex-col  sm:mt-10 mt-4 w-full  sm:gap-y-2 gap-y-3 bg-white/20 outline outline-gray-200 shadow-sm rounded-2xl p-6">
              <p className="mt-3 sm:text-[24px] text-lg">{userData?.name} {params?.get('name')}</p>
              <hr className="mt-1" />
              <p className="mt-3 flex items-center gap-6 sm:text-xl tex-lg"><Mail /> {userData?.email} {params?.get('email')}</p>
              <hr className="mt-1" />
              <p className="mt-3 flex items-center gap-6 sm:text-xl text-lg"><Phone /> {userData?.phone} {params?.get('phone')}</p>
              <hr className="mt-1" />
              <p className="mt-3 flex items-center gap-6 sm:text-xl text-lg"><MapPinHouse /> {userData?.address} {params?.get('address')}</p>
            </div>
          )}

          <div className="mt-6 p-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 mt-6 bg-gray-300/50 px-10 py-3 rounded-lg hover:bg-blue-300"
              onClick={() => navigate('/policy')}
            >
              Lưu ý và điều khoản chính sách
            </motion.button>
          </div>

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
