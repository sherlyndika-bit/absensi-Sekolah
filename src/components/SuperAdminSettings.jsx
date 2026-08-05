import React, { useState, useEffect } from 'react';
import { Settings, Shield, UserPlus, Key, Save, Trash2, CreditCard } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminSettings({ user }) {
  const [activeTab, setActiveTab] = useState('general');
  const [staffList, setStaffList] = useState([]);
  const [pricingConfig, setPricingConfig] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ targetUserId: '', newPassword: '' });

  const isOwner = user?.role === 'owner';
  const isManager = user?.role === 'manager';
  const isSuperadmin = user?.role === 'superadmin';
  const canManageStaff = isOwner || isManager;

  useEffect(() => {
    if (activeTab === 'staff') {
      fetchStaff();
    } else if (activeTab === 'pricing') {
      fetchPricing();
    }
  }, [activeTab]);

  const fetchStaff = async () => {
    const { data } = await supabase.from('users').select('*').in('role', ['owner', 'superadmin', 'manager', 'devops', 'finance', 'support']).order('role');
    if (data) setStaffList(data);
  };

  const fetchPricing = async () => {
    const { data } = await supabase.from('global_settings').select('*').eq('key', 'pricing_config').single();
    if (data && data.value) {
      setPricingConfig(JSON.parse(data.value));
    }
  };

  const handleSavePricing = async () => {
    await supabase.from('global_settings').upsert({ key: 'pricing_config', value: JSON.stringify(pricingConfig) });
    alert('Pricing saved!');
  };

  const handlePricingChange = (plan, field, value) => {
    setPricingConfig({
      ...pricingConfig,
      [plan]: {
        ...pricingConfig[plan],
        [field]: value
      }
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': case 'superadmin': return 'text-purple-600 bg-purple-100';
      case 'manager': return 'text-indigo-600 bg-indigo-100';
      case 'devops': return 'text-blue-600 bg-blue-100';
      case 'finance': return 'text-emerald-600 bg-emerald-100';
      case 'support': return 'text-amber-600 bg-amber-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    await supabase.from('users').update({ password: passwordForm.newPassword }).eq('id', passwordForm.targetUserId);
    alert('Password updated!');
    setShowPasswordModal(false);
  };

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Platform Settings ⚙️</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Konfigurasi global platform SaaS dan manajemen hak akses staf.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'general' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            General Settings
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${activeTab === 'staff' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            Staff Management
          </button>
          <button 
            onClick={() => setActiveTab('pricing')}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${activeTab === 'pricing' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            Pricing & Plans
          </button>
        </div>

        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">General Settings</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Platform Name</label>
                  <input type="text" defaultValue="Absensi Modern Enterprise" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <button className="mt-4 px-6 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Staff Management</h2>
              
              <div className="space-y-6 mt-6">
                {canManageStaff && (
                  <button className="px-4 py-3 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-100 border border-blue-200 flex items-center gap-2 transition-colors">
                    <UserPlus className="w-4 h-4" /> Buat Akun Staf Baru
                  </button>
                )}

                <div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-sm">
                    {staffList.map(staff => (
                      <div key={staff.id} className="p-4 flex justify-between items-center bg-white hover:bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900">{staff.name} {staff.id === user.id && '(Anda)'}</p>
                          <p className="text-slate-500 text-xs mt-1">Role: <span className={`uppercase px-1.5 py-0.5 rounded text-[10px] font-bold ${getRoleColor(staff.role)}`}>{staff.role}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(staff.id === user.id || isOwner || (isManager && !['owner', 'superadmin', 'manager'].includes(staff.role))) && (
                            <button 
                              onClick={() => { setPasswordForm({targetUserId: staff.id, newPassword: ''}); setShowPasswordModal(true); }}
                              className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                              title="Ganti Password"
                            >
                              <Key className="w-4 h-4"/>
                            </button>
                          )}
                          {canManageStaff && staff.role !== 'superadmin' && staff.id !== user.id && (
                            <button className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Pricing & Plans</h2>
              {pricingConfig ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Basic', 'Pro', 'Enterprise'].map(plan => (
                      <div key={plan} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                        <h3 className="font-black text-lg text-slate-800 mb-4">{plan}</h3>
                        <div className="mb-4">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Harga (Rp)</label>
                          <input 
                            type="number" 
                            value={pricingConfig[plan].price} 
                            onChange={(e) => handlePricingChange(plan, 'price', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Fitur Tersedia</label>
                          {['face_id', 'classes', 'attendance', 'leaves', 'reports', 'geofence', 'broadcast', 'api', 'support'].map(feat => (
                            <label key={feat} className="flex items-center gap-2 mb-2 text-sm">
                              <input 
                                type="checkbox" 
                                checked={pricingConfig[plan].features.includes(feat)}
                                onChange={(e) => {
                                  let feats = [...pricingConfig[plan].features];
                                  if (e.target.checked) feats.push(feat);
                                  else feats = feats.filter(f => f !== feat);
                                  handlePricingChange(plan, 'features', feats);
                                }}
                              />
                              {feat}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSavePricing} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Simpan Konfigurasi</button>
                </div>
              ) : (
                <p>Loading pricing...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">Ubah Password</h3>
            <form onSubmit={handleChangePassword}>
              <input 
                type="text" 
                placeholder="Password Baru" 
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="w-full border border-slate-200 px-4 py-2 rounded-lg mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-slate-500">Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}