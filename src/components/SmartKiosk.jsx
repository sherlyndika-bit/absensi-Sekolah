import React, { useState, useEffect, useRef } from 'react';
import { store } from '../firebase/services';
import { Tablet, Camera, Wifi, WifiOff, CheckCircle2, ShieldCheck, RefreshCw, Volume2, Sparkles } from 'lucide-react';

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

  // Automatic Face Detection Simulation Loop
  const handleSimulateFaceScan = (student) => {
    if (!scanning || detectedStudent) return;

    setDetectedStudent(student);

    setTimeout(() => {
      // Execute Check-in
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

      // Reset scanner after 3 seconds
      setTimeout(() => {
        setDetectedStudent(null);
      }, 3000);

    }, 1200);
  };

  const handleSyncOfflineData = () => {
    if (offlineBufferCount > 0) {
      alert(`Berhasil menyinkronkan ${offlineBufferCount} transaksi absensi lokal ke Google Cloud Firestore!`);
      setOfflineBufferCount(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Kiosk Header Banner */}
      <div className="glass-card-glow p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-emerald-500/20">
            <Tablet className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">SMART KIOSK GATE SCANNER</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                Tablet Android / iPad Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">Pemindaian Otomatis Wajah Siswa di Gerbang Utama Sekolah</p>
          </div>
        </div>

        {/* Offline Toggle Simulator */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isOffline
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            <span>Mode Internet: {isOffline ? 'OFFLINE (Lokal Storage)' : 'ONLINE (Firestore)'}</span>
          </button>

          {isOffline && offlineBufferCount > 0 && (
            <button
              onClick={handleSyncOfflineData}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-lg shadow-emerald-500/20 animate-pulse"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync ({offlineBufferCount})
            </button>
          )}
        </div>
      </div>

      {/* Camera Viewfinder Box */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6 text-center">
        
        <div className="relative max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500/30 shadow-2xl flex items-center justify-center">
          
          {/* Background Camera Mesh Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950 flex items-center justify-center">
            <Camera className="w-16 h-16 text-slate-800 animate-pulse" />
          </div>

          {/* Scanner Overlay Box */}
          <div className="absolute inset-8 border-2 border-dashed border-emerald-400/50 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
              <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
            </div>
            
            {/* Active Scanning Line */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan shadow-[0_0_15px_#22c55e]"></div>

            <div className="flex justify-between">
              <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
              <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>
            </div>
          </div>

          {/* Status Indicator inside Viewfinder */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>AI FACE MATCHING ACTIVE</span>
          </div>

          {/* Detected Face Banner Popup */}
          {detectedStudent && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white animate-fade-in">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-400 overflow-hidden mb-3 shadow-xl">
                <img src={detectedStudent.photoUrl} alt={detectedStudent.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-black">{detectedStudent.name}</h3>
              <p className="text-xs text-emerald-300 font-medium">{detectedStudent.classId} • Match Confidence: 99.4%</p>
              <div className="mt-3 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" /> ABSENSI TERVERIFIKASI
              </div>
            </div>
          )}

        </div>

        {/* Live Simulation Trigger Buttons */}
        <div className="space-y-3 pt-2">
          <p className="text-xs text-slate-400 font-medium">Klik nama siswa di bawah untuk mensimulasikan siswa berjalan mendekati Kiosk:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {data.students.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSimulateFaceScan(s)}
                disabled={!!detectedStudent}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                <img src={s.photoUrl} alt={s.name} className="w-6 h-6 rounded-full object-cover" />
                <span>{s.name} ({s.classId})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Alert Banner for Parents */}
        {lastCheckIn && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Notifikasi WhatsApp Dikirim Ke Orang Tua</h4>
                <p className="text-[11px] text-slate-400">
                  Ananda <strong className="text-emerald-400">{lastCheckIn.studentName}</strong> tercatat masuk pada {lastCheckIn.time} WIB. 
                  {lastCheckIn.isOffline && ' (Tersimpan di Cache Offline Tablet)'}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
              WA API OK
            </span>
          </div>
        )}

      </div>

    </div>
  );
}
