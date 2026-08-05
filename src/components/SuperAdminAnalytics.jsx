import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, UserMinus, AlertTriangle, CheckCircle } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminAnalytics() {
  const [churnRisk, setChurnRisk] = useState([]);
  const [stats, setStats] = useState({ mrr: 0, newSchools: 0, activeSchools: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    // 1. Fetch Pricing Config
    const { data: pricingData } = await supabase.from('global_settings').select('value').eq('key', 'pricing_config').single();
    let pricing = { Basic: {price: 0}, Pro: {price: 1000000}, Enterprise: {price: 3500000} };
    if (pricingData) pricing = JSON.parse(pricingData.value);

    // 2. Fetch Active Schools
    const { data: schools } = await supabase.from('schools').select('*').eq('status', 'active');
    
    // Calculate MRR
    let mrr = 0;
    schools?.forEach(s => {
      if (pricing[s.package_plan]) mrr += pricing[s.package_plan].price;
    });

    // 3. Find Churn Risk (No attendance in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data: recentAttendance } = await supabase.from('attendance').select('school_id').gte('created_at', sevenDaysAgo);
    
    const activeSchoolIds = new Set(recentAttendance?.map(a => a.school_id));
    const atRisk = schools?.filter(s => !activeSchoolIds.has(s.id)) || [];

    setStats({
      mrr,
      newSchools: schools?.filter(s => new Date(s.created_at) > new Date(Date.now() - 30 * 86400000)).length || 0,
      activeSchools: schools?.length || 0
    });
    setChurnRisk(atRisk);
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Menghitung AI Analytics...</div>;

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">AI Analytics 🧠</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Menganalisis pendapatan (MRR) dan risiko klien berhenti (Churn).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl"><TrendingUp className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">MRR (Bulanan)</p>
            <p className="text-2xl font-black text-slate-900">Rp {stats.mrr.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Users className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Sekolah Aktif</p>
            <p className="text-2xl font-black text-slate-900">{stats.activeSchools}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl"><CheckCircle className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Klien Baru (30 Hari)</p>
            <p className="text-2xl font-black text-slate-900">+{stats.newSchools}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <AlertTriangle className="w-6 h-6 text-rose-500" />
          <h2 className="text-lg font-bold text-slate-800">AI Churn Risk Detector</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">Sekolah di bawah ini tidak memiliki data absensi masuk dalam 7 hari terakhir. Terdapat risiko mereka berhenti berlangganan.</p>
        
        {churnRisk.length > 0 ? (
          <div className="space-y-4">
            {churnRisk.map(school => (
              <div key={school.id} className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-rose-900">{school.name}</h3>
                  <p className="text-xs text-rose-600 mt-1">Paket: {school.package_plan} • URL: /{school.slug}</p>
                </div>
                <button className="px-4 py-2 bg-white text-rose-600 font-bold text-sm rounded-lg shadow-sm">Hubungi Klien</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-emerald-50 text-emerald-700 text-center rounded-xl font-bold">
            Semua sekolah aktif menggunakan sistem! Tidak ada risiko Churn terdeteksi.
          </div>
        )}
      </div>
    </div>
  );
}