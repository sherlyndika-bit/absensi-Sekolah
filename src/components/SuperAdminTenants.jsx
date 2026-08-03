import React, { useState, useEffect } from 'react';
import { Building2, Package } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminTenants() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    const { data } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
    if (data) setSchools(data);
    setLoading(false);
  };

  const savePackage = async (schoolId, newPackage) => {
    const { error } = await supabase.from('schools').update({ package_plan: newPackage }).eq('id', schoolId);
    if (!error) {
      setEditingPackage(null);
      fetchSchools();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Memuat data klien...</div>;

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Manajemen Tenant 🏫</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Daftar klien sekolah yang terdaftar di platform Anda.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Total Sekolah ({schools.length})
          </h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {schools.map(school => (
            <div key={school.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{school.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{school.level}</span>
                  <span className="text-slate-400 text-sm">URL: <span className="text-indigo-600 font-medium font-mono">/{school.slug}</span></span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {editingPackage === school.id ? (
                  <div className="flex items-center gap-1">
                    <select 
                      className="text-sm border border-slate-200 rounded-lg p-1.5"
                      defaultValue={school.package_plan}
                      onChange={(e) => savePackage(school.id, e.target.value)}
                    >
                      <option value="Basic">Basic</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                    <button onClick={() => setEditingPackage(null)} className="text-xs text-slate-500 ml-1 hover:underline">Batal</button>
                  </div>
                ) : (
                  <div 
                    onClick={() => setEditingPackage(school.id)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 ${
                      school.package_plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                      school.package_plan === 'Pro' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    {school.package_plan || 'Basic'}
                  </div>
                )}
              </div>
            </div>
          ))}
          {schools.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada sekolah yang mendaftar.</div>}
        </div>
      </div>
    </div>
  );
}
