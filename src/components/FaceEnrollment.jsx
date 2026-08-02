import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { evaluateFaceQuality } from '../utils/faceAndGeoUtils';
import { UserCheck, Camera, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw, UploadCloud, Info } from 'lucide-react';

export default function FaceEnrollment() {
  const [data, setData] = useState(store.getState());
  const [mode, setMode] = useState('self'); // 'self' or 'admin'
  const [selectedStudentId, setSelectedStudentId] = useState(data.students[2].id); // Ahmad Rizky
  
  const [anglesCaptured, setAnglesCaptured] = useState({
    front: false,
    right: false,
    left: false
  });

  const [qualityScore, setQualityScore] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    return store.subscribe((newState) => setData(newState));
  }, []);

  const currentStudent = data.students.find(s => s.id === selectedStudentId) || data.students[0];

  const handleCaptureAngle = (angleKey) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Run Quality Check Engine
    const check = evaluateFaceQuality();
    
    if (!check.valid) {
      setErrorMessage(check.reason);
      return;
    }

    setAnglesCaptured(prev => ({ ...prev, [angleKey]: true }));
    setQualityScore(check.score);
  };

  const handleResetCapture = () => {
    setAnglesCaptured({ front: false, right: false, left: false });
    setQualityScore(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmitEnrollment = () => {
    if (!anglesCaptured.front || !anglesCaptured.right || !anglesCaptured.left) {
      alert("Harap ambil foto wajah dari 3 sudut terlebih dahulu (Depan, Serong Kanan, Serong Kiri).");
      return;
    }

    if (mode === 'self') {
      store.submitFaceEnrollment(selectedStudentId, {
        front: currentStudent.photoUrl,
        right: currentStudent.photoUrl,
        left: currentStudent.photoUrl
      });
      setSuccessMessage("Pendaftaran Wajah Mandiri Berhasil Terkirim! Status saat ini: PENDING (Menunggu verifikasi Admin/Wali Kelas).");
    } else {
      store.updateEnrollmentStatus(selectedStudentId, 'approved');
      setSuccessMessage("Wajah Siswa Berhasil Terverifikasi dan Disetujui Secara Langsung oleh Admin!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Mode Switcher Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">MODUL PENDAFTARAN WAJAH SISWA (FACE ENROLLMENT)</h2>
              <p className="text-xs text-slate-400">Ekstraksi 128-d Vector Landmark Wajah & Standarisasi Kualitas</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMode('self')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'self' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Self-Enrollment (HP Siswa)
            </button>
            <button
              onClick={() => setMode('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'admin' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin / Orientasi Sekolah
            </button>
          </div>
        </div>

        {/* Info Banner for Approval Status */}
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-3 ${
          mode === 'self' 
            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
            : 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
        }`}>
          <Info className="w-5 h-5 flex-shrink-0" />
          <p>
            {mode === 'self'
              ? 'Pendaftaran Mandiri via HP: Hasil pendaftaran akan berstatus PENDING hingga disetujui manual oleh Admin / Wali Kelas untuk mencegah pemalsuan wajah.'
              : 'Pendaftaran Langsung Petugas Admin: Foto diambil langsung oleh staf sekolah saat orientasi/daftar ulang (Direct Auto Approval).'}
          </p>
        </div>

        {/* Student Selector */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Pilih Siswa yang Didaftarkan Wajahnya:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              handleResetCapture();
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
          >
            {data.students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.classId}) - Status Face Saat Ini: {s.faceEnrollmentStatus.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Angle Capture Grid (Depan, Serong Kanan, Serong Kiri) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">3-Angle Mandatory Photo Capture</h3>
          {qualityScore && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-xs rounded-full border border-emerald-500/30">
              Quality Score: {qualityScore}% (Pass)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Angle 1: Depan */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-3">
            <div className="relative aspect-square rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              <img src={currentStudent.photoUrl} alt="Front" className="w-full h-full object-cover" />
              {anglesCaptured.front && (
                <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              )}
            </div>
            <h4 className="text-xs font-bold text-white">1. Sudut Depan (Front)</h4>
            <button
              onClick={() => handleCaptureAngle('front')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition-all ${
                anglesCaptured.front
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {anglesCaptured.front ? '✔ Terambil' : 'Ambil Foto Depan'}
            </button>
          </div>

          {/* Angle 2: Serong Kanan */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-3">
            <div className="relative aspect-square rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              <img src={currentStudent.photoUrl} alt="Right" className="w-full h-full object-cover transform rotate-6" />
              {anglesCaptured.right && (
                <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              )}
            </div>
            <h4 className="text-xs font-bold text-white">2. Serong Kanan (45°)</h4>
            <button
              onClick={() => handleCaptureAngle('right')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition-all ${
                anglesCaptured.right
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {anglesCaptured.right ? '✔ Terambil' : 'Ambil Foto Kanan'}
            </button>
          </div>

          {/* Angle 3: Serong Kiri */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-3">
            <div className="relative aspect-square rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              <img src={currentStudent.photoUrl} alt="Left" className="w-full h-full object-cover transform -rotate-6" />
              {anglesCaptured.left && (
                <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              )}
            </div>
            <h4 className="text-xs font-bold text-white">3. Serong Kiri (45°)</h4>
            <button
              onClick={() => handleCaptureAngle('left')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition-all ${
                anglesCaptured.left
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {anglesCaptured.left ? '✔ Terambil' : 'Ambil Foto Kiri'}
            </button>
          </div>

        </div>

        {/* Error Alert for Quality Filter Failure */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <div>
              <strong className="block font-bold">Foto Ditolak Oleh Filter Standarisasi Wajah!</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleResetCapture}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700"
          >
            Reset Kamera
          </button>
          <button
            onClick={handleSubmitEnrollment}
            disabled={!anglesCaptured.front || !anglesCaptured.right || !anglesCaptured.left}
            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              anglesCaptured.front && anglesCaptured.right && anglesCaptured.left
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:scale-[1.01]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>SIMPAN MODEL WAJAH SISWA</span>
          </button>
        </div>

      </div>

    </div>
  );
}
