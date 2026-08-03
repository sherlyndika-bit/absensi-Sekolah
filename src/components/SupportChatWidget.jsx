import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import supabase from '../supabase/config';
import { store } from '../firebase/services';

export default function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const schoolId = store.schoolId;

  useEffect(() => {
    if (schoolId) {
      fetchMessages();
      
      // Simple polling for new messages (in a real app, use Supabase Realtime)
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [schoolId]);

  const fetchMessages = async () => {
    if (!schoolId) return;
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setMessages(data);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !schoolId) return;

    const msg = {
      school_id: schoolId,
      sender_role: 'admin',
      message: newMessage.trim()
    };

    setNewMessage('');
    
    const { error } = await supabase.from('support_messages').insert([msg]);
    if (!error) {
      fetchMessages();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 transition-all origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">Bantuan Pusat (SaaS Owner)</h3>
            <p className="text-xs text-indigo-200">Tinggalkan pesan untuk Super Admin</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 text-sm mt-4">
              Ada kendala dengan sistem? Kirim pesan ke kami!
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.sender_role === 'admin' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button 
              type="submit"
              className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
