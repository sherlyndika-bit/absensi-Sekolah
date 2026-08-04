import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';

export default function SuperAdminActivity() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Live Activity Logs ⚡</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Siaran langsung aktivitas dari seluruh sekolah.</p>
      </div>
      
      <div className="mt-8">
        <div className="bg-slate-900 rounded-xl p-4 h-64 overflow-hidden font-mono text-xs text-green-400 space-y-2"><p>[LIVE] SMA 1 Jakarta: 450 siswa berhasil diabsen (Face ID).</p><p>[LIVE] SMK Budi: Guru Maman mendaftarkan izin sakit untuk Budi.</p><p>[LIVE] SMP 3: Tenant Admin memperbarui paket langganan ke PRO.</p><p className="animate-pulse">Menunggu aktivitas baru...</p></div>
      </div>
    </div>
  );
}
