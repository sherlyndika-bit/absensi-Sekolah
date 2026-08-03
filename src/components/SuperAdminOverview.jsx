import React from 'react';
import { TrendingUp, Users, DollarSign, Activity, BarChart3 } from 'lucide-react';

export default function SuperAdminOverview() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Bisnis Overview 📊</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Ringkasan pendapatan dan pertumbuhan platform SaaS.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total MRR</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Rp 45.5M</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% bulan ini
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Tenants</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">124</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            +8 sekolah baru
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Avg Churn Rate</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">1.2%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-600">
            -0.5% dari bulan lalu
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">LTV</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Rp 12.8M</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-slate-500">
            Lifetime Value per Klien
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80 flex flex-col items-center justify-center text-slate-400">
        <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-medium text-sm">Grafik pertumbuhan MRR tahunan akan dirender di sini.</p>
        <p className="text-xs mt-2">(Gunakan library seperti Recharts untuk implementasi produksi)</p>
      </div>
    </div>
  );
}
