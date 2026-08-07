import React, { useState, useEffect } from 'react';
import { ScanFace, MapPin, Building2, ChevronRight, ShieldCheck, Zap, Users, CheckCircle2, Play, Lock, Globe, Smartphone, Mail, Phone, Map, ChevronDown, Check, GraduationCap, BookOpen, Clock } from 'lucide-react';
import SchoolRegistration from './SchoolRegistration';
import Login from './Login';
import supabase from '../supabase/config';

export default function LandingPage({ onLogin }) {
  const [activeView, setActiveView] = useState('landing');
  const [landingConfig, setLandingConfig] = useState({
    phone: '+62 811-2233-4455',
    email: 'hello@absenpro.id',
    address: 'Gedung Pendidikan Modern Lt. 5\nJl. Merdeka Belajar No. 123, Jakarta Selatan 12190',
    about: 'AbsenPro hadir sebagai revolusi digital dalam sistem kedisiplinan instansi pendidikan di Indonesia. Kami berdedikasi membangun ekosistem yang aman, transparan, dan anti-kecurangan menggunakan teknologi biometrik tingkat tinggi.'
  });

  useEffect(() => {
    fetchLandingConfig();
  }, []);

  const fetchLandingConfig = async () => {
    try {
      const { data, error } = await supabase.from('global_settings').select('value').eq('key', 'landing_config').single();
      if (data && data.value) {
        const config = JSON.parse(data.value);
        setLandingConfig(prev => ({ ...prev, ...config }));
      }
    } catch (e) {
      console.error('Error fetching landing config', e);
    }
  };

  if (activeView === 'register') {
    return <SchoolRegistration onBack={() => setActiveView('landing')} onLogin={onLogin} />;
  }

  if (activeView === 'login') {
    return <Login onLogin={onLogin} onBack={() => setActiveView('landing')} />;
  }

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-200">
      
      {/* Navbar Premium - School Theme */}
      <nav className="w-full bg-white/90 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => handleNavClick('landing')}>
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-1.5 rounded-xl shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span>Absen<span className="text-amber-500">Sekolah</span></span>
        </div>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-600">
          <button onClick={() => handleNavClick('landing', 'features')} className="hover:text-amber-500 transition-colors">Fitur Keamanan</button>
          <button onClick={() => handleNavClick('landing', 'how-it-works')} className="hover:text-amber-500 transition-colors">Cara Kerja</button>
          <button onClick={() => handleNavClick('landing', 'pricing')} className="hover:text-amber-500 transition-colors">Harga</button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('login')}
            className="hidden md:block px-5 py-2.5 text-slate-700 hover:text-amber-500 text-sm font-bold transition-all"
          >
            Masuk
          </button>
          <button 
            onClick={() => setActiveView('register')}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2"
          >
            Daftar Sekolah
            <ChevronRight className="w-4 h-4 hidden sm:block" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeView === 'landing' && <LandingContent setActiveView={setActiveView} />}
        {activeView === 'about' && <AboutView config={landingConfig} />}
        {activeView === 'privacy' && <PrivacyView />}
        {activeView === 'terms' && <TermsView />}
        {activeView === 'contact' && <ContactView config={landingConfig} />}
      </div>
      
      {/* Footer Premium */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter cursor-pointer" onClick={() => handleNavClick('landing')}>
                <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-1.5 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span>Absen<span className="text-amber-500">Sekolah</span></span>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                {landingConfig.about.substring(0, 150)}...
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white cursor-pointer transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white cursor-pointer transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wide uppercase text-sm">Produk Edukasi</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><button onClick={() => handleNavClick('landing', 'how-it-works')} className="hover:text-amber-400 transition-colors">Cara Kerja Sistem</button></li>
                <li><button onClick={() => handleNavClick('landing', 'pricing')} className="hover:text-amber-400 transition-colors">Daftar Harga & Paket</button></li>
                <li><button onClick={() => handleNavClick('landing', 'features')} className="hover:text-amber-400 transition-colors">Fitur Keamanan AI</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wide uppercase text-sm">Perusahaan</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><button onClick={() => handleNavClick('about')} className="hover:text-amber-400 transition-colors">Tentang Kami</button></li>
                <li><button onClick={() => handleNavClick('contact')} className="hover:text-amber-400 transition-colors">Hubungi Sales Tim</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-white mb-4 tracking-wide uppercase text-sm">Bantuan & Legal</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><button onClick={() => handleNavClick('privacy')} className="hover:text-amber-400 transition-colors">Kebijakan Privasi Data</button></li>
                <li><button onClick={() => handleNavClick('terms')} className="hover:text-amber-400 transition-colors">Syarat & Ketentuan Layanan</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
            <p>&copy; {new Date().getFullYear()} AbsenSekolah Indonesia. Hak Cipta Dilindungi Undang-Undang Republik Indonesia.</p>
            <div className="flex gap-6">
              <button onClick={() => handleNavClick('privacy')} className="hover:text-slate-300 transition-colors">Privasi</button>
              <button onClick={() => handleNavClick('terms')} className="hover:text-slate-300 transition-colors">Ketentuan</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------
// LANDING PAGE CONTENT
// ---------------------------------------------------------
function LandingContent({ setActiveView }) {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white min-h-[90vh] flex flex-col justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 -left-40 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center space-y-10">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold shadow-sm animate-fade-in-up">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Sistem SaaS Modern Untuk Instansi Pendidikan
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl">
              Disiplin Pintar dengan <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Face ID & Geofencing
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              AbsenSekolah membawa kedisiplinan ke tingkat selanjutnya. Tidak ada lagi penitipan absen. Kami menggunakan validasi biometrik wajah 3D dan lokasi satelit khusus untuk dunia pendidikan modern.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => setActiveView('register')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white text-base font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Daftarkan Sekolah Anda 
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveView('login')}
              className="w-full sm:w-auto px-8 py-4 bg-amber-100 text-amber-800 border border-amber-200 text-base font-bold rounded-2xl shadow-sm hover:bg-amber-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 text-amber-600" />
              Demo Dasbor Admin
            </button>
          </div>

          {/* Educational Trust Indicators */}
          <div className="pt-20 flex flex-col items-center gap-6 opacity-70">
            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Cocok Untuk Berbagai Jenjang Pendidikan</p>
            <div className="flex gap-8 md:gap-16 items-center justify-center grayscale text-slate-400">
              <div className="flex flex-col items-center gap-2 font-black text-lg"><BookOpen className="w-8 h-8"/> Sekolah Dasar</div>
              <div className="flex flex-col items-center gap-2 font-black text-lg"><Users className="w-8 h-8"/> SMP / MTs</div>
              <div className="flex flex-col items-center gap-2 font-black text-lg"><GraduationCap className="w-8 h-8"/> SMA / SMK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div id="features" className="bg-slate-900 py-24 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Teknologi Pendidikan Tanpa Kompromi</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Dirancang secara eksklusif untuk mengatasi problematika kedisiplinan siswa di sekolah modern.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-sm hover:border-amber-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
              <div className="w-14 h-14 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm relative z-10">
                <ScanFace className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold mb-3 relative z-10">AI Liveness Face ID</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">Sistem memindai ratusan titik biometrik siswa dan mewajibkan kedipan mata (Liveness) untuk menolak tipuan foto atau video.</p>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-sm hover:border-blue-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm relative z-10">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold mb-3 relative z-10">Anti-Fake GPS Geofencing</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium relative z-10">Siswa hanya bisa mengabsen jika koordinat satelit HP mereka berada tepat di dalam radius gedung sekolah yang Anda tentukan.</p>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-sm hover:border-emerald-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm relative z-10">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold mb-3 relative z-10">Isolasi Data Instansi</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">Setiap sekolah beroperasi di ruang lingkup (Multi-Tenant) yang terisolasi 100%. Data privasi anak didik dijamin aman dan terenkripsi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern How It Works (Vertical Timeline) */}
      <div id="how-it-works" className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Cara Kerja yang Transparan</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Digitalisasi sekolah Anda hanya dalam 3 langkah mudah.</p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2"></div>

            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
              <div className="md:w-5/12 flex justify-start md:justify-end pr-0 md:pr-12 w-full mb-8 md:mb-0 pl-24 md:pl-0">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-left md:text-right">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center md:ml-auto mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">1. Registrasi Instansi</h3>
                  <p className="text-slate-500">Admin mendaftarkan profil sekolah, menentukan titik koordinat gerbang sekolah (GPS), dan membuat kelas.</p>
                </div>
              </div>
              <div className="absolute left-8 md:left-1/2 w-12 h-12 bg-amber-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl -translate-x-1/2">1</div>
              <div className="md:w-5/12 w-full hidden md:block"></div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
              <div className="md:w-5/12 w-full hidden md:block"></div>
              <div className="absolute left-8 md:left-1/2 w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl -translate-x-1/2">2</div>
              <div className="md:w-5/12 flex justify-start pl-24 md:pl-12 w-full">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-left">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <ScanFace className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">2. Pemindaian Wajah Siswa</h3>
                  <p className="text-slate-500">Gunakan tablet Kiosk atau perangkat sekolah untuk merekam wajah seluruh siswa dalam hitungan detik. Data wajah tersimpan sebagai enkripsi matematika.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-5/12 flex justify-start md:justify-end pr-0 md:pr-12 w-full mb-8 md:mb-0 pl-24 md:pl-0">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-left md:text-right">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center md:ml-auto mb-4">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">3. Absensi Real-time</h3>
                  <p className="text-slate-500">Siswa datang ke sekolah, membuka aplikasi dari HP, dan berkedip di depan kamera. Lokasi GPS divalidasi, wajah dicocokkan, dan notifikasi masuk ke orang tua.</p>
                </div>
              </div>
              <div className="absolute left-8 md:left-1/2 w-12 h-12 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl -translate-x-1/2">3</div>
              <div className="md:w-5/12 w-full hidden md:block"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Investasi Kedisiplinan</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Pilih lisensi yang paling cocok dengan ukuran institusi Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Basic Plan */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Dasar (Basic)</h3>
              <p className="text-slate-500 text-sm mb-6">Untuk SD/TK dengan jumlah kecil</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-900">Rp 250k</span>
                <span className="text-slate-500 font-medium">/bulan</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Maksimal 200 Siswa</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Absensi GPS Geofencing</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Dasbor Admin Sekolah</li>
              </ul>
              <button onClick={() => setActiveView('register')} className="w-full py-3 rounded-xl border border-slate-900 text-slate-900 font-bold hover:bg-slate-200 transition-colors">
                Mulai Lisensi Dasar
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">Standard Sekolah</div>
              <h3 className="text-xl font-bold text-white mb-2">Profesional (Pro)</h3>
              <p className="text-slate-400 text-sm mb-6">Mencegah penitipan absen secara total</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">Rp 750k</span>
                <span className="text-slate-400 font-medium">/bulan</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0"/> Maksimal 1.000 Siswa</li>
                <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0"/> Face ID + Liveness Detection</li>
                <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0"/> Notifikasi WhatsApp Orang Tua</li>
                <li className="flex items-center gap-3 text-sm text-white font-medium"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0"/> Fitur Surat Izin / Sakit Online</li>
              </ul>
              <button onClick={() => setActiveView('register')} className="w-full py-3 rounded-xl bg-amber-500 text-slate-900 font-black hover:bg-amber-400 hover:shadow-lg transition-all">
                Daftar Paket Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instansi Besar</h3>
              <p className="text-slate-500 text-sm mb-6">Untuk SMK / Universitas / Yayasan</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-900">Kustom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Siswa Tak Terbatas</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Aplikasi Smart Kiosk Fisik</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Database Server Terpisah</li>
              </ul>
              <button onClick={() => setActiveView('contact')} className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 transition-colors">
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-amber-500 py-24 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Tinggalkan Cara Lama!</h2>
          <p className="text-slate-800 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Bergabunglah dengan sekolah-sekolah berprestasi yang telah meniadakan celah kecurangan dalam tata tertib sekolah mereka.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setActiveView('register')}
              className="px-8 py-4 bg-slate-900 text-white text-base font-extrabold rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Mulai Uji Coba Gratis Hari Ini
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------
// STATIC PAGES (DYNAMIC FROM GLOBAL SETTINGS)
// ---------------------------------------------------------
function AboutView({ config }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-slate-900 mb-6">Tentang Kami</h1>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
        {config.about}
      </div>
    </div>
  );
}

