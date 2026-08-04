import React, { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2 } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminAPI() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    const { data } = await supabase.from('api_keys').select('*').order('created_at', { ascending: false });
    if (data) setKeys(data);
    setLoading(false);
  };

  const generateKey = async () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substr(2, 16);
    await supabase.from('api_keys').insert([{ key_string: newKey, description: 'Generated Token' }]);
    fetchKeys();
  };

  const deleteKey = async (id) => {
    await supabase.from('api_keys').delete().eq('id', id);
    fetchKeys();
  };

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Developer API 👨‍💻</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Manajemen API Key platform untuk diakses secara *headless*.</p>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-lg">API Keys Aktif</h3>
          <button onClick={generateKey} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Buat Token Baru
          </button>
        </div>
        
        {loading ? <p className="text-slate-500 text-sm">Memuat keys...</p> : (
          <div className="space-y-3">
            {keys.length === 0 && <p className="text-slate-400 text-sm">Belum ada API key.</p>}
            {keys.map(k => (
              <div key={k.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-200 transition-colors">
                <div>
                  <span className="font-mono text-sm font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">{k.key_string}</span>
                  <p className="text-xs text-slate-500 mt-2">{k.description} • Dibuat: {new Date(k.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => deleteKey(k.id)} className="text-rose-500 hover:text-rose-700 p-2 bg-white rounded-lg border border-rose-100 self-start sm:self-auto">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
