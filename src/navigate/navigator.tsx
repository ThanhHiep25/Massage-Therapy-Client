import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "../page/auth/Register";
import GetUser from "../page/auth/GetUser";
import LoginForm from "../page/auth/LoginForm";
import Home from "../page/home-TrangChinh/Home";
import SettingsDetail from "../page/setting/SettingsDetail";
import ProfileDetail from "../page/auth/ProfileDetail";
import ForgotPassword from "../page/auth/ForgotPassword";
import Chatbot from "../components/google/Chatbot";



const NavigatorBrowser: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/getuserid" element={<GetUser />} />
        <Route path="/profile" element={<ProfileDetail />} />
        <Route path="/settings" element= {<SettingsDetail />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default NavigatorBrowser;
