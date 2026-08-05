import React, { useState, useEffect } from 'react';
import { Building2, ArrowLeft, Loader2, CheckCircle2, QrCode } from 'lucide-react';
import supabase from '../supabase/config';

export default function SchoolRegistration({ onBack, onLogin }) {
  const [formData, setFormData] = useState({
    schoolName: '', slug: '', level: 'SMA', packagePlan: 'Basic', adminName: '', adminPhone: '', adminPassword: ''
  });
  const [pricing, setPricing] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.from('global_settings').select('value').eq('key', 'pricing_config').single().then(({data}) => {
      if(data) setPricing(JSON.parse(data.value));
    });
  }, []);

  const handleNext = () => {
    if (step === 1 && (!formData.schoolName || !formData.slug || !formData.adminPhone || !formData.adminPassword)) {
      setError("Harap isi semua kolom."); return;
    }
    setError(null);
    setStep(2);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: existing } = await supabase.from('schools').select('id').eq('slug', formData.slug.toLowerCase()).maybeSingle();
      if (existing) { setError("URL sudah dipakai."); setIsLoading(false); return; }

      const isPaid = formData.packagePlan !== 'Basic' && pricing[formData.packagePlan].price > 0;
      const initialStatus = isPaid ? 'pending_payment' : 'active';

      const { data: schoolData, error: schoolError } = await supabase.from('schools').insert([{ 
        name: formData.schoolName, level: formData.level, slug: formData.slug.toLowerCase(), 
        package_plan: formData.packagePlan, status: initialStatus
      }]).select().single();
      
      if (schoolError) throw schoolError;

      const adminId = `admin_${Date.now()}`;
      const { error: userError } = await supabase.from('users').insert([{
        id: adminId, name: formData.adminName, role: 'admin', parent_phone: formData.adminPhone,
        phone: formData.adminPhone, school_id: schoolData.id, class_id: null, nisn: formData.adminPhone,
        password: formData.adminPassword, enrollment_status: 'approved'
      }]);

      if (userError) throw userError;

      if (isPaid) {
        await supabase.from('invoices').insert([{
          school_id: schoolData.id, amount: pricing[formData.packagePlan].price, status: 'unpaid', due_date: new Date(Date.now() + 86400000).toISOString()
        }]);

        const successUrl = `https://${window.location.host}/${formData.slug.toLowerCase()}`;
        alert(`Dialihkan ke gerbang pembayaran SumoPod QRIS untuk Rp ${pricing[formData.packagePlan].price.toLocaleString('id-ID')}`);
        window.location.href = `/${formData.slug.toLowerCase()}`; 
      } else {
        window.location.href = `/${formData.slug.toLowerCase()}`;
      }
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/3 bg-blue-900 p-8 text-white flex flex-col">
          <button onClick={onBack} className="w-fit p-2 bg-white/10 hover:bg-white/20 rounded-lg mb-8">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="mt-auto mb-auto">
            <h2 className="text-3xl font-black mb-4">Gabung Sekarang.</h2>
            <p className="text-blue-200">Tingkatkan efisiensi sekolah Anda dengan sistem absensi AI terbaik.</p>
          </div>
        </div>

        <div className="w-full md:w-2/3 p-8">
          {error && <div className="p-4 mb-6 rounded-xl bg-rose-50 text-rose-700 text-sm">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-xl mb-4">Data Sekolah & Admin</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nama Sekolah" value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} className="border p-3 rounded-lg w-full" />
                <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="border p-3 rounded-lg w-full">
                  <option>SMP</option><option>SMA</option><option>SMK</option>
                </select>
              </div>
              <div className="flex border rounded-lg overflow-hidden">
                <span className="bg-slate-100 p-3 text-slate-500">{window.location.host}/</span>
                <input type="text" placeholder="slug-sekolah" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="p-3 w-full outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nama Admin" value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} className="border p-3 rounded-lg w-full" />
                <input type="text" placeholder="No WhatsApp (Username)" value={formData.adminPhone} onChange={e => setFormData({...formData, adminPhone: e.target.value})} className="border p-3 rounded-lg w-full" />
              </div>
              <input type="password" placeholder="Password Admin" value={formData.adminPassword} onChange={e => setFormData({...formData, adminPassword: e.target.value})} className="border p-3 rounded-lg w-full" />
              
              <button onClick={handleNext} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold mt-4">Pilih Paket →</button>
            </div>
          )}

          {step === 2 && pricing && (
            <div>
              <h3 className="font-bold text-xl mb-4">Pilih Paket Berlangganan</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['Basic', 'Pro', 'Enterprise'].map(plan => (
                  <div key={plan} onClick={() => setFormData({...formData, packagePlan: plan})} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.packagePlan === plan ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                    <h4 className="font-bold text-lg">{plan}</h4>
                    <p className="text-sm text-slate-500 mb-2">Rp {pricing[plan].price.toLocaleString('id-ID')}</p>
                    <ul className="text-xs space-y-1 text-slate-600">
                      {pricing[plan].features.slice(0,4).map(f => <li key={f}>✓ {f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-4 border rounded-xl font-bold">Kembali</button>
                <button onClick={handlePayment} disabled={isLoading} className="flex-1 bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><QrCode className="w-5 h-5"/> Bayar via SumoPod QRIS</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}