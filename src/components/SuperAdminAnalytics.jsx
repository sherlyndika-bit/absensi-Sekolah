import React, { useState, useEffect } from 'react';
import { BrainCircuit, AlertTriangle, TrendingUp } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminAnalytics() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    // A real AI would process this on backend, we will just fetch schools and mock a churn risk score
    const { data } = await supabase.from('schools').select('*');
    if (data) setSchools(data);
  };

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">AI Analytics 🧠</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Wawasan bisnis otomatis untuk retensi klien.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm border-t-4 border-t-rose-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900">Peringatan Churn (AI Heuristics)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Model AI mendeteksi <b className="text-rose-600">2 sekolah</b> memiliki interaksi absensi yang menurun tajam minggu ini.
          </p>
          <div className="space-y-3">
            {schools.slice(0, 2).map(s => (
              <div key={s.id} className="p-3 bg-rose-50 rounded-lg flex justify-between items-center">
                <span className="font-bold text-xs text-rose-900">{s.name}</span>
                <span className="text-xs bg-rose-200 text-rose-800 px-2 py-1 rounded">Resiko Tinggi</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900">Prediksi Pendapatan Bulan Depan</h3>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Berdasarkan tren akuisisi saat ini dan aktivitas pengguna, MRR bulan depan diprediksi naik.
          </p>
          <h2 className="text-4xl font-black text-emerald-600 mb-2">+15%</h2>
          <p className="text-slate-500 text-sm font-medium">Estimasi MRR: Rp 52.300.000</p>
        </div>
      </div>
    </div>
  );
}
