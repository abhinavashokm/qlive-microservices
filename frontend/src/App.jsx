import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import JoinSessionPage from './pages/JoinSessionPage';
import SessionRoomPage from './pages/SessionRoomPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        
        <Route path="/join" element={<ProtectedRoute><JoinSessionPage /></ProtectedRoute>} />
        <Route path="/join/:inviteCode" element={<ProtectedRoute><JoinSessionPage /></ProtectedRoute>} />
        <Route path="/session/:inviteCode" element={<ProtectedRoute><SessionRoomPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
