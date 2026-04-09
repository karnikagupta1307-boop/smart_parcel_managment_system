CREATE TABLE students (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    sap_id      VARCHAR(20)   NOT NULL UNIQUE,
    phone       VARCHAR(15)   NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE admins (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('admin', 'watchman', 'staff') NOT NULL DEFAULT 'watchman',
    created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE parcels (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    parcel_id       VARCHAR(20)  NOT NULL UNIQUE,
    student_id      INT          NOT NULL,
    student_name    VARCHAR(100) NOT NULL,
    sap_id          VARCHAR(20)  NOT NULL,
    phone           VARCHAR(15)  NOT NULL,
    source          VARCHAR(100) NOT NULL,
    delivery_person VARCHAR(100),
    delivery_phone  VARCHAR(15),
    status          ENUM('Arrived', 'Delivered') NOT NULL DEFAULT 'Arrived',
    arrival_date    DATE         NOT NULL DEFAULT (CURDATE()),
    delivery_date   DATE         DEFAULT NULL,
    created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO students (name, sap_id, phone, password_hash) VALUES
('Rahul Sharma',   'SAP2024001', '9876543210', '$2b$10$dummyhash_rahul'),
('Priya Mehta',    'SAP2024002', '9876543211', '$2b$10$dummyhash_priya'),
('Aditya Verma',   'SAP2024003', '9876543212', '$2b$10$dummyhash_aditya');

INSERT INTO admins (username, password_hash, role) VALUES
('admin_01',    '$2b$10$dummyhash_admin',    'admin'),
('watchman_01', '$2b$10$dummyhash_watchman', 'watchman'),
('staff_01',    '$2b$10$dummyhash_staff',    'staff');

INSERT INTO parcels (parcel_id, student_id, student_name, sap_id, phone, source, delivery_person, delivery_phone) VALUES
('2026-04-07-001', 1, 'Rahul Sharma', 'SAP2024001', '9876543210', 'Amazon',   'Ravi Kumar',  '9000000001'),
('2026-04-07-002', 2, 'Priya Mehta',  'SAP2024002', '9876543211', 'Flipkart', 'Suresh Singh', '9000000002'),
('2026-04-07-003', 3, 'Aditya Verma', 'SAP2024003', '9876543212', 'Meesho',  'Amit Yadav',  '9000000003');

-- Student login (match by SAP ID or phone)
SELECT id, name, sap_id, phone
FROM students
WHERE sap_id = 'SAP2024001' OR phone = '9876543210';

-- Admin login
SELECT id, username, role
FROM admins
WHERE username = 'watchman_01';

-- Create a parcel (auto arrival_date)
INSERT INTO parcels (parcel_id, student_id, student_name, sap_id, phone, source, delivery_person, delivery_phone)
VALUES ('2026-04-07-004', 1, 'Rahul Sharma', 'SAP2024001', '9876543210', 'Amazon', 'Ravi Kumar', '9000000001');

-- Mark parcel as delivered (auto delivery_date)
UPDATE parcels
SET status = 'Delivered', delivery_date = CURDATE()
WHERE parcel_id = '2026-04-07-001';

-- Student dashboard — fetch parcels by student_id or phone
SELECT parcel_id, source, student_name, sap_id, phone,
       arrival_date, delivery_date, status
FROM parcels
WHERE student_id = 1 OR phone = '9876543210';

-- Admin parcel list view
SELECT parcel_id, student_name, sap_id, phone,
       source, arrival_date, status
FROM parcels
ORDER BY created_at DESC;

-- ─────────────────────────────────────────
-- VERIFY ALL TABLES
-- ─────────────────────────────────────────
SELECT * FROM students;
SELECT * FROM admins;
SELECT * FROM parcels;
