import React, { useState, useEffect } from 'react';
import { Activity, Terminal } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminActivity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchInitialLogs();
    
    // Subscribe to realtime inserts
    const subscription = supabase
      .channel('public:audit_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs', filter: 'type=eq.activity' }, payload => {
        setLogs(current => [payload.new, ...current].slice(0, 50));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchInitialLogs = async () => {
    const { data } = await supabase.from('audit_logs').select('*').eq('type', 'activity').order('created_at', { ascending: false }).limit(20);
    if (data) setLogs(data);
  };

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Live Activity Logs ⚡</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Mendengarkan aktivitas seluruh sekolah secara *real-time*.</p>
      </div>
      
      <div className="flex-1 bg-slate-900 rounded-2xl p-6 overflow-hidden flex flex-col shadow-xl border border-slate-800 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          CONNECTED
        </div>
        <div className="flex items-center gap-2 text-slate-500 mb-4 border-b border-slate-800 pb-4 shrink-0">
          <Terminal className="w-5 h-5" />
          <span className="font-mono text-sm">superadmin@saas-core:~$ tail -f /var/log/activity.log</span>
        </div>
        
        <div className="flex-1 overflow-y-auto font-mono text-xs md:text-sm space-y-2 custom-scrollbar">
          {logs.map((log, i) => (
            <div key={log.id} className="animate-fade-in flex gap-3">
              <span className="text-slate-500 shrink-0">[{new Date(log.created_at).toLocaleTimeString('id-ID')}]</span>
              <span className="text-emerald-400 font-bold shrink-0">[{log.action}]</span>
              <span className="text-slate-300">{log.details}</span>
              <span className="text-slate-600 text-[10px] ml-auto shrink-0">{log.ip_address}</span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-slate-500 animate-pulse">Menunggu aktivitas masuk...</div>}
        </div>
      </div>
    </div>
  );
}
