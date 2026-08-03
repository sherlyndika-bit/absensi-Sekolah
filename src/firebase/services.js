import supabase from '../supabase/config';

// Coordinate Gerbang Sekolah Default (Fallback)
export const DEFAULT_GEOFENCE = {
  id: "school_gate",
  school_name: "SMA Negeri 1 Jakarta",
  center_latitude: -6.175392,
  center_longitude: 106.827153,
  allowed_radius_meters: 50,
  strict_mode: true
};

class SupabaseDataStore {
  constructor() {
    this.students = [];
    this.attendances = [];
    this.leaveRequests = [];
    this.geofence = { 
      schoolName: DEFAULT_GEOFENCE.school_name,
      centerLatitude: DEFAULT_GEOFENCE.center_latitude,
      centerLongitude: DEFAULT_GEOFENCE.center_longitude,
      allowedRadiusMeters: DEFAULT_GEOFENCE.allowed_radius_meters
    };
    this.listeners = [];
    this.initialized = false;
    this.initData();
    
    // Auto-poll Supabase every 3 seconds for real-time sync across devices
    setInterval(() => {
      this.fetchSilentUpdates();
    }, 3000);
  }

  async fetchSilentUpdates() {
    try {
      const [geoRes, usersRes, attRes, leaveRes] = await Promise.all([
        supabase.from('geofence_settings').select('*').single(),
        supabase.from('users').select('*').order('created_at', { ascending: true }),
        supabase.from('attendances').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('sick_leave_requests').select('*').order('submitted_at', { ascending: false })
      ]);

      let changed = false;

      if (geoRes.data) {
        this.geofence = {
          schoolName: geoRes.data.school_name,
          centerLatitude: geoRes.data.center_latitude,
          centerLongitude: geoRes.data.center_longitude,
          allowedRadiusMeters: geoRes.data.allowed_radius_meters
        };
      }

      if (usersRes.data) {
        this.students = usersRes.data.map(u => ({
          id: u.id,
          nisn: u.nisn,
          name: u.name,
          classId: u.class_id,
          parentPhone: u.parent_phone,
          parentName: u.parent_name,
          faceEnrollmentStatus: u.face_enrollment_status || 'none',
          photoUrl: u.photo_url
        }));
        changed = true;
      }

      if (attRes.data) {
        this.attendances = attRes.data.map(a => {
          let gpsCoordinates = null;
          if (a.liveness_challenge) {
            try { gpsCoordinates = JSON.parse(a.liveness_challenge); } catch(e) {}
          }
          return {
            id: a.id,
            studentId: a.student_id,
            studentName: a.student_name,
            classId: a.class_id,
            timestamp: a.timestamp,
            timeStr: a.time_str,
            dateString: a.date_string,
            status: a.status,
            method: a.method,
            distanceMeters: a.distance_meters,
            gpsCoordinates: gpsCoordinates,
            livenessPassed: a.liveness_passed,
            photoProofUrl: a.photo_proof_url,
            waNotifSent: a.wa_notif_sent
          };
        });
        changed = true;
      }

      if (leaveRes.data) {
        this.leaveRequests = leaveRes.data.map(r => ({
          id: r.id,
          studentId: r.student_id,
          studentName: r.student_name,
          classId: r.class_id,
          date: r.date,
          category: r.category,
          reason: r.reason,
          medicalNoteUrl: r.medical_note_url,
          status: r.status,
          submittedAt: r.submitted_at
        }));
        changed = true;
      }

      if (changed) {
        this.notify();
      }
    } catch (err) {
      console.error("Silent update error:", err);
    }
  }

