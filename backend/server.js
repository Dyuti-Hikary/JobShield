require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// TiDB Cloud database connection
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


// ===============================
// HOME / TEST API
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "JobShield backend is running!"
    });
});


// ===============================
// DATABASE TEST
// ===============================

app.get("/api/test-db", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT 1 AS connected"
        );

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


// ===============================
// SIGN UP / REGISTER
// ===============================

app.post("/api/register", async (req, res) => {

    try {

        const {
            name,
            email,
            role,
            password
        } = req.body;


        // Check required fields
        if (!name || !email || !role || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }


        // Check password length
        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }


        // Check whether email already exists
        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );


        if (existingUser.length > 0) {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }


        // Insert new user
        await db.query(
            `INSERT INTO users
            (name, email, role, password)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                role,
                password
            ]
        );


        res.status(201).json({
            success: true,
            message: "Account created successfully!"
        });


    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed."
        });
    }
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`JobShield backend running on port ${PORT}`);
});
