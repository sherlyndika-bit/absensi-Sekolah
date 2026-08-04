import React from 'react';
import { Megaphone, ShieldAlert } from 'lucide-react';

export default function SuperAdminBroadcasts() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Pengumuman Masal 📢</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Kirim notifikasi ke seluruh dashboard sekolah.</p>
      </div>
      
      <div className="mt-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200"><h3 className="font-bold mb-4">Buat Pengumuman Baru</h3><input type="text" placeholder="Judul Pengumuman" className="w-full p-2 border rounded-lg mb-4" /><textarea placeholder="Isi pesan (mendukung Markdown)..." className="w-full p-2 border rounded-lg h-32 mb-4"></textarea><button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Kirim ke 124 Sekolah</button></div>
      </div>
    </div>
  );
}
