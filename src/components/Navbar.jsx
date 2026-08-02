import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, Tablet, LayoutDashboard, UserCheck, FileText, Database, Clock } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [serverTime, setServerTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'mobile', label: 'Absen Mobile (HP)', icon: Smartphone, badge: 'Siswa' },
    { id: 'kiosk', label: 'Smart Kiosk Gate', icon: Tablet, badge: 'Hardware' },
    { id: 'admin', label: 'Admin Dashboard', icon: LayoutDashboard, badge: 'Realtime' },
    { id: 'enrollment', label: 'Pendaftaran Wajah', icon: UserCheck, badge: 'Quality Check' },
    { id: 'sick_leave', label: 'Izin Sakit & Cuti', icon: FileText, badge: 'Dokumen' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800 px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white tracking-tight">E-ABSENSI SISWA</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase / Cloud DB Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Face Recognition & Geofencing Anti-Spoofing</p>
          </div>
        </div>

        {/* Server Timestamp Clock (Time-Sync Server) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Server Time: {serverTime.toLocaleTimeString('id-ID')} WIB</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
