// JobShield - Express.js API Server
// Express.js is used as the web framework.
// Node.js is the runtime that executes this application.

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// -------------------------
// Demo data
// -------------------------

const users = [];
const jobs = [
  {
    id: "JB-1001",
    title: "Junior Software Engineer",
    company: "TechNova Bangladesh",
    location: "Dhaka",
    category: "Software Engineering",
    type: "Full-time",
    salary: "BDT 45k-65k",
    status: "Verified",
    riskLevel: "Low",
    riskScore: 94
  },
  {
    id: "JB-1002",
    title: "Work From Home Data Entry",
    company: "Global Fast Hire",
    location: "Remote",
    category: "Finance",
    type: "Part-time",
    salary: "BDT 80k-120k",
    status: "High Risk",
    riskLevel: "High",
    riskScore: 28
  }
];

const companies = [
  {
    id: 1,
    name: "TechNova Bangladesh",
    industry: "Software & Technology",
    verified: true
  },
  {
    id: 2,
    name: "Global Fast Hire",
    industry: "Recruitment",
    verified: false
  }
];

const reports = [];
const reviews = [];
const notifications = [];

// -------------------------
// Health check
// -------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "JobShield Express.js API",
    message: "Express.js server is running."
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    runtime: "Node.js",
    framework: "Express.js"
  });
});

// -------------------------
// FR-01: Registration
// -------------------------

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, gender, nid, role } = req.body;

  if (!name || !email || !password || !phone || !gender || !nid) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password, phone, gender and NID are required."
    });
  }

  const user = {
    id: users.length + 1,
    name,
    email,
    password,
    phone,
    gender,
    nid,
    role: role || "job_seeker"
  };

  users.push(user);

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      role: user.role
    }
  });
});

// -------------------------
// FR-01: Login
// -------------------------

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    item => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  res.json({
    success: true,
    message: "Login successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: `demo-token-${user.id}`
  });
});

// -------------------------
// FR-02: Create Job
// -------------------------

app.post("/api/jobs", (req, res) => {
  const {
    title,
    company,
    location,
    category,
    type,
    salary,
    description
  } = req.body;

  if (!title || !company || !location || !category || !type) {
    return res.status(400).json({
      success: false,
      message: "Required job information is missing."
    });
  }

  const job = {
    id: `JB-${1000 + jobs.length + 1}`,
    title,
    company,
    location,
    category,
    type,
    salary: salary || "Not specified",
    description: description || "",
    status: "Pending Verification",
    riskLevel: "Pending",
    riskScore: null
  };

  jobs.push(job);

  res.status(201).json({
    success: true,
    message: "Job created successfully.",
    job
  });
});

// -------------------------
// FR-03: Search & Filtering
// -------------------------

app.get("/api/jobs", (req, res) => {
  const {
    search = "",
    location = "",
    category = "",
    type = ""
  } = req.query;

  let result = jobs;

  if (search) {
    const q = search.toLowerCase();

    result = result.filter(job =>
      `${job.title} ${job.company} ${job.description}`
        .toLowerCase()
        .includes(q)
    );
  }

  if (location) {
    result = result.filter(job =>
      job.location.toLowerCase() === location.toLowerCase()
    );
  }

  if (category) {
    result = result.filter(job =>
      job.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (type) {
    result = result.filter(job =>
      job.type.toLowerCase() === type.toLowerCase()
    );
  }

  res.json({
    success: true,
    count: result.length,
    jobs: result
  });
});

// -------------------------
// FR-04: Job Verification
// -------------------------

app.patch("/api/jobs/:id/verify", (req, res) => {
  const job = jobs.find(item => item.id === req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found."
    });
  }

  job.status = req.body.verified ? "Verified" : "Rejected";

  res.json({
    success: true,
    message: "Job verification updated.",
    job
  });
});

// -------------------------
// FR-05: Fake Job Risk Assessment
// -------------------------

app.post("/api/jobs/:id/analyze", (req, res) => {
  const job = jobs.find(item => item.id === req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found."
    });
  }

  const text = `${job.title} ${job.description} ${job.salary}`.toLowerCase();

  let score = 100;
  const warnings = [];

  if (
    text.includes("registration fee") ||
    text.includes("payment required") ||
    text.includes("pay first")
  ) {
    score -= 40;
    warnings.push("Possible payment request detected.");
  }

  if (
    text.includes("guaranteed income") ||
    text.includes("get rich") ||
    text.includes("instant income")
  ) {
    score -= 30;
    warnings.push("Unrealistic income claim detected.");
  }

  if (job.company === "Global Fast Hire") {
    score -= 20;
    warnings.push("Company is not verified.");
  }

  score = Math.max(0, score);

  let riskLevel = "Low";

  if (score < 50) {
    riskLevel = "High";
  } else if (score < 75) {
    riskLevel = "Medium";
  }

  job.riskScore = score;
  job.riskLevel = riskLevel;

  res.json({
    success: true,
    jobId: job.id,
    riskScore: score,
    riskLevel,
    warnings,
    note: "Phase-2 rule-based prototype. Python ML will replace this later."
  });
});

// -------------------------
// FR-06: Company Verification
// -------------------------

app.get("/api/companies", (req, res) => {
  res.json({
    success: true,
    count: companies.length,
    companies
  });
});

app.patch("/api/companies/:id/verify", (req, res) => {
  const company = companies.find(
    item => item.id === Number(req.params.id)
  );

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found."
    });
  }

  company.verified = Boolean(req.body.verified);

  res.json({
    success: true,
    company
  });
});

// -------------------------
// FR-07: Reports
// -------------------------

app.post("/api/reports", (req, res) => {
  const { jobId, reason, details } = req.body;

  if (!jobId || !reason) {
    return res.status(400).json({
      success: false,
      message: "Job ID and report reason are required."
    });
  }

  const report = {
    id: `RP-${reports.length + 1}`,
    jobId,
    reason,
    details: details || "",
    status: "Submitted",
    createdAt: new Date().toISOString()
  };

  reports.push(report);

  res.status(201).json({
    success: true,
    message: "Report submitted successfully.",
    report
  });
});

// -------------------------
// FR-08: Reviews
// -------------------------

app.post("/api/reviews", (req, res) => {
  const { companyId, rating, review } = req.body;

  if (!companyId || !rating || !review) {
    return res.status(400).json({
      success: false,
      message: "Company, rating and review are required."
    });
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5."
    });
  }

  const newReview = {
    id: reviews.length + 1,
    companyId: Number(companyId),
    rating: Number(rating),
    review,
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);

  res.status(201).json({
    success: true,
    message: "Review submitted successfully.",
    review: newReview
  });
});

// -------------------------
// FR-09: Notifications
// -------------------------

app.get("/api/notifications", (req, res) => {
  res.json({
    success: true,
    count: notifications.length,
    notifications
  });
});

// -------------------------
// FR-10: Admin Dashboard
// -------------------------

app.get("/api/admin/dashboard", (req, res) => {
  res.json({
    success: true,
    dashboard: {
      totalUsers: users.length,
      totalJobs: jobs.length,
      totalCompanies: companies.length,
      totalReports: reports.length,
      totalReviews: reviews.length,
      highRiskJobs: jobs.filter(job => job.riskLevel === "High").length
    }
  });
});

// -------------------------
// 404 handler
// -------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found."
  });
});

// -------------------------
// Start server
// -------------------------

app.listen(PORT, () => {
  console.log(`JobShield Express.js API running at http://localhost:${PORT}`);
});