function ContactView({ config }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-slate-900 mb-6">Hubungi Kami</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6 text-slate-600">
          <p className="text-lg">Tim manajemen kami siap membantu Anda mengintegrasikan teknologi kedisiplinan tingkat tinggi ke institusi pendidikan Anda.</p>
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0"><Phone className="w-5 h-5"/></div>
              <span className="font-bold text-slate-800">{config.phone}</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0"><Mail className="w-5 h-5"/></div>
              <span className="font-bold text-slate-800">{config.email}</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0"><Map className="w-5 h-5"/></div>
              <span className="font-bold text-slate-800 whitespace-pre-wrap">{config.address}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
          <h3 className="text-2xl font-black mb-6">Kirim Pesan Resmi</h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Pesan berhasil terkirim! Tim kami akan menghubungi Anda.'); }}>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">Nama Lengkap & Gelar</label>
              <input type="text" className="w-full bg-slate-800 border-slate-700 text-white rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 px-4 py-3" placeholder="Contoh: Drs. Budi Santoso, M.Pd" required/>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">Nama Instansi Pendidikan</label>
              <input type="text" className="w-full bg-slate-800 border-slate-700 text-white rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 px-4 py-3" placeholder="SMA Negeri 1 Nusantara" required/>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">Tujuan / Pertanyaan</label>
              <textarea rows="4" className="w-full bg-slate-800 border-slate-700 text-white rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 px-4 py-3" placeholder="Saya ingin mengajukan demo aplikasi untuk sekolah kami..." required></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-amber-500 text-slate-900 font-black rounded-xl hover:bg-amber-400 transition-colors mt-4">Kirim Pesan Sekarang</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PrivacyView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh] font-serif">
      <h1 className="text-4xl font-black text-slate-900 mb-2 font-sans">Kebijakan Privasi Data & Perlindungan Informasi</h1>
      <p className="text-slate-500 mb-10 font-sans">Pembaruan Terakhir: 15 Agustus 2026 | Dokumen No. 001/PRIV-AS/2026</p>
      
      <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-justify space-y-6">
        <p className="text-lg font-semibold bg-slate-50 p-4 rounded-xl border border-slate-200">Kerahasiaan dan keamanan data Anda, terutama informasi biometrik peserta didik, adalah prioritas tertinggi kami. Dokumen ini disusun selaras dengan Undang-Undang Pelindungan Data Pribadi (UU PDP) Republik Indonesia untuk menguraikan secara transparan bagaimana PT AbsenSekolah Indonesia mengumpulkan, memproses, menyimpan, dan melindungi informasi Anda.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">1. Ruang Lingkup Kebijakan</h3>
        <p>Kebijakan Privasi ini berlaku untuk seluruh platform yang disediakan oleh PT AbsenSekolah Indonesia, mencakup namun tidak terbatas pada: (a) Aplikasi mobile siswa/orang tua berbasis Android dan iOS, (b) Dasbor web pengelolaan administrasi (*Super Admin* dan *School Admin*), (c) Mesin *Smart Kiosk* fisik yang berlokasi di instansi pendidikan, dan (d) API/Webhooks terkait layanan kami.</p>
        
        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">2. Pengumpulan Data Biometrik & Identifikasi Wajah</h3>
        <p><strong>2.1. Sifat Data Biometrik:</strong> Sistem pengenalan wajah (*Face Recognition*) yang terintegrasi pada platform kami didesain khusus agar <strong>tidak menyimpan citra/gambar wajah asli (.jpg, .png, dsb)</strong> dalam basis data permanen. Saat pendaftaran wajah dilakukan, algoritma kecerdasan buatan (AI) kami mengekstraksi 128 titik nodal (*nodal points*) wajah dan merubahnya menjadi matriks angka 128 dimensi (*Float32Array*). Deretan angka ini (disebut *Face Descriptor*) sepenuhnya tidak dapat direkayasa balik (*non-reversible*) menjadi gambar wajah fisik manusia.</p>
        <p><strong>2.2. Deteksi Liveness:</strong> Untuk mencegah penipuan menggunakan foto dua dimensi atau video (*spoofing*), kami menggunakan teknologi pengenalan kontur mata dan deteksi kedipan (Eye Aspect Ratio / EAR). Kami mencatat koordinat 68 titik tengara (*landmarks*) sesaat selama proses ini, namun data kontur ini bersifat sementara (berada di RAM perangkat keras pengguna) dan langsung dimusnahkan segera setelah *Liveness Validation* menghasilkan output True/False.</p>
        <p><strong>2.3. Penyimpanan Multi-Tenant:</strong> *Face Descriptors* milik masing-masing instansi pendidikan di-partisi dengan keamanan setingkat militer (*Row-Level Security/RLS*). Siswa dari "Sekolah A" tidak akan bisa diakses, dilihat, apalagi diverifikasi menggunakan infrastruktur "Sekolah B". Data biometrik hanya tersimpan selama institusi Anda masih menjalin kontrak kerja sama dengan PT AbsenSekolah Indonesia.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">3. Perekaman Lokasi (Geofencing)</h3>
        <p><strong>3.1. Pengambilan Sesaat:</strong> Kami tidak pernah melacak posisi Anda di latar belakang (*background tracking*). Izin geolokasi hanya diminta dan diaktifkan secara eksklusif pada saat layar *Live Attendance* dibuka. Titik Latitude dan Longitude perangkat hanya diambil satu kali pada detik yang sama ketika tombol absensi ditekan.</p>
        <p><strong>3.2. Deteksi GPS Palsu:</strong> Aplikasi kami dipersenjatai dengan kemampuan untuk mendeteksi *mock locations* (aplikasi GPS palsu) dari sistem operasi. Jika kami mendeteksi upaya manipulasi lokasi, data tersebut akan ditandai dengan peringatan ke dasbor Admin Sekolah, namun tidak dikirim ke pihak eksternal manapun.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">4. Data Anak & Persetujuan (Informed Consent)</h3>
        <p>Sistem ini dirancang khusus untuk entitas pendidikan anak di bawah umur. Kami secara tegas mewajibkan Anda (sebagai Pihak Sekolah/Administrator Instansi) untuk memperoleh persetujuan tertulis secara formal dari orang tua/wali sah murid (*Informed Consent*) sebelum mendaftarkan wajah dan data pribadi murid ke dalam platform AbsenSekolah. Pihak AbsenSekolah berhak meminta dokumen *consent* dari institusi pendidikan untuk keperluan audit legal jika dirasa perlu.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">5. Pengungkapan kepada Pihak Ketiga</h3>
        <p>Kami memiliki komitmen absolut: <strong>Kami tidak menjual, menyewakan, mentransfer, atau membarter data pengguna, metrik kehadiran, maupun informasi finansial kepada pihak ketiga atau pialang data (*data broker*).</strong> Pengungkapan informasi secara terbatas hanya akan terjadi pada skenario berikut:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Proses Hukum Resmi:</strong> Jika diwajibkan oleh putusan pengadilan, panggilan pengadilan (*subpoena*), kepolisian RI, atau proses hukum yang sah secara konstitusional.</li>
          <li><strong>Penyedia Infrastruktur Cloud:</strong> Data Anda disimpan di infrastruktur pihak ketiga (AWS/Supabase) yang dijamin kerahasiaannya dengan standar SOC-2 Type II dan ISO 27001, yang tidak berhak mengakses *raw data* dari platform Anda.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">6. Hak Pengguna (Sesuai UU PDP)</h3>
        <p>Anda selaku subjek data memiliki hak untuk meminta pembaruan, perbaikan, pembekuan, atau pemusnahan penuh seluruh informasi (Hak untuk Dilupakan / *Right to be Forgotten*). Permintaan penghapusan total dapat dikirimkan dari pihak resmi institusi pendidikan kepada <strong>dpo@absenpro.id</strong> (Data Protection Officer) dan kami berkomitmen menyelesaikannya maksimal 3x24 jam kerja sejak surat permintaan kami terima secara sah.</p>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">Dengan mengakses, mengunduh aplikasi, atau berinteraksi dengan API kami, Anda mengkonfirmasi bahwa Anda telah menyetujui praktik perlindungan privasi yang dijabarkan dalam dokumen sah ini tanpa ada paksaan dari pihak mana pun.</p>
        </div>
      </div>
    </div>
  );
}

