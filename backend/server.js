require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// TiDB Cloud connection
const db = mysql.createPool({
    host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "2YRoPTCCekGBopK.root",
    password: process.env.DB_PASSWORD,
    database: "jobshield",
    ssl: {
        rejectUnauthorized: true
    }
});

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "JobShield backend is running!"
    });
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS connected");

        res.json({
            success: true,
            message: "Database connected successfully!",
            result: rows
        });

    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
});

app.listen(PORT, () => {
    console.log(`JobShield backend running on port ${PORT}`);
});
