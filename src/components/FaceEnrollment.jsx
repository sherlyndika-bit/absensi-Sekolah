import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { evaluateFaceQuality } from '../utils/faceAndGeoUtils';
import { UserCheck, CheckCircle2, UploadCloud, AlertCircle } from 'lucide-react';

export default function FaceEnrollment() {
  const [data, setData] = useState(store.getState());
  const [mode, setMode] = useState('self');
  const [selectedStudentId, setSelectedStudentId] = useState(() => {
    const students = store.getState().students;
    return students.length > 0 ? students[0].id : '';
  });
  
  const [anglesCaptured, setAnglesCaptured] = useState({ front: false, right: false, left: false });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    return store.subscribe((newState) => {
      setData(newState);
      // Auto-select first student if none selected and data just arrived
      if (!selectedStudentId && newState.students.length > 0) {
        setSelectedStudentId(newState.students[0].id);
      }
    });
  }, [selectedStudentId]);

  const currentStudent = data.students.find(s => s.id === selectedStudentId) || data.students[0] || {};

  const handleCaptureAngle = (angleKey) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const check = evaluateFaceQuality();
    if (!check.valid) {
      setErrorMessage(check.reason);
      return;
    }

    setAnglesCaptured(prev => ({ ...prev, [angleKey]: true }));
  };

  const handleResetCapture = () => {
    setAnglesCaptured({ front: false, right: false, left: false });
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmitEnrollment = () => {
    if (!anglesCaptured.front || !anglesCaptured.right || !anglesCaptured.left) {
      alert("Harap ambil foto 3 sudut terlebih dahulu (Depan, Kanan, Kiri).");
      return;
    }

    if (mode === 'self') {
      store.submitFaceEnrollment(selectedStudentId, {
        front: currentStudent.photoUrl,
        right: currentStudent.photoUrl,
        left: currentStudent.photoUrl
      });
      setSuccessMessage("Pendaftaran Wajah Mandiri Berhasil! Status: Pending (Menunggu verifikasi admin).");
    } else {
      store.updateEnrollmentStatus(selectedStudentId, 'approved');
      setSuccessMessage("Wajah Siswa Berhasil Disetujui Langsung oleh Admin!");
    }
  };

  if (data.students.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 clean-card text-center space-y-3">
        <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-700">Belum Ada Data Siswa</h2>
        <p className="text-sm text-slate-500">Silakan tambahkan data siswa terlebih dahulu di menu Dashboard Admin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="clean-card p-6 space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Pendaftaran Wajah Siswa</h2>
              <p className="text-[11px] text-slate-500">Foto 3 Sudut & Standarisasi Kualitas</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setMode('self')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                mode === 'self' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Self-Enrollment (HP)
            </button>
            <button
              onClick={() => setMode('admin')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                mode === 'admin' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Admin Sekolah
            </button>
          </div>
        </div>

        {/* Form Pilihan Siswa */}
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Pilih Siswa:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              handleResetCapture();
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-900"
          >
            {data.students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.classId}) - Status: {s.faceEnrollmentStatus.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Grid 3 Sudut Foto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-2">
            <div className="relative aspect-square sm:aspect-auto sm:h-24 md:h-32 rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center">
              <img src={currentStudent.photoUrl} alt="Depan" className="w-full h-full object-cover" />
              {anglesCaptured.front && (
                <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </div>
            <h4 className="text-[11px] font-bold text-slate-700">Depan</h4>
            <button
              onClick={() => handleCaptureAngle('front')}
              className={`w-full py-1.5 text-[11px] font-bold rounded transition-colors ${
                anglesCaptured.front ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              {anglesCaptured.front ? 'Tersimpan' : 'Foto Depan'}
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-2">
            <div className="relative aspect-square sm:aspect-auto sm:h-24 md:h-32 rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center">
              <img src={currentStudent.photoUrl} alt="Kanan" className="w-full h-full object-cover transform rotate-6" />
              {anglesCaptured.right && (
                <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </div>
            <h4 className="text-[11px] font-bold text-slate-700">Serong Kanan</h4>
            <button
              onClick={() => handleCaptureAngle('right')}
              className={`w-full py-1.5 text-[11px] font-bold rounded transition-colors ${
                anglesCaptured.right ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              {anglesCaptured.right ? 'Tersimpan' : 'Foto Kanan'}
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-2">
            <div className="relative aspect-square sm:aspect-auto sm:h-24 md:h-32 rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center">
              <img src={currentStudent.photoUrl} alt="Kiri" className="w-full h-full object-cover transform -rotate-6" />
              {anglesCaptured.left && (
                <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </div>
            <h4 className="text-[11px] font-bold text-slate-700">Serong Kiri</h4>
            <button
              onClick={() => handleCaptureAngle('left')}
              className={`w-full py-1.5 text-[11px] font-bold rounded transition-colors ${
                anglesCaptured.left ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              {anglesCaptured.left ? 'Tersimpan' : 'Foto Kiri'}
            </button>
          </div>

        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-2 pt-1">
          <button onClick={handleResetCapture} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300">
            Reset
          </button>
          <button
            onClick={handleSubmitEnrollment}
            disabled={!anglesCaptured.front || !anglesCaptured.right || !anglesCaptured.left}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
              anglesCaptured.front && anglesCaptured.right && anglesCaptured.left
                ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>SIMPAN MODEL WAJAH</span>
          </button>
        </div>

      </div>

    </div>
  );
}
