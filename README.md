# 🏫 Sistem Absensi Siswa Modern (Face Recognition & Geofencing)

Aplikasi platform absensi siswa modern berbasis **Pengenalan Wajah (Face Recognition)**, **Deteksi Kehidupan (Liveness Detection)**, **Geofencing (Pelacakan Lokasi Radius)**, dan **Google Firebase Ecosystem**.

![License](https://img.shields.io/badge/License-MIT-emerald)
![Firebase](https://img.shields.io/badge/Database-Google%20Firebase-FFCA28)
![React](https://img.shields.io/badge/Frontend-React.js%20%2B%20TailwindCSS-61DAFB)

---

## 🌟 Fitur Utama Sistem

### 1. Modul Pendaftaran Wajah (Face Enrollment)
* **Pendaftaran via Admin/Sekolah**: Pengambilan foto wajah siswa dari 3 sudut (*Depan*, *Serong Kanan*, *Serong Kiri*) saat masa orientasi / pendaftaran ulang.
* **Pendaftaran Mandiri (Self-Enrollment)**: Siswa mendaftar via HP dari rumah dengan status **Pending** hingga disetujui manual oleh wali kelas/admin.
* **Filter Standarisasi Kualitas (Quality Check)**: Menolak foto blur, terlalu gelap, atau jika terdeteksi multi-wajah dalam satu frame.

### 2. Modul Verifikasi Absensi & Anti-Kecurangan
* **Liveness Detection (Anti-Foto Cetak)**: Instruksi tantangan acak (*Berkedip 2x*, *Tersenyum*, *Geleng Kepala*) untuk memastikan objek kamera adalah manusia asli.
* **Geofencing GPS Radius Check**: Menghitung jarak presisi ke titik gerbang sekolah menggunakan formula Haversine (misal max 50m).
* **Anti-Fake GPS & Root Detection**: Memblokir upaya jika terdeteksi penggunaan Mock Location, VPN, atau perangkat di-root.
* **Time-Sync Server**: Menggunakan timestamp resmi server NTP (mengabaikan jam lokal HP siswa).

### 3. Integrasi Hardware (Smart Kiosk & IoT)
* **Smart Kiosk Tablet**: Mode khusus tablet Android/iPad di gerbang sekolah untuk pemindaian wajah otomatis.
* **Offline Support (Mode Luring)**: Kiosk menyimpan data secara lokal saat koneksi internet mati dan otomatis melakukan sinkronisasi (*sync buffer*) saat internet kembali menyala.
* **API Integrasi Biometrik IoT**: REST / Webhook endpoint untuk mesin fisik Hikvision, ZKTeco, atau perangkat IoT sejenis.

### 4. Ekosistem Dashboard & Notifikasi
* **Notifikasi WhatsApp Orang Tua**: Mengirim pesan otomatis ke nomor WA ortu begitu siswa berhasil absen.
* **Live Admin Dashboard**: Statistik real-time hadir, terlambat, sakit, alfa, persetujuan pendaftaran wajah, dan konfigurasi radius geofence.
* **Izin Sakit & Cuti Berbasis Kamera**: Unggah surat dokter dengan mematikan akses galeri (kamera langsung).

---

## 🛠️ Pilihan Tech Stack & Arsitektur

* **Frontend**: React.js, Vite, TailwindCSS, Lucide Icons, `face-api.js` (TensorFlow.js)
* **Database & Cloud**: Google Firebase (Cloud Firestore, Firebase Storage, Firebase Auth, Cloud Functions)
* **Algoritma Geofencing**: Haversine Formula ($d = 2r \arcsin \dots$)
* **Message Queue & Push**: Firebase Cloud Messaging (FCM) & WhatsApp Webhook Gateway (Fonnte/Wablas)

---

## 🔥 Cara Setting Google Firebase

1. Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Cloud Firestore Database** (Pilih Region `asia-southeast1`).
3. Aktifkan **Firebase Storage** untuk penyimpanan foto.
4. Salin objek `firebaseConfig` ke dalam file `src/firebase/config.js` atau file `.env`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "absensi-sekolah.firebaseapp.com",
  projectId: "absensi-sekolah",
  storageBucket: "absensi-sekolah.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

---

## 🚀 Cara Menjalankan Project Secara Lokal

```bash
# 1. Clone Repository
git clone https://github.com/sherlyndika-bit/absensi-Sekolah.git
cd absensi-Sekolah

# 2. Install Dependencies
npm install

# 3. Jalankan Development Server
npm run dev
```

Aplikasi dapat diakses melalui browser pada `http://localhost:3000`.

---

## 📄 Lisensi
Hak Cipta © 2026 - Sistem Absensi Siswa Modern.
