import React from 'react';
import { ServerCrash, ShieldAlert } from 'lucide-react';

export default function SuperAdminHealth() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">System Health 🖥️</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Status Uptime Server, Database, dan API.</p>
      </div>
      
      <div className="mt-8">
        <div className="grid grid-cols-3 gap-4"><div className="bg-white p-4 rounded-xl border-t-4 border-t-emerald-500 shadow-sm"><h4 className="font-bold">Database (Supabase)</h4><p className="text-2xl text-emerald-600 font-black mt-2">99.9%</p><p className="text-xs text-slate-500">Uptime (Sehat)</p></div><div className="bg-white p-4 rounded-xl border-t-4 border-t-emerald-500 shadow-sm"><h4 className="font-bold">Face API (AI)</h4><p className="text-2xl text-emerald-600 font-black mt-2">124ms</p><p className="text-xs text-slate-500">Avg Response Time</p></div><div className="bg-white p-4 rounded-xl border-t-4 border-t-emerald-500 shadow-sm"><h4 className="font-bold">Storage</h4><p className="text-2xl text-emerald-600 font-black mt-2">12 GB</p><p className="text-xs text-slate-500">Telah digunakan (Aman)</p></div></div>
      </div>
    </div>
  );
}
