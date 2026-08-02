import React, { useState, useEffect, useRef } from 'react';
import { store } from '../firebase/services';
import { evaluateFaceQuality } from '../utils/faceAndGeoUtils';
import { UserCheck, CheckCircle2, UploadCloud, AlertCircle, Camera } from 'lucide-react';

export default function FaceEnrollment() {
  const [data, setData] = useState(store.getState());
  const [mode, setMode] = useState('self');
  const [selectedStudentId, setSelectedStudentId] = useState(() => {
    const students = store.getState().students;
    return students.length > 0 ? students[0].id : '';
  });
  
  const [capturedPhotos, setCapturedPhotos] = useState({ front: null, right: null, left: null });
  const [activeCamera, setActiveCamera] = useState(null); // 'front', 'right', 'left'
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const handleOpenCamera = async (angleKey) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setActiveCamera(angleKey);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      setErrorMessage("Gagal mengakses kamera. Pastikan browser memiliki izin.");
      setActiveCamera(null);
    }
  };

  const handleCapturePhoto = (angleKey) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      // Flip for mirror effect
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      setCapturedPhotos(prev => ({ ...prev, [angleKey]: photoDataUrl }));
      setActiveCamera(null);
    }
  };

  const handleResetCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCapturedPhotos({ front: null, right: null, left: null });
    setActiveCamera(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmitEnrollment = () => {
    if (!capturedPhotos.front || !capturedPhotos.right || !capturedPhotos.left) {
      alert("Harap ambil foto 3 sudut terlebih dahulu (Depan, Kanan, Kiri) dengan kamera.");
      return;
    }

    if (mode === 'self') {
      store.submitFaceEnrollment(selectedStudentId, capturedPhotos);
      setSuccessMessage("Pendaftaran Wajah Mandiri Berhasil! Status: Pending (Menunggu verifikasi admin).");
    } else {
      // If admin, we can auto approve
      store.submitFaceEnrollment(selectedStudentId, capturedPhotos).then(() => {
        store.updateEnrollmentStatus(selectedStudentId, 'approved');
      });
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

  const renderAngleBox = (angleKey, label) => {
    const isCameraActive = activeCamera === angleKey;
    const isCaptured = !!capturedPhotos[angleKey];
    const displayImg = capturedPhotos[angleKey] || currentStudent.photoUrl || fallbackImg;

    return (
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-2">
        <div className="relative aspect-square sm:aspect-auto sm:h-24 md:h-32 rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-slate-300">
          {isCameraActive ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
          ) : (
            <img src={displayImg} alt={label} className="w-full h-full object-cover" />
          )}
          
          {isCaptured && !isCameraActive && (
            <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
        </div>
        <h4 className="text-[11px] font-bold text-slate-700">{label}</h4>
        
        {isCameraActive ? (
          <button
            onClick={() => handleCapturePhoto(angleKey)}
            className="w-full py-1.5 text-[11px] font-bold rounded bg-blue-900 text-white flex items-center justify-center gap-1 hover:bg-blue-800"
          >
            <Camera className="w-3 h-3" /> AMBIL FOTO
          </button>
        ) : (
          <button
            onClick={() => handleOpenCamera(angleKey)}
            className={`w-full py-1.5 text-[11px] font-bold rounded transition-colors ${
              isCaptured ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {isCaptured ? 'FOTO ULANG' : 'BUKA KAMERA'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <canvas ref={canvasRef} className="hidden" />
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
          {renderAngleBox('front', 'Depan')}
          {renderAngleBox('right', 'Serong Kanan')}
          {renderAngleBox('left', 'Serong Kiri')}
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
            disabled={!capturedPhotos.front || !capturedPhotos.right || !capturedPhotos.left}
            className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
              capturedPhotos.front && capturedPhotos.right && capturedPhotos.left
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
