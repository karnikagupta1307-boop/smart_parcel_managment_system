const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config(); // This loads your .env file!

const app = express();
app.use(cors());
app.use(express.json());

// 1. Create the Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 2. Test the Database Connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Successfully connected to the MySQL database!');
});

// Add this right above the /test route
app.get('/', (req, res) => {
    res.send("Welcome to the Parcel Management API!");
});

// 3. Keep our test route
app.get('/test', (req, res) => {
    res.send("Hello from the Node.js Backend!");
});

// Get all parcels from the database
app.get('/api/parcels', (req, res) => {
    // Write the SQL query
    const sqlQuery = "SELECT * FROM parcels"; 
    
    // Ask the database to run the query
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Failed to fetch parcels" });
        }
        // Send the database results back to the browser!
        res.json(results); 
    });
});

// Add a brand new parcel to the database
// Add a brand new parcel to the database
app.post('/api/parcels', (req, res) => {
    // 1. Grab the data the frontend sent us
    const { student_name, phone, source, delivery_person, sap_id } = req.body;

    // 2. Generate a unique parcel ID
    const parcel_id = 'PKG-' + Date.now();

    // 3. UPDATED SQL: Added student_id to the list, and an extra ? to VALUES
    const sqlQuery = `INSERT INTO parcels 
                      (parcel_id, student_id, student_name, phone, source, delivery_person, sap_id, status) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, 'Arrived')`;

    // 4. UPDATED ARRAY: Added a hardcoded '1' right after parcel_id!
    db.query(sqlQuery, [parcel_id, 1, student_name, phone, source, delivery_person, sap_id], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Failed to add parcel" });
        }
        
        // 5. Tell the frontend it was a success!
        res.json({ message: "Parcel added successfully!", database_id: result.insertId });
    });
});

// Search for a student's parcels using their SAP ID
app.get('/api/parcels/search', (req, res) => {
    // 1. Grab the SAP ID from the URL query
    const { sap_id } = req.query; 

    // 2. Check if they actually typed an SAP ID
    if (!sap_id) {
        return res.status(400).json({ error: "Please provide an SAP ID to search." });
    }

    // 3. Write the SQL query to find only matching parcels
    const sqlQuery = "SELECT * FROM parcels WHERE sap_id = ?";

    // 4. Ask the database
    db.query(sqlQuery, [sap_id], (err, results) => {
        if (err) {
            console.error("Error searching data:", err);
            return res.status(500).json({ error: "Failed to search parcels" });
        }
        
        // 5. Send the matching parcels back to the browser
        res.json(results); 
    });
});
// Mark a parcel as Delivered
app.put('/api/parcels/:id/deliver', (req, res) => {
    // 1. Grab the specific parcel's ID from the URL
    const parcelId = req.params.id;

    // 2. Write the SQL query to change the status
    const sqlQuery = "UPDATE parcels SET status = 'Delivered' WHERE id = ?";

    // 3. Send the command to MySQL
    db.query(sqlQuery, [parcelId], (err, result) => {
        if (err) {
            console.error("Error updating parcel:", err);
            return res.status(500).json({ error: "Failed to update status" });
        }

        // 4. Check if the parcel actually existed
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Parcel not found" });
        }
        
        // 5. Success!
        res.json({ message: "Parcel successfully marked as Delivered!" });
    });
});

// 4. Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});