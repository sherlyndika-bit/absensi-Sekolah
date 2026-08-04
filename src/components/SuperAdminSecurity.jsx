import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SuperAdminSecurity() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Keamanan & Anti-DDoS 🛡️</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Pantau ancaman keamanan dan aktivitas login mencurigakan.</p>
      </div>
      
      <div className="mt-8">
        <div className="space-y-4"><div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"><ShieldAlert className="text-green-600" /><div><h4 className="font-bold text-green-800">Status Firewall: Aktif</h4><p className="text-xs text-green-600">0 serangan DDoS terdeteksi dalam 24 jam terakhir.</p></div></div><div className="p-4 bg-white rounded-xl border border-slate-200"> <h4 className="font-bold mb-2">Log Keamanan Terbaru</h4> <p className="text-xs text-slate-500 font-mono">10:45 - Login berhasil dari IP 114.122.x.x (Owner)</p> <p className="text-xs text-slate-500 font-mono">09:12 - Akses API ditolak (Invalid Token) dari IP 103.44.x.x</p> </div></div>
      </div>
    </div>
  );
}
