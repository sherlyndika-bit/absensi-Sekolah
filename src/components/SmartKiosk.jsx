import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { Tablet, Camera, Wifi, WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SmartKiosk() {
  const [data, setData] = useState(store.getState());
  const [isOffline, setIsOffline] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [detectedStudent, setDetectedStudent] = useState(null);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [offlineBufferCount, setOfflineBufferCount] = useState(0);

  useEffect(() => {
    return store.subscribe((newState) => setData(newState));
  }, []);

  const handleSimulateFaceScan = (student) => {
    if (!scanning || detectedStudent) return;

    setDetectedStudent(student);

    setTimeout(() => {
      const record = {
        studentId: student.id,
        studentName: student.name,
        classId: student.classId,
        parentPhone: student.parentPhone,
        method: 'smart_kiosk',
        distanceMeters: 1.2,
        livenessPassed: true,
        photoProofUrl: student.photoUrl,
        status: 'Hadir'
      };

      if (isOffline) {
        setOfflineBufferCount(prev => prev + 1);
      } else {
        store.addAttendance(record);
      }

      setLastCheckIn({
        studentName: student.name,
        classId: student.classId,
        time: new Date().toLocaleTimeString('id-ID'),
        isOffline
      });

      setTimeout(() => {
        setDetectedStudent(null);
      }, 2500);

    }, 1000);
  };

  const handleSyncOfflineData = () => {
    if (offlineBufferCount > 0) {
      alert(`Berhasil menyinkronkan ${offlineBufferCount} transaksi absensi lokal ke Supabase Database!`);
      setOfflineBufferCount(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="clean-card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
            <Tablet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Smart Kiosk Tablet Gerbang Utama</h2>
            <p className="text-xs text-slate-500">Kamera Pemindai Wajah Otomatis Siswa</p>
          </div>
        </div>

        {/* Offline Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isOffline
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
            <span>Mode: {isOffline ? 'Offline (Penyimpanan Lokal)' : 'Online (Database)'}</span>
          </button>

          {isOffline && offlineBufferCount > 0 && (
            <button
              onClick={handleSyncOfflineData}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-900 text-white flex items-center gap-1 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync ({offlineBufferCount})
            </button>
          )}
        </div>
      </div>

      {/* Camera Box */}
      <div className="clean-card p-6 space-y-6 text-center">
        
        <div className="relative max-w-md mx-auto aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-300 flex items-center justify-center">
          
          <Camera className="w-12 h-12 text-slate-600" />

          {/* Scanner Box */}
          <div className="absolute inset-8 border border-emerald-400/60 rounded-lg pointer-events-none"></div>

          {/* Status Indicator */}
          <div className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-md text-[11px] text-slate-800 font-medium flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Kamera Standby</span>
          </div>

          {/* Detected Face Banner Popup */}
          {detectedStudent && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-slate-900">
              <img src={detectedStudent.photoUrl} alt={detectedStudent.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 mb-2 shadow-md" />
              <h3 className="text-lg font-bold">{detectedStudent.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{detectedStudent.classId} • Match: 99.4%</p>
              <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ABSENSI TERVERIFIKASI
              </div>
            </div>
          )}

        </div>

        {/* Simulasi Tombol Siswa */}
        <div className="space-y-2 pt-2">
          <p className="text-xs text-slate-500 font-medium">Klik nama siswa untuk mensimulasikan pemindaian wajah:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {data.students.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSimulateFaceScan(s)}
                disabled={!!detectedStudent}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-medium text-slate-800 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <img src={s.photoUrl} alt={s.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Alert Notifikasi WA */}
        {lastCheckIn && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-left flex items-center justify-between text-xs">
            <div>
              <strong className="text-emerald-800 block">Notifikasi WhatsApp Dikirim Ke Orang Tua</strong>
              <span className="text-emerald-700">
                Siswa <strong>{lastCheckIn.studentName}</strong> ({lastCheckIn.classId}) telah tercatat masuk pukul {lastCheckIn.time} WIB.
              </span>
            </div>
            <span className="clean-badge-green px-2 py-0.5 rounded text-[10px] font-semibold">
              Terkiirm
            </span>
          </div>
        )}

      </div>

    </div>
  );
}
