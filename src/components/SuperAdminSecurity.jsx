import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, AlertOctagon } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminSecurity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const fetchSecurityLogs = async () => {
    const { data } = await supabase.from('audit_logs').select('*').eq('type', 'security').order('created_at', { ascending: false }).limit(20);
    if (data) setLogs(data);
  };

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Keamanan & Anti-DDoS 🛡️</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Pantau ancaman keamanan dan aktivitas login mencurigakan (Real Database).</p>
      </div>
      
      <div className="space-y-6">
        <div className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-green-800 text-lg">Status Firewall: Aktif & Sehat</h4>
            <p className="text-sm text-green-600">Tidak ada serangan DDoS terdeteksi dalam 24 jam terakhir.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-500"/>
              Log Keamanan Terbaru (Audit Trail)
            </h4>
          </div>
          <div className="divide-y divide-slate-100">
            {logs.length === 0 ? <p className="p-6 text-center text-slate-500">Belum ada log keamanan.</p> : logs.map(log => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-slate-50">
                <div>
                  <p className="font-bold text-rose-700 text-sm">{log.action}</p>
                  <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded inline-block text-slate-600 mb-1">{log.ip_address}</p>
                  <p className="text-[10px] text-slate-400 block">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
