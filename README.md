# 🏫 Sistem Absensi Siswa Modern (Face Recognition & Geofencing)

Aplikasi platform absensi siswa modern berbasis **Pengenalan Wajah (Face Recognition)**, **Deteksi Kehidupan (Liveness Detection)**, **Geofencing (Pelacakan Lokasi Radius)**, dan **Supabase Ecosystem (PostgreSQL Database - 100% Gratis Tanpa Kartu Kredit)**.

![License](https://img.shields.io/badge/License-MIT-emerald)
![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E)
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
* **Database & Cloud**: Supabase PostgreSQL (100% Free Tier - No Credit Card Required)
* **Algoritma Geofencing**: Haversine Formula ($d = 2r \arcsin \dots$)
* **Message Queue & Push**: WhatsApp Webhook Gateway (Fonnte/Wablas)

---

## 🔥 Cara Setting Supabase (100% Gratis Tanpa Kartu Kredit)

1. Buka [https://supabase.com](https://supabase.com) lalu buat akun gratis (login via GitHub / Google).
2. Klik **New Project**, beri nama: `absensi-sekolah`.
3. Buka **SQL Editor** pada menu Supabase Dashboard.
4. Salin isi file `supabase_schema.sql` dan klik **RUN**.
5. Buka **Project Settings > API**, salin `Project URL` dan `anon public key` ke `.env` atau `src/supabase/config.js`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
Hak Cipta © 2026 - Sistem Absensi Siswa Modern (Supabase Ecosystem).
