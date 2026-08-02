import React, { useState } from 'react';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import SmartKiosk from './components/SmartKiosk';
import StudentMobileApp from './components/StudentMobileApp';
import FaceEnrollment from './components/FaceEnrollment';
import SickLeaveModule from './components/SickLeaveModule';
import Login from './components/Login';
import { School, Github, Database } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('absensi_user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = localStorage.getItem('absensi_user_session');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.role === 'admin' ? 'admin' : 'mobile';
    }
    return 'admin';
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('absensi_user_session', JSON.stringify(userData));
    if (userData.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('mobile');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('absensi_user_session');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {user.role === 'admin' && (
        <div className="fade-in">
          {activeTab === 'admin' && <AdminDashboard />}
          {activeTab === 'kiosk' && <SmartKiosk />}
          {activeTab === 'enrollment' && <FaceEnrollment />}
        </div>
      )}
      
      {user.role === 'student' && (
        <div className="fade-in">
          {activeTab === 'mobile' && <StudentMobileApp loggedInStudent={user} />}
          {activeTab === 'sick_leave' && <SickLeaveModule loggedInStudent={user} />}
        </div>
      )}
    </Layout>
  );
}
