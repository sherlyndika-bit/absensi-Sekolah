import React, { useState } from 'react';
import { ScanFace, MapPin, Building2, ChevronRight, ShieldCheck, Zap, Users, CheckCircle2, Play, Lock, Globe, Smartphone, Mail, Phone, Map } from 'lucide-react';
import SchoolRegistration from './SchoolRegistration';
import Login from './Login';

export default function LandingPage({ onLogin }) {
  const [activeView, setActiveView] = useState('landing'); // 'landing', 'register', 'login'

  if (activeView === 'register') {
    return <SchoolRegistration onBack={() => setActiveView('landing')} onLogin={onLogin} />;
  }

  if (activeView === 'login') {
    return <Login onLogin={onLogin} onBack={() => setActiveView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200">
      
      {/* Navbar Premium */}
      <nav className="w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-2 text-blue-950 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => setActiveView('landing')}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-xl shadow-md">
            <ScanFace className="w-6 h-6 text-white" />
          </div>
          <span>Absen<span className="text-blue-600">Pro</span></span>
        </div>
        
        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Fitur Unggulan</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Cara Kerja</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Harga</a>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('login')}
            className="hidden md:block px-5 py-2.5 text-slate-700 hover:text-blue-600 text-sm font-bold transition-all"
          >
            Masuk
          </button>
          <button 
            onClick={() => setActiveView('register')}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2"
          >
            Coba Gratis
            <ChevronRight className="w-4 h-4 hidden sm:block" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32 text-center space-y-10">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/50 text-blue-700 text-xs sm:text-sm font-bold shadow-sm animate-fade-in-up">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Sistem SaaS Multi-Tenant Enterprise Edition
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl">
              Revolusi Kehadiran dengan <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Kecerdasan Buatan
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              AbsenPro mengamankan sistem kehadiran sekolah Anda melalui verifikasi biometrik tingkat tinggi dan validasi geolokasi anti-palsu. Bebas kecurangan, 100% akurat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => setActiveView('register')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Daftarkan Sekolah Anda Sekarang
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveView('login')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 text-base font-bold rounded-2xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 text-slate-400" />
              Lihat Demo Dasbor
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-16 flex flex-col items-center gap-4 opacity-70">
            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Dipercaya oleh institusi pendidikan modern</p>
            <div className="flex gap-8 md:gap-16 items-center justify-center grayscale">
              <div className="flex items-center gap-2 font-black text-xl text-slate-400"><Globe className="w-6 h-6"/> EduGlobal</div>
              <div className="flex items-center gap-2 font-black text-xl text-slate-400"><ShieldCheck className="w-6 h-6"/> SecureSchool</div>
              <div className="flex items-center gap-2 font-black text-xl text-slate-400"><Users className="w-6 h-6"/> BinaBangsa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div id="features" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Teknologi Tanpa Kompromi</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Kami merancang setiap fitur untuk memberikan keamanan maksimal dan kemudahan tanpa batas bagi pihak sekolah maupun siswa.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <ScanFace className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Liveness Face ID</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Sistem memetakan ratusan titik wajah siswa secara 3D dan mendeteksi kedipan mata asli. Mencegah manipulasi menggunakan foto cetak atau topeng.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Geofencing Akurat</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Batas radius sekolah ditentukan melalui satelit GPS. Fitur Anti-Fake GPS memastikan siswa benar-benar berada di area sekolah sebelum mengabsen.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-fuchsia-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Multi-Tenant Terisolasi</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Privasi data terjamin dengan arsitektur SaaS mandiri. Setiap instansi memiliki ruang lingkup database terenkripsi yang tidak akan pernah bocor ke publik.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Siap Melangkah ke Masa Depan?</h2>
          <p className="text-blue-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Bergabunglah dengan ratusan sekolah unggulan lainnya yang telah mendigitalisasi kedisiplinan dan keamanan siswa mereka.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setActiveView('register')}
              className="px-8 py-4 bg-white text-blue-950 text-base font-extrabold rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95"
            >
              Mulai Uji Coba Gratis
            </button>
            <button 
              className="px-8 py-4 bg-blue-900/50 text-white border border-blue-800 text-base font-extrabold rounded-2xl hover:bg-blue-800 transition-all active:scale-95"
            >
              Hubungi Tim Sales
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Premium */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2 text-blue-950 font-black text-2xl tracking-tighter">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-xl">
                  <ScanFace className="w-6 h-6 text-white" />
                </div>
                <span>Absen<span className="text-blue-600">Pro</span></span>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Platform SaaS terkemuka untuk manajemen kehadiran sekolah berbasis AI, Biometrik, dan Geofencing.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 tracking-wide uppercase text-sm">Produk</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Smart Kiosk</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Aplikasi Mobile Siswa</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Dasbor Manajemen</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Integrasi WhatsApp</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Keamanan Data</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 tracking-wide uppercase text-sm">Perusahaan</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Kisah Sukses</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog & Artikel</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Hubungi Kami</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 tracking-wide uppercase text-sm">Hubungi Kami</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> +62 811-2233-4455</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> sales@absenpro.id</li>
                <li className="flex items-start gap-2"><Map className="w-4 h-4 text-slate-400 mt-1" /> Sudirman Central Business District (SCBD), Jakarta 12190</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
            <p>&copy; {new Date().getFullYear()} AbsenPro Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Status Layanan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
