show databases;
USE lab_pulse;
SELECT * FROM users;
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'IN PROGRESS',
    time_spent VARCHAR(50) DEFAULT '0h',
    student_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO tasks (title, status, time_spent, student_id)
VALUES
('Lab 01: UI Fundamentals', 'COMPLETED', '1h 40m', 2),
('Lab 02: Component Architecture', 'IN PROGRESS', '2h 15m', 2);

describe tasks;
DROP TABLE tasks;
DROP TABLE progress;
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'IN PROGRESS',
    time_spent VARCHAR(50) DEFAULT '0h',
    student_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT id, name, role FROM users;
Select * from tasks;
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE task_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    student_id INT,
    status VARCHAR(50) DEFAULT 'IN PROGRESS',
    time_spent VARCHAR(50) DEFAULT '0h',

    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
USE parcel_management;
ALTER TABLE parcels ADD COLUMN otp VARCHAR(6) NOT NULL DEFAULT '000000';
DESCRIBE parcels;

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
    otp             VARCHAR(6)   NOT NULL DEFAULT '000000', -- The new OTP column
    arrival_date    DATE         NOT NULL DEFAULT (CURDATE()),
    delivery_date   DATE         DEFAULT NULL,
    created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
DESCRIBE parcels;