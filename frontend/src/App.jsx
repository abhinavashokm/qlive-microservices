import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import CreateSessionPage from './pages/CreateSessionPage'
import JoinPage from './pages/JoinPage'

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
        <Route path="/dashboard" element={<DashboardPage token={token} setToken={setToken} />} />
        
        <Route path="/sessions/new" element={
          <ProtectedRoute token={token}>
            <CreateSessionPage token={token} />
          </ProtectedRoute>
        } />
        
        <Route path="/join" element={<JoinPage token={token} />} />
        <Route path="/join/:inviteCode" element={<JoinPage token={token} />} />
        
        {/* Placeholder for live session room */}
        <Route path="/session/:inviteCode" element={
          <ProtectedRoute token={token}>
            <div className="p-8 text-center text-xl mt-20">Live Session Room Placeholder</div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
