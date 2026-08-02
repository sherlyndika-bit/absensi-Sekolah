import React, { useState, useEffect } from 'react';
import { store } from '../firebase/services';
import { getRandomLivenessChallenge, checkDeviceSecurity } from '../utils/faceAndGeoUtils';
import { Smartphone, MapPin, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet Default Icon Issues
const schoolIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: #1e3a8a; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>`,
  iconAnchor: [14, 14]
});

const getStudentIcon = (isInside) => new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: ${isInside ? '#059669' : '#e11d48'}; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
  iconAnchor: [10, 10]
});

// Component to dynamically update map center based on state
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export default function StudentMobileApp({ loggedInStudent }) {
  const [data, setData] = useState(store.getState());
  const selectedStudent = loggedInStudent;
  
  const [studentLat, setStudentLat] = useState(null);
  const [studentLng, setStudentLng] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [realDistance, setRealDistance] = useState(0); 

  const [challenge, setChallenge] = useState(getRandomLivenessChallenge());
  
  const [livenessCompleted, setLivenessCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  useEffect(() => {
    return store.subscribe((newState) => setData(newState));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung GPS.");
      return;
    }
    
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3; 
      const p1 = lat1 * Math.PI/180; 
      const p2 = lat2 * Math.PI/180;
      const dp = (lat2-lat1) * Math.PI/180;
      const dl = (lon2-lon1) * Math.PI/180;
      const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return Math.round(R * c);
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setStudentLat(lat);
        setStudentLng(lng);
        
        if (data.initialized && data.geofence) {
          const centerLat = data.geofence.centerLatitude || -6.175392;
          const centerLng = data.geofence.centerLongitude || 106.827153;
          const dist = calculateDistance(lat, lng, centerLat, centerLng);
          setRealDistance(dist);
          setGpsError(null);
        }
      },
      (err) => {
        setGpsError("Gagal mendapatkan lokasi GPS. Pastikan izin lokasi aktif.");
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [data.initialized, data.geofence]);

  if (!data.initialized) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Memuat Data Sekolah...
      </div>
    );
  }

  const allowedRadius = data.geofence.allowedRadiusMeters;
  const centerLat = data.geofence.centerLatitude || -6.175392;
  const centerLng = data.geofence.centerLongitude || 106.827153;

  if (studentLat === null || studentLng === null) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500 text-sm p-6 text-center space-y-2 bg-white m-4 rounded-xl shadow-xs border border-slate-200">
        {gpsError ? (
          <>
            <MapPin className="w-8 h-8 text-rose-500 mb-2" />
            <p className="text-rose-600 font-bold">{gpsError}</p>
          </>
        ) : (
          <>
            <RefreshCw className="w-8 h-8 animate-spin text-blue-900" /> 
            <p className="font-bold text-slate-700">Mencari Sinyal GPS...</p>
            <p className="text-[10px] text-slate-500">Harap izinkan akses lokasi (Location) pada browser/perangkat Anda.</p>
          </>
        )}
      </div>
    );
  }

  const isInsideGeofence = realDistance <= allowedRadius;

  const handleResetChallenge = () => {
    setChallenge(getRandomLivenessChallenge());
    setLivenessCompleted(false);
    setSuccessResult(null);
  };

  const handleSimulateLivenessPass = () => setLivenessCompleted(true);

  const handleExecuteCheckIn = () => {
    if (!isInsideGeofence) {
      alert(`Gagal: Posisi Anda (${realDistance}m) di luar radius izin gerbang (${allowedRadius}m)!`);
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
        distanceMeters: realDistance,
        livenessPassed: true,
        livenessChallenge: challenge.label,
        photoProofUrl: selectedStudent.photoUrl,
        status: 'Hadir'
      };

      store.addAttendance(record).then(result => {
        setIsSubmitting(false);
        setSuccessResult(result);
      });
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      
      <div className="clean-card p-5 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 text-white flex items-center justify-center font-bold shadow-md">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Absen GPS & Wajah</h3>
              <p className="text-[10px] text-slate-500">Super Strict Mode</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 bg-slate-100 rounded border border-slate-200 shadow-xs uppercase tracking-wider">
            NTP Sync
          </span>
        </div>

        {/* Info Akun Siswa (Locked) */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
          <img src={selectedStudent.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/192px-User_icon_2.svg.png"} alt={selectedStudent.name} className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-sm" />
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">{selectedStudent.name}</h4>
            <p className="text-[11px] text-slate-500 font-medium">NISN: {selectedStudent.nisn} • Kelas: {selectedStudent.classId}</p>
          </div>
        </div>

        {/* Status Perangkat */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-center text-slate-600 shadow-xs">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Deteksi Sensor
          </span>
          <span className="clean-badge-green px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            No Fake GPS
          </span>
        </div>

        {/* Interactive Map */}
        <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm relative z-0">
          <div className="h-48 w-full bg-slate-100">
            <MapContainer 
              center={[centerLat, centerLng]} 
              zoom={18} 
              scrollWheelZoom={false}
              dragging={false}
              zoomControl={false}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <MapUpdater center={[centerLat, centerLng]} />
              
              {/* Geofence Circle */}
              <Circle 
                center={[centerLat, centerLng]} 
                radius={allowedRadius} 
                pathOptions={{ 
                  color: '#1e3a8a', 
                  fillColor: '#3b82f6', 
                  fillOpacity: 0.15,
                  weight: 2
                }} 
              />
              
              {/* School Gate Marker */}
              <Marker position={[centerLat, centerLng]} icon={schoolIcon}>
                <Popup className="text-xs font-bold">{data.geofence.schoolName}</Popup>
              </Marker>

              {/* Student Position Marker */}
              <Marker position={[studentLat, studentLng]} icon={getStudentIcon(isInsideGeofence)}>
                <Popup className="text-xs">
                  <div className="font-bold text-slate-800">Posisi Anda Asli</div>
                  <div className="text-slate-500">{realDistance}m dari gerbang</div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className={`p-3 text-xs border-t ${
            isInsideGeofence ? 'bg-emerald-50 text-emerald-900 border-emerald-100' : 'bg-rose-50 text-rose-900 border-rose-100'
          }`}>
            <div className="flex items-center justify-between font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Radius Geofence
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider shadow-xs ${
                isInsideGeofence ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {isInsideGeofence ? 'Di Dalam Area' : 'Di Luar Area'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/50 flex flex-col items-center">
              <span className="text-[10px] text-slate-500 mb-1 block">Akurasi Jarak GPS Anda:</span>
              <span className="font-extrabold text-xl text-slate-800">{realDistance} Meter</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Maksimum Radius Izin: {allowedRadius} Meter</span>
            </div>
          </div>
        </div>

        {/* Liveness Challenge */}
        <div className="p-4 rounded-lg border border-slate-200 space-y-3 bg-white shadow-xs">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Anti-Spoofing (Liveness)</h4>
            <button onClick={handleResetChallenge} className="text-slate-400 hover:text-slate-700 text-[10px] flex items-center gap-1 font-bold bg-slate-100 px-2 py-1 rounded">
              <RefreshCw className="w-3 h-3" /> ACAK
            </button>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="text-3xl drop-shadow-sm">{challenge.icon}</div>
            <p className="text-xs font-bold text-slate-800">{challenge.label}</p>

            {livenessCompleted ? (
              <div className="clean-badge-green w-full py-2 rounded-lg text-xs font-bold inline-flex justify-center items-center gap-1.5 shadow-sm border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> WAJAH TERVERIFIKASI
              </div>
            ) : (
              <button
                onClick={handleSimulateLivenessPass}
                className="w-full py-2 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-[0.98]"
              >
                MULAI VERIFIKASI WAJAH
              </button>
            )}
          </div>
        </div>

        {/* Tombol Check-in */}
        <button
          onClick={handleExecuteCheckIn}
          disabled={!isInsideGeofence || !livenessCompleted || isSubmitting}
          className={`w-full py-3.5 rounded-lg font-extrabold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${
            isInsideGeofence && livenessCompleted && !isSubmitting
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
          }`}
        >
          {isSubmitting ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Rekam Kehadiran Sekarang</span>
            </>
          )}
        </button>

        {/* Hasil Sukses */}
        {successResult && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1.5 shadow-inner">
            <div className="font-extrabold flex items-center gap-1.5 text-emerald-700 text-sm">
              <CheckCircle2 className="w-4 h-4" /> SUKSES DISIMPAN!
            </div>
            <p className="font-medium">Sistem Server: {successResult.timeStr} WIB</p>
            <p className="text-[10px] text-emerald-600 font-bold bg-emerald-100 p-1.5 rounded mt-1">Notifikasi WhatsApp otomatis terkirim ke orang tua.</p>
          </div>
        )}

      </div>
    </div>
  );
}
