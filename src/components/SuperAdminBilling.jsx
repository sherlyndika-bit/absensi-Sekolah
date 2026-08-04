import React, { useState, useEffect } from 'react';
import { CreditCard, FileText } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminBilling() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data } = await supabase.from('invoices').select('*, schools(name, package_plan)').order('created_at', { ascending: false });
    if (data) setInvoices(data);
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Memuat Tagihan...</div>;

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tagihan & Keuangan 💳</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Kelola invoice dan metode pembayaran klien (Data Asli).</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">Daftar Invoice</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {invoices.length === 0 ? <p className="p-8 text-center text-slate-500">Belum ada invoice.</p> : invoices.map(inv => (
            <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5"/></div>
                <div>
                  <h4 className="font-bold text-slate-900">Invoice #{inv.id.split('-')[0].toUpperCase()}</h4>
                  <p className="text-xs text-slate-500">{inv.schools?.name} - {inv.schools?.package_plan}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="font-bold text-slate-900">Rp {Number(inv.amount).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-slate-500">Jatuh Tempo: {inv.due_date}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-lg ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                  {inv.status === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
