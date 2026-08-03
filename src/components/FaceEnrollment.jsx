import React, { useState, useEffect, useRef } from 'react';
import { store } from '../firebase/services';
import { UserCheck, CheckCircle2, UploadCloud, AlertCircle, Camera, ScanFace } from 'lucide-react';

export default function FaceEnrollment() {
  const [data, setData] = useState(store.getState());
  const [selectedStudentId, setSelectedStudentId] = useState(() => {
    const students = store.getState().students;
    return students.length > 0 ? students[0].id : '';
  });
  
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState(''); // 'scanning', 'detected', 'captured'
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanTimerRef = useRef(null);

  useEffect(() => {
    return store.subscribe((newState) => {
      setData(newState);
      if (!selectedStudentId && newState.students.length > 0) {
        setSelectedStudentId(newState.students[0].id);
      }
    });
  }, [selectedStudentId]);

  const currentStudent = data.students.find(s => s.id === selectedStudentId) || data.students[0] || {};
  const fallbackImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/192px-User_icon_2.svg.png";

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const handleOpenCamera = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setCapturedPhoto(null);
    stopCamera();
    
    setIsCameraActive(true);
    setScanStatus('scanning');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);

      // Auto-scan logic (3 seconds)
      scanTimerRef.current = setTimeout(() => {
        setScanStatus('detected');
        
        scanTimerRef.current = setTimeout(() => {
          executeCapture();
        }, 1000);
      }, 2000);

    } catch (err) {
      setErrorMessage("Gagal mengakses kamera. Pastikan browser memiliki izin.");
      setIsCameraActive(false);
      setScanStatus('');
    }
  };

  const executeCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const MAX_WIDTH = 640;
      let targetWidth = video.videoWidth;
      let targetHeight = video.videoHeight;
      if (targetWidth > MAX_WIDTH) {
        targetHeight = Math.floor(targetHeight * (MAX_WIDTH / targetWidth));
        targetWidth = MAX_WIDTH;
      }
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.6);
      
      stopCamera();
      
      setCapturedPhoto(photoDataUrl);
      setIsCameraActive(false);
      setScanStatus('captured');
    }
  };

  const handleResetCapture = () => {
    clearTimeout(scanTimerRef.current);
    stopCamera();
    setCapturedPhoto(null);
    setIsCameraActive(false);
    setScanStatus('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmitEnrollment = () => {
    if (!capturedPhoto) {
      alert("Harap scan wajah terlebih dahulu.");
      return;
    }

    // Directly approve since this is now an Admin-only tool
    store.submitFaceEnrollment(selectedStudentId, { front: capturedPhoto }).then(() => {
      store.updateEnrollmentStatus(selectedStudentId, 'approved');
    });
    setSuccessMessage("Wajah Siswa Berhasil Disimpan & Disetujui!");
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

  const displayImg = capturedPhoto || currentStudent.photoUrl || fallbackImg;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      <div className="clean-card p-6 space-y-5">
        
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
            <ScanFace className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Pendaftaran Wajah Instan</h2>
            <p className="text-[11px] text-slate-500">Auto-Scan Wajah (Admin Mode)</p>
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

        {/* Kotak Scanner Utama */}
        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200 text-center space-y-4">
          <div className="relative aspect-square rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center shadow-inner ring-4 ring-slate-100">
            {isCameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                
                {/* Scanner Overlay UI */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Targeting Box */}
                  <div className="absolute inset-8 border-2 border-dashed border-white/50 rounded-full"></div>
                  
                  {/* Scan Line Animation */}
                  {scanStatus === 'scanning' && (
                    <div className="absolute left-0 right-0 h-1 bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  )}

                  {/* Status Overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg transition-all ${
                      scanStatus === 'scanning' ? 'bg-black/50 text-white border border-white/20' :
                      scanStatus === 'detected' ? 'bg-emerald-500/90 text-white border border-emerald-400 scale-110' :
                      'hidden'
                    }`}>
                      {scanStatus === 'scanning' ? 'Menganalisis Wajah...' : 'Wajah Terdeteksi! 📸'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <img src={displayImg} alt="Profil" className="w-full h-full object-cover" />
                {capturedPhoto && (
                  <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                    <div className="bg-emerald-500 text-white p-3 rounded-full shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {isCameraActive ? (
            <button
              onClick={handleResetCapture}
              className="w-full py-2.5 text-xs font-bold rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200"
            >
              BATALKAN SCAN
            </button>
          ) : (
            <button
              onClick={handleOpenCamera}
              className="w-full py-3 text-xs font-bold rounded-lg bg-slate-800 text-white hover:bg-slate-900 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <ScanFace className="w-4 h-4" /> 
              {capturedPhoto ? 'SCAN ULANG WAJAH' : 'MULAI SCAN WAJAH OTOMATIS'}
            </button>
          )}
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
        <div className="pt-2">
          <button
            onClick={handleSubmitEnrollment}
            disabled={!capturedPhoto}
            className={`w-full py-3.5 rounded-lg font-extrabold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${
              capturedPhoto
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>SIMPAN KE DATABASE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
