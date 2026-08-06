import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import SmartKiosk from './components/SmartKiosk';
import StudentMobileApp from './components/StudentMobileApp';
import FaceEnrollment from './components/FaceEnrollment';
import SickLeaveModule from './components/SickLeaveModule';
import StudentManagement from './components/StudentManagement';
import LandingPage from './components/LandingPage';
import Login from './components/Login';

// SaaS Modules
import SuperAdminOverview from './components/SuperAdminOverview';
import SuperAdminTenants from './components/SuperAdminTenants';
import SuperAdminSupport from './components/SuperAdminSupport';
import SuperAdminBilling from './components/SuperAdminBilling';
import SuperAdminBroadcasts from './components/SuperAdminBroadcasts';
import SuperAdminAnalytics from './components/SuperAdminAnalytics';
import SuperAdminSecurity from './components/SuperAdminSecurity';
import SuperAdminActivity from './components/SuperAdminActivity';
import SuperAdminHealth from './components/SuperAdminHealth';
import SuperAdminIntegrations from './components/SuperAdminIntegrations';
import SuperAdminAPI from './components/SuperAdminAPI';
import SuperAdminSettings from './components/SuperAdminSettings';

import { store } from './firebase/services';
import supabase from './supabase/config';

export default function App() {
  const [tenantSlug, setTenantSlug] = useState(null);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [isLoadingTenant, setIsLoadingTenant] = useState(true);
  const [tenantNotFound, setTenantNotFound] = useState(false);
  const [isSuperAdminRoute, setIsSuperAdminRoute] = useState(false);

  const saasRoles = ['superadmin', 'owner', 'manager', 'devops', 'finance', 'support'];

  useEffect(() => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(Boolean);
    
    let slug = null;
    
    if (parts.length > 0 && parts[0] === 'superadmin') {
       setIsSuperAdminRoute(true);
       setIsLoadingTenant(false);
       return;
    } else if (parts.length > 0 && parts[0] !== 'daftar' && parts[0] !== 'pricing') {
       slug = parts[0];
    }

    if (slug) {
      setTenantSlug(slug);
      supabase.from('schools').select('*').eq('slug', slug).single()
        .then(({ data, error }) => {
          if (data && !error) {
            setTenantInfo(data);
          } else {
            setTenantNotFound(true);
          }
          setIsLoadingTenant(false);
        });
    } else {
      setIsLoadingTenant(false);
    }
  }, []);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('absensi_user_session');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.schoolId) {
        store.setSchoolId(parsed.schoolId);
      }
      return parsed;
    }
    return null;
  });
  
  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = localStorage.getItem('absensi_user_session');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (saasRoles.includes(parsed.role)) return 'saas_overview';
      return parsed.role === 'admin' ? 'admin' : 'mobile';
    }
    return 'admin';
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('absensi_user_session', JSON.stringify(userData));
    
    if (userData.schoolId) {
      store.setSchoolId(userData.schoolId);
    }
    
    if (saasRoles.includes(userData.role)) {
      if (userData.role === 'support') setActiveTab('saas_tenants');
      else if (userData.role === 'devops') setActiveTab('saas_health');
      else setActiveTab('saas_overview');
    } else if (userData.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('mobile');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('absensi_user_session');
    window.location.reload();
  };

  // 1. Loading State
  if (isLoadingTenant) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-bold tracking-widest text-sm">MEMUAT...</p>
      </div>
    );
  }

  // 2. Super Admin Route
  if (isSuperAdminRoute) {
    if (!user) {
       return <Login onLogin={handleLogin} isSuperAdminLogin={true} />;
    }
    if (!saasRoles.includes(user.role)) {
       return <div className="p-8 text-center text-red-600 font-bold">Akses Ditolak. Anda bukan staf internal SaaS.</div>;
    }
    return (
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
        <div className="fade-in">
          {activeTab === 'saas_overview' && <SuperAdminOverview user={user} />}
          {activeTab === 'saas_tenants' && <SuperAdminTenants user={user} />}
          {activeTab === 'saas_support' && <SuperAdminSupport user={user} />}
          {activeTab === 'saas_billing' && <SuperAdminBilling user={user} />}
          {activeTab === 'saas_broadcasts' && <SuperAdminBroadcasts user={user} />}
          {activeTab === 'saas_analytics' && <SuperAdminAnalytics user={user} />}
          {activeTab === 'saas_security' && <SuperAdminSecurity user={user} />}
          {activeTab === 'saas_activity' && <SuperAdminActivity user={user} />}
          {activeTab === 'saas_health' && <SuperAdminHealth user={user} />}
          {activeTab === 'saas_integrations' && <SuperAdminIntegrations user={user} />}
          {activeTab === 'saas_api' && <SuperAdminAPI user={user} />}
          {activeTab === 'saas_settings' && <SuperAdminSettings user={user} />}
        </div>
      </Layout>
    );
  }

  // 3. Tenant Not Found Error
  if (tenantNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-black text-slate-800 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Sekolah Tidak Terdaftar</h2>
        <p className="text-slate-500 mb-8 max-w-md">
          Alamat URL sekolah <b>/{tenantSlug}</b> tidak terdaftar di sistem kami.
        </p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-xl font-bold"
        >
          Kembali ke Beranda Utama
        </button>
      </div>
    );
  }

  // 4. Root Domain (Landing Page)
  if (!tenantSlug) {
    return <LandingPage onLogin={() => {
      alert("Registrasi Berhasil! Silakan masukkan URL yang Anda buat tadi di address bar (Contoh: /sekolahku/portal).");
    }} />;
  }

  // 5. Tenant Portal (Subdomain logic)
  if (!user) {
    return <Login onLogin={handleLogin} schoolInfo={tenantInfo} />;
  }

  // Check Tenant Isolation (Prevent Admin from accessing other school's URL)
  if (user && user.role === 'admin' && user.schoolId !== tenantInfo.id) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 flex items-center justify-center rounded-full mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Akses Ditolak</h1>
        <p className="text-slate-600 mb-6">Akun Anda tidak terdaftar sebagai admin di sekolah <b>{tenantInfo.name}</b>.</p>
        <button onClick={handleLogout} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800">
          Keluar & Ganti Akun
        </button>
      </div>
    );
  }

  // Admin Dashboard (Standalone, no Layout wrapping)
  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  // Student Portal (Wrapped in Layout)
  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {user.role === 'student' && (
        <div className="fade-in">
          {activeTab === 'mobile' && <StudentMobileApp />}
          {activeTab === 'enrollment' && <FaceEnrollment />}
          {activeTab === 'sick' && <SickLeaveModule />}
        </div>
      )}
    </Layout>
  );
}
