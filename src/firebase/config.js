import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase Configuration Object
// Siswa/Admin dapat mengganti nilai environment variable atau string di bawah ini dengan config dari Firebase Console mereka
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_SAMPLE_KEY_ABSENSI_SEKOLAH",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "absensi-sekolah-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "absensi-sekolah-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "absensi-sekolah-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:demo1234567890"
};

// Inisialisasi Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
