require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint untuk mendapatkan semua destinasi beserta transport dan ulasannya
app.get('/api/destinations', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM destinations');
        
        // Ambil data transport dan ulasan untuk setiap destinasi
        const fullDestinations = await Promise.all(rows.map(async (d) => {
            const [transports] = await pool.query('SELECT transport_option FROM destination_transport WHERE destination_id = ?', [d.id]);
            const [reviews] = await pool.query('SELECT user_name as u, rating_stars as s, review_text as t FROM destination_reviews WHERE destination_id = ?', [d.id]);
            
            return {
                ...d,
                priceNum: d.price_num, // Mapping nama kolom SQL ke JS property
                transport: transports.map(t => t.transport_option),
                reviews: reviews
            };
        }));
        
        res.json(fullDestinations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint untuk mendapatkan paket tur
app.get('/api/tours', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tour_packages');
        const fullTours = await Promise.all(rows.map(async (t) => {
            const [features] = await pool.query('SELECT feature FROM tour_features WHERE tour_id = ?', [t.id]);
            return {
                ...t,
                priceLabel: t.price_label,
                features: features.map(f => f.feature)
            };
        }));
        res.json(fullTours);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint untuk mendapatkan events
app.get('/api/events', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});