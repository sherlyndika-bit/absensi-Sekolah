import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import SmartKiosk from './components/SmartKiosk';
import StudentMobileApp from './components/StudentMobileApp';
import FaceEnrollment from './components/FaceEnrollment';
import SickLeaveModule from './components/SickLeaveModule';
import Login from './components/Login';
import { School, Github, Database } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null); // null, {role: 'admin'}, or {role: 'student', ...}
  const [activeTab, setActiveTab] = useState('admin');

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('mobile');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'admin' && (
          <>
            {activeTab === 'admin' && <AdminDashboard />}
            {activeTab === 'kiosk' && <SmartKiosk />}
            {activeTab === 'enrollment' && <FaceEnrollment />}
          </>
        )}
        
        {user.role === 'student' && (
          <>
            {activeTab === 'mobile' && <StudentMobileApp loggedInStudent={user} />}
            {activeTab === 'sick_leave' && <SickLeaveModule loggedInStudent={user} />}
          </>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2 font-medium text-slate-700">
            <School className="w-4 h-4 text-blue-900 hidden md:block" />
            <span>Sistem Presensi Siswa Modern — SMA Negeri 1 Jakarta</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-blue-900" /> Supabase Database</span>
            <a 
              href="https://github.com/sherlyndika-bit/absensi-Sekolah.git" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-blue-900 font-medium transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub Repo
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
