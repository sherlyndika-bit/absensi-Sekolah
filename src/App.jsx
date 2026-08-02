import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import SmartKiosk from './components/SmartKiosk';
import StudentMobileApp from './components/StudentMobileApp';
import FaceEnrollment from './components/FaceEnrollment';
import SickLeaveModule from './components/SickLeaveModule';
import { School, Github, Database } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'mobile' && <StudentMobileApp />}
        {activeTab === 'kiosk' && <SmartKiosk />}
        {activeTab === 'enrollment' && <FaceEnrollment />}
        {activeTab === 'sick_leave' && <SickLeaveModule />}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <School className="w-4 h-4 text-blue-900" />
            <span>Sistem Presensi Siswa Modern — SMA Negeri 1 Jakarta</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-blue-900" /> Supabase Database (Free Tier)</span>
            <a 
              href="https://github.com/sherlyndika-bit/absensi-Sekolah.git" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-blue-900 font-medium transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
