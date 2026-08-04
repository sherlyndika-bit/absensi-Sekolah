import React, { useState } from 'react';
import { Settings, Shield, UserPlus, Key, Save } from 'lucide-react';

export default function SuperAdminSettings({ user }) {
  const [activeTab, setActiveTab] = useState('general');
  const isAuthorized = user?.role === 'superadmin' || user?.role === 'owner' || user?.role === 'manager';

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Platform Settings ⚙️</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Konfigurasi global platform SaaS dan manajemen hak akses staf.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Settings */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'general' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            General Settings
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${
              activeTab === 'staff' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Staff Management
            {!isAuthorized && <Shield className="w-4 h-4 opacity-50" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
          
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">General Settings</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Platform Name</label>
                  <input type="text" defaultValue="Absensi Modern Enterprise" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@absenpro.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
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
              <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Kelola akses tim internal Anda.</p>

              {!isAuthorized ? (
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl text-center flex flex-col items-center justify-center">
                  <Shield className="w-12 h-12 text-rose-500 mb-3" />
                  <h3 className="font-bold text-rose-800 mb-1">Akses Ditolak</h3>
                  <p className="text-sm text-rose-600 max-w-sm mx-auto">Hanya Owner dan Manager yang diizinkan mengelola staf. Hubungi atasan Anda untuk membuat akun baru atau mereset password.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Authorized View */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 px-4 py-3 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-100 border border-blue-200 flex items-center justify-center gap-2 transition-colors">
                      <UserPlus className="w-4 h-4" /> Buat Akun Staf Baru
                    </button>
                    <button className="flex-1 px-4 py-3 bg-amber-50 text-amber-700 font-bold text-sm rounded-xl hover:bg-amber-100 border border-amber-200 flex items-center justify-center gap-2 transition-colors">
                      <Key className="w-4 h-4" /> Reset Password Staf
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-700 mb-3 mt-8">Daftar Staf Internal</h3>
                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-sm">
                      <div className="p-4 flex justify-between items-center bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900">John Doe (Anda)</p>
                          <p className="text-slate-500 text-xs">Role: <span className="uppercase text-purple-600 font-bold">{user?.role}</span></p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Active</span>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">Sarah Connor</p>
                          <p className="text-slate-500 text-xs">Role: <span className="uppercase text-slate-600 font-bold">Support</span></p>
                        </div>
                        <button className="text-indigo-600 font-bold text-xs hover:underline">Edit</button>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">Tech Team Lead</p>
                          <p className="text-slate-500 text-xs">Role: <span className="uppercase text-slate-600 font-bold">DevOps</span></p>
                        </div>
                        <button className="text-indigo-600 font-bold text-xs hover:underline">Edit</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
