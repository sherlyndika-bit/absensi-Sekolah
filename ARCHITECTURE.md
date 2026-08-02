# 🏫 ARSITEKTUR SISTEM ABSENSI SISWA MODERN
## (Face Recognition, Liveness Detection, Geofencing, Smart Kiosk & Firebase Ecosystem)

---

## 1. DESAIN ARSITEKTUR SISTEM (OVERVIEW)

Sistem ini dirancang dengan pendekatan **Serverless Hybrid Architecture** mengoptimalkan **Google Firebase** untuk real-time data sync, autentikasi, penyimpanan media, serta event-driven notifications.

```
                  +-------------------------------------------------+
                  |                CLIENT INTERFACES                |
                  +------------------------+------------------------+
                                           |
         +---------------------------------+---------------------------------+
         |                                 |                                 |
+--------v-------+               +---------v--------+              +---------v--------+
| Mobile App HP  |               | Smart Kiosk Gate |              | Admin/Guru Live  |
|  (Siswa App)   |               | (Tablet Android) |              |    Dashboard     |
+--------+-------+               +---------+--------+              +---------+--------+
         |                                 |                                 |
         | Liveness & GeoCheck             | Face Scan & Offline Cache       | Realtime Stats
         v                                 v                                 v
+-----------------------------------------------------------------------------------+
|                            CLIENT-SIDE AI & ENGINE                                |
|  - Face-api.js / TensorFlow.js (128-d Face Embedding Vector Extraction)           |
|  - Random Liveness Challenge Evaluator (Blink, Smile, Turn Head Landmark Engine)  |
|  - HTML5 Geolocation + Haversine Radius Math (Target: School Gate Lat/Long)       |
|  - Root & Mock Location (Fake GPS) Detector                                       |
+-----------------------------------------------------------------------------------+
                                           |
                                 HTTPS / WSS / Firestore SDK
                                           |
+-----------------------------------------------------------------------------------+
|                            GOOGLE FIREBASE ECOSYSTEM                              |
|                                                                                   |
|  +---------------------+  +---------------------+  +---------------------------+  |
|  | Cloud Firestore     |  | Firebase Storage    |  | Firebase Auth             |  |
|  | (Realtime NoSQL DB) |  | (Images & Documents)|  | (Students/Admin/Teachers) |  |
|  +----------+----------+  +----------+----------+  +-------------+-------------+  |
|             |                        |                           |                |
+-------------|------------------------|---------------------------|----------------+
              |                        |                           |
              +-------------------+----+---------------------------+
                                  |
                                  v
                  +-------------------------------+
                  |    FIREBASE CLOUD FUNCTIONS   |
                  |  - Server Timestamp Signer    |
                  |  - Geofence Distance Verifier |
                  |  - WhatsApp Gateway Webhook   |
                  +---------------+---------------+
                                  |
                                  v
                  +-------------------------------+
                  |       WHATSAPP GATEWAY        |
                  | (Fonnte / Wablas / Twilio)    |
                  |  -> Notifikasi Otomatis Ortu  |
                  +-------------------------------+
```

---

## 2. PANDUAN LENGKAP SETTING FIREBASE GOOGLE

### Step 1: Membuat Proyek Firebase
1. Akses [https://console.firebase.google.com](https://console.firebase.google.com).
2. Klik **Add project** / **Tambah Proyek**, masukkan nama: `absensi-sekolah-modern`.
3. Klik **Continue** dan aktifkan/matikan Google Analytics, lalu klik **Create project**.

### Step 2: Mendaftarkan Web Application
1. Di halaman Overview, klik ikon Web **`</>`**.
2. Masukkan App Nickname: `Absensi-Sekolah-Web`.
3. Klik **Register app**.
4. Simpan konfigurasi `firebaseConfig` yang tampil:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "absensi-sekolah-modern.firebaseapp.com",
     projectId: "absensi-sekolah-modern",
     storageBucket: "absensi-sekolah-modern.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef..."
   };
   ```

### Step 3: Setting Cloud Firestore Database
1. Buka menu **Build > Firestore Database** -> Klik **Create Database**.
2. Pilih lokasi region terdekat: `asia-southeast1 (Singapore)`.
3. Pilih **Start in test mode** untuk pengembangan awal.

#### Aturan Keamanan Firestore (Firestore Security Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fungsi pembantu role admin
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Koleksi Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if isAdmin() || request.auth.uid == userId;
    }

    // Koleksi Face Embeddings
    match /face_embeddings/{studentId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if isAdmin();
    }

    // Koleksi Absensi
    match /attendances/{attendanceId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    // Koleksi Geofence Settings
    match /geofence_settings/{zoneId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Koleksi Surat Izin Sakit
    match /sick_leave_requests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
  }
}
```

