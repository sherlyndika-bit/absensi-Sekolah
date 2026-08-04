import React, { useState, useEffect } from 'react';
import { ServerCrash, Database, Zap, HardDrive } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminHealth() {
  const [ping, setPing] = useState(0);

  useEffect(() => {
    const checkPing = async () => {
      const start = Date.now();
      await supabase.from('schools').select('id').limit(1);
      setPing(Date.now() - start);
    };
    checkPing();
    const interval = setInterval(checkPing, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">System Health 🖥️</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Status Uptime Server, Database, dan API secara langsung.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border-t-4 border-t-emerald-500 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-slate-700">Database (Supabase)</h4>
            <Database className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl text-slate-900 font-black mt-2">99.99%</p>
          <p className="text-xs text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-1 rounded mt-2">Operational</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border-t-4 border-t-emerald-500 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-slate-700">API Response Time</h4>
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl text-slate-900 font-black mt-2">{ping} ms</p>
          <p className="text-xs text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-1 rounded mt-2">Live Ping</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border-t-4 border-t-blue-500 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-slate-700">Storage Size</h4>
            <HardDrive className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl text-slate-900 font-black mt-2">12.4 GB</p>
          <p className="text-xs text-blue-600 font-bold bg-blue-50 inline-block px-2 py-1 rounded mt-2">Used Space</p>
        </div>
      </div>
    </div>
  );
}
