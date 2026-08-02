/**
 * Formula Haversine untuk menghitung jarak antara 2 titik koordinat (Latitude/Longitude)
 * @returns jarak dalam meter
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Jari-jari bumi dalam meter
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Pembulatan 1 desimal
}

/**
 * Daftar Instruksi Liveness Detection Acak
 */
export const LIVENESS_CHALLENGES = [
  { id: 'blink', label: 'Kedipkan Mata 2 Kali', icon: '👁️', durationSec: 5 },
  { id: 'smile', label: 'Tersenyum Lebar', icon: '😊', durationSec: 5 },
  { id: 'turn_right', label: 'Gelengkan Kepala ke Kanan', icon: '↗️', durationSec: 5 },
  { id: 'turn_left', label: 'Gelengkan Kepala ke Kiri', icon: '↖️', durationSec: 5 }
];

export function getRandomLivenessChallenge() {
  const randomIndex = Math.floor(Math.random() * LIVENESS_CHALLENGES.length);
  return LIVENESS_CHALLENGES[randomIndex];
}

/**
 * Simulasi Evaluasi Kualitas Foto Wajah (Standarisasi Quality Check)
 */
export function evaluateFaceQuality(imageCanvasOrBase64) {
  // Simulasi analisis blur, kegelapan, dan deteksi multi-wajah
  const isTooDark = Math.random() < 0.05; // 5% chance
  const isBlurry = Math.random() < 0.05;
  const isMultipleFaces = Math.random() < 0.03;
  
  if (isTooDark) {
    return { valid: false, reason: "Pencahayaan terlalu gelap. Harap cari tempat yang lebih terang." };
  }
  if (isBlurry) {
    return { valid: false, reason: "Foto terlalu blur/kabur. Harap pegang HP dengan stabil." };
  }
  if (isMultipleFaces) {
    return { valid: false, reason: "Terdeteksi lebih dari 1 wajah dalam frame. Harap lakukan absensi sendiri." };
  }
  
  return {
    valid: true,
    score: Math.floor(88 + Math.random() * 11), // 88 - 99%
    vector128d: Array.from({ length: 128 }, () => Math.round((Math.random() * 2 - 1) * 1000) / 1000)
  };
}

/**
 * Simulasi Deteksi Keamanan Perangkat (Root / Fake GPS / VPN)
 */
export function checkDeviceSecurity() {
  // Pada environment Android Native (Capacitor/Cordova), nilai ini diambil dari plugin native
  return {
    isMockLocationActive: false,
    isRooted: false,
    isVpnActive: false,
    passedAllChecks: true
  };
}

/**
 * Format Pesan WhatsApp Notifikasi Orang Tua
 */
export function formatParentWAMessage(studentName, timeStr, status, classId) {
  return `*Sistem Absensi SMAN 1*\n\n` +
    `Halo Bapak/Ibu Wali Murid,\n` +
    `Pemberitahuan bahwa ananda *${studentName}* (${classId}) telah berhasil melakukan absensi kehadiran:\n\n` +
    `📅 Waktu: ${timeStr} WIB\n` +
    `📌 Status: *${status.toUpperCase()}*\n` +
    `📍 Verifikasi: Face Recognition + Geofencing Liveness (Valid)\n\n` +
    `Terima kasih.`;
}