function TermsView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh] font-serif">
      <h1 className="text-4xl font-black text-slate-900 mb-2 font-sans">Syarat & Ketentuan Layanan (TOS)</h1>
      <p className="text-slate-500 mb-10 font-sans">Pembaruan Terakhir: 15 Agustus 2026 | Dokumen No. 002/TOS-AS/2026</p>
      
      <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-justify space-y-6">
        <p className="text-lg font-semibold bg-slate-50 p-4 rounded-xl border border-slate-200">Silakan baca Perjanjian Ketentuan Layanan ini dengan sangat hati-hati. Dengan membuat akun, menandatangani kontrak berlangganan, atau menggunakan infrastruktur teknologi PT AbsenSekolah Indonesia, Anda ("Klien", "Sekolah", atau "Pengguna") tunduk pada syarat dan ketentuan hukum yang dijabarkan di bawah ini.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">Pasal 1: Ketentuan Umum & Definisi</h3>
        <p>1.1. "Layanan" mengacu pada perangkat lunak sebagai layanan (*Software as a Service*), dasbor web, aplikasi mobile, model kecerdasan buatan, infrastruktur API, serta dokumentasi tertulis yang disediakan oleh PT AbsenSekolah Indonesia ("Kami").</p>
        <p>1.2. Perjanjian ini beroperasi sebagai kontrak yang mengikat secara hukum di bawah yurisdiksi perundang-undangan hukum perdata dan pidana Republik Indonesia, secara spesifik mengacu pada Undang-Undang Informasi dan Transaksi Elektronik (UU ITE).</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">Pasal 2: Hak Cipta dan Lisensi Penggunaan</h3>
        <p>2.1. Kami memberi Anda lisensi yang tidak eksklusif, tidak dapat dialihkan (*non-transferable*), dan dapat dibatalkan sewaktu-waktu untuk menggunakan layanan kami. Seluruh Hak Kekayaan Intelektual (HAKI) termasuk kode sumber (*source code*), rancangan antarmuka pengguna, algoritma pengenalan wajah (*machine learning models*), dan merek dagang tetap mutlak menjadi hak milik PT AbsenSekolah Indonesia.</p>
        <p>2.2. Pelanggaran berat seperti mencoba melakukan rekayasa balik (*reverse engineering*), membongkar kode keamanan (*decompiling*), atau menduplikasi fungsionalitas utama aplikasi untuk membuat perangkat lunak kompetitor (*cloning*) akan dilaporkan secara perdata dengan tuntutan ganti rugi materiil minimal senilai Rp 5.000.000.000 (Lima Miliar Rupiah) dan tuntutan pidana sesuai regulasi ITE.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">Pasal 3: Kewajiban Kontrak Instansi Sekolah</h3>
        <p>3.1. <strong>Integritas Data:</strong> Anda menyatakan menjamin penuh bahwa data yang diunggah ke dalam sistem (termasuk Nomor Induk Siswa Nasional / NISN dan Nama Lengkap) adalah otentik dan legal. Penginputan data fiktif untuk mengeksploitasi sumber daya *server* akan berakibat pada pembekuan permanen ruang kerja (*workspace*) tanpa kompensasi dana.</p>
        <p>3.2. <strong>Regulasi Edukasi:</strong> Segala keputusan kedisiplinan (pemberian poin pelanggaran, skorsing, atau denda akademik) yang timbul akibat data luaran dari sistem kami adalah sepenuhnya wewenang dan tanggung jawab penuh institusi sekolah bersangkutan. Kami tidak dapat digugat oleh wali murid atas tindakan indisipliner yang dijatuhkan pihak sekolah akibat rekam jejak digital dari platform ini.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">Pasal 4: Finansial, SLA, dan Force Majeure</h3>
        <p>4.1. <strong>Penagihan & Suspensi:</strong> Langganan (*Subscription*) berlaku dengan model *Post-paid* ataupun *Pre-paid* bulanan/tahunan. Jika invoice tertunggak melampaui masa *grace period* selama 14 hari kalender, akun institusi akan dibekukan (*suspended*) secara sepihak. Data riwayat (*logs*) akan dipertahankan dalam arsip dingin (*cold storage*) selama maksimal 90 hari sebelum dihapus permanen via siklus *garbage collection*.</p>
        <p>4.2. <strong>Service Level Agreement (SLA):</strong> Kami menargetkan ketersediaan sistem sebesar 99.9% (uptime) per bulan takwim untuk pelanggan *Enterprise* dan *Pro*. Kami akan memberikan kompensasi kredit layanan sebanding jika *downtime* melampaui persentase tersebut (tidak termasuk *Scheduled Maintenance* yang akan diberitahukan minimal 48 jam sebelumnya).</p>
        <p>4.3. <strong>Force Majeure:</strong> Baik Anda maupun Kami tidak dapat dimintai pertanggungjawaban atas gangguan sistem akibat Keadaan Kahar, yang meliputi namun tidak terbatas pada: gempa bumi, banjir bandang, pemutusan akses internet nasional oleh Kementerian Kominfo, perang, peretasan berskala nasional (*state-sponsored cyber attack*), atau kegagalan *data center* AWS/GCP regional Indonesia.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3 font-sans uppercase tracking-wider border-b-2 border-amber-500 inline-block">Pasal 5: Penyelesaian Sengketa (Arbitrase)</h3>
        <p>Semua perselisihan yang mungkin timbul terkait dengan interpretasi atau eksekusi perjanjian ini, jika tidak dapat diselesaikan melalui mufakat internal (*B2B Negotiation*) dalam waktu 60 hari kalender, maka akan dirujuk dan diselesaikan di Pengadilan Negeri Jakarta Selatan secara eksklusif. Biaya perkara akan ditanggung oleh pihak yang pada akhirnya dinyatakan bersalah oleh majelis hakim.</p>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-sm font-bold text-slate-800">Dokumen Hukum PT AbsenSekolah Indonesia</p>
          <p className="text-sm text-slate-500 mt-1">Gedung Pendidikan Modern Lantai 5, Jalan Merdeka Belajar No. 123, Jakarta Selatan 12190.</p>
          <p className="text-sm text-slate-500 mt-1">Tim Legal Resmi: legal@absenpro.id | +62-21-9988-7766</p>
        </div>
      </div>
    </div>
  );
}
