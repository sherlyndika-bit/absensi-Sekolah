import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { FileText, Camera, ShieldAlert, CheckCircle2, UploadCloud, ImageOff, Lock } from 'lucide-react';

export default function SickLeaveModule() {
  const [data, setData] = useState(store.getState());
  const [selectedStudentId, setSelectedStudentId] = useState(data.students[2].id);
  
  const [category, setCategory] = useState('Sakit');
  const [reason, setReason] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const sampleMedicalNoteUrl = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80";

  useEffect(() => {
    return store.subscribe((newState) => setData(newState));
  }, []);

  const selectedStudent = data.students.find(s => s.id === selectedStudentId) || data.students[0];

  const handleSimulateDirectCameraCapture = () => {
    setPhotoCaptured(true);
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Harap isi alasan pengajuan izin/sakit.");
      return;
    }
    if (!photoCaptured) {
      alert("Harap ambil foto surat keterangan dokter langsung dari kamera.");
      return;
    }

    const req = store.addLeaveRequest({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      classId: selectedStudent.classId,
      date: new Date().toISOString().split('T')[0],
      category,
      reason,
      medicalNoteUrl: sampleMedicalNoteUrl,
      capturedDirectFromCamera: true
    });

    setSuccessMessage(`Surat Izin/Sakit berhasil terkirim ke Wali Kelas! ID Pengajuan: ${req.id}`);
    setReason('');
    setPhotoCaptured(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="glass-card-glow p-6 rounded-3xl border border-emerald-500/30 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">PENGAJUAN IZIN SAKIT & CUTI BERBASIS DOKUMEN</h2>
            <p className="text-xs text-slate-400">Pengunggahan Foto Surat Keterangan Dokter Berpengaman Tinggi</p>
          </div>
        </div>

        {/* Anti-Gallery Security Alert */}
        <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3">
          <Lock className="w-6 h-6 flex-shrink-0 text-amber-400" />
          <div>
            <strong className="block font-bold">Fitur Akses Galeri HP Dinonaktifkan (Security Protocol)</strong>
            <span>Foto surat dokter harus diambil secara langsung dari kamera HP secara real-time untuk mencegah penggunaan foto lama/palsu.</span>
          </div>
        </div>

        <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
          
          {/* Student Selector */}
          <div>
            <label className="text-slate-400 mb-1 block">Pilih Siswa:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
            >
              {data.students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.classId})</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-slate-400 mb-1 block">Kategori Pengajuan:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategory('Sakit')}
                className={`py-2.5 rounded-xl font-bold border transition-all ${
                  category === 'Sakit' 
                    ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                🏥 Sakit (Wajib Surat Dokter)
              </button>
              <button
                type="button"
                onClick={() => setCategory('Izin')}
                className={`py-2.5 rounded-xl font-bold border transition-all ${
                  category === 'Izin' 
                    ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                📝 Izin Alasan Penting
              </button>
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <label className="text-slate-400 mb-1 block">Detail Alasan / Diagnosa Dokter:</label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Demam tinggi 38.5°C dan flu berat, diminta istirahat dokter 2 hari..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Direct Camera Capture Trigger */}
          <div>
            <label className="text-slate-400 mb-1 block">Foto Surat Keterangan Dokter (Direct Camera Only):</label>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-3">
              
              {photoCaptured ? (
                <div className="space-y-3">
                  <img src={sampleMedicalNoteUrl} alt="Medical Note" className="w-full max-h-48 object-cover rounded-xl border border-slate-700" />
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Foto Surat Dokter Terambil (Direct Camera Stream)
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-900 text-slate-400 mx-auto flex items-center justify-center border border-slate-800">
                    <Camera className="w-7 h-7" />
                  </div>
                  <p className="text-slate-400">Tekan tombol di bawah untuk membuka kamera langsung:</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-900">
                <span className="text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
                  <ImageOff className="w-3 h-3" /> Upload Galeri Ditolak
                </span>
                <button
                  type="button"
                  onClick={handleSimulateDirectCameraCapture}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {photoCaptured ? 'Ambil Ulang Foto' : 'Buka Kamera & Foto Surat'}
                </button>
              </div>

            </div>
          </div>

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit Request Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-extrabold text-xs transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>KIRIM PERMOHONAN IZIN SAKIT KE FIRESTORE</span>
          </button>

        </form>

      </div>

    </div>
  );
}
