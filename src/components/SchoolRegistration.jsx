import React, { useState } from 'react';
import { Building2, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import supabase from '../supabase/config';

export default function SchoolRegistration({ onBack, onLogin }) {
  const [formData, setFormData] = useState({
    schoolName: '',
    slug: '',
    level: 'SMA',
    packagePlan: 'Basic',
    adminName: '',
    adminPhone: '',
    adminPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Cek apakah slug sudah dipakai sekolah lain
      // Gunakan maybeSingle() agar tidak error saat data tidak ditemukan
      const { data: existing } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', formData.slug.toLowerCase())
        .maybeSingle();

      if (existing) {
        setError(`Alamat URL "${formData.slug}" sudah digunakan sekolah lain. Pilih nama lain.`);
        setIsLoading(false);
        return;
      }

      // 2. Insert School (hanya kolom yang pasti ada di tabel)
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert([{ 
          name: formData.schoolName, 
          slug: formData.slug.toLowerCase(),
          level: formData.level,
          package_plan: formData.packagePlan
        }])
        .select()
        .single();
      
      if (schoolError) throw schoolError;

      // 3. Insert Admin User (class_id = null karena admin tidak punya kelas)
      const adminId = `admin_${Date.now()}`;
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: adminId,
          name: formData.adminName,
          role: 'admin',
          parent_phone: formData.adminPhone,
          phone: formData.adminPhone,
          school_id: schoolData.id,
          class_id: null,
          nisn: formData.adminPhone,
          password: formData.adminPassword,
          enrollment_status: 'approved'
        }]);

      if (userError) throw userError;

      setSuccess(true);
      
      // Auto login after 2 seconds
      setTimeout(() => {
        onLogin({
          id: adminId,
          name: formData.adminName,
          role: 'admin',
          schoolId: schoolData.id,
          schoolName: formData.schoolName,
          schoolLevel: formData.level
        });
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      // Tampilkan pesan error asli dari Supabase, bukan pesan generik
      const msg = err?.message || err?.details || JSON.stringify(err);
      setError(`Pendaftaran gagal: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-slate-200 p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Sekolah Terdaftar!</h2>
          <p className="text-sm text-slate-500">Ruang kerja {formData.schoolName} berhasil dibuat. Mengalihkan ke Dasbor Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-blue-900 p-6 sm:p-8 text-white relative">
          <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center mt-6">
            <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-700">
              <Building2 className="w-8 h-8 text-blue-300" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Pendaftaran Sewa SaaS</h2>
            <p className="text-blue-200 text-sm mt-2">Buat ruang kerja baru untuk sekolah Anda</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Informasi Sekolah</h3>
              
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Nama Sekolah</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: SMAN 1 Nusantara"
                  value={formData.schoolName}
                  onChange={e => {
                    const val = e.target.value;
                    const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '');
                    setFormData({...formData, schoolName: val, slug: slug});
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Alamat URL Portal Sekolah</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <div className="bg-slate-100 border-r border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 flex items-center">
                    {window.location.host}/
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="sman1nusantara"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                    className="w-full bg-transparent px-4 py-3 text-sm font-medium focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Siswa akan login melalui URL ini nanti (contoh: absenpro.com/sman1nusantara/portal).</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Tingkat Sekolah</label>
                <div className="grid grid-cols-4 gap-2">
                  {['SD', 'SMP', 'SMA', 'SMK'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({...formData, level})}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        formData.level === level 
                          ? 'bg-blue-50 border-blue-500 text-blue-700' 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Pilihan Paket SaaS</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Basic', 'Pro', 'Enterprise'].map(plan => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setFormData({...formData, packagePlan: plan})}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                        formData.packagePlan === plan 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20' 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {plan}
                      {plan === 'Pro' && <div className="text-[10px] text-amber-500 mt-0.5">Populer</div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Akun Kepala Admin</h3>
              
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Nama Lengkap Admin</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nama Admin"
                  value={formData.adminName}
                  onChange={e => setFormData({...formData, adminName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Username (No. HP)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: 081234..."
                    value={formData.adminPhone}
                    onChange={e => setFormData({...formData, adminPhone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Password Admin</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Minimal 6 karakter"
                    value={formData.adminPassword}
                    onChange={e => setFormData({...formData, adminPassword: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Mendaftarkan Sekolah...</>
              ) : (
                'DAFTARKAN & BUAT RUANG KERJA'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
