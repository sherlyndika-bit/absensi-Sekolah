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
import { store } from './firebase/services';
import supabase from './supabase/config';

export default function App() {
  const [tenantSlug, setTenantSlug] = useState(null);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [isLoadingTenant, setIsLoadingTenant] = useState(true);
  const [tenantNotFound, setTenantNotFound] = useState(false);

  useEffect(() => {
    // Kita ubah ke sistem URL Path: /sekolah/portal
    // Contoh pathname: /sman1toapaya/portal atau /sman1toapaya
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(Boolean); // Hapus empty string
    
    let slug = null;
    
    // Jika path-nya seperti /namasekolah atau /namasekolah/portal
    if (parts.length > 0 && parts[0] !== 'daftar' && parts[0] !== 'pricing') {
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

  // 1. Loading State
  if (isLoadingTenant) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-bold tracking-widest text-sm">MEMUAT RUANG KERJA...</p>
      </div>
    );
  }

  // 2. Tenant Not Found Error
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

  // 3. Root Domain (Landing Page)
  if (!tenantSlug) {
    return <LandingPage onLogin={() => {
      alert("Registrasi Berhasil! Silakan masukkan URL yang Anda buat tadi di address bar (Contoh: /sekolahku/portal).");
    }} />;
  }

  // 4. Tenant Portal (Subdomain logic)
  if (!user) {
    return <Login onLogin={handleLogin} schoolInfo={tenantInfo} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {user.role === 'admin' && (
        <div className="fade-in">
          {activeTab === 'admin' && <AdminDashboard />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'kiosk' && <SmartKiosk />}
        </div>
      )}
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
