import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Clock, AlertCircle, FileText, MapPin, Send, Check, X, Building2, Grid, Lock, LogOut, Tablet, UserCheck } from 'lucide-react';
import supabase from '../supabase/config';

import SmartKiosk from './SmartKiosk';
import FaceEnrollment from './FaceEnrollment';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [school, setSchool] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Real Data State
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchSchoolData();
  }, []);

  const fetchSchoolData = async () => {
    const { data: schoolData } = await supabase.from('schools').select('*').eq('id', user.schoolId).single();
    setSchool(schoolData);

    const { data: pricingData } = await supabase.from('global_settings').select('value').eq('key', 'pricing_config').single();
    if(pricingData) setPricing(JSON.parse(pricingData.value));

    // Fetch Classes
    const { data: clsData } = await supabase.from('classes').select('*').eq('school_id', user.schoolId);
    setClasses(clsData || []);

    // Fetch Students
    const { data: stdData } = await supabase.from('users').select('*').eq('school_id', user.schoolId).eq('role', 'student');
    setStudents(stdData || []);

    setLoading(false);
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading Workspace...</div>;

  const currentPlan = school?.package_plan || 'Basic';
  const features = pricing?.[currentPlan]?.features || [];
  const hasFeature = (f) => features.includes(f);

  const LockedFeature = ({ name }) => (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Fitur {name} Dikunci</h3>
      <p className="text-slate-500 mb-6 max-w-sm">Tingkatkan paket layanan Anda ke Pro atau Enterprise untuk membuka fitur ini.</p>
      <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all">
        Upgrade Paket Sekarang
      </button>
    </div>
  );

  // If Smart Kiosk or Enrollment is active, maybe we don't need the standard dashboard wrapper, 
  // but let's just render them inside the main content area.
  if (activeTab === 'kiosk') {
    return (
      <div className="relative">
        <button onClick={() => setActiveTab('overview')} className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-md">Kembali ke Dashboard</button>
        <SmartKiosk />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="p-6 bg-slate-950 border-b border-slate-800">
          <h2 className="text-white font-black text-xl truncate" title={school?.name}>{school?.name}</h2>
          <span className="inline-block mt-2 px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded uppercase">
            {currentPlan} PLAN
          </span>
        </div>
        
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 mt-2">Utama</p>
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Grid className="w-5 h-5" /> Overview
          </button>
          
          <button onClick={() => setActiveTab('classes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'classes' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Building2 className="w-5 h-5" /> Manajemen Kelas
            {!hasFeature('classes') && <Lock className="w-4 h-4 ml-auto text-slate-500"/>}
          </button>
          
          <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Users className="w-5 h-5" /> Data Siswa
          </button>
          
          <button onClick={() => setActiveTab('attendance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <CheckCircle2 className="w-5 h-5" /> Rekap Absensi
            {!hasFeature('attendance') && <Lock className="w-4 h-4 ml-auto text-slate-500"/>}
          </button>
          
          <button onClick={() => setActiveTab('leaves')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'leaves' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <AlertCircle className="w-5 h-5" /> Izin & Sakit
            {!hasFeature('leaves') && <Lock className="w-4 h-4 ml-auto text-slate-500"/>}
          </button>
          
          <button onClick={() => setActiveTab('broadcast')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'broadcast' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Send className="w-5 h-5" /> Pengumuman
            {!hasFeature('broadcast') && <Lock className="w-4 h-4 ml-auto text-slate-500"/>}
          </button>

          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 mt-6">Perangkat Keras</p>
          <button onClick={() => setActiveTab('kiosk')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'kiosk' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Tablet className="w-5 h-5" /> Jalankan Mesin Kiosk
          </button>
          <button onClick={() => setActiveTab('enrollment')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'enrollment' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <UserCheck className="w-5 h-5" /> Daftar Face ID Siswa
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
            <button onClick={onLogout} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Keluar">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Overview Hari Ini</h1>
            <p className="text-slate-500 mb-8">Selamat datang kembali, {user.name}.</p>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 font-bold text-xs uppercase mb-2">Total Siswa</p>
                <p className="text-4xl font-black text-slate-800">{students.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200">
                <p className="text-emerald-600 font-bold text-xs uppercase mb-2">Hadir</p>
                <p className="text-4xl font-black text-emerald-700">0</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-200">
                <p className="text-rose-600 font-bold text-xs uppercase mb-2">Alfa</p>
                <p className="text-4xl font-black text-rose-700">0</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200">
                <p className="text-amber-600 font-bold text-xs uppercase mb-2">Izin/Sakit</p>
                <p className="text-4xl font-black text-amber-700">0</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          !hasFeature('classes') ? <LockedFeature name="Manajemen Kelas" /> :
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Manajemen Kelas</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <button className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">+ Tambah Kelas Baru</button>
              <div className="grid grid-cols-3 gap-4">
                {classes.length === 0 ? <p className="text-slate-500 col-span-3">Belum ada kelas.</p> : 
                  classes.map(c => (
                    <div key={c.id} className="border border-slate-200 p-4 rounded-xl">
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-slate-500 text-sm">{c.grade} {c.level}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Database Siswa</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-600">Nama Lengkap</th>
                    <th className="px-6 py-4 font-bold text-slate-600">NISN</th>
                    <th className="px-6 py-4 font-bold text-slate-600">No HP Orang Tua</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Face ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 font-bold">{s.name}</td>
                      <td className="px-6 py-4 font-mono">{s.nisn || '-'}</td>
                      <td className="px-6 py-4">{s.parent_phone}</td>
                      <td className="px-6 py-4">
                        {s.enrollment_status === 'approved' ? 
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">Terdaftar</span> : 
                          <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs font-bold">Belum</span>
                        }
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">Belum ada siswa terdaftar.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          !hasFeature('attendance') ? <LockedFeature name="Laporan Rekap Absensi" /> :
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Rekap Kehadiran Siswa</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
              Tabel rekap bulanan akan muncul di sini. (Dalam pengembangan)
            </div>
          </div>
        )}

        {activeTab === 'leaves' && (
          !hasFeature('leaves') ? <LockedFeature name="Persetujuan Izin/Sakit" /> :
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Inbox Izin & Sakit</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
              Surat izin dari HP orang tua akan masuk ke sini.
            </div>
          </div>
        )}

        {activeTab === 'broadcast' && (
          !hasFeature('broadcast') ? <LockedFeature name="Broadcast Pengumuman" /> :
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Broadcast Pengumuman</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
              Kirim pengumuman massal ke aplikasi HP siswa.
            </div>
          </div>
        )}
        
        {activeTab === 'enrollment' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FaceEnrollment />
          </div>
        )}
      </div>
    </div>
  );
}