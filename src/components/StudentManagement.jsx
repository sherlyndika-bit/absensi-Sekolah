import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { Users, Plus, Trash2, Edit2, Check, X, ShieldAlert } from 'lucide-react';

export default function StudentManagement() {
  const [data, setData] = useState(store.getState());

  const getAvailableClasses = () => {
    const level = data.schoolInfo?.level || '';
    if (level === 'SD') return ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
    if (level === 'SMP') return ['7A', '7B', '8A', '8B', '9A', '9B'];
    if (level === 'SMA') return ['10-IPA', '10-IPS', '11-IPA', '11-IPS', '12-IPA', '12-IPS'];
    if (level === 'SMK') return ['10-RPL', '10-TKJ', '11-RPL', '11-TKJ', '12-RPL', '12-TKJ'];
    return ['Kelas A', 'Kelas B']; // Default fallback
  };

  const availableClasses = getAvailableClasses();

  useEffect(() => {
    return store.subscribe((newState) => setData(newState));
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [nisn, setNisn] = useState('');
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentName, setParentName] = useState('');

  const resetForm = () => {
    setNisn('');
    setName('');
    setClassId('');
    setParentPhone('');
    setParentName('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!nisn || !name || !classId) return;

    if (editingId) {
      store.updateStudent(editingId, { nisn, name, classId, parentPhone, parentName });
    } else {
      store.addStudent({ nisn, name, classId, parentPhone, parentName });
    }
    resetForm();
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setNisn(student.nisn);
    setName(student.name);
    setClassId(student.classId);
    setParentPhone(student.parentPhone || '');
    setParentName(student.parentName || '');
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
      store.deleteStudent(id);
    }
  };

  return (
    <div className="clean-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-900" /> Manajemen Data Siswa
          </h3>
          <p className="text-xs text-slate-500">Tambah, edit, dan hapus data identitas siswa.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="px-3 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Siswa
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4 mb-4">
          <h4 className="font-bold text-xs text-slate-800">{editingId ? 'Edit Data Siswa' : 'Input Siswa Baru'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1">NISN (Untuk Login Siswa)</label>
              <input type="text" required value={nisn} onChange={e => setNisn(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-900" placeholder="0051234567" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Nama Lengkap</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-900" placeholder="Budi Santoso" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Kelas</label>
              <select 
                required 
                value={classId} 
                onChange={e => setClassId(e.target.value)} 
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-900 bg-white"
              >
                <option value="" disabled>Pilih Kelas</option>
                {availableClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Nama Orang Tua</label>
              <input type="text" value={parentName} onChange={e => setParentName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-900" placeholder="Bapak Santoso" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">No. WhatsApp Ortu</label>
              <input type="text" value={parentPhone} onChange={e => setParentPhone(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-900" placeholder="6281234567890" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-md flex items-center gap-1 hover:bg-emerald-700">
              <Check className="w-4 h-4" /> Simpan Data
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-md hover:bg-slate-300">
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
        <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
          <thead className="bg-slate-50 uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-3">NISN</th>
              <th className="p-3">Nama Siswa</th>
              <th className="p-3">Kelas</th>
              <th className="p-3">Kontak Ortu</th>
              <th className="p-3">Status Wajah</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.students.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">Belum ada data siswa. Silakan klik Tambah Siswa.</td>
              </tr>
            ) : (
              data.students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-blue-900 font-medium">{student.nisn}</td>
                  <td className="p-3 font-semibold text-slate-900">{student.name}</td>
                  <td className="p-3 text-slate-500">{student.classId}</td>
                  <td className="p-3 text-slate-500">{student.parentPhone}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      student.faceEnrollmentStatus === 'approved' ? 'clean-badge-green' : 
                      student.faceEnrollmentStatus === 'pending' ? 'clean-badge-amber' : 'clean-badge-red'
                    }`}>
                      {student.faceEnrollmentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => handleEdit(student)} className="p-1.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-1.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100" title="Hapus">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
