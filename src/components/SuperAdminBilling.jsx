import React from 'react';
import { CreditCard, ShieldAlert } from 'lucide-react';

export default function SuperAdminBilling() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tagihan & Keuangan 💳</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Kelola invoice dan metode pembayaran klien.</p>
      </div>
      
      <div className="mt-8">
        <div className="space-y-4"><div className="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center"><div><h4 className="font-bold">Invoice #INV-2026-08</h4><p className="text-xs text-slate-500">SMA N 1 Jakarta - Paket Pro</p></div><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">Lunas (Rp 1.000.000)</span></div><div className="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center"><div><h4 className="font-bold">Invoice #INV-2026-09</h4><p className="text-xs text-slate-500">SMK Budi Utomo - Paket Enterprise</p></div><span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">Menunggu Pembayaran</span></div></div>
      </div>
    </div>
  );
}
