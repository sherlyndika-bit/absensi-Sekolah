import React, { useState, useRef, useEffect } from 'react';
import { store } from '../firebase/services';
import { UserCheck, CheckCircle2, ShieldCheck, Camera, ScanFace, AlertCircle } from 'lucide-react';
import * as faceapi from '@vladmandic/face-api';

export default function StudentOnboarding({ activeStudent }) {
  const [step, setStep] = useState(1);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const faceDescriptorRef = useRef(null);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    clearInterval(detectionIntervalRef.current);
  };

  const handleOpenCamera = async () => {
    setStep(2);
    setErrorMessage(null);
    setCapturedPhoto(null);
    stopCamera();
    
    setIsCameraActive(true);
    setScanStatus('loading');
    
    try {
      if (!faceapi.nets.tinyFaceDetector.isLoaded || !faceapi.nets.faceLandmark68TinyNet.isLoaded || !faceapi.nets.faceRecognitionNet.isLoaded) {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
      }

      setScanStatus('scanning');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          let detectCount = 0;
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              const detection = await faceapi.detectSingleFace(
                videoRef.current, 
                new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
              ).withFaceLandmarks(true).withFaceDescriptor();
              
              if (detection) {
                detectCount++;
                if (detectCount === 1) setScanStatus('detected');
                if (detectCount >= 3) {
                  clearInterval(detectionIntervalRef.current);
                  faceDescriptorRef.current = Array.from(detection.descriptor);
                  executeCapture();
                }
              } else {
                detectCount = 0;
                setScanStatus('scanning');
              }
            }
          }, 400);
        }
      }, 300);

    } catch (err) {
      setErrorMessage("Kamera diblokir. Harap izinkan akses kamera.");
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

      // Auto Submit per user request!
      store.submitFaceEnrollment(activeStudent.id, { front: photoDataUrl }, faceDescriptorRef.current)
        .then(() => {
          store.updateEnrollmentStatus(activeStudent.id, 'approved');
          setStep(3);
        });
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div className="clean-card p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-800">Pendaftaran Wajah Wajib</h2>
            <p className="text-xs text-slate-500">Anda belum mendaftarkan wajah. Ini adalah syarat wajib untuk melakukan absensi kehadiran.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">TATA CARA SCAN WAJAH:</h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex gap-2"><span>1️⃣</span> <b>Cari Tempat Terang:</b> Pastikan wajah Anda tidak gelap/membelakangi cahaya.</li>
              <li className="flex gap-2"><span>2️⃣</span> <b>Lepas Aksesoris:</b> Tolong lepas kacamata, masker, atau topi Anda.</li>
              <li className="flex gap-2"><span>3️⃣</span> <b>Pandangan Lurus:</b> Tatap lurus ke arah kamera HP Anda dan diam selama 2 detik.</li>
            </ul>
          </div>

          <button onClick={handleOpenCamera} className="w-full py-3.5 bg-blue-900 text-white text-xs font-bold rounded-lg shadow-[0_4px_14px_0_rgba(30,58,138,0.39)] transition-all active:scale-[0.98]">
            SAYA MENGERTI, MULAI SCAN SEKARANG
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <canvas ref={canvasRef} className="hidden" />
        <div className="clean-card p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
              <ScanFace className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Proses Scan Wajah</h2>
              <p className="text-[11px] text-slate-500">Arahkan wajah Anda ke kamera</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200 text-center space-y-4">
            <div className="relative aspect-square rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center shadow-inner ring-4 ring-slate-100">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-8 border-2 border-dashed border-white/50 rounded-full"></div>
                {scanStatus === 'scanning' && (
                  <div className="absolute left-0 right-0 h-1 bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                )}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg transition-all ${
                    scanStatus === 'loading' ? 'bg-amber-500/90 text-white border border-amber-400' :
                    scanStatus === 'scanning' ? 'bg-black/50 text-white border border-white/20' :
                    scanStatus === 'detected' ? 'bg-emerald-500/90 text-white border border-emerald-400 scale-110' :
                    'hidden'
                  }`}>
                    {scanStatus === 'loading' ? 'Memuat AI Model...' :
                     scanStatus === 'scanning' ? 'Arahkan Wajah ke Kamera...' : 'Wajah Terdeteksi! 📸'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="clean-card p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-lg font-extrabold text-slate-800">Wajah Berhasil Didaftarkan!</h2>
        <p className="text-xs text-slate-500">Terima kasih, profil wajah Anda sudah tersimpan dengan aman dan telah disetujui otomatis oleh sistem.</p>
        <button onClick={() => window.location.reload()} className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-md hover:bg-slate-800 mt-4">
          LANJUT KE MENU ABSENSI
        </button>
      </div>
    </div>
  );
}
