const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// JSON database files
const dataPath = path.join(__dirname, "data");

const usersFile = path.join(dataPath, "users.json");
const jobsFile = path.join(dataPath, "jobs.json");
const companiesFile = path.join(dataPath, "companies.json");
const reportsFile = path.join(dataPath, "reports.json");

// Read JSON file
function readJSON(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
        return [];
    }
}

// Write JSON file
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


// =========================
// HOME / API TEST
// =========================

app.get("/api", (req, res) => {
    res.json({
        message: "JobShield Backend API is running!",
        status: "success"
    });
});


// =========================
// USERS
// =========================

// Get all users
app.get("/api/users", (req, res) => {
    const users = readJSON(usersFile);

    // Don't send passwords
    const safeUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });

    res.json(safeUsers);
});


// Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const users = readJSON(usersFile);

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    res.json({
        success: true,
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        }
    });
});


// =========================
// JOBS
// =========================

// Get all jobs
app.get("/api/jobs", (req, res) => {
    const jobs = readJSON(jobsFile);
    const companies = readJSON(companiesFile);

    const jobsWithCompany = jobs.map(job => {

        const company = companies.find(
            c => c.id === job.company_id
        );

        return {
            ...job,
            company_name: company
                ? company.name
                : "Unknown Company"
        };
    });

    res.json(jobsWithCompany);
});


// Get single job
app.get("/api/jobs/:id", (req, res) => {

    const jobs = readJSON(jobsFile);

    const job = jobs.find(
        j => String(j.id) === String(req.params.id)
    );

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    res.json(job);
});


// =========================
// COMPANIES
// =========================

// Get companies
app.get("/api/companies", (req, res) => {

    const companies = readJSON(companiesFile);

    res.json(companies);
});


// =========================
// REPORTS
// =========================

// Get reports
app.get("/api/reports", (req, res) => {

    const reports = readJSON(reportsFile);

    res.json(reports);
});


// Submit report
app.post("/api/reports", (req, res) => {

    const reports = readJSON(reportsFile);

    const newReport = {
        id: reports.length + 1,
        job_id: req.body.job_id,
        reported_by: req.body.reported_by,
        reason: req.body.reason,
        details: req.body.details || "",
        status: "pending",
        created_at: new Date().toISOString()
    };

    reports.push(newReport);

    writeJSON(reportsFile, reports);

    res.status(201).json({
        success: true,
        message: "Report submitted successfully",
        report: newReport
    });
});


// =========================
// SERVER
// =========================

app.listen(PORT, () => {
    console.log(`JobShield server running on port ${PORT}`);
});
