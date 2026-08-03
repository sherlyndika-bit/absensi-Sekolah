import React, { useState } from 'react';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import SmartKiosk from './components/SmartKiosk';
import StudentMobileApp from './components/StudentMobileApp';
import FaceEnrollment from './components/FaceEnrollment';
import SickLeaveModule from './components/SickLeaveModule';
import StudentManagement from './components/StudentManagement';
import LandingPage from './components/LandingPage';
import { store } from './firebase/services';
import { School, Github, Database } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('absensi_user_session');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      store.setSchoolId(parsed.schoolId);
      return parsed;
    }
    return null;
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
    store.setSchoolId(userData.schoolId);
    
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
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {user.role === 'admin' && (
        <div className="fade-in">
          {activeTab === 'admin' && <AdminDashboard />}
          {activeTab === 'students' && <StudentManagement />}
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
