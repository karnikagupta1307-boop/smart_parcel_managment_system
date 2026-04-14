const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Constants
const SALT_ROUNDS = 10;
const ADMIN_USERNAME = 'nmims@123';
const ADMIN_PASSWORD = 'nmims123';

// Serve static files (frontend HTML, CSS, JS)
app.use(express.static('.'));

// Database configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'parcel_management';

let db;
let promiseDb;

// Function to initialize database
async function initializeDatabase() {
    try {
        // Step 1: Connect to MySQL without database to create it
        const tempConnection = mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD
        });

        const tempPromiseDb = tempConnection.promise();

        // Create database if it doesn't exist
        await tempPromiseDb.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        console.log(`✓ Database '${DB_NAME}' created or already exists`);

        // Close temporary connection
        tempConnection.end();

        // Step 2: Create connection pool with the database
        db = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        promiseDb = db.promise();

        // Step 3: Create tables
        await createTables();

        // Step 4: Insert sample data
        await insertSampleData();

        console.log('✓ Successfully connected to MySQL database!');
        console.log('✓ All tables created and ready!');

    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

// Function to create tables
async function createTables() {
    // Create students table
    await promiseDb.query(`
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            sap_id VARCHAR(20) NOT NULL UNIQUE,
            phone VARCHAR(15) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    console.log('✓ Table "students" ready');

    // Create admins table
    await promiseDb.query(`
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('admin', 'watchman', 'staff') NOT NULL DEFAULT 'watchman',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    console.log('✓ Table "admins" ready');

    // Create parcels table
    await promiseDb.query(`
        CREATE TABLE IF NOT EXISTS parcels (
            id INT AUTO_INCREMENT PRIMARY KEY,
            parcel_id VARCHAR(20) NOT NULL UNIQUE,
            student_id INT NOT NULL,
            student_name VARCHAR(100) NOT NULL,
            sap_id VARCHAR(20) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            source VARCHAR(100) NOT NULL,
            delivery_person VARCHAR(100),
            delivery_phone VARCHAR(15),
            status ENUM('Arrived', 'Delivered') NOT NULL DEFAULT 'Arrived',
            arrival_date DATE NOT NULL DEFAULT (CURDATE()),
            delivery_date DATE DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        )
    `);
    console.log('✓ Table "parcels" ready');
}

// Function to insert sample data
async function insertSampleData() {
    try {
        // Clear parcels first (foreign key constraint)
        await promiseDb.query('DELETE FROM parcels');
        
        // Clear all students and insert only 3 demo students
        await promiseDb.query('DELETE FROM students');
        
        // Hash passwords for demo students
        const hashedPassword1 = await bcrypt.hash('student123', SALT_ROUNDS);
        const hashedPassword2 = await bcrypt.hash('student456', SALT_ROUNDS);
        const hashedPassword3 = await bcrypt.hash('student789', SALT_ROUNDS);
        
        // Insert exactly 3 demo students with proper 11-digit SAP IDs
        const [result1] = await promiseDb.query(
            'INSERT INTO students (name, sap_id, phone, password_hash) VALUES (?, ?, ?, ?)',
            ['Rahul Sharma', '12345678901', '9876543210', hashedPassword1]
        );
        const [result2] = await promiseDb.query(
            'INSERT INTO students (name, sap_id, phone, password_hash) VALUES (?, ?, ?, ?)',
            ['Priya Mehta', '12345678902', '9876543211', hashedPassword2]
        );
        const [result3] = await promiseDb.query(
            'INSERT INTO students (name, sap_id, phone, password_hash) VALUES (?, ?, ?, ?)',
            ['Aditya Verma', '12345678903', '9876543212', hashedPassword3]
        );
        console.log('✓ 3 Demo students inserted');

        // Clear existing admins and create only the required one
        await promiseDb.query('DELETE FROM admins');
        
        // Hash the admin password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
        
        // Insert only the required admin
        await promiseDb.query(
            'INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)',
            [ADMIN_USERNAME, hashedPassword, 'admin']
        );
        console.log('✓ Admin account created: nmims@123');

        // Insert sample parcels with correct student IDs
        await promiseDb.query(
            `INSERT INTO parcels (parcel_id, student_id, student_name, sap_id, phone, source, delivery_person, delivery_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['1', result1.insertId, 'Rahul Sharma', '12345678901', '9876543210', 'Amazon', 'Ravi Kumar', '9000000001']
        );
        await promiseDb.query(
            `INSERT INTO parcels (parcel_id, student_id, student_name, sap_id, phone, source, delivery_person, delivery_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['2', result2.insertId, 'Priya Mehta', '12345678902', '9876543211', 'Flipkart', 'Suresh Singh', '9000000002']
        );
        await promiseDb.query(
            `INSERT INTO parcels (parcel_id, student_id, student_name, sap_id, phone, source, delivery_person, delivery_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['3', result1.insertId, 'Rahul Sharma', '12345678901', '9876543210', 'Myntra', 'Amit Yadav', '9000000003']
        );
        console.log('✓ Sample parcels inserted (IDs: 1, 2, 3)');
    } catch (err) {
        console.error('Error inserting sample data:', err);
    }
}

// Initialize database on startup
initializeDatabase();

// ==================== AUTHENTICATION APIs ====================

// Student Login API - Only SAP ID allowed
app.post('/api/auth/student/login', async (req, res) => {
    const { sap_id, password } = req.body;
    
    // Validate SAP ID (exactly 11 digits)
    if (!sap_id || !/^\d{11}$/.test(sap_id)) {
        return res.status(400).json({ error: "Please provide a valid 11-digit SAP ID" });
    }

    if (!password) {
        return res.status(400).json({ error: "Please provide password" });
    }

    try {
        const [results] = await promiseDb.query(
            "SELECT * FROM students WHERE sap_id = ?",
            [sap_id]
        );
        
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const student = results[0];
        
        // Verify password using bcrypt
        const isValidPassword = await bcrypt.compare(password, student.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: student.id,
                name: student.name,
                sap_id: student.sap_id,
                phone: student.phone,
                role: 'student'
            }
        });
    } catch (err) {
        console.error("Error during student login:", err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Admin Login API
app.post('/api/auth/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Please provide username and password" });
    }

    try {
        const [results] = await promiseDb.query(
            "SELECT * FROM admins WHERE username = ?",
            [username]
        );
        
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const admin = results[0];
        
        // Verify password using bcrypt
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            }
        });
    } catch (err) {
        console.error("Error during admin login:", err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Student Registration API with validation
app.post('/api/auth/student/register', async (req, res) => {
    const { name, sap_id, phone, password } = req.body;
    
    // Validate all fields present
    if (!name || !sap_id || !phone || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Validate name (at least 2 characters, letters and spaces only)
    if (!/^[a-zA-Z\s]{2,100}$/.test(name)) {
        return res.status(400).json({ error: "Name must be 2-100 characters, letters only" });
    }

    // Validate SAP ID (exactly 11 digits)
    if (!/^\d{11}$/.test(sap_id)) {
        return res.status(400).json({ error: "SAP ID must be exactly 11 digits" });
    }

    // Validate phone (exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
    }

    // Validate password (at least 6 characters)
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        // Check if SAP ID already exists
        const [existingSap] = await promiseDb.query(
            "SELECT * FROM students WHERE sap_id = ?",
            [sap_id]
        );
        
        if (existingSap.length > 0) {
            return res.status(409).json({ error: "SAP ID already registered" });
        }

        // Check if phone already exists
        const [existingPhone] = await promiseDb.query(
            "SELECT * FROM students WHERE phone = ?",
            [phone]
        );
        
        if (existingPhone.length > 0) {
            return res.status(409).json({ error: "Phone number already registered" });
        }

        // Hash the password with bcrypt
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await promiseDb.query(
            "INSERT INTO students (name, sap_id, phone, password_hash) VALUES (?, ?, ?, ?)",
            [name, sap_id, phone, passwordHash]
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: result.insertId,
                name: name,
                sap_id: sap_id,
                phone: phone,
                role: 'student'
            }
        });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// ==================== PARCEL APIs ====================

// Get all parcels (for admin dashboard)
app.get('/api/parcels', async (req, res) => {
    try {
        const [results] = await promiseDb.query(
            "SELECT * FROM parcels ORDER BY created_at DESC"
        );
        res.json(results);
    } catch (err) {
        console.error("Error fetching parcels:", err);
        res.status(500).json({ error: "Failed to fetch parcels" });
    }
});

// Get parcels by student SAP ID or Phone
app.get('/api/parcels/student', async (req, res) => {
    const { sap_id, phone } = req.query;
    
    try {
        let sqlQuery;
        let params;
        
        if (sap_id) {
            sqlQuery = "SELECT * FROM parcels WHERE sap_id = ? ORDER BY created_at DESC";
            params = [sap_id];
        } else if (phone) {
            sqlQuery = "SELECT * FROM parcels WHERE phone = ? ORDER BY created_at DESC";
            params = [phone];
        } else {
            return res.status(400).json({ error: "Please provide sap_id or phone" });
        }

        const [results] = await promiseDb.query(sqlQuery, params);
        res.json(results);
    } catch (err) {
        console.error("Error fetching student parcels:", err);
        res.status(500).json({ error: "Failed to fetch parcels" });
    }
});

// Search parcels
app.get('/api/parcels/search', async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: "Search query required" });
    }

    try {
        const searchPattern = `%${query}%`;
        const [results] = await promiseDb.query(
            `SELECT * FROM parcels 
             WHERE parcel_id LIKE ? 
             OR student_name LIKE ? 
             OR sap_id LIKE ? 
             OR phone LIKE ?
             OR source LIKE ?
             ORDER BY created_at DESC`,
            [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]
        );
        res.json(results);
    } catch (err) {
        console.error("Error searching parcels:", err);
        res.status(500).json({ error: "Search failed" });
    }
});

// Add a new parcel
app.post('/api/parcels', async (req, res) => {
    const { student_name, phone, source, delivery_person, delivery_phone, sap_id } = req.body;

    if (!student_name || !phone || !source) {
        return res.status(400).json({ error: "Student name, phone, and source are required" });
    }

    try {
        // Find student by phone or SAP ID
        let studentId = null;
        let studentSapId = sap_id;
        
        const [students] = await promiseDb.query(
            "SELECT id, sap_id FROM students WHERE phone = ? OR sap_id = ?",
            [phone, sap_id || '']
        );
        
        if (students.length > 0) {
            studentId = students[0].id;
            studentSapId = students[0].sap_id;
        }

        // Generate sequential parcel ID (1, 2, 3, ...)
        const [maxIdResult] = await promiseDb.query(
            "SELECT MAX(CAST(parcel_id AS UNSIGNED)) as max_id FROM parcels"
        );
        const nextId = (maxIdResult[0].max_id || 0) + 1;
        const parcel_id = String(nextId);

        const [result] = await promiseDb.query(
            `INSERT INTO parcels (parcel_id, student_id, student_name, phone, sap_id, source, delivery_person, delivery_phone, status, arrival_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Arrived', CURDATE())`,
            [parcel_id, studentId, student_name, phone, studentSapId || '', source, delivery_person || '', delivery_phone || '']
        );

        res.status(201).json({
            success: true,
            message: "Parcel added successfully",
            parcel: {
                id: result.insertId,
                parcel_id: parcel_id,
                student_name: student_name,
                status: 'Arrived'
            }
        });
    } catch (err) {
        console.error("Error adding parcel:", err);
        res.status(500).json({ error: "Failed to add parcel" });
    }
});

// Mark parcel as delivered
app.put('/api/parcels/:id/deliver', async (req, res) => {
    const parcelId = req.params.id;

    try {
        const [result] = await promiseDb.query(
            "UPDATE parcels SET status = 'Delivered', delivery_date = CURDATE() WHERE id = ? OR parcel_id = ?",
            [parcelId, parcelId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Parcel not found" });
        }

        res.json({ success: true, message: "Parcel marked as delivered" });
    } catch (err) {
        console.error("Error updating parcel:", err);
        res.status(500).json({ error: "Failed to update parcel" });
    }
});

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [totalResult] = await promiseDb.query("SELECT COUNT(*) as total FROM parcels");
        const [arrivedResult] = await promiseDb.query("SELECT COUNT(*) as count FROM parcels WHERE status = 'Arrived'");
        const [deliveredResult] = await promiseDb.query("SELECT COUNT(*) as count FROM parcels WHERE status = 'Delivered'");
        
        res.json({
            total: totalResult[0].total,
            arrived: arrivedResult[0].count,
            delivered: deliveredResult[0].count,
            pending: arrivedResult[0].count
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});