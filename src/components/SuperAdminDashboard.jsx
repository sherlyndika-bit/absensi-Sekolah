import React, { useState, useEffect } from 'react';
import { Building2, MessageSquare, Package, ChevronRight, Activity, Users, School, Star, Save } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setSchools(data);
    setLoading(false);
  };

  const openChat = async (school) => {
    setSelectedSchool(school);
    fetchMessages(school.id);
  };

  const fetchMessages = async (schoolId) => {
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: true });
    
    if (data) setChatMessages(data);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSchool) return;

    const msg = {
      school_id: selectedSchool.id,
      sender_role: 'superadmin',
      message: newMessage.trim()
    };

    setNewMessage('');
    
    const { error } = await supabase.from('support_messages').insert([msg]);
    if (!error) {
      fetchMessages(selectedSchool.id);
    }
  };

  const savePackage = async (schoolId, newPackage) => {
    const { error } = await supabase
      .from('schools')
      .update({ package_plan: newPackage })
      .eq('id', schoolId);
    
    if (!error) {
      setEditingPackage(null);
      fetchSchools();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Memuat data klien...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">SaaS Owner Dashboard 👑</h1>
        <p className="text-slate-500 mt-1">Pantau semua klien dan kelola langganan.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Tenant List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Daftar Sekolah Terdaftar ({schools.length})
              </h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {schools.map(school => (
                <div key={school.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{school.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                        {school.level}
                      </span>
                      <span className="text-slate-400 text-sm">
                        URL: <span className="text-blue-600 font-medium font-mono">/{school.slug}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Package Badge */}
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
                        <button onClick={() => setEditingPackage(null)} className="text-xs text-slate-500 ml-1">Batal</button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setEditingPackage(school.id)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                          school.package_plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                          school.package_plan === 'Pro' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        {school.package_plan || 'Basic'}
                      </div>
                    )}

                    {/* Chat Button */}
                    <button 
                      onClick={() => openChat(school)}
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ml-2"
                      title="Support Chat"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {schools.length === 0 && (
                <div className="p-8 text-center text-slate-500">Belum ada sekolah yang mendaftar.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Chat Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Customer Support
              </h2>
              {selectedSchool ? (
                <p className="text-xs text-slate-500 mt-1">Mengobrol dengan Admin {selectedSchool.name}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Pilih sekolah di daftar untuk membalas pesan.</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {!selectedSchool ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center">
                  Pilih sekolah untuk melihat obrolan.
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center">
                  Belum ada pesan.
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_role === 'superadmin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender_role === 'superadmin' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedSchool && (
              <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Tulis balasan..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Kirim
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
