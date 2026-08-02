import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { Users, CheckCircle2, Clock, AlertCircle, FileText, MapPin, Send, Check, X, Eye, Crosshair } from 'lucide-react';
import StudentManagement from './StudentManagement';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

const schoolIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: #1e3a8a; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>`,
  iconAnchor: [14, 14]
});

function MapUpdater({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

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

  const handleApproveEnrollment = (studentId) => store.updateEnrollmentStatus(studentId, 'approved');
  const handleRejectEnrollment = (studentId) => store.updateEnrollmentStatus(studentId, 'rejected');
  const handleApproveLeave = (reqId) => store.updateLeaveStatus(reqId, 'approved');
  const handleRejectLeave = (reqId) => store.updateLeaveStatus(reqId, 'rejected');
  const handleUpdateGeofenceRadius = (e) => store.updateGeofence({ allowedRadiusMeters: Number(e.target.value) });
  
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung Geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if (confirm(`Pindahkan gerbang sekolah ke kordinat Anda saat ini?\n(Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)})`)) {
        store.updateGeofence({ centerLatitude: lat, centerLongitude: lng });
      }
    }, (err) => {
      alert("Gagal mendapatkan lokasi: " + err.message);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dashboard Kehadiran Siswa</h2>
          <p className="text-xs text-slate-500">Ringkasan presensi harian, log absensi real-time, dan verifikasi dokumen.</p>
        </div>
        <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
          Hari ini: <strong className="text-slate-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
        </div>
      </div>

      {/* Ringkasan Statistik Presensi */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="clean-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Siswa</p>
            <h3 className="text-xl font-bold text-slate-900">{totalStudents}</h3>
          </div>
        </div>

        <div className="clean-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Hadir Tepat Waktu</p>
            <h3 className="text-xl font-bold text-emerald-600">{totalHadir}</h3>
          </div>
        </div>

        <div className="clean-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Terlambat</p>
            <h3 className="text-xl font-bold text-amber-600">{totalTerlambat}</h3>
          </div>
        </div>

        <div className="clean-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Izin / Sakit</p>
            <h3 className="text-xl font-bold text-blue-600">{totalSakit}</h3>
          </div>
        </div>

        <div className="clean-card p-4 flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Belum Absen (Alfa)</p>
            <h3 className="text-xl font-bold text-rose-600">{totalAlfa < 0 ? 0 : totalAlfa}</h3>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Log Absensi */}
        <div className="lg:col-span-2 clean-card p-5 space-y-4 flex flex-col min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Log Presensi Real-Time</h3>
              <p className="text-xs text-slate-500">Data kehadiran siswa yang masuk hari ini</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap">
              {data.attendances.length} Catatan
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50 uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Siswa</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Metode</th>
                  <th className="p-3">Jarak GPS</th>
                  <th className="p-3">WA Ortu</th>
                  <th className="p-3 text-center">Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.attendances.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">Belum ada riwayat absensi.</td>
                  </tr>
                ) : (
                  data.attendances.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">{att.studentName}</td>
                      <td className="p-3 text-slate-500">{att.classId}</td>
                      <td className="p-3 font-mono font-medium text-blue-900">{att.timeStr}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {att.method === 'mobile_liveness' ? 'HP Siswa' : att.method === 'smart_kiosk' ? 'Kiosk Gate' : 'IoT Gate'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          att.distanceMeters <= data.geofence.allowedRadiusMeters 
                            ? 'clean-badge-green' 
                            : 'clean-badge-red'
                        }`}>
                          {att.distanceMeters}m ({att.distanceMeters <= data.geofence.allowedRadiusMeters ? 'Valid' : 'Luar Area'})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="clean-badge-green px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                          <Send className="w-3 h-3" /> Terkirim
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => setSelectedPhoto(att.photoProofUrl)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Lihat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Kanan: Geofence & Persetujuan Wajah/Izin */}
        <div className="space-y-6">
          
          {/* Pengaturan Geofence Sekolah */}
          <div className="clean-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-900" />
              Radius Geofence Sekolah
            </h3>
            <div className="space-y-3 text-xs">
              
              {/* Map Preview */}
              <div className="rounded-lg overflow-hidden border border-slate-200 h-32 relative z-0">
                <MapContainer 
                  center={[data.geofence.centerLatitude, data.geofence.centerLongitude]} 
                  zoom={16} 
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  <MapUpdater center={[data.geofence.centerLatitude, data.geofence.centerLongitude]} />
                  <Circle 
                    center={[data.geofence.centerLatitude, data.geofence.centerLongitude]} 
                    radius={data.geofence.allowedRadiusMeters} 
                    pathOptions={{ color: '#1e3a8a', fillColor: '#3b82f6', fillOpacity: 0.15 }} 
                  />
                  <Marker position={[data.geofence.centerLatitude, data.geofence.centerLongitude]} icon={schoolIcon} />
                </MapContainer>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-500 font-bold">Titik Pusat Kordinat</label>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={`${data.geofence.centerLatitude.toFixed(5)}, ${data.geofence.centerLongitude.toFixed(5)}`} disabled className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 font-mono text-[10px]" />
                  <button onClick={handleUseMyLocation} className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors" title="Gunakan Lokasi Saya Saat Ini">
                    <Crosshair className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-500">Radius Izin Absen</label>
                  <span className="text-blue-900 font-bold">{data.geofence.allowedRadiusMeters} Meter</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="5"
                  value={data.geofence.allowedRadiusMeters} 
                  onChange={handleUpdateGeofenceRadius}
                  className="w-full accent-blue-900 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Persetujuan Pendaftaran Wajah Mandiri */}
          <div className="clean-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Verifikasi Wajah Siswa</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200">
                {pendingEnrollments.length} Menunggu
              </span>
            </div>
            
            {pendingEnrollments.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">Tidak ada pendaftaran wajah baru.</p>
            ) : (
              <div className="space-y-2">
                {pendingEnrollments.map((s) => (
                  <div key={s.id} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-2 bg-slate-50">
                    <img src={s.photoUrl} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{s.name}</h4>
                      <p className="text-[10px] text-slate-500">{s.classId}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleApproveEnrollment(s.id)} className="p-1 rounded bg-emerald-600 text-white" title="Setujui">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleRejectEnrollment(s.id)} className="p-1 rounded bg-rose-600 text-white" title="Tolak">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Persetujuan Surat Izin Sakit */}
          <div className="clean-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Verifikasi Surat Sakit</h3>
            {pendingLeaves.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">Tidak ada pengajuan izin pending.</p>
            ) : (
              <div className="space-y-2">
                {pendingLeaves.map((req) => (
                  <div key={req.id} className="p-3 rounded-lg border border-slate-200 space-y-2 bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{req.studentName} ({req.classId})</h4>
                        <p className="text-[11px] text-slate-600">{req.category}: {req.reason}</p>
                      </div>
                      <button onClick={() => setSelectedPhoto(req.medicalNoteUrl)} className="text-[10px] text-blue-700 underline font-medium">
                        Lihat Surat
                      </button>
                    </div>
                    <div className="flex justify-end gap-2 pt-1 border-t border-slate-200">
                      <button onClick={() => handleRejectLeave(req.id)} className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                        Tolak
                      </button>
                      <button onClick={() => handleApproveLeave(req.id)} className="px-2 py-1 rounded bg-blue-900 text-white text-[10px] font-bold">
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

      {/* Modal Preview Foto Bukti */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Bukti Pindaian Wajah / Surat Sakit</h3>
              <button onClick={() => setSelectedPhoto(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedPhoto} alt="Bukti Absensi" className="w-full rounded-lg max-h-80 object-cover border border-slate-200" />
            <button onClick={() => setSelectedPhoto(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">
              Tutup Preview
            </button>
          </div>
        </div>
      )}

      {/* Manajemen Data Siswa (CRUD) */}
      <div className="pt-6 mt-6 border-t border-slate-200">
        <StudentManagement data={data} />
      </div>

    </div>
  );
}
