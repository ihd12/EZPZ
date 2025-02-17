import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import EZPackingLayout from "./components/EZPackingLayout";
import MyPage from "./api/checklistApi"
// import MyPage from "./components/checklist/ChecklistPage";
import "./App.css";
import "./components/notice/Notice.css";
import Notice from "./pages/Notice";
import ProhibitedItems from "./components/prohibited-items/ProhibitedItems";
import CategoryItemPage from "./components/checklist/CategoryItemPage";

import AirportParkingPage from "./pages/AirportParkingPage";
import 'swiper/css';  // 기본 스타일
import 'swiper/css/navigation';  // 네비게이션 스타일 (필요한 경우)
import 'swiper/css/pagination';  // 페이지네이션 스타일 (필요한 경우)
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<EZPackingLayout />} />
            <Route path="/prohibited" element={<ProhibitedItems />} />
            <Route path="/board" element={<Notice />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/checklist/:checklistId" element={<CategoryItemPage />} />
            <Route path="/parking" element={<AirportParkingPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;