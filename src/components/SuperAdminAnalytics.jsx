import React from 'react';
import { BrainCircuit, ShieldAlert } from 'lucide-react';

export default function SuperAdminAnalytics() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">AI Analytics 🧠</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Prediksi Churn dan Wawasan Bisnis Cerdas.</p>
      </div>
      
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4"><div className="bg-white p-6 rounded-xl border border-slate-200"><h3 className="font-bold text-rose-600 mb-2">Peringatan Churn (AI)</h3><p className="text-sm">Sistem AI mendeteksi <b>2 sekolah</b> memiliki interaksi absensi yang menurun tajam minggu ini. Disarankan tim Support segera menghubungi mereka.</p></div><div className="bg-white p-6 rounded-xl border border-slate-200"><h3 className="font-bold text-emerald-600 mb-2">Prediksi Pendapatan</h3><p className="text-sm">Berdasarkan tren akuisisi saat ini, MRR bulan depan diprediksi akan naik <b>+15%</b> mencapai Rp 52.3M.</p></div></div>
      </div>
    </div>
  );
}
