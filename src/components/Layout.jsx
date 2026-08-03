import React, { useState, useEffect } from 'react';
import { 
  School, Smartphone, Tablet, LayoutDashboard, UserCheck, FileText, LogOut, Clock, 
  Menu, X, BarChart3, Building2, MessageSquare, CreditCard, Megaphone, 
  BrainCircuit, ShieldAlert, Activity, ServerCrash, Puzzle, Webhook, Settings, Users
} from 'lucide-react';

export default function Layout({ activeTab, setActiveTab, user, onLogout, children }) {
  const [serverTime, setServerTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saasRoles = ['owner', 'manager', 'devops', 'support', 'finance', 'superadmin'];
  const isSaasStaff = user && saasRoles.includes(user.role);

  const navItems = [
    // --- School Admin & Student Roles ---
    { id: 'admin', label: 'Dashboard Admin', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'students', label: 'Data Siswa', icon: Users, roles: ['admin'] },
    { id: 'mobile', label: 'Absen Siswa', icon: Smartphone, roles: ['student'] },
    { id: 'kiosk', label: 'Smart Kiosk', icon: Tablet, roles: ['admin'] },
    { id: 'enrollment', label: 'Daftar Wajah', icon: UserCheck, roles: ['admin'] },
    { id: 'sick_leave', label: 'Izin Sakit', icon: FileText, roles: ['student'] },
    
    // --- SaaS Command Center Roles (RBAC) ---
    // Business
    { id: 'saas_overview', label: 'Overview', icon: BarChart3, roles: ['superadmin', 'owner', 'manager', 'finance'], group: 'Business' },
    { id: 'saas_billing', label: 'Billing', icon: CreditCard, roles: ['superadmin', 'owner', 'manager', 'finance'], group: 'Business' },
    
    // Operations
    { id: 'saas_tenants', label: 'Tenants', icon: Building2, roles: ['superadmin', 'owner', 'manager', 'support'], group: 'Operations' },
    { id: 'saas_support', label: 'Support', icon: MessageSquare, roles: ['superadmin', 'owner', 'manager', 'support'], group: 'Operations' },
    { id: 'saas_broadcasts', label: 'Broadcasts', icon: Megaphone, roles: ['superadmin', 'owner', 'manager', 'support'], group: 'Operations' },
    
    // Analytics & Security
    { id: 'saas_analytics', label: 'AI Analytics', icon: BrainCircuit, roles: ['superadmin', 'owner', 'manager'], group: 'Intelligence' },
    { id: 'saas_security', label: 'Security', icon: ShieldAlert, roles: ['superadmin', 'owner', 'manager', 'devops'], group: 'Intelligence' },
    
    // System & IT
    { id: 'saas_activity', label: 'Activity Logs', icon: Activity, roles: ['superadmin', 'owner', 'manager', 'devops'], group: 'System' },
    { id: 'saas_health', label: 'System Health', icon: ServerCrash, roles: ['superadmin', 'owner', 'manager', 'devops'], group: 'System' },
    
    // Integrations & Dev
    { id: 'saas_integrations', label: 'Integrations', icon: Puzzle, roles: ['superadmin', 'owner', 'manager'], group: 'Developer' },
    { id: 'saas_api', label: 'Developer API', icon: Webhook, roles: ['superadmin', 'owner', 'manager', 'devops'], group: 'Developer' },
    
    // Config
    { id: 'saas_settings', label: 'Platform Settings', icon: Settings, roles: ['superadmin', 'owner', 'manager'], group: 'Config' },
  ];

  const visibleNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  // Grouping for SaaS
  const groups = isSaasStaff ? [...new Set(visibleNavItems.map(item => item.group))] : [];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false); // Close mobile menu on click
  };

  const renderNavLinks = () => {
    if (isSaasStaff) {
      return groups.map(group => (
        <div key={group} className="mb-4">
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{group}</span>
          {visibleNavItems.filter(item => item.group === group).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 mb-1 ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20 translate-x-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      ));
    } else {
      return (
        <>
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 mt-2">Menu Utama</span>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 mb-1 ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20 translate-x-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </>
      );
    }
  };

  const renderUserInfo = () => (
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Akun Aktif</span>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 truncate pr-2">{user?.name}</span>
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
          user?.role === 'owner' ? 'bg-purple-100 text-purple-800' :
          user?.role === 'manager' ? 'bg-indigo-100 text-indigo-800' :
          isSaasStaff ? 'bg-slate-800 text-white' :
          user?.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
          'bg-emerald-100 text-emerald-800'
        }`}>
          {user?.role}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      
      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 z-50 shrink-0 shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-blue-800 to-blue-900 text-white flex items-center justify-center font-bold shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 leading-tight">
              {isSaasStaff ? 'SaaS Command' : 'Absensi Modern'}
            </h1>
            <p className="text-[10px] text-slate-500">
              {isSaasStaff ? 'Enterprise Edition' : 'Sistem Presensi Terpadu'}
            </p>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          {renderUserInfo()}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          {renderNavLinks()}
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


      {/* ----------------- MOBILE DRAWER (For all users now) ----------------- */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 rounded-md bg-gradient-to-br from-blue-800 to-blue-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-xs text-slate-900">{isSaasStaff ? 'SaaS Command' : 'Absensi Modern'}</h1>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          {renderUserInfo()}
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {renderNavLinks()}
        </nav>

        <div className="p-4 border-t border-slate-200 bg-white">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-2 px-3 py-3 text-white bg-rose-600 rounded-xl transition-colors text-sm font-bold shadow-md shadow-rose-600/20"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>


      {/* ----------------- MOBILE HEADER ----------------- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50">
        
        <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 shrink-0 rounded-md bg-gradient-to-br from-blue-800 to-blue-900 text-white flex items-center justify-center font-bold">
                {isSaasStaff ? <Building2 className="w-3.5 h-3.5" /> : <School className="w-3.5 h-3.5" />}
              </div>
              <h1 className="font-bold text-sm text-slate-900">
                {isSaasStaff ? 'Command Center' : 'Absensi'}
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6 relative z-10 custom-scrollbar">
          {children}
          
          <footer className="mt-12 pt-6 border-t border-slate-200 text-[10px] text-slate-400 text-center space-y-2">
            <p>{isSaasStaff ? 'SaaS Enterprise Command Center' : 'SMA Negeri 1 Jakarta'} © {new Date().getFullYear()}</p>
          </footer>
        </main>

        {/* ----------------- MOBILE BOTTOM NAV (Only for non-SaaS users) ----------------- */}
        {!isSaasStaff && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-safe">
            <div className="flex items-center justify-around px-2 py-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
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
        )}

      </div>
    </div>
  );
}
