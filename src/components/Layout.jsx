import React, { useState, useEffect } from 'react';
import { School, Smartphone, Tablet, LayoutDashboard, UserCheck, FileText, LogOut, Clock, Database, Github } from 'lucide-react';

export default function Layout({ activeTab, setActiveTab, user, onLogout, children }) {
  const [serverTime, setServerTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'admin', label: 'Dashboard Admin', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'mobile', label: 'Absen Siswa', icon: Smartphone, roles: ['student'] },
    { id: 'kiosk', label: 'Smart Kiosk', icon: Tablet, roles: ['admin'] },
    { id: 'enrollment', label: 'Daftar Wajah', icon: UserCheck, roles: ['admin'] },
    { id: 'sick_leave', label: 'Izin Sakit', icon: FileText, roles: ['student'] },
  ];

  const visibleNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      
      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 z-50 shrink-0 shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-blue-800 to-blue-900 text-white flex items-center justify-center font-bold shadow-md">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 leading-tight">Absensi Modern</h1>
            <p className="text-[10px] text-slate-500">Sistem Presensi Terpadu</p>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Akun Aktif</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate pr-2">{user?.name}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                user?.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 mt-2">Menu Utama</span>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20 translate-x-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-600 justify-center shadow-xs">
            <Clock className="w-3.5 h-3.5 text-blue-900" />
            <span>{serverTime.toLocaleTimeString('id-ID')} WIB</span>
          </div>
          <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-bold border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>


      {/* ----------------- MOBILE VIEW WRAPPER ----------------- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 shrink-0 rounded-md bg-gradient-to-br from-blue-800 to-blue-900 text-white flex items-center justify-center font-bold">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-xs text-slate-900">Absensi Modern</h1>
              <p className="text-[9px] text-emerald-600 font-medium">Sistem Presensi</p>
            </div>
          </div>
          <button onClick={onLogout} className="p-1.5 text-rose-600 bg-rose-50 rounded-md border border-rose-100 hover:bg-rose-100 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6 relative z-10 custom-scrollbar">
          {children}
          
          {/* Footer inside content area so it scrolls with it */}
          <footer className="mt-12 pt-6 border-t border-slate-200 text-[10px] text-slate-400 text-center space-y-2">
            <p>SMA Negeri 1 Jakarta © {new Date().getFullYear()}</p>
          </footer>
        </main>

        {/* ----------------- MOBILE BOTTOM NAV ----------------- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-safe">
          <div className="flex items-center justify-around px-2 py-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="flex flex-col items-center justify-center w-16 gap-1 relative"
                >
                  <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-900 translate-y-[-4px]' : 'text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] text-center leading-tight transition-all duration-300 ${isActive ? 'font-bold text-blue-900 translate-y-[-2px]' : 'font-medium text-slate-500'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

      </div>

    </div>
  );
}
