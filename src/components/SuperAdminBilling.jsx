import React from 'react';
import { CreditCard } from 'lucide-react';

export default function SuperAdminBilling() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tagihan & Keuangan 💳</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Kelola invoice dan metode pembayaran klien.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-slate-400 text-center">
        <CreditCard className="w-20 h-20 mb-6 opacity-20 text-indigo-600" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Modul Sedang Dikembangkan</h3>
        <p className="max-w-md mx-auto text-sm">Halaman <b>SuperAdminBilling</b> ini adalah bagian dari fitur Enterprise. Tim *Engineering* kami akan segera merilisnya di update selanjutnya.</p>
      </div>
    </div>
  );
}
