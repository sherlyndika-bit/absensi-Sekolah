import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send, Building2 } from 'lucide-react';
import supabase from '../supabase/config';

export default function SuperAdminSupport({ user }) {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      fetchMessages(selectedSchool.id);
      const interval = setInterval(() => fetchMessages(selectedSchool.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSchool]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchSchools = async () => {
    const { data } = await supabase.from('schools').select('*').order('name');
    if (data) setSchools(data);
    setLoading(false);
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
      sender_role: user?.role === 'support' ? 'support' : 'superadmin',
      message: newMessage.trim()
    };

    setNewMessage('');
    await supabase.from('support_messages').insert([msg]);
    fetchMessages(selectedSchool.id);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Memuat...</div>;

  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Customer Support 💬</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Pusat bantuan keluhan Admin Sekolah.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden min-h-0">
        
        {/* Sidebar Klien */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Cari sekolah..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {schools.map(school => (
              <button 
                key={school.id}
                onClick={() => setSelectedSchool(school)}
                className={`w-full text-left p-4 border-b border-slate-100 hover:bg-white transition-colors ${selectedSchool?.id === school.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
              >
                <h3 className="font-bold text-slate-800 text-sm truncate">{school.name}</h3>
                <p className="text-xs text-slate-500 mt-1 truncate">ID: {school.slug}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white relative">
          {selectedSchool ? (
            <>
              <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedSchool.name}</h3>
                  <p className="text-xs text-green-600 font-medium">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">Belum ada obrolan dengan sekolah ini.</div>
                ) : (
                  chatMessages.map(msg => {
                    const isMe = msg.sender_role === 'superadmin' || msg.sender_role === 'support' || msg.sender_role === 'owner';
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                          isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Ketik balasan untuk sekolah..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" /> <span className="hidden sm:inline">Kirim</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">Pilih Sekolah</h3>
              <p className="text-sm">Klik salah satu sekolah di panel kiri untuk melihat riwayat obrolan dan merespon keluhan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
