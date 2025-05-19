import { useState } from 'react';
import { getUserById } from '../../service/apiService';
import axios from 'axios';
import { logout } from '../../service/apiAuth';

const GetUser: React.FC = () => {
  const [userId, setUserId] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleFetch = async () => {
    try {
      const response = await getUserById(userId);

      if (response.code === 1000) {
        setUserInfo(response.result);
        setMessage('');
      } else {
        setMessage('Error: Failed to fetch user data.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Error: ${error.response?.data?.error || error.message}`);
      }

    }

    console.log(document.cookie); // In toàn bộ cookie
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.message === 'Logged out successfully') {
        setUserInfo(null); // Xóa thông tin người dùng
        setMessage('You have logged out successfully.');
      }
    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
        setMessage(`Error: ${error.response?.data?.error || error.message}`);
      }

    }
  };

  return (
    <div className="p-6 font-sans">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Get User Information</h2>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter User ID"
          onChange={(e) => setUserId(Number(e.target.value))}
          value={userId}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
        />
        <button
          onClick={handleFetch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Fetch User Info
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md ml-4 hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>

      {userInfo ? (
        <div className="mt-6 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">User Information</h3>
          <ul className="list-none p-0">
            <li>
              <img src={userInfo.imageUrl} alt="User Avatar" className="w-20 h-20 rounded-full" />
            </li>
            <li className="mb-2">
              <strong className="font-medium">Username:</strong> {userInfo.username}
            </li>
            <li className="mb-2">
              <strong className="font-medium">Email:</strong> {userInfo.email}
            </li>
            <li className="mb-2">
              <strong className="font-medium">Name:</strong> {userInfo.name}
            </li>
            <li className="mb-2">
              <strong className="font-medium">Phone:</strong> {userInfo.phone}
            </li>
            <li className="mb-2">
              <strong className="font-medium">Address:</strong> {userInfo.address}
            </li>
            <li className="mb-2">
              <strong className="font-medium">Created At:</strong> {new Date(userInfo.createdAt).toLocaleString()}
            </li>
            <li className="mb-2">
              <strong className="font-medium">Role:</strong> {userInfo.role}
            </li>
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No user data available.</p>
      )}

      {message && (
        <p className="mt-4 text-red-500 text-sm">{message}</p>
      )}
    </div>
  );
};

export default GetUser;
