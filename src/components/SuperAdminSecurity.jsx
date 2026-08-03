import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SuperAdminSecurity() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Keamanan & Anti-DDoS 🛡️</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Pantau ancaman keamanan dan aktivitas login mencurigakan.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-slate-400 text-center">
        <ShieldAlert className="w-20 h-20 mb-6 opacity-20 text-indigo-600" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Modul Sedang Dikembangkan</h3>
        <p className="max-w-md mx-auto text-sm">Halaman <b>SuperAdminSecurity</b> ini adalah bagian dari fitur Enterprise. Tim *Engineering* kami akan segera merilisnya di update selanjutnya.</p>
      </div>
    </div>
  );
}
