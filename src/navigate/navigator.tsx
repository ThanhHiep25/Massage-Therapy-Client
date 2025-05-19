import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "../page/auth/Register";
import GetUser from "../page/auth/GetUser";
import LoginForm from "../page/auth/LoginForm";
import Home from "../page/home-TrangChinh/Home";
import SettingsDetail from "../page/setting/SettingsDetail";
import ProfileDetail from "../page/auth/ProfileDetail";
import ForgotPassword from "../page/auth/ForgotPassword";
import NotFound from "../components/notFound/pageNotFound";
import TermsAndConditionsPage from "../page/termsAndConditionsPage/TermsAndConditionsPage";
import PaymentSuccess from "../page/Payment/PaymentSuccess";
import Chatbot from "../components/google/Chatbot";
import GooglePaySuccess from "../page/Payment/GooglePaySuccess";




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
        <Route path="/policy" element={<TermsAndConditionsPage/>}/>
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/google-pay-success" element={<GooglePaySuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default NavigatorBrowser;
