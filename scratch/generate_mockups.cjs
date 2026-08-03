const fs = require('fs');
const path = require('path');

const components = [
  { name: 'SuperAdminBilling', title: 'Tagihan & Keuangan 💳', desc: 'Kelola invoice dan metode pembayaran klien.', icon: 'CreditCard' },
  { name: 'SuperAdminBroadcasts', title: 'Pengumuman Masal 📢', desc: 'Kirim notifikasi ke seluruh dashboard sekolah.', icon: 'Megaphone' },
  { name: 'SuperAdminAnalytics', title: 'AI Analytics 🧠', desc: 'Prediksi Churn dan Wawasan Bisnis Cerdas.', icon: 'BrainCircuit' },
  { name: 'SuperAdminSecurity', title: 'Keamanan & Anti-DDoS 🛡️', desc: 'Pantau ancaman keamanan dan aktivitas login mencurigakan.', icon: 'ShieldAlert' },
  { name: 'SuperAdminActivity', title: 'Live Activity Logs ⚡', desc: 'Siaran langsung aktivitas dari seluruh sekolah.', icon: 'Activity' },
  { name: 'SuperAdminHealth', title: 'System Health 🖥️', desc: 'Status Uptime Server, Database, dan API.', icon: 'ServerCrash' },
  { name: 'SuperAdminIntegrations', title: 'Marketplace Integrasi 🧩', desc: 'Kelola integrasi pihak ketiga (WhatsApp, Zoom, dll).', icon: 'Puzzle' },
  { name: 'SuperAdminAPI', title: 'Developer API 👨‍💻', desc: 'Manajemen Webhook dan API Key platform.', icon: 'Webhook' },
  { name: 'SuperAdminSettings', title: 'Platform Settings ⚙️', desc: 'Pengaturan Global, White-label, dan Manajemen Staf.', icon: 'Settings' }
];

const dir = path.join(__dirname, '../src/components');

components.forEach(c => {
  const code = `import React from 'react';
import { ${c.icon} } from 'lucide-react';

export default function ${c.name}() {
  return (
    <div className="p-4 sm:p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">${c.title}</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">${c.desc}</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-slate-400 text-center">
        <${c.icon} className="w-20 h-20 mb-6 opacity-20 text-indigo-600" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Modul Sedang Dikembangkan</h3>
        <p className="max-w-md mx-auto text-sm">Halaman <b>${c.name}</b> ini adalah bagian dari fitur Enterprise. Tim *Engineering* kami akan segera merilisnya di update selanjutnya.</p>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, c.name + '.jsx'), code);
  console.log('Created ' + c.name);
});
