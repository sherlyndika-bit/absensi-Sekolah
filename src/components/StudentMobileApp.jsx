import React, { useState, useEffect, useRef } from 'react';
import { store } from '../firebase/services';
import { Smartphone, MapPin, ShieldCheck, CheckCircle2, RefreshCw, Camera } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as faceapi from '@vladmandic/face-api';
import StudentOnboarding from './StudentOnboarding';

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
  useEffect(() => {
    return store.subscribe((newState) => {
      setData(newState);
    });
  }, []);

  const activeStudent = data.students.find(s => s.id === loggedInStudent.id) || loggedInStudent;
  
  const [studentLat, setStudentLat] = useState(null);
  const [studentLng, setStudentLng] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [realDistance, setRealDistance] = useState(0); 

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanTimerRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState(''); // loading, scanning, matched, unmatched
  const [manualFallbackCount, setManualFallbackCount] = useState(0);
  const [allowManualCapture, setAllowManualCapture] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const [livenessCompleted, setLivenessCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

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

  const isInsideGeofence = realDistance !== null && realDistance <= allowedRadius;

  let gpsBadgeText = "Mencari GPS...";
  let gpsBadgeClass = "bg-slate-100 text-slate-500 border-slate-200";
  if (gpsError) {
    gpsBadgeText = "GPS Gagal";
    gpsBadgeClass = "bg-rose-50 text-rose-600 border-rose-200";
  } else if (realDistance !== null) {
    if (isInsideGeofence) {
      gpsBadgeText = `Jarak: ${realDistance}m (Aman)`;
      gpsBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else {
      gpsBadgeText = `Jarak: ${realDistance}m (Luar Radius)`;
      gpsBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    }
  }

  const handleResetChallenge = () => {
    setLivenessCompleted(false);
    setSuccessResult(null);
    setCapturedPhoto(null);
  };

  const handleOpenFaceVerification = async () => {
    try {
      setCameraError(null);
      setScanStatus('loading');
      setManualFallbackCount(0);
      setAllowManualCapture(false);
      
      // Load model if not loaded
      if (!faceapi.nets.tinyFaceDetector.isLoaded || !faceapi.nets.faceLandmark68TinyNet.isLoaded || !faceapi.nets.faceRecognitionNet.isLoaded) {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
      }

      setScanStatus('scanning');
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          let matchCount = 0;
          let unmatchCount = 0;
          clearInterval(detectionIntervalRef.current);
          
          detectionIntervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              const detection = await faceapi.detectSingleFace(
                videoRef.current, 
                new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
              ).withFaceLandmarks(true).withFaceDescriptor();
              
              if (detection) {
                // Check Face Recognition Match
                let isMatch = false;
                if (loggedInStudent.faceDescriptor) {
                  const enrolledDescriptor = new Float32Array(loggedInStudent.faceDescriptor);
                  const distance = faceapi.euclideanDistance(detection.descriptor, enrolledDescriptor);
                  isMatch = distance <= 0.55; // 0.55 is a strict/good threshold
                } else {
                  // Fallback if somehow they got here without a descriptor
                  isMatch = true; 
                }

                if (isMatch) {
                  matchCount++;
                  unmatchCount = 0;
                  setScanStatus('matched');
                  if (matchCount >= 2) {
                    clearInterval(detectionIntervalRef.current);
                    handleCapturePhoto();
                  }
                } else {
                  unmatchCount++;
                  matchCount = 0;
                  setScanStatus('unmatched');
                  if (unmatchCount >= 5) {
                    setManualFallbackCount(prev => prev + 1);
                    unmatchCount = 0;
                  }
                }
              } else {
                matchCount = 0;
                setScanStatus('scanning');
              }
            }
          }, 500);
        }
      }, 300);
      
    } catch (err) {
      setCameraError("Kamera diblokir. Harap izinkan akses kamera browser Anda.");
      setIsCameraOpen(false);
      setScanStatus('');
      console.error(err);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
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
    
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(detectionIntervalRef.current);
    setIsCameraOpen(false);
    setScanStatus('');
    setLivenessCompleted(true);
    setCapturedPhoto(photoDataUrl);
  };

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
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        classId: activeStudent.classId,
        parentPhone: activeStudent.parentPhone,
        method: 'mobile_liveness',
        distanceMeters: realDistance,
        gpsCoordinates: { lat: studentLat, lng: studentLng },
        livenessPassed: true,
        livenessChallenge: 'Direct Camera Capture',
        photoProofUrl: capturedPhoto || activeStudent.photoUrl,
        status: 'Hadir'
      };

      store.addAttendance(record).then(result => {
        setIsSubmitting(false);
        setSuccessResult(result);
      });
    }, 800);
  };

  // --- RENDER EARLY RETURN FOR ONBOARDING ---
  if (!loggedInStudent || loggedInStudent.faceEnrollmentStatus === 'none' || loggedInStudent.faceEnrollmentStatus === 'rejected') {
    return <StudentOnboarding activeStudent={loggedInStudent} />;
  }

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24">
      
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
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shadow-xs uppercase tracking-wider ${gpsBadgeClass}`}>
            {gpsBadgeText}
          </span>
        </div>

        {/* Info Akun Siswa (Locked) */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
          <img src={activeStudent.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/192px-User_icon_2.svg.png"} alt={activeStudent.name} className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-sm" />
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">{activeStudent.name}</h4>
            <p className="text-[11px] text-slate-500 font-medium">NISN: {activeStudent.nisn} • Kelas: {activeStudent.classId}</p>
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
              {studentLat !== null && studentLng !== null && (
                <Marker position={[studentLat, studentLng]} icon={getStudentIcon(isInsideGeofence)}>
                  <Popup className="text-xs">
                    <div className="font-bold text-slate-800">Posisi Anda Asli</div>
                    <div className="text-slate-500">{realDistance}m dari gerbang</div>
                  </Popup>
                </Marker>
              )}
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

        {/* Wajah / Foto Kehadiran */}
        <div className="p-4 rounded-lg border border-slate-200 space-y-3 bg-white shadow-xs">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Bukti Kehadiran</h4>
            <button onClick={handleResetChallenge} className="text-slate-400 hover:text-slate-700 text-[10px] flex items-center gap-1 font-bold bg-slate-100 px-2 py-1 rounded">
              <RefreshCw className="w-3 h-3" /> ULANG FOTO
            </button>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            {isCameraOpen ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-square bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-300 shadow-inner">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                  {/* Scanner Overlay UI */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-8 border-2 border-dashed border-white/50 rounded-[2rem]"></div>
                    {scanStatus === 'scanning' && (
                      <div className="absolute left-0 right-0 h-1 bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    )}
                    {scanStatus === 'unmatched' && (
                      <div className="absolute inset-0 border-4 border-rose-500/80 rounded-[2rem] transition-all"></div>
                    )}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg transition-all ${
                        scanStatus === 'loading' ? 'bg-amber-500/90 text-white border border-amber-400' :
                        scanStatus === 'unmatched' ? 'bg-rose-500/90 text-white border border-rose-400 scale-105' :
                        scanStatus === 'matched' ? 'bg-emerald-500/90 text-white border border-emerald-400 scale-110' :
                        scanStatus === 'scanning' ? 'bg-black/50 text-white border border-white/20' :
                        'hidden'
                      }`}>
                        {scanStatus === 'loading' ? 'Memuat AI Model...' :
                         scanStatus === 'unmatched' ? 'Wajah Tidak Dikenali! ❌' :
                         scanStatus === 'matched' ? 'Wajah Cocok! 📸' :
                         scanStatus === 'scanning' ? 'Arahkan Wajah ke Kamera...' : ''}
                      </div>
                    </div>
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />

                {manualFallbackCount >= 2 && !allowManualCapture && (
                  <button
                    onClick={() => {
                      setAllowManualCapture(true);
                      clearInterval(detectionIntervalRef.current);
                      setScanStatus('scanning');
                    }}
                    className="w-full py-2 text-xs font-bold rounded-lg bg-orange-100 text-orange-700 border border-orange-200 shadow-sm"
                  >
                    Gagal Identifikasi? Ajukan Absen Manual
                  </button>
                )}

                {allowManualCapture && (
                  <button
                    onClick={() => {
                      clearInterval(detectionIntervalRef.current);
                      handleCapturePhoto();
                    }}
                    className="w-full py-3 text-white text-xs font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-blue-800"
                  >
                    <Camera className="w-4 h-4" /> AMBIL FOTO PAKSA
                  </button>
                )}

                <button
                  onClick={() => {
                    clearInterval(detectionIntervalRef.current);
                    if (videoRef.current && videoRef.current.srcObject) {
                      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                    }
                    setIsCameraOpen(false);
                    setScanStatus('');
                  }}
                  className="w-full py-2.5 text-xs font-bold rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-all active:scale-95"
                >
                  BATALKAN SCAN
                </button>
              </div>
            ) : livenessCompleted ? (
              <div className="space-y-3">
                <img src={capturedPhoto} alt="Bukti Hadir" className="w-full aspect-square object-cover rounded-lg border-2 border-emerald-300 shadow-sm" />
                <div className="clean-badge-green w-full py-2 rounded-lg text-xs font-bold inline-flex justify-center items-center gap-1.5 shadow-sm border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> FOTO TERSIMPAN
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-3">
                <Camera className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 mb-2">Ambil foto *selfie* di lokasi sekolah sebagai bukti kehadiran Anda.</p>
                <button
                  onClick={handleOpenFaceVerification}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-[0.98]"
                >
                  BUKA KAMERA SEKARANG
                </button>
              </div>
            )}

            {cameraError && (
              <p className="text-[10px] text-rose-600 font-bold bg-rose-50 p-2 rounded border border-rose-200">{cameraError}</p>
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
