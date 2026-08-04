import React, { useState, useEffect } from 'react';
import { Puzzle, MessageCircle, Video } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminIntegrations() {
  const [waToken, setWaToken] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('global_settings').select('*').eq('key', 'whatsapp_gateway').single();
      if (data) setWaToken(data.value);
    };
    fetchSettings();
  }, []);

  const saveWA = async () => {
    setSaving(true);
    await supabase.from('global_settings').upsert({ key: 'whatsapp_gateway', value: waToken, updated_at: new Date() });
    setSaving(false);
  };

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Marketplace Integrasi 🧩</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Kelola token API pihak ketiga secara global (Real Database).</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 border border-slate-200 bg-white rounded-2xl shadow-sm">
          <div className="flex gap-4 items-start mb-6">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">WhatsApp Gateway</h4>
              <p className="text-xs text-slate-500 mt-1">Gunakan layanan pihak ketiga untuk mengirim notifikasi absensi ke orang tua secara masal.</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700">API Token / Session Key</label>
            <input type="text" value={waToken} onChange={e=>setWaToken(e.target.value)} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-green-500" />
            <button onClick={saveWA} disabled={saving} className="bg-green-600 text-white font-bold text-sm px-4 py-2 rounded-lg w-full hover:bg-green-700">
              {saving ? 'Menyimpan...' : 'Simpan Token'}
            </button>
          </div>
        </div>
        
        <div className="p-6 border border-slate-200 bg-white rounded-2xl shadow-sm opacity-70">
          <div className="flex gap-4 items-start mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Zoom API</h4>
              <p className="text-xs text-slate-500 mt-1">Integrasi kelas online untuk fitur e-learning.</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700">Zoom JWT Token</label>
            <input type="text" disabled placeholder="Segera Hadir" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-slate-50" />
            <button disabled className="bg-slate-300 text-slate-500 font-bold text-sm px-4 py-2 rounded-lg w-full">
              Belum Tersedia
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
