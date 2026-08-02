import React, { useState, useEffect } from 'react';
import { School, Smartphone, Tablet, LayoutDashboard, UserCheck, FileText, Clock, Menu, LogOut, User } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const [serverTime, setServerTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'admin', label: 'Dashboard Admin', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'mobile', label: 'Absen Siswa (HP)', icon: Smartphone, roles: ['admin', 'student'] },
    { id: 'kiosk', label: 'Smart Kiosk Gerbang', icon: Tablet, roles: ['admin'] },
    { id: 'enrollment', label: 'Pendaftaran Wajah', icon: UserCheck, roles: ['admin'] },
    { id: 'sick_leave', label: 'Izin Sakit & Cuti', icon: FileText, roles: ['admin', 'student'] },
  ];

  const visibleNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 md:h-16 md:py-0">
          
          {/* Logo & School Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold shadow-xs">
                <School className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-bold text-base text-slate-900 tracking-tight truncate">Sistem Absensi Siswa</h1>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md whitespace-nowrap">
                    Supabase Connected
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">SMA Negeri 1 Jakarta • Face Recognition & Geofencing</p>
              </div>
            </div>
            
            {/* Mobile Auth Status */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={onLogout} className="p-2 text-rose-600 bg-rose-50 rounded-lg border border-rose-200">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Clock */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Server: {serverTime.toLocaleTimeString('id-ID')} WIB</span>
            </div>

            {/* Auth Status Desktop */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900">{user?.name}</span>
                <span className="text-[10px] text-slate-500 uppercase">{user?.role}</span>
              </div>
              <button onClick={onLogout} title="Logout" className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links - Scrollable on Mobile */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide w-full md:w-auto">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-blue-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
}
