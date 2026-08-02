import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { Users, CheckCircle2, Clock, AlertTriangle, FileSpreadsheet, MapPin, Send, ShieldAlert, Check, X, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(store.getState());
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    return store.subscribe((newState) => setData(newState));
  }, []);

  const totalStudents = data.students.length;
  const totalHadir = data.attendances.filter(a => a.status === 'Hadir').length;
  const totalTerlambat = data.attendances.filter(a => a.status === 'Terlambat').length;
  const totalSakit = data.leaveRequests.filter(r => r.status === 'approved').length;
  const totalAlfa = totalStudents - (totalHadir + totalTerlambat + totalSakit);

  const pendingEnrollments = data.students.filter(s => s.faceEnrollmentStatus === 'pending');
  const pendingLeaves = data.leaveRequests.filter(r => r.status === 'pending');

  const handleApproveEnrollment = (studentId) => {
    store.updateEnrollmentStatus(studentId, 'approved');
  };

  const handleRejectEnrollment = (studentId) => {
    store.updateEnrollmentStatus(studentId, 'rejected');
  };

  const handleApproveLeave = (reqId) => {
    store.updateLeaveStatus(reqId, 'approved');
  };

  const handleRejectLeave = (reqId) => {
    store.updateLeaveStatus(reqId, 'rejected');
  };

  const handleUpdateGeofenceRadius = (e) => {
    store.updateGeofence({ allowedRadiusMeters: Number(e.target.value) });
  };

  return (
    <div className="space-y-6">
      
      {/* Stats Cards Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Siswa</p>
            <h3 className="text-2xl font-extrabold text-white">{totalStudents}</h3>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Hadir Tepat Waktu</p>
            <h3 className="text-2xl font-extrabold text-emerald-400">{totalHadir}</h3>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Terlambat</p>
            <h3 className="text-2xl font-extrabold text-amber-400">{totalTerlambat}</h3>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Izin / Sakit</p>
            <h3 className="text-2xl font-extrabold text-purple-400">{totalSakit}</h3>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4 col-span-2 md:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Belum Absen (Alfa)</p>
            <h3 className="text-2xl font-extrabold text-rose-400">{totalAlfa < 0 ? 0 : totalAlfa}</h3>
          </div>
        </div>

      </div>

      {/* Grid Content: Live Attendance Logs & Geofence Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Attendance Stream Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live Feed Absensi Hari Ini
              </h2>
              <p className="text-xs text-slate-400">Log sinkronisasi Firestore real-time & status Notifikasi WA Ortu</p>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {data.attendances.length} Log Disimpan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Siswa / Kelas</th>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Metode</th>
                  <th className="p-3">Geofence (Jarak)</th>
                  <th className="p-3">Notif WA</th>
                  <th className="p-3">Bukti Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{att.studentName}</div>
                      <div className="text-[10px] text-slate-400">{att.classId} • ID: {att.studentId}</div>
                    </td>
                    <td className="p-3 font-mono text-emerald-400">{att.timeStr}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                        {att.method === 'mobile_liveness' ? '📱 Mobile HP' : att.method === 'smart_kiosk' ? '🖥️ Smart Kiosk' : '⚙️ IoT Gate'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${att.distanceMeters <= data.geofence.allowedRadiusMeters ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                        📍 {att.distanceMeters}m ({att.distanceMeters <= data.geofence.allowedRadiusMeters ? 'Dalam Radius' : 'Luar Radius'})
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30 text-[10px] flex items-center gap-1 w-fit">
                        <Send className="w-3 h-3" /> Terkirim
                      </span>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => setSelectedPhoto(att.photoProofUrl)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Geofence Zone Settings & Pending Approvals */}
        <div className="space-y-6">
          
          {/* Geofence Settings Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Pengaturan Geofence Sekolah
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Sekolah / Zone</label>
                <input 
                  type="text" 
                  value={data.geofence.schoolName}
                  disabled
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Latitude Gate</label>
                  <input type="text" value={data.geofence.centerLatitude} disabled className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-400" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Longitude Gate</label>
                  <input type="text" value={data.geofence.centerLongitude} disabled className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-400" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400">Radius Absensi Diberikan</label>
                  <span className="text-emerald-400 font-bold font-mono">{data.geofence.allowedRadiusMeters} Meter</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="5"
                  value={data.geofence.allowedRadiusMeters} 
                  onChange={handleUpdateGeofenceRadius}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Pending Face Self-Enrollment Approval Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Persetujuan Wajah Mandiri
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] border border-amber-500/30">
                {pendingEnrollments.length} Pending
              </span>
            </div>
            
            {pendingEnrollments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Tidak ada pendaftaran wajah baru yang menunggu verifikasi manual.</p>
            ) : (
              <div className="space-y-3">
                {pendingEnrollments.map((s) => (
                  <div key={s.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <img src={s.photoUrl} alt={s.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{s.name}</h4>
                      <p className="text-[10px] text-slate-400">{s.classId} • Pending Manual Check</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleApproveEnrollment(s.id)}
                        className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40"
                        title="Setujui Wajah"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleRejectEnrollment(s.id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40"
                        title="Tolak Wajah"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Doctor Medical Notes Approval */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-400" />
              Verifikasi Surat Izin Sakit
            </h3>
            {pendingLeaves.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Tidak ada pengajuan surat dokter pending.</p>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((req) => (
                  <div key={req.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">{req.studentName} ({req.classId})</h4>
                        <p className="text-[10px] text-amber-400 font-semibold">{req.category}: {req.reason}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedPhoto(req.medicalNoteUrl)}
                        className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Surat Dokter
                      </button>
                    </div>
                    <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
                      <button 
                        onClick={() => handleRejectLeave(req.id)}
                        className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold"
                      >
                        Tolak
                      </button>
                      <button 
                        onClick={() => handleApproveLeave(req.id)}
                        className="px-2 py-1 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold"
                      >
                        Setujui
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Bukti Pindaian Wajah / Dokumen Surat</h3>
              <button onClick={() => setSelectedPhoto(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedPhoto} alt="Proof" className="w-full rounded-xl max-h-80 object-cover border border-slate-700" />
            <button onClick={() => setSelectedPhoto(null)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl">
              Tutup Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
