import React from 'react';
import { Webhook, ShieldAlert } from 'lucide-react';

export default function SuperAdminAPI() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Developer API 👨‍💻</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Manajemen Webhook dan API Key platform.</p>
      </div>
      
      <div className="mt-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200"><h3 className="font-bold mb-4">API Keys Aktif</h3><div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center mb-4"><span className="font-mono text-sm">sk_live_9384729384729348...</span><button className="text-indigo-600 text-sm font-bold">Copy</button></div><button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm">Buat Token Baru</button></div>
      </div>
    </div>
  );
}
