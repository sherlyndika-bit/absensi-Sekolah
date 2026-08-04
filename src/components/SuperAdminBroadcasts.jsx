import React, { useState, useEffect } from 'react';
import { Megaphone, Send } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminBroadcasts() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    const { data } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
    if (data) setBroadcasts(data);
  };

  const sendBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !message) return;
    setLoading(true);
    await supabase.from('broadcasts').insert([{ title, message }]);
    setTitle('');
    setMessage('');
    fetchBroadcasts();
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">Pengumuman Masal 📢</h1>
        <p className="text-slate-500 text-sm mb-6">Kirim notifikasi ke seluruh dashboard sekolah secara *real-time*.</p>
        
        <form onSubmit={sendBroadcast} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-4 text-slate-800">Buat Pengumuman Baru</h3>
          <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul Pengumuman" className="w-full p-3 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Isi pesan pengumuman..." className="w-full p-3 border border-slate-200 rounded-xl h-32 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" required></textarea>
          <button disabled={loading} type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 flex items-center gap-2">
            <Send className="w-4 h-4" /> {loading ? 'Mengirim...' : 'Kirim Pengumuman'}
          </button>
        </form>
      </div>

      <div className="w-full md:w-80 flex flex-col gap-4">
        <h3 className="font-bold text-slate-800 pt-2">Riwayat Pengumuman</h3>
        {broadcasts.map(b => (
          <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">{new Date(b.created_at).toLocaleDateString('id-ID')}</p>
            <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{b.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
