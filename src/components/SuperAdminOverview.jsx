import React, { useState, useEffect } from 'react';
import { TrendingUp, Building2, Users, MessageSquare, DollarSign, Activity } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminOverview() {
  const [stats, setStats] = useState({
    activeTenants: 0,
    totalStudents: 0,
    totalSupportTickets: 0,
    estimatedMRR: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      // 1. Dapatkan Total Sekolah (Tenant) & Hitung MRR
      const { data: schools } = await supabase.from('schools').select('package_plan');
      let tenantCount = 0;
      let mrr = 0;
      
      if (schools) {
        tenantCount = schools.length;
        schools.forEach(school => {
          if (school.package_plan === 'Pro') mrr += 1000000;
          else if (school.package_plan === 'Enterprise') mrr += 3500000;
          // Basic = 0 (Gratis/Trial)
        });
      }

      // 2. Dapatkan Total Siswa dari Seluruh Platform
      const { count: studentCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // 3. Dapatkan Total Pesan Support (Tiket Aktif)
      const { count: supportCount } = await supabase
        .from('support_messages')
        .select('*', { count: 'exact', head: true });

      setStats({
        activeTenants: tenantCount,
        totalStudents: studentCount || 0,
        totalSupportTickets: supportCount || 0,
        estimatedMRR: mrr
      });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Menghitung analitik platform...</div>;
  }

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Bisnis Overview 📊</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Data analitik *real-time* langsung dari database Supabase Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: Active Tenants */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sekolah Terdaftar</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.activeTenants}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase">
            Total Klien SaaS Anda
          </div>
        </div>

        {/* Card 2: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Pengguna (Siswa)</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalStudents}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase">
            Jangkauan Seluruh Platform
          </div>
        </div>

        {/* Card 3: MRR (Estimated) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimasi MRR (Pro+)</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Rp {stats.estimatedMRR.toLocaleString('id-ID')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase">
            Pendapatan Berulang Bulanan
          </div>
        </div>

        {/* Card 4: Support Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aktivitas Support</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalSupportTickets}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase">
            Total Interaksi Tiket Pesan
          </div>
        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80 flex flex-col items-center justify-center text-slate-400">
        <Activity className="w-16 h-16 mb-4 opacity-20 text-indigo-500" />
        <p className="font-medium text-sm text-slate-600 mb-1">Live Database Connected</p>
        <p className="text-xs max-w-sm text-center mt-2">Kartu analitik di atas saat ini dikalkulasi secara *real-time* langsung dari database Supabase Anda berdasarkan total sekolah, akun pengguna, paket langganan, dan obrolan yang masuk.</p>
      </div>
    </div>
  );
}
