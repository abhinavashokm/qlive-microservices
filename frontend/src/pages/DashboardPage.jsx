import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

export default function DashboardPage({ token, setToken }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setToken(null);
          navigate('/login');
        }
      } catch (err) {
        setToken(null);
        navigate('/login');
      }
    };

    fetchUser();
  }, [token, navigate, setToken]);

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Log Out
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Welcome, {user.full_name}!</h2>
          <p className="text-gray-700">Your username is: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{user.username}</span></p>
          <p className="mt-4 text-gray-600">You have successfully authenticated with the minimal auth system.</p>
        </div>
      </div>
    </div>
  );
}
