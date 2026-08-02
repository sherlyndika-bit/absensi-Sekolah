import React, { useState, useEffect, useRef } from 'react';
import { store } from '../firebase/services';
import { FileText, Camera, CheckCircle2, UploadCloud, Lock } from 'lucide-react';

export default function SickLeaveModule({ loggedInStudent }) {
  const [data, setData] = useState(store.getState());
  const selectedStudent = loggedInStudent;
  
  const [category, setCategory] = useState('Sakit');
  const [reason, setReason] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return store.subscribe((newState) => setData(newState));
  }, []);

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      alert("Kamera tidak dapat diakses. Pastikan Anda memberi izin kamera di browser.");
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
      setPhotoCaptured(photoDataUrl);
    }
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Harap isi alasan pengajuan izin/sakit.");
      return;
    }
    if (!photoCaptured) {
      alert("Harap ambil foto surat keterangan dokter terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const req = store.addLeaveRequest({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        classId: selectedStudent.classId,
        date: new Date().toISOString().split('T')[0],
        category,
        reason,
        medicalNoteUrl: photoCaptured,
        capturedDirectFromCamera: true
      });

      setSuccessMessage(`Permohonan ${category} Berhasil Dikirim ke Wali Kelas! (ID: ${req.id})`);
      setReason('');
      setPhotoCaptured(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      <div className="clean-card p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Pengajuan Izin Sakit & Cuti Siswa</h2>
            <p className="text-[11px] text-slate-500">Unggah Surat Dokter via Kamera HP</p>
          </div>
        </div>

        {/* Info Akun Siswa (Locked) */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
          <img src={selectedStudent.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/192px-User_icon_2.svg.png"} alt={selectedStudent.name} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{selectedStudent.name}</h4>
            <p className="text-xs text-slate-500">NISN: {selectedStudent.nisn} • Kelas: {selectedStudent.classId}</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>Pengambilan foto dilakukan langsung dari kamera HP (Gallery upload disabled untuk keamanan).</span>
        </div>

        <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">


          {/* Kategori */}
          <div>
            <label className="text-slate-600 font-medium mb-1 block">Kategori:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('Sakit')}
                className={`py-2 rounded-lg font-bold border transition-colors ${
                  category === 'Sakit' 
                    ? 'bg-blue-900 text-white border-blue-900' 
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                🏥 Sakit (Surat Dokter)
              </button>
              <button
                type="button"
                onClick={() => setCategory('Izin')}
                className={`py-2 rounded-lg font-bold border transition-colors ${
                  category === 'Izin' 
                    ? 'bg-blue-900 text-white border-blue-900' 
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                📝 Izin Kepentingan Orang Tua
              </button>
            </div>
          </div>

          {/* Alasan */}
          <div>
            <label className="text-slate-600 font-medium mb-1 block">Detail Alasan / Diagnosa Dokter:</label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Demam tinggi 38.5°C, diminta istirahat dokter 2 hari..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900"
            ></textarea>
          </div>

          {/* Kamera Upload */}
          <div>
            <label className="text-slate-600 font-medium mb-1 block">Foto Surat Keterangan Dokter:</label>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-3">
              
              {isCameraOpen ? (
                <div className="space-y-3">
                  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-300">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="w-full py-2.5 bg-blue-900 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" /> AMBIL FOTO SURAT
                  </button>
                </div>
              ) : photoCaptured ? (
                <div className="space-y-2">
                  <img src={photoCaptured} alt="Surat Dokter" className="w-full max-h-40 object-cover rounded-lg border border-slate-300" />
                  <span className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Foto Surat Dokter Terambil
                  </span>
                  <button
                    type="button"
                    onClick={() => { setPhotoCaptured(null); handleOpenCamera(); }}
                    className="mt-2 text-xs text-blue-700 font-bold underline"
                  >
                    Foto Ulang
                  </button>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-slate-500">Foto fisik surat keterangan dokter</p>
                  <button
                    type="button"
                    onClick={handleOpenCamera}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs mx-auto block"
                  >
                    Buka Kamera & Foto Surat
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Alert Sukses */}
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>KIRIM PERMOHONAN IZIN</span>
          </button>

        </form>

      </div>

    </div>
  );
}
