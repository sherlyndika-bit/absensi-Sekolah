// Firebase Data Services & Real-time Fallback Data Store
import { formatParentWAMessage } from '../utils/faceAndGeoUtils';

// Coordinate Gerbang Sekolah Default (SMA Negeri 1 - Contoh: Monas Jakarta)
export const DEFAULT_GEOFENCE = {
  schoolName: "SMA Negeri 1 Jakarta",
  centerLatitude: -6.175392,
  centerLongitude: 106.827153,
  allowedRadiusMeters: 50,
  strictMode: true,
  checkInLateTime: "07:15"
};

// Initial Sample Data Students
export const INITIAL_STUDENTS = [
  {
    id: "STD001",
    nisn: "0051234567",
    name: "Budi Santoso",
    classId: "10-IPA-1",
    parentPhone: "6281234567890",
    parentName: "Bapak Santoso",
    faceEnrollmentStatus: "approved", // approved, pending, none
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STD002",
    nisn: "0051234568",
    name: "Siti Rahmawati",
    classId: "10-IPA-1",
    parentPhone: "6281987654321",
    parentName: "Ibu Rahmawati",
    faceEnrollmentStatus: "approved",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STD003",
    nisn: "0051234569",
    name: "Ahmad Rizky",
    classId: "10-IPA-2",
    parentPhone: "6285678901234",
    parentName: "Bapak Rizky",
    faceEnrollmentStatus: "pending",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STD004",
    nisn: "0051234570",
    name: "Dewi Lestari",
    classId: "10-IPA-2",
    parentPhone: "6287712345678",
    parentName: "Ibu Lestari",
    faceEnrollmentStatus: "approved",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  }
];

// Initial Attendance Records
export const INITIAL_ATTENDANCES = [
  {
    id: "ATT-101",
    studentId: "STD001",
    studentName: "Budi Santoso",
    classId: "10-IPA-1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    timeStr: "06:45:12",
    dateString: new Date().toISOString().split('T')[0],
    status: "Hadir",
    method: "mobile_liveness",
    distanceMeters: 4.2,
    livenessPassed: true,
    photoProofUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    waNotifSent: true
  },
  {
    id: "ATT-102",
    studentId: "STD002",
    studentName: "Siti Rahmawati",
    classId: "10-IPA-1",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    timeStr: "07:05:40",
    dateString: new Date().toISOString().split('T')[0],
    status: "Hadir",
    method: "smart_kiosk",
    distanceMeters: 1.5,
    livenessPassed: true,
    photoProofUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    waNotifSent: true
  }
];

// Initial Sick & Leave Requests
export const INITIAL_LEAVE_REQUESTS = [
  {
    id: "REQ-001",
    studentId: "STD003",
    studentName: "Ahmad Rizky",
    classId: "10-IPA-2",
    date: new Date().toISOString().split('T')[0],
    category: "Sakit",
    reason: "Demam tinggi & flu berat, diminta istirahat dokter",
    medicalNoteUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80",
    status: "pending",
    submittedAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// In-Memory Data Store Proxy for Instant Interactive Demo & Firebase Mirror
class LocalDataStore {
  constructor() {
    this.students = [...INITIAL_STUDENTS];
    this.attendances = [...INITIAL_ATTENDANCES];
    this.leaveRequests = [...INITIAL_LEAVE_REQUESTS];
    this.geofence = { ...DEFAULT_GEOFENCE };
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getState());
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  getState() {
    return {
      students: [...this.students],
      attendances: [...this.attendances],
      leaveRequests: [...this.leaveRequests],
      geofence: { ...this.geofence }
    };
  }

  // Record Attendance
  addAttendance(record) {
    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dateString: new Date().toISOString().split('T')[0],
      waNotifSent: true,
      ...record
    };

    this.attendances.unshift(newRecord);
    this.notify();
    return newRecord;
  }

  // Submit Self Enrollment Face
  submitFaceEnrollment(studentId, photos) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.faceEnrollmentStatus = "pending";
      student.photos = photos;
      this.notify();
    }
  }

  // Approve / Reject Face Enrollment (Admin Function)
  updateEnrollmentStatus(studentId, newStatus) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.faceEnrollmentStatus = newStatus;
      this.notify();
    }
  }

  // Submit Sick / Doctor Leave Note
  addLeaveRequest(request) {
    const newReq = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      ...request
    };
    this.leaveRequests.unshift(newReq);
    this.notify();
    return newReq;
  }

  // Update Leave Request Status (Admin)
  updateLeaveStatus(reqId, status) {
    const req = this.leaveRequests.find(r => r.id === reqId);
    if (req) {
      req.status = status;
      this.notify();
    }
  }

  // Update Geofence Config
  updateGeofence(newConfig) {
    this.geofence = { ...this.geofence, ...newConfig };
    this.notify();
  }
}

export const store = new LocalDataStore();