  async initData() {
    try {
      // Fetch Geofence
      const { data: geoData } = await supabase.from('geofence_settings').select('*').single();
      if (geoData) {
        this.geofence = {
          schoolName: geoData.school_name,
          centerLatitude: geoData.center_latitude,
          centerLongitude: geoData.center_longitude,
          allowedRadiusMeters: geoData.allowed_radius_meters
        };
      }

      // Fetch Users/Students
      const { data: usersData } = await supabase.from('users').select('*').order('created_at', { ascending: true });
      if (usersData) {
        this.students = usersData.map(u => {
          let finalPhotoUrl = u.photo_url;
          let faceDescriptor = null;
          if (u.photo_url && u.photo_url.includes('|||')) {
            const parts = u.photo_url.split('|||');
            finalPhotoUrl = parts[0];
            try { faceDescriptor = JSON.parse(parts[1]); } catch(e) {}
          }
          return {
            id: u.id,
            nisn: u.nisn,
            name: u.name,
            classId: u.class_id,
            parentPhone: u.parent_phone,
            parentName: u.parent_name,
            faceEnrollmentStatus: u.face_enrollment_status,
            photoUrl: finalPhotoUrl,
            faceDescriptor: faceDescriptor
          };
        });
      }

      // Fetch Attendances
      const { data: attData } = await supabase.from('attendances').select('*').order('created_at', { ascending: false }).limit(50);
      if (attData) {
        this.attendances = attData.map(a => {
          let gpsCoordinates = null;
          if (a.liveness_challenge) {
            try { gpsCoordinates = JSON.parse(a.liveness_challenge); } catch(e) {}
          }
          return {
            id: a.id,
            studentId: a.student_id,
            studentName: a.student_name,
            classId: a.class_id,
            timestamp: a.timestamp,
            timeStr: a.time_str,
            dateString: a.date_string,
            status: a.status,
            method: a.method,
            distanceMeters: a.distance_meters,
            gpsCoordinates: gpsCoordinates,
            livenessPassed: a.liveness_passed,
            photoProofUrl: a.photo_proof_url,
            waNotifSent: a.wa_notif_sent
          };
        });
      }

      // Fetch Leave Requests
      const { data: reqData } = await supabase.from('sick_leave_requests').select('*').order('submitted_at', { ascending: false });
      if (reqData) {
        this.leaveRequests = reqData.map(r => ({
          id: r.id,
          studentId: r.student_id,
          studentName: r.student_name,
          classId: r.class_id,
          date: r.date,
          category: r.category,
          reason: r.reason,
          medicalNoteUrl: r.medical_note_url,
          status: r.status,
          submittedAt: r.submitted_at
        }));
      }

      this.initialized = true;
      this.notify();
    } catch (err) {
      console.error("Error fetching Supabase data:", err);
    }
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
      geofence: { ...this.geofence },
      initialized: this.initialized
    };
  }

  // Record Attendance
  async addAttendance(record) {
    const newRecord = {
      id: `ATT-${Date.now()}`,
      student_id: record.studentId,
      student_name: record.studentName,
      class_id: record.classId,
      timestamp: new Date().toISOString(),
      time_str: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date_string: new Date().toISOString().split('T')[0],
      status: record.status || 'Hadir',
      method: record.method || 'mobile_liveness',
      distance_meters: record.distanceMeters,
      liveness_challenge: record.gpsCoordinates ? JSON.stringify(record.gpsCoordinates) : null,
      liveness_passed: record.livenessPassed,
      photo_proof_url: record.photoProofUrl,
      wa_notif_sent: true
    };

    // Optimistic UI update
    const uiRecord = {
      id: newRecord.id,
      studentId: newRecord.student_id,
      studentName: newRecord.student_name,
      classId: newRecord.class_id,
      timestamp: newRecord.timestamp,
      timeStr: newRecord.time_str,
      dateString: newRecord.date_string,
      status: newRecord.status,
      method: newRecord.method,
      distanceMeters: newRecord.distance_meters,
      gpsCoordinates: record.gpsCoordinates,
      livenessPassed: newRecord.liveness_passed,
      photoProofUrl: newRecord.photo_proof_url,
      waNotifSent: newRecord.wa_notif_sent
    };
    this.attendances.unshift(uiRecord);
    this.notify();

    // Persist to Supabase
    const { error } = await supabase.from('attendances').insert([newRecord]);
    if (error) {
      console.error("Gagal menyimpan absensi:", error);
      alert("Gagal menyimpan data ke server! Pastikan RLS Supabase mengizinkan INSERT.");
    }
    return uiRecord;
  }

  // Submit Self Enrollment Face
  async submitFaceEnrollment(studentId, photos, descriptorArray = null) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      let finalUrl = photos && photos.front ? photos.front : null;
      if (finalUrl && descriptorArray) {
        finalUrl = `${finalUrl}|||${JSON.stringify(descriptorArray)}`;
      }

      student.faceEnrollmentStatus = "pending";
      if (photos && photos.front) {
        student.photoUrl = photos.front;
        student.faceDescriptor = descriptorArray;
      }
      this.notify();

      const updatePayload = { face_enrollment_status: 'pending' };
      if (finalUrl) {
        updatePayload.photo_url = finalUrl;
      }

      const { error } = await supabase.from('users').update(updatePayload).eq('id', studentId);
      if (error) {
        alert("Gagal memperbarui status wajah di server: " + error.message);
        console.error(error);
      }
    }
  }

  // Approve / Reject Face Enrollment (Admin Function)
  async updateEnrollmentStatus(studentId, newStatus) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.faceEnrollmentStatus = newStatus;
      this.notify();
      await supabase.from('users').update({ face_enrollment_status: newStatus }).eq('id', studentId);
    }
  }

  // Submit Sick / Doctor Leave Note
  async addLeaveRequest(request) {
    const newReq = {
      id: `REQ-${Date.now()}`,
      student_id: request.studentId,
      student_name: request.studentName,
      class_id: request.classId,
      date: request.date,
      category: request.category,
      reason: request.reason,
      medical_note_url: request.medicalNoteUrl,
      captured_direct_from_camera: true,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    const uiReq = {
      id: newReq.id,
      studentId: newReq.student_id,
      studentName: newReq.student_name,
      classId: newReq.class_id,
      date: newReq.date,
      category: newReq.category,
      reason: newReq.reason,
      medicalNoteUrl: newReq.medical_note_url,
      status: newReq.status,
      submittedAt: newReq.submitted_at
    };
    this.leaveRequests.unshift(uiReq);
    this.notify();

    const { error } = await supabase.from('sick_leave_requests').insert([newReq]);
    if (error) {
      alert("Gagal mengirim surat izin ke server. Pastikan RLS Supabase mengizinkan INSERT.");
      console.error(error);
    }
    return uiReq;
  }

  // Update Leave Request Status (Admin)
  async updateLeaveStatus(reqId, status) {
    const req = this.leaveRequests.find(r => r.id === reqId);
    if (req) {
      req.status = status;
      this.notify();
      await supabase.from('sick_leave_requests').update({ status: status }).eq('id', reqId);
    }
  }

  // Update Geofence Config
  async updateGeofence(newConfig) {
    this.geofence = { ...this.geofence, ...newConfig };
    this.notify();
    await supabase.from('geofence_settings').update({
      school_name: this.geofence.schoolName,
      center_latitude: this.geofence.centerLatitude,
      center_longitude: this.geofence.centerLongitude,
      allowed_radius_meters: this.geofence.allowedRadiusMeters
    }).eq('id', 'school_gate');
  }

  // --- Student CRUD ---
  async addStudent(studentData) {
    const id = `STD${Date.now().toString().slice(-4)}`;
    const newStudent = {
      id: id,
      nisn: studentData.nisn,
      name: studentData.name,
      class_id: studentData.classId,
      parent_phone: studentData.parentPhone,
      parent_name: studentData.parentName,
      face_enrollment_status: 'none',
      photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/192px-User_icon_2.svg.png'
    };

    const uiStudent = {
      id: newStudent.id,
      nisn: newStudent.nisn,
      name: newStudent.name,
      classId: newStudent.class_id,
      parentPhone: newStudent.parent_phone,
      parentName: newStudent.parent_name,
      faceEnrollmentStatus: newStudent.face_enrollment_status,
      photoUrl: newStudent.photo_url
    };

    this.students.push(uiStudent);
    this.notify();

    const { error } = await supabase.from('users').insert([newStudent]);
    if (error) {
      alert("Gagal menyimpan siswa ke server! " + error.message);
      console.error(error);
    }
    return uiStudent;
  }

  async updateStudent(studentId, updates) {
    const idx = this.students.findIndex(s => s.id === studentId);
    if (idx !== -1) {
      this.students[idx] = { ...this.students[idx], ...updates };
      this.notify();
      
      await supabase.from('users').update({
        nisn: this.students[idx].nisn,
        name: this.students[idx].name,
        class_id: this.students[idx].classId,
        parent_phone: this.students[idx].parentPhone,
        parent_name: this.students[idx].parentName
      }).eq('id', studentId);
    }
  }

  async deleteStudent(studentId) {
    // Simpan status lama untuk rollback jika error
    const previousStudents = [...this.students];
    
    // Update UI (optimistic)
    this.students = this.students.filter(s => s.id !== studentId);
    this.notify();

    try {
      // Hapus data dependen terlebih dahulu (menghindari Foreign Key Constraint Error di PostgreSQL)
      await supabase.from('attendances').delete().eq('student_id', studentId);
      await supabase.from('sick_leave_requests').delete().eq('student_id', studentId);
      
      // Hapus user
      const { error } = await supabase.from('users').delete().eq('id', studentId);
      
      if (error) throw error;
    } catch (err) {
      console.error("Gagal menghapus dari database:", err);
      alert("Gagal menghapus data siswa. Mungkin karena masalah jaringan atau hak akses.");
      // Rollback UI
      this.students = previousStudents;
      this.notify();
    }
  }
}

export const store = new SupabaseDataStore();
