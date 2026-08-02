import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import SmartKiosk from './components/SmartKiosk';
import StudentMobileApp from './components/StudentMobileApp';
import FaceEnrollment from './components/FaceEnrollment';
import SickLeaveModule from './components/SickLeaveModule';
import { ShieldCheck, Github, Database, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-12">
        {activeTab === 'mobile' && <StudentMobileApp />}
        {activeTab === 'kiosk' && <SmartKiosk />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'enrollment' && <FaceEnrollment />}
        {activeTab === 'sick_leave' && <SickLeaveModule />}
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-300">Sistem Absensi Wajah & Geofencing (Firebase Powered)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-emerald-400" /> Cloud Firestore</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Real-time Liveness Engine</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Github className="w-4 h-4 text-slate-300" />
            <a href="https://github.com/sherlyndika-bit/absensi-Sekolah.git" target="_blank" rel="noreferrer" className="hover:text-emerald-400 underline transition-colors">
              github.com/sherlyndika-bit/absensi-Sekolah
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
