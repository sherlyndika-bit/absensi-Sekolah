import React, { useState } from 'react';
import { ScanFace, MapPin, Building2, ChevronRight, ShieldCheck, Zap, Users, CheckCircle2, Play, Lock, Globe, Smartphone, Mail, Phone, Map, Check, ArrowRight } from 'lucide-react';
import SchoolRegistration from './SchoolRegistration';
import Login from './Login';

export default function LandingPage({ onLogin }) {
  const [activeView, setActiveView] = useState('landing'); // 'landing', 'register', 'login', 'about', 'privacy', 'terms', 'contact'

  if (activeView === 'register') {
    return <SchoolRegistration onBack={() => setActiveView('landing')} onLogin={onLogin} />;
  }

  if (activeView === 'login') {
    return <Login onLogin={onLogin} onBack={() => setActiveView('landing')} />;
  }

  // Handle smooth scroll for landing page hash links
  const handleNavClick = (view, hash = '') => {
    setActiveView(view);
    if (hash && view === 'landing') {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200">
      
      {/* Navbar Premium */}
      <nav className="w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-2 text-blue-950 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => handleNavClick('landing')}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-xl shadow-md">
            <ScanFace className="w-6 h-6 text-white" />
          </div>
          <span>Absen<span className="text-blue-600">Pro</span></span>
        </div>
        
        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
          <button onClick={() => handleNavClick('landing', 'features')} className="hover:text-blue-600 transition-colors">Fitur Unggulan</button>
          <button onClick={() => handleNavClick('landing', 'how-it-works')} className="hover:text-blue-600 transition-colors">Cara Kerja</button>
          <button onClick={() => handleNavClick('landing', 'pricing')} className="hover:text-blue-600 transition-colors">Harga</button>
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

      {/* Main Content Area */}
      <div className="flex-1">
        {activeView === 'landing' && <LandingContent setActiveView={setActiveView} />}
        {activeView === 'about' && <AboutView />}
        {activeView === 'privacy' && <PrivacyView />}
        {activeView === 'terms' && <TermsView />}
        {activeView === 'contact' && <ContactView />}
      </div>
      
      {/* Footer Premium */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2 text-blue-950 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => handleNavClick('landing')}>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-xl">
                  <ScanFace className="w-6 h-6 text-white" />
                </div>
                <span>Absen<span className="text-blue-600">Pro</span></span>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Platform SaaS terkemuka untuk manajemen kehadiran sekolah berbasis AI, Biometrik, dan Geofencing.
              </p>
              <div className="flex gap-4">
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
                <li><button onClick={() => handleNavClick('landing', 'how-it-works')} className="hover:text-blue-600 transition-colors">Cara Kerja</button></li>
                <li><button onClick={() => handleNavClick('landing', 'pricing')} className="hover:text-blue-600 transition-colors">Daftar Harga</button></li>
                <li><button onClick={() => handleNavClick('landing', 'features')} className="hover:text-blue-600 transition-colors">Fitur Keamanan</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 tracking-wide uppercase text-sm">Perusahaan</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><button onClick={() => handleNavClick('about')} className="hover:text-blue-600 transition-colors">Tentang Kami</button></li>
                <li><button onClick={() => handleNavClick('contact')} className="hover:text-blue-600 transition-colors">Hubungi Kami</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 tracking-wide uppercase text-sm">Bantuan & Legal</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><button onClick={() => handleNavClick('privacy')} className="hover:text-blue-600 transition-colors">Kebijakan Privasi</button></li>
                <li><button onClick={() => handleNavClick('terms')} className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
            <p>&copy; {new Date().getFullYear()} AbsenPro Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex gap-6">
              <button onClick={() => handleNavClick('privacy')} className="hover:text-slate-600 transition-colors">Kebijakan Privasi</button>
              <button onClick={() => handleNavClick('terms')} className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------
// LANDING PAGE CONTENT (Hero, Features, How It Works, Pricing)
// ---------------------------------------------------------
function LandingContent({ setActiveView }) {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
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
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <ScanFace className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Liveness Face ID</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Sistem memetakan ratusan titik wajah siswa secara 3D dan mendeteksi kedipan mata asli. Mencegah manipulasi menggunakan foto cetak atau topeng.</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Geofencing Akurat</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Batas radius sekolah ditentukan melalui satelit GPS. Fitur Anti-Fake GPS memastikan siswa benar-benar berada di area sekolah sebelum mengabsen.</p>
            </div>
            
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

      {/* How It Works */}
      <div id="how-it-works" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Cara Kerja Sistem</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">3 Langkah mudah mengimplementasikan kedisiplinan tingkat tinggi di sekolah Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 -translate-y-1/2 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center text-2xl font-black text-blue-600 shadow-lg">1</div>
              <h4 className="text-xl font-bold text-slate-900">Daftarkan Sekolah</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Buat akun sekolah, atur radius GPS absensi sekolah Anda, dan impor data siswa ke dalam sistem Dasbor Admin.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center text-2xl font-black text-indigo-600 shadow-lg">2</div>
              <h4 className="text-xl font-bold text-slate-900">Pendaftaran Wajah</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Siswa memindai wajah mereka melalui kamera perangkat untuk menyimpan data biometrik dasar ke server.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-purple-500 flex items-center justify-center text-2xl font-black text-purple-600 shadow-lg">3</div>
              <h4 className="text-xl font-bold text-slate-900">Absensi Harian Mandiri</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Siswa tiba di sekolah, membuka aplikasi, wajah dipindai untuk uji Liveness (kedipan), dan notifikasi terkirim otomatis.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Daftar Harga</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Pilih paket yang sesuai dengan kapasitas dan kebutuhan operasional sekolah Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Paket Basic</h3>
              <p className="text-slate-500 text-sm mb-6">Cocok untuk sekolah kecil</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-900">Rp 250k</span>
                <span className="text-slate-500 font-medium">/bulan</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Maksimal 200 Siswa</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Absensi GPS Geofencing</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Dasbor Admin Sekolah</li>
              </ul>
              <button onClick={() => setActiveView('register')} className="w-full py-3 rounded-xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-colors">
                Pilih Basic
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-900 p-8 rounded-3xl border border-blue-800 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">Paling Disarankan</div>
              <h3 className="text-xl font-bold text-white mb-2">Paket Pro</h3>
              <p className="text-blue-200 text-sm mb-6">Untuk sekolah standar dan modern</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">Rp 750k</span>
                <span className="text-blue-300 font-medium">/bulan</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-blue-50 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0"/> Maksimal 1.000 Siswa</li>
                <li className="flex items-center gap-3 text-sm text-blue-50 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0"/> Face ID + Liveness Detection</li>
                <li className="flex items-center gap-3 text-sm text-blue-50 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0"/> Notifikasi WhatsApp Orang Tua</li>
                <li className="flex items-center gap-3 text-sm text-blue-50 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0"/> Fitur Surat Izin / Sakit Online</li>
              </ul>
              <button onClick={() => setActiveView('register')} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold hover:shadow-lg transition-all">
                Mulai Uji Coba Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">Kapasitas besar dan dedikasi</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-900">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Kuota Siswa Tidak Terbatas</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Akses Smart Kiosk Tablet</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Database Instansi Dedicated</li>
              </ul>
              <button onClick={() => setActiveView('contact')} className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                Hubungi Sales
              </button>
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
              onClick={() => setActiveView('contact')}
              className="px-8 py-4 bg-blue-900/50 text-white border border-blue-800 text-base font-extrabold rounded-2xl hover:bg-blue-800 transition-all active:scale-95"
            >
              Hubungi Tim Sales
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------
// STATIC PAGES
// ---------------------------------------------------------
function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-slate-900 mb-6">Tentang AbsenPro</h1>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <p className="text-lg mb-4">AbsenPro adalah platform manajemen kehadiran (SaaS) yang didedikasikan untuk mentransformasi sistem kedisiplinan sekolah di Indonesia.</p>
        <p className="mb-4">Berawal dari visi untuk meniadakan kecurangan seperti penitipan absen atau pemalsuan lokasi, kami merancang sistem berbasis AI (Pengenalan Wajah & Liveness Detection) dan Geofencing berlapis.</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Visi Kami</h3>
        <p>Menjadi pilar teknologi pendukung kedisiplinan dan transparansi pendidikan di seluruh instansi pendidikan modern.</p>
      </div>
    </div>
  );
}

function ContactView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-slate-900 mb-6">Hubungi Kami</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6 text-slate-600">
          <p className="text-lg">Tim kami siap membantu Anda mengimplementasikan AbsenPro di institusi Anda.</p>
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-blue-600"/> <span>+62 811-2233-4455</span></div>
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-blue-600"/> <span>sales@absenpro.id</span></div>
            <div className="flex items-start gap-3"><Map className="w-5 h-5 text-blue-600 mt-1"/> <span>Sudirman Central Business District (SCBD)<br/>Jakarta 12190</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input type="text" className="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Budi Santoso" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Sekolah</label>
              <input type="text" className="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="SMA Negeri 1" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Pesan</label>
              <textarea rows="4" className="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Halo, saya ingin menanyakan paket Enterprise..."></textarea>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">Kirim Pesan</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PrivacyView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-slate-900 mb-6">Kebijakan Privasi</h1>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <p className="text-sm text-slate-400 mb-8">Pembaruan Terakhir: 1 Agustus 2026</p>
        <p>Di AbsenPro, kami sangat menjaga keamanan dan privasi data biometrik (wajah) pengguna kami.</p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">1. Pengumpulan Data Biometrik</h3>
        <p>Data wajah (Face Descriptors) yang kami kumpulkan merupakan array angka matematis, bukan file foto asli yang disimpan mentah. Data ini disandikan dan diamankan dalam database instansi masing-masing (Isolasi Multi-Tenant).</p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">2. Penggunaan Data Lokasi</h3>
        <p>Sistem kami hanya mengakses koordinat GPS Anda pada saat Anda menekan tombol "Rekam Kehadiran". Kami tidak melacak lokasi Anda secara terus-menerus di latar belakang.</p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">3. Keamanan Tingkat Lanjut</h3>
        <p>Sistem ini beroperasi di bawah infrastruktur cloud yang tangguh dengan perlindungan *Row Level Security (RLS)*, memastikan bahwa data satu sekolah tidak akan pernah bisa diakses oleh sekolah lain.</p>
      </div>
    </div>
  );
}

function TermsView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-slate-900 mb-6">Syarat & Ketentuan</h1>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <p className="text-sm text-slate-400 mb-8">Pembaruan Terakhir: 1 Agustus 2026</p>
        <p>Dengan mendaftar dan menggunakan layanan AbsenPro, Anda menyetujui seluruh ketentuan berikut:</p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">1. Penggunaan Layanan</h3>
        <p>Layanan ini ditujukan bagi instansi pendidikan yang sah. Akun yang digunakan untuk percobaan tanpa instansi riil dapat kami hapus jika masa percobaan habis.</p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">2. Tanggung Jawab Pengguna</h3>
        <p>Admin sekolah bertanggung jawab penuh terhadap data siswa yang dimasukkan ke dalam sistem, serta memiliki kewajiban untuk memberi tahu pihak orang tua/wali atas perekaman data biometrik tersebut.</p>
        <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">3. Pembayaran & Tagihan</h3>
        <p>Siklus penagihan berlangganan bersifat prabayar. Keterlambatan pembayaran selama 14 hari akan mengakibatkan penangguhan layanan dasbor untuk instansi tersebut.</p>
      </div>
    </div>
  );
}
