import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Clock, AlertCircle, FileText, MapPin, Send, Check, X, Building2, Grid, Lock, LogOut, Tablet, UserCheck, Plus } from 'lucide-react';
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
  const [attendances, setAttendances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);

  // Forms
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '' });

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

    // Fetch Attendances
    const { data: attData } = await supabase.from('attendances').select('*, users(name, nisn)').eq('school_id', user.schoolId).order('timestamp', { ascending: false }).limit(100);
    setAttendances(attData || []);

    // Fetch Leaves
    const { data: leaveData } = await supabase.from('sick_leave_requests').select('*, users(name)').eq('school_id', user.schoolId).order('created_at', { ascending: false });
    setLeaves(leaveData || []);

    // Fetch Broadcasts
    try {
      const { data: bcData } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false }).limit(20);
      setBroadcasts(bcData || []);
    } catch(e) {
      console.error(e);
    }

    setLoading(false);
  };

  const handleApproveLeave = async (id, status) => {
    await supabase.from('sick_leave_requests').update({ status }).eq('id', id);
    fetchSchoolData(); // Refresh
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;
    
    await supabase.from('broadcasts').insert([{
      title: broadcastForm.title,
      message: broadcastForm.message
    }]);
    
    setBroadcastForm({ title: '', message: '' });
    alert('Pengumuman berhasil dikirim!');
    fetchSchoolData();
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

  if (activeTab === 'kiosk') {
    return (
      <div className="relative">
        <button onClick={() => setActiveTab('overview')} className="absolute top-4 left-4 z-50 px-4 py-2 bg-slate-900/50 hover:bg-slate-900/80 text-white rounded-lg backdrop-blur-md">Kembali ke Dashboard</button>
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
            <Tablet className="w-5 h-5" /> Jalankan Kiosk Absen
          </button>
          <button onClick={() => setActiveTab('enrollment')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'enrollment' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
            <UserCheck className="w-5 h-5" /> Daftar Face ID
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
                <p className="text-emerald-600 font-bold text-xs uppercase mb-2">Hadir (Hari Ini)</p>
                <p className="text-4xl font-black text-emerald-700">
                  {attendances.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200">
                <p className="text-amber-600 font-bold text-xs uppercase mb-2">Izin/Sakit (Hari Ini)</p>
                <p className="text-4xl font-black text-amber-700">
                  {leaves.filter(l => l.status === 'approved' && new Date(l.date).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          !hasFeature('classes') ? <LockedFeature name="Manajemen Kelas" /> :
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Manajemen Kelas</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <button className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4"/> Tambah Kelas Baru
              </button>
              <div className="grid grid-cols-3 gap-4">
                {classes.length === 0 ? <p className="text-slate-500 col-span-3">Belum ada kelas.</p> : 
                  classes.map(c => (
                    <div key={c.id} className="border border-slate-200 p-4 rounded-xl hover:border-indigo-300 cursor-pointer transition-colors">
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
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold">{s.name}</td>
                      <td className="px-6 py-4 font-mono">{s.nisn || '-'}</td>
                      <td className="px-6 py-4">{s.parent_phone}</td>
                      <td className="px-6 py-4">
                        {s.enrollment_status === 'approved' ? 
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold border border-emerald-200">Terdaftar</span> : 
                          <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs font-bold border border-slate-200">Belum</span>
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-600">Waktu Kedatangan</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Nama Siswa</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendances.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">{new Date(a.timestamp).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 font-bold">{a.users?.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold border border-emerald-200 uppercase">{a.status}</span>
                      </td>
                      <td className="px-6 py-4 uppercase text-xs text-slate-500 font-bold">{a.location_type || 'Kiosk'}</td>
                    </tr>
                  ))}
                  {attendances.length === 0 && (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">Belum ada data absensi.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leaves' && (
          !hasFeature('leaves') ? <LockedFeature name="Persetujuan Izin/Sakit" /> :
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Inbox Izin & Sakit</h1>
            <div className="space-y-4">
              {leaves.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                  Tidak ada permohonan izin baru.
                </div>
              ) : (
                leaves.map(leave => (
                  <div key={leave.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{leave.users?.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border 
                          ${leave.leave_type === 'sick' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                          {leave.leave_type === 'sick' ? 'Sakit' : 'Izin'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border 
                          ${leave.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : leave.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-1"><span className="font-bold">Tanggal:</span> {new Date(leave.date).toLocaleDateString('id-ID')}</p>
                      <p className="text-slate-600 text-sm"><span className="font-bold">Alasan:</span> {leave.reason}</p>
                      {leave.proof_url && (
                        <a href={leave.proof_url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline mt-2 inline-block">Lihat Surat Bukti ↗</a>
                      )}
                    </div>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveLeave(leave.id, 'rejected')} className="px-4 py-2 border border-rose-200 text-rose-600 rounded-lg font-bold hover:bg-rose-50">Tolak</button>
                        <button onClick={() => handleApproveLeave(leave.id, 'approved')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">Setujui</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'broadcast' && (
          !hasFeature('broadcast') ? <LockedFeature name="Broadcast Pengumuman" /> :
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Broadcast Pengumuman</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-bold text-lg mb-4">Buat Pengumuman Baru</h2>
                <form onSubmit={handleSendBroadcast} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Judul Pengumuman</label>
                    <input type="text" value={broadcastForm.title} onChange={e => setBroadcastForm({...broadcastForm, title: e.target.value})} className="w-full border border-slate-200 rounded-lg p-3" placeholder="Contoh: Libur Nasional" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Isi Pesan</label>
                    <textarea value={broadcastForm.message} onChange={e => setBroadcastForm({...broadcastForm, message: e.target.value})} className="w-full border border-slate-200 rounded-lg p-3 h-32 resize-none" placeholder="Isi pesan akan dikirim ke aplikasi semua siswa..." required />
                  </div>
                  <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                    <Send className="w-4 h-4" /> Kirim Sekarang
                  </button>
                </form>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-4">Riwayat Pengumuman</h2>
                <div className="space-y-4">
                  {broadcasts.length === 0 ? <p className="text-slate-500">Belum ada pengumuman.</p> :
                    broadcasts.map(bc => (
                      <div key={bc.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <h3 className="font-bold text-slate-800">{bc.title}</h3>
                        <p className="text-sm text-slate-600 mt-2">{bc.message}</p>
                        <p className="text-xs text-slate-400 mt-4">{new Date(bc.created_at).toLocaleString('id-ID')}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
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