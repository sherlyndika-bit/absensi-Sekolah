import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { getRandomLivenessChallenge, checkDeviceSecurity } from '../utils/faceAndGeoUtils';
import { Smartphone, MapPin, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function StudentMobileApp() {
  const [data, setData] = useState(store.getState());
  const [selectedStudent, setSelectedStudent] = useState(data.students[0]);
  
  const [simulatedDistance, setSimulatedDistance] = useState(15); 
  const [challenge, setChallenge] = useState(getRandomLivenessChallenge());
  
  const [livenessCompleted, setLivenessCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

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

  const handleSimulateLivenessPass = () => setLivenessCompleted(true);

  const handleExecuteCheckIn = () => {
    if (!isInsideGeofence) {
      alert(`Gagal: Posisi Anda (${simulatedDistance}m) di luar radius izin gerbang (${allowedRadius}m)!`);
      return;
    }
    if (!livenessCompleted) {
      alert("Gagal: Harap selesaikan tantangan verifikasi wajah terlebih dahulu.");
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
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      <div className="clean-card p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Absensi Siswa (HP)</h3>
              <p className="text-[11px] text-slate-500">Verifikasi Lokasi & Wajah</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
            NTP Server Sync
          </span>
        </div>

        {/* Pilih Akun Siswa */}
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Akun Siswa:</label>
          <select 
            value={selectedStudent.id}
            onChange={(e) => {
              const std = data.students.find(s => s.id === e.target.value);
              if (std) {
                setSelectedStudent(std);
                handleResetChallenge();
              }
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-900"
          >
            {data.students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.classId})
              </option>
            ))}
          </select>
        </div>

        {/* Status Perangkat */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-center text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Keamanan HP:
          </span>
          <span className="clean-badge-green px-2 py-0.5 rounded text-[10px] font-semibold">
            Clean (No Fake GPS)
          </span>
        </div>

        {/* Geofencing Status */}
        <div className={`p-4 rounded-lg border space-y-2 text-xs ${
          isInsideGeofence
            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
            : 'bg-rose-50/60 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Radius Gerbang Sekolah
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${
              isInsideGeofence ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'
            }`}>
              {isInsideGeofence ? 'Valid' : 'Luar Radius'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span>Jarak Saat Ini:</span>
            <strong className="font-mono">{simulatedDistance} Meter</strong>
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Simulasi Ubah Jarak GPS HP:</span>
              <span className="font-bold text-slate-700">{simulatedDistance}m</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="150" 
              value={simulatedDistance}
              onChange={(e) => setSimulatedDistance(Number(e.target.value))}
              className="w-full accent-blue-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Liveness Challenge */}
        <div className="p-4 rounded-lg border border-slate-200 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-800">Tantangan Wajah (Liveness)</h4>
            <button onClick={handleResetChallenge} className="text-slate-400 hover:text-slate-700 text-[10px] flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Acak
            </button>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="text-2xl">{challenge.icon}</div>
            <p className="text-xs font-bold text-slate-800">{challenge.label}</p>

            {livenessCompleted ? (
              <div className="clean-badge-green px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Wajah Manusia Tervalidasi
              </div>
            ) : (
              <button
                onClick={handleSimulateLivenessPass}
                className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Verifikasi Gerakan Wajah
              </button>
            )}
          </div>
        </div>

        {/* Tombol Check-in */}
        <button
          onClick={handleExecuteCheckIn}
          disabled={!isInsideGeofence || !livenessCompleted || isSubmitting}
          className={`w-full py-3 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
            isInsideGeofence && livenessCompleted && !isSubmitting
              ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-sm'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>SUBMIT PRESENSI SISWA</span>
            </>
          )}
        </button>

        {/* Hasil Sukses */}
        {successResult && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Absensi Berhasil Disimpan!
            </div>
            <p>Waktu Server: {successResult.timeStr} WIB</p>
            <p className="text-[10px] text-emerald-600">Notifikasi WA otomatis terkirim ke orang tua.</p>
          </div>
        )}

      </div>

    </div>
  );
}
