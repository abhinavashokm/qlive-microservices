import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import JoinSessionPage from './pages/JoinSessionPage'
import SessionRoomPage from './pages/SessionRoomPage'

function ProtectedRoute({ children, token }) {
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ returnTo: location.pathname }} />;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage token={token} />} />
        <Route path="/signup" element={<SignupPage setToken={setToken} />} />
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        
        <Route path="/home" element={
          <ProtectedRoute token={token}>
            <HomePage token={token} setToken={setToken} />
          </ProtectedRoute>
        } />
        
        <Route path="/join" element={
          <ProtectedRoute token={token}>
            <JoinSessionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/join/:inviteCode" element={
          <ProtectedRoute token={token}>
            <JoinSessionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/session/:inviteCode" element={
          <ProtectedRoute token={token}>
            <SessionRoomPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