### Step 4: Setting Firebase Storage (Penyimpanan Foto Wajah & Dokter)
1. Buka menu **Build > Storage** -> Klik **Get Started**.
2. Gunakan lokasi bucket yang sama (`asia-southeast1`).
3. Set aturan akses Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /face_enrollments/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /attendance_proofs/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /medical_notes/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 3. STRUKTUR DATABASE CLOUD FIRESTORE

### 1. Collection: `users`
Document ID: `{userId}` (NISN / UID)
```json
{
  "uid": "STD001",
  "nisn": "0051234567",
  "name": "Budi Santoso",
  "role": "student",
  "classId": "10-IPA-1",
  "parentPhone": "6281234567890",
  "parentName": "Bapak Santoso",
  "faceEnrollmentStatus": "approved",
  "createdAt": "2026-08-02T07:00:00.000Z"
}
```

### 2. Collection: `face_embeddings`
Document ID: `{studentId}`
```json
{
  "studentId": "STD001",
  "studentName": "Budi Santoso",
  "vector": [0.124,-0.045,0.871,0.002],
  "photos": {
    "front": "https://firebasestorage.googleapis.com/.../front.jpg",
    "right": "https://firebasestorage.googleapis.com/.../right.jpg",
    "left": "https://firebasestorage.googleapis.com/.../left.jpg"
  },
  "qualityScore": 98,
  "approvalStatus": "approved",
  "approvedBy": "Admin - Pak Guru",
  "approvedAt": "2026-08-02T07:15:00.000Z"
}
```

### 3. Collection: `geofence_settings`
Document ID: `school_gate`
```json
{
  "schoolName": "SMA Negeri 1 Jakarta",
  "centerLatitude": -6.2088,
  "centerLongitude": 106.8456,
  "maxRadiusMeters": 50,
  "strictMode": true
}
```

### 4. Collection: `attendances`
Document ID: `{attendanceId}`
```json
{
  "studentId": "STD001",
  "studentName": "Budi Santoso",
  "classId": "10-IPA-1",
  "timestamp": "2026-08-02T06:45:12.000Z",
  "dateString": "2026-08-02",
  "status": "Hadir",
  "method": "mobile_liveness",
  "livenessChallenge": "Blink",
  "livenessPassed": true,
  "deviceSecurity": {
    "isMockLocation": false,
    "isRooted": false,
    "isVpnActive": false
  },
  "location": {
    "latitude": -6.20881,
    "longitude": 106.84562,
    "distanceMeters": 4.2
  },
  "photoProofUrl": "https://firebasestorage.googleapis.com/.../checkin_001.jpg",
  "waNotification": {
    "sent": true,
    "targetPhone": "6281234567890",
    "sentAt": "2026-08-02T06:45:13.000Z"
  }
}
```

### 5. Collection: `sick_leave_requests`
Document ID: `{requestId}`
```json
{
  "requestId": "REQ-20260802-001",
  "studentId": "STD001",
  "studentName": "Budi Santoso",
  "classId": "10-IPA-1",
  "date": "2026-08-02",
  "category": "Sakit",
  "reason": "Demam dan Flu berat",
  "medicalNoteUrl": "https://firebasestorage.googleapis.com/.../surat_dokter.jpg",
  "capturedDirectFromCamera": true,
  "status": "approved",
  "submittedAt": "2026-08-02T06:30:00.000Z"
}
```

---

## 4. INTEGRASI HARDWARE & WHATSAPP
- **Smart Kiosk**: Menggunakan local storage / IndexedDB offline cache.
- **WhatsApp Gateway**: Dihubungkan melalui Cloud Functions trigger `onCreate` pada collection `attendances`.
