import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "../page/auth/Register";
import GetUser from "../page/auth/GetUser";
import LoginForm from "../page/auth/LoginForm";
import Home from "../page/home-TrangChinh/Home";
import SettingsDetail from "../page/setting/SettingsDetail";
import ProfileDetail from "../page/auth/ProfileDetail";



const NavigatorBrowser: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/getuserid" element={<GetUser />} />
        <Route path="/profile" element={<ProfileDetail />} />
        <Route path="/settings" element= {<SettingsDetail />} />
      </Routes>
    </Router>
  );
};

export default NavigatorBrowser;
