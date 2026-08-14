import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import JoinSessionPage from './pages/JoinSessionPage';
import SessionRoomPage from './pages/SessionRoomPage';
import { ROUTES } from './constants';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} state={{ returnTo: location.pathname }} />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        
        <Route path="/join" element={<JoinSessionPage />} />
        <Route path="/join/:inviteCode" element={<JoinSessionPage />} />
        <Route path="/session/:inviteCode" element={<ProtectedRoute><SessionRoomPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
