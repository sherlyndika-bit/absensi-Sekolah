import React, { useState } from 'react';
import { School, User, Lock, Mail, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import supabase from '../supabase/config';

export default function Login({ onLogin, schoolInfo, isSuperAdminLogin = false }) {
  const [activeTab, setActiveTab] = useState(isSuperAdminLogin ? 'admin' : 'student'); // 'student' or 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Admin states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student states
  const [nisn, setNisn] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let query = supabase
        .from('users')
        .select('*, schools(*)')
        .eq('nisn', email)
        .eq('password', password);

      if (isSuperAdminLogin) {
        query = query.in('role', ['superadmin', 'owner', 'manager', 'support', 'devops', 'finance']);
      } else {
        query = query.eq('role', 'admin').eq('school_id', schoolInfo.id);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error('Username atau password admin salah.');
      }

      onLogin({ 
        id: data.id,
        role: data.role, 
        name: data.name,
        schoolId: data.school_id,
        schoolName: data.schools?.name,
        schoolLevel: data.schools?.level
      });
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*, schools(*)')
        .eq('nisn', nisn)
        .eq('role', 'student')
        .eq('school_id', schoolInfo.id)
        .single();
      
      if (error || !data) {
        throw new Error('Siswa dengan NISN tersebut tidak ditemukan.');
      }

      // Convert photo_url mapping to be compatible with how services.js parses it
      let finalPhotoUrl = data.photo_url;
      let faceDescriptor = null;
      if (data.photo_url && data.photo_url.includes('|||')) {
        const parts = data.photo_url.split('|||');
        finalPhotoUrl = parts[0];
        try { faceDescriptor = JSON.parse(parts[1]); } catch(e) {}
      }

      onLogin({ 
        role: 'student', 
        id: data.id,
        nisn: data.nisn,
        name: data.name,
        classId: data.class_id,
        parentPhone: data.parent_phone,
        parentName: data.parent_name,
        faceEnrollmentStatus: data.face_enrollment_status || 'none',
        photoUrl: finalPhotoUrl,
        faceDescriptor: faceDescriptor,
        schoolId: data.school_id,
        schoolName: data.schools?.name,
        schoolLevel: data.schools?.level
      });
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative">
        <div className="mx-auto w-16 h-16 bg-blue-900 rounded-2xl shadow-lg flex items-center justify-center text-white mb-4 mt-8 sm:mt-0">
          <School className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isSuperAdminLogin ? 'SaaS Owner Portal' : `Portal ${schoolInfo?.name || 'Sekolah'}`}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {isSuperAdminLogin ? 'Masuk ke Dasbor Super Admin' : `Masuk ke ruang kerja ${schoolInfo?.level} Anda`}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {/* Tabs */}
          {!isSuperAdminLogin && (
            <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${
                  activeTab === 'student' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Siswa
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${
                  activeTab === 'admin' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Admin/Guru
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Induk Siswa Nasional (NISN)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="Contoh: 0051234567"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 sm:text-sm font-medium text-slate-900"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">Gunakan NISN sebagai identitas akses absensi Anda.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-70 transition-colors"
              >
                {loading ? 'Memeriksa Data...' : 'Masuk sebagai Siswa'}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Username (No. HP)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                    placeholder="Masukkan Nomor HP Admin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 sm:text-sm font-medium text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 transition-colors"
              >
                {loading ? 'Mengautentikasi...' : 'Masuk ke Dashboard'}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
            </form>
          )}
          
        </div>
        <p className="text-center text-xs text-slate-500 mt-6">
          Versi 2.0 • Dilindungi oleh Enkripsi Liveness Detection
        </p>
      </div>
    </div>
  );
}
