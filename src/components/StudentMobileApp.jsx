import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { calculateHaversineDistance, getRandomLivenessChallenge, evaluateFaceQuality, checkDeviceSecurity } from '../utils/faceAndGeoUtils';
import { Smartphone, MapPin, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2, RefreshCw, AlertOctagon, Send } from 'lucide-react';

export default function StudentMobileApp() {
  const [data, setData] = useState(store.getState());
  const [selectedStudent, setSelectedStudent] = useState(data.students[0]);
  
  // Simulated Location (Defaults to 15 meters from school gate)
  const [simulatedDistance, setSimulatedDistance] = useState(15); 
  const [challenge, setChallenge] = useState(getRandomLivenessChallenge());
  
  const [livenessCompleted, setLivenessCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  // Security status checks
  const securityStatus = checkDeviceSecurity();

  useEffect(() => {
    return store.subscribe((newState) => setData(newState));
  }, []);

  const allowedRadius = data.geofence.allowedRadiusMeters;
  const isInsideGeofence = simulatedDistance <= allowedRadius;

  const handleResetChallenge = () => {
    setChallenge(getRandomLivenessChallenge());
    setLivenessCompleted(false);
    setSuccessResult(null);
  };

  const handleSimulateLivenessPass = () => {
    setLivenessCompleted(true);
  };

  const handleExecuteCheckIn = () => {
    if (!isInsideGeofence) {
      alert(`Gagal Absensi: Posisi Anda (${simulatedDistance}m) berada di luar radius izin gerbang sekolah (${allowedRadius}m)!`);
      return;
    }
    if (!livenessCompleted) {
      alert("Gagal Absensi: Harap selesaikan verifikasi Liveness (Tantangan Kehidupan) terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const record = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        classId: selectedStudent.classId,
        parentPhone: selectedStudent.parentPhone,
        method: 'mobile_liveness',
        distanceMeters: simulatedDistance,
        livenessPassed: true,
        livenessChallenge: challenge.label,
        photoProofUrl: selectedStudent.photoUrl,
        status: 'Hadir'
      };

      const result = store.addAttendance(record);
      setIsSubmitting(false);
      setSuccessResult(result);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Phone Frame Wrapper */}
      <div className="glass-card-glow rounded-3xl p-6 border border-emerald-500/30 space-y-6 shadow-2xl">
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">ABSENSI SISWA MOBILE</h3>
              <p className="text-[11px] text-slate-400">Verifikasi Liveness & Geofencing GPS</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-lg border border-slate-800">
            NTP Server Sync OK
          </span>
        </div>

        {/* Student Selector Dropdown */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Pilih Akun Siswa (Simulasi HP):</label>
          <select 
            value={selectedStudent.id}
            onChange={(e) => {
              const std = data.students.find(s => s.id === e.target.value);
              if (std) {
                setSelectedStudent(std);
                handleResetChallenge();
              }
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
          >
            {data.students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.classId}) - Status Face: {s.faceEnrollmentStatus.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Security Checklist (Mock Location & Root Checks) */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Keamanan Perangkat HP:
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              SAFE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-900">
            <div>Fake GPS: <strong className="text-emerald-400">NONAKTIF</strong></div>
            <div>Root Status: <strong className="text-emerald-400">CLEAN</strong></div>
            <div>VPN Check: <strong className="text-emerald-400">OFF</strong></div>
          </div>
        </div>

        {/* Geofencing Location Status Card */}
        <div className={`p-4 rounded-xl border space-y-3 transition-all ${
          isInsideGeofence
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs">
              <MapPin className={`w-4 h-4 ${isInsideGeofence ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span>GEOFENCING RADIUS CHECK</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${
              isInsideGeofence ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
            }`}>
              {isInsideGeofence ? 'DI DALAM AREA GERBANG' : 'DI LUAR AREA SEKOLAH'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span>Jarak Anda ke Gerbang Sekolah:</span>
            <strong className="font-mono text-sm">{simulatedDistance} Meter</strong>
          </div>

          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>Toleransi Max: {allowedRadius} Meter</span>
            <span>Titik Acuan: Monas Gate (-6.1753, 106.8271)</span>
          </div>

          {/* Location Distance Simulator Slider */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
              <span>Simulasi Ubah Jarak GPS HP Siswa:</span>
              <span className="font-mono text-emerald-400 font-bold">{simulatedDistance}m</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="150" 
              value={simulatedDistance}
              onChange={(e) => setSimulatedDistance(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Liveness Detection Challenge Box */}
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Liveness Verification (Anti-Foto Cetak)
            </h4>
            <button onClick={handleResetChallenge} className="text-slate-400 hover:text-white text-[10px] flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Acak Ulang
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-3">
            <div className="text-3xl animate-bounce">{challenge.icon}</div>
            <div>
              <p className="text-xs text-slate-400">Instruksi Acak dari Server:</p>
              <h3 className="text-sm font-extrabold text-white">{challenge.label}</h3>
            </div>

            {livenessCompleted ? (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Liveness Tervalidasi (Manusia Asli)
              </div>
            ) : (
              <button
                onClick={handleSimulateLivenessPass}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                Lakukan Gerakan Kamera & Verifikasi
              </button>
            )}
          </div>
        </div>

        {/* Execute Check-in Button */}
        <button
          onClick={handleExecuteCheckIn}
          disabled={!isInsideGeofence || !livenessCompleted || isSubmitting}
          className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
            isInsideGeofence && livenessCompleted && !isSubmitting
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:scale-[1.02] shadow-emerald-500/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          {isSubmitting ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>SUBMIT ABSENSI KEHADIRAN</span>
            </>
          )}
        </button>

        {/* Success Modal Notification Result */}
        {successResult && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <CheckCircle2 className="w-5 h-5" /> Absensi Berhasil Disimpan di Firestore!
            </div>
            <p>Siswa: <strong>{successResult.studentName}</strong> ({successResult.classId})</p>
            <p>Waktu Server: <strong>{successResult.timeStr} WIB</strong></p>
            <div className="pt-2 border-t border-emerald-800/60 text-[10px] text-teal-300 flex items-center gap-1">
              <Send className="w-3 h-3" /> Notifikasi WhatsApp otomatis terkirim ke {successResult.parentPhone}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
