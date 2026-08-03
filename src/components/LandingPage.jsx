import React, { useState } from 'react';
import { School, MapPin, ScanFace, Building2, ChevronRight, ShieldCheck, Zap, Users } from 'lucide-react';
import SchoolRegistration from './SchoolRegistration';
import Login from './Login';

export default function LandingPage({ onLogin }) {
  const [activeView, setActiveView] = useState('landing'); // 'landing', 'register'

  if (activeView === 'register') {
    return <SchoolRegistration onBack={() => setActiveView('landing')} onLogin={onLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-blue-900 font-black text-xl tracking-tight">
          <ScanFace className="w-6 h-6 text-blue-600" />
          <span>Absen<span className="text-blue-600">Pro</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('register')}
            className="px-5 py-2.5 bg-blue-900 text-white text-sm font-bold rounded-xl shadow-md hover:bg-blue-800 transition-all active:scale-95"
          >
            Daftar Sekolah Baru
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-24 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-4">
            <Zap className="w-4 h-4 text-blue-500" /> V2.0 Sistem SaaS Telah Hadir!
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Absensi Biometrik Cerdas <br className="hidden md:block" /> untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sekolah Modern</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Tinggalkan cara lama. Kelola kehadiran siswa dengan teknologi pengenalan wajah tingkat tinggi dan validasi GPS otomatis. Khusus didesain untuk SMP, SMA, dan SMK.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => setActiveView('register')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Building2 className="w-5 h-5" />
            Daftarkan Sekolah Anda
            <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveView('login')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 text-base font-bold rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            Sudah Punya Akun? Masuk
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <ScanFace className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Face ID Anti-Tipu</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Sistem memetakan 128 titik tulang wajah siswa. Teman tidak akan bisa menitip absen dengan foto atau topeng.</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Terisolasi Sepenuhnya</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Keamanan tingkat tinggi. Setiap sekolah mendapatkan *subdomain* URL dan *database* mereka sendiri.</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dasbor Multi-Tenant</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Setiap sekolah memiliki ruang kerjanya sendiri yang terisolasi 100%. Data aman dan tidak akan bercampur antar sekolah.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-8 text-center text-slate-400 text-xs font-medium border-t border-slate-200 bg-white">
        &copy; 2026 AbsenPro SaaS Architecture. Powered by Supabase & Antigravity.
      </div>
    </div>
  );
}
