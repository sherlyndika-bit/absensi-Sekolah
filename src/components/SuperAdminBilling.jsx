import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, ExternalLink, Download } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminBilling() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*, schools(name, package_plan)')
      .order('created_at', { ascending: false });
    if (data) setInvoices(data);
    setLoading(false);
  };

  const handleApprove = async (id, school_id) => {
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', id);
    await supabase.from('schools').update({ status: 'active' }).eq('id', school_id);
    fetchInvoices();
  };

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Billing & Payments 💳</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Kelola tagihan pelanggan dan konfirmasi pembayaran manual (jika SumoPod gagal webhook).</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">ID Tagihan</th>
                <th className="px-6 py-4 font-bold text-slate-600">Sekolah (Klien)</th>
                <th className="px-6 py-4 font-bold text-slate-600">Nominal</th>
                <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                <th className="px-6 py-4 font-bold text-slate-600">Tenggat Waktu</th>
                <th className="px-6 py-4 font-bold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{inv.id.substring(0,8)}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {inv.schools?.name}
                    <span className="block text-xs text-slate-500 font-normal">{inv.schools?.package_plan} Plan</span>
                  </td>
                  <td className="px-6 py-4 font-medium">Rp {inv.amount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    {inv.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs">
                        <AlertCircle className="w-3.5 h-3.5" /> Menunggu
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(inv.due_date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download Invoice">
                        <Download className="w-4 h-4" />
                      </button>
                      {inv.status === 'unpaid' && (
                        <button 
                          onClick={() => handleApprove(inv.id, inv.school_id)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100"
                        >
                          Setujui Pembayaran
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && !loading && (
            <div className="p-12 text-center text-slate-500">Tidak ada data tagihan.</div>
          )}
        </div>
      </div>
    </div>
  );
}