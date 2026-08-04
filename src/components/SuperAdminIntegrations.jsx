import React from 'react';
import { Puzzle, ShieldAlert } from 'lucide-react';

export default function SuperAdminIntegrations() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Marketplace Integrasi 🧩</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Kelola integrasi pihak ketiga (WhatsApp, Zoom, dll).</p>
      </div>
      
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4"><div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between"><div className="flex gap-3 items-center"><div className="w-10 h-10 bg-green-500 rounded-lg"></div><div><h4 className="font-bold">WhatsApp Gateway</h4><p className="text-xs text-slate-500">Kirim notif absen ke Ortu</p></div></div><button className="text-xs font-bold bg-slate-100 px-3 py-1 rounded">Terpasang</button></div><div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between"><div className="flex gap-3 items-center"><div className="w-10 h-10 bg-blue-500 rounded-lg"></div><div><h4 className="font-bold">Zoom API</h4><p className="text-xs text-slate-500">Untuk kelas online</p></div></div><button className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded">Pasang</button></div></div>
      </div>
    </div>
  );
}
