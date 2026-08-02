import React, { useState } from 'react';
import { School, User, Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { store } from '../firebase/services';

export default function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Admin states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student states
  const [nisn, setNisn] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Dummy authentication logic before Supabase is connected
    setTimeout(() => {
      if (email === 'admin@sekolah.com' && password === 'admin123') {
        onLogin({ role: 'admin', name: 'Admin Sekolah' });
      } else {
        setError('Email atau password admin salah.');
      }
      setLoading(false);
    }, 800);
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const data = store.getState();
      const student = data.students.find(s => s.nisn === nisn);
      
      if (student) {
        onLogin({ role: 'student', ...student });
      } else {
        setError('Siswa dengan NISN tersebut tidak ditemukan.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-900 rounded-2xl shadow-lg flex items-center justify-center text-white mb-4">
          <School className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sistem Presensi Digital</h2>
        <p className="text-sm text-slate-500 mt-2">SMA Negeri 1 Jakarta</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
            <button
              onClick={() => { setActiveTab('student'); setError(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                activeTab === 'student' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Siswa
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setError(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                activeTab === 'admin' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Admin Sekolah
            </button>
          </div>

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
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Admin</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sekolah.com"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 sm:text-sm font-medium text-slate-900"
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
