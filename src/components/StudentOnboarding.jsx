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
      <div className="max-w-md mx-auto space-y-6 pt-4 pb-20">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-tr from-blue-600 to-blue-900 rounded-[2rem] flex items-center justify-center shadow-xl rotate-3">
              <ScanFace className="w-12 h-12 text-white -rotate-3" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Face ID Setup</h2>
            <p className="text-sm text-slate-500 font-medium px-4">Sistem keamanan biometrik untuk absensi kehadiran Anda.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Pencahayaan Terang</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Pastikan wajah Anda mendapat cahaya yang cukup dan tidak membelakangi sumber cahaya (Backlight).</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 border border-rose-100">
              <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Lepas Aksesoris</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Lepaskan kacamata hitam, masker, atau topi agar AI dapat memetakan struktur wajah Anda dengan sempurna.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Tatap Kamera</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Posisikan wajah Anda di tengah lingkaran yang disediakan dan tatap lurus ke lensa kamera selama 2 detik.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleOpenCamera} 
          className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2"
        >
          SAYA MENGERTI, MULAI SCAN
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
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
                     scanStatus === 'scanning' ? 'Arahkan Wajah ke Kamera...' : 'Wajah Terdeteksi! ??'}
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

  if (step === 3) {
    return (
      <div className="max-w-md mx-auto space-y-4 pt-10">
        <div className="bg-white rounded-[2rem] p-8 space-y-6 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Face ID Aktif!</h2>
            <p className="text-sm text-slate-500">Wajah Anda telah berhasil dipetakan ke dalam sistem keamanan kami. Sekarang Anda bisa melakukan absensi.</p>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-4 bg-emerald-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2"
            >
              MULAI ABSENSI SEKARANG
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </div>
    );
  } return null; }

