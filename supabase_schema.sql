-- =========================================================
-- SKEMA DATABASE SUPABASE (POSTGRESQL) - ABSENSI SISWA MODERN
-- =========================================================

-- 1. TABEL GEOFENCE SETTINGS
CREATE TABLE IF NOT EXISTS geofence_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'school_gate',
    school_name VARCHAR(100) NOT NULL DEFAULT 'SMA Negeri 1 Jakarta',
    center_latitude DOUBLE PRECISION NOT NULL DEFAULT -6.175392,
    center_longitude DOUBLE PRECISION NOT NULL DEFAULT 106.827153,
    allowed_radius_meters INT NOT NULL DEFAULT 50,
    strict_mode BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL USERS / SISWA
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    nisn VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    class_id VARCHAR(50) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_name VARCHAR(100),
    face_enrollment_status VARCHAR(20) DEFAULT 'approved', -- approved, pending, rejected, none
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL FACE EMBEDDINGS (LANDMARK WAJAH 128-D)
CREATE TABLE IF NOT EXISTS face_embeddings (
    student_id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(100) NOT NULL,
    vector FLOAT8[], -- Array 128-dimensi Landmark Wajah
    photo_front_url TEXT,
    photo_right_url TEXT,
    photo_left_url TEXT,
    quality_score INT DEFAULT 95,
    approval_status VARCHAR(20) DEFAULT 'approved',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL LOG ABSENSI
CREATE TABLE IF NOT EXISTS attendances (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(100) NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_str VARCHAR(20) NOT NULL,
    date_string DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'Hadir', -- Hadir, Terlambat, Luar Radius
    method VARCHAR(30) NOT NULL DEFAULT 'mobile_liveness', -- mobile_liveness, smart_kiosk, iot_gate
    distance_meters DOUBLE PRECISION NOT NULL,
    liveness_passed BOOLEAN DEFAULT TRUE,
    photo_proof_url TEXT,
    wa_notif_sent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL SURAT IZIN SAKIT / CUTI
CREATE TABLE IF NOT EXISTS sick_leave_requests (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    student_name VARCHAR(100) NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(20) NOT NULL, -- Sakit, Izin
    reason TEXT NOT NULL,
    medical_note_url TEXT NOT NULL,
    captured_direct_from_camera BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEED DATA DEFAULT (INITIAL DATA)
INSERT INTO geofence_settings (id, school_name, center_latitude, center_longitude, allowed_radius_meters)
VALUES ('school_gate', 'SMA Negeri 1 Jakarta', -6.175392, 106.827153, 50)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, nisn, name, class_id, parent_phone, parent_name, face_enrollment_status, photo_url)
VALUES 
('STD001', '0051234567', 'Budi Santoso', '10-IPA-1', '6281234567890', 'Bapak Santoso', 'approved', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'),
('STD002', '0051234568', 'Siti Rahmawati', '10-IPA-1', '6281987654321', 'Ibu Rahmawati', 'approved', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'),
('STD003', '0051234569', 'Ahmad Rizky', '10-IPA-2', '6285678901234', 'Bapak Rizky', 'pending', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('STD004', '0051234570', 'Dewi Lestari', '10-IPA-2', '6287712345678', 'Ibu Lestari', 'approved', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- ENABLE ROW LEVEL SECURITY (RLS) FOR PUBLIC ACCESS DEMO
ALTER TABLE geofence_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE sick_leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON geofence_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON users FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON face_embeddings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON attendances FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON sick_leave_requests FOR SELECT USING (true);

CREATE POLICY "Public Insert Access" ON attendances FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Access" ON sick_leave_requests FOR INSERT WITH CHECK (true);
