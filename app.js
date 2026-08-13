

const API_BASE_URL = "";

const demoJobs = [
  {id:"JB-1001",title:"Junior Software Engineer",company:"TechNova Bangladesh",location:"Dhaka",category:"Software Engineering",type:"Full-time",salary:"BDT 45k–65k",description:"Build and maintain secure web applications and collaborate with a modern software engineering team.",status:"Verified",riskLevel:"Low",riskScore:94},
  {id:"JB-1002",title:"UI/UX Design Intern",company:"PixelCraft Studio",location:"Dhaka",category:"Design",type:"Internship",salary:"BDT 12k–18k",description:"Assist the design team with user research, wireframes, prototypes and visual design.",status:"Verified",riskLevel:"Low",riskScore:91},
  {id:"JB-1003",title:"Work From Home Data Entry",company:"Global Fast Hire",location:"Remote",category:"Finance",type:"Part-time",salary:"BDT 80k–120k",description:"Guaranteed income with registration payment required before starting work.",status:"High Risk",riskLevel:"High",riskScore:28},
  {id:"JB-1004",title:"Marketing Executive",company:"BrightPath Ltd.",location:"Chattogram",category:"Marketing",type:"Full-time",salary:"BDT 30k–45k",description:"Develop campaigns, coordinate digital marketing activities and analyze campaign performance.",status:"Under Review",riskLevel:"Medium",riskScore:67},
  {id:"JB-1005",title:"Backend Developer",company:"TechNova Bangladesh",location:"Remote",category:"Software Engineering",type:"Remote",salary:"BDT 55k–80k",description:"Develop REST APIs and backend services using Node.js and database technologies.",status:"Verified",riskLevel:"Low",riskScore:96},
  {id:"JB-1006",title:"Junior Content Writer",company:"GreenLeaf Media",location:"Sylhet",category:"Content",type:"Part-time",salary:"BDT 15k–25k",description:"Create clear and engaging content for digital campaigns and company communication.",status:"Verified",riskLevel:"Low",riskScore:88}
];

const demoCompanies = [
  {id:1,name:"TechNova Bangladesh",industry:"Software & Technology",verified:true},
  {id:2,name:"PixelCraft Studio",industry:"Design & Creative",verified:true},
  {id:3,name:"Global Fast Hire",industry:"Recruitment",verified:false}
];

let authMode = "login";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupSearch();
  setupAuth();
  setupModals();
  setupActions();
  renderJobs(demoJobs);
  renderCompanies(demoCompanies);
});

const $ = selector => document.querySelector(selector);

function setupNavigation() {
  $("#menuToggle").addEventListener("click", () => $("#navLinks").classList.toggle("active"));
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => $("#navLinks").classList.remove("active"));
  });
}

function setupSearch() {
  $("#searchBtn").addEventListener("click", applyFilters);
  $("#refreshJobsBtn").addEventListener("click", () => {
    $("#jobSearch").value = "";
    $("#locationFilter").value = "";
    $("#typeFilter").value = "";
    renderJobs(demoJobs);
    showToast("Job list refreshed.");
  });
  $("#jobSearch").addEventListener("keydown", e => {
    if (e.key === "Enter") applyFilters();
  });
}

function applyFilters() {
  const q = $("#jobSearch").value.trim().toLowerCase();
  const location = $("#locationFilter").value;
  const type = $("#typeFilter").value;

  const result = demoJobs.filter(job => {
    const text = `${job.title} ${job.company} ${job.category} ${job.description}`.toLowerCase();
    return (!q || text.includes(q)) && (!location || job.location === location) && (!type || job.type === type);
  });

  renderJobs(result);
  showToast(result.length ? `${result.length} job${result.length > 1 ? "s" : ""} found.` : "No matching jobs found.");
}

function renderJobs(list) {
  const grid = $("#jobsGrid");
  const empty = $("#jobsEmpty");
  grid.innerHTML = "";

  if (!list.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  list.forEach(job => {
    const riskClass = job.riskLevel === "High" ? "badge-danger" : job.riskLevel === "Medium" ? "badge-warning" : "badge-safe";
    const card = document.createElement("article");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-top">
        <div class="company-logo">${initials(job.company)}</div>
        <span class="badge ${riskClass}">${safe(job.status)}</span>
      </div>
      <h3>${safe(job.title)}</h3>
      <p class="job-company">${safe(job.company)}</p>
      <div class="job-meta">
        <span class="meta">📍 ${safe(job.location)}</span>
        <span class="meta">💼 ${safe(job.type)}</span>
        <span class="meta">🏷 ${safe(job.category)}</span>
      </div>
      <div class="job-bottom">
        <span class="salary">${safe(job.salary)}</span>
        <button class="btn btn-outline job-details-btn" data-id="${job.id}">View Details</button>
      </div>`;
    grid.appendChild(card);
  });

  document.querySelectorAll(".job-details-btn").forEach(btn => {
    btn.addEventListener("click", () => openJob(demoJobs.find(j => j.id === btn.dataset.id)));
  });
}

function openJob(job) {
  if (!job) return;
  const riskClass = job.riskLevel === "High" ? "badge-danger" : job.riskLevel === "Medium" ? "badge-warning" : "badge-safe";
  $("#jobDetails").innerHTML = `
    <div class="job-detail-head">
      <div class="company-logo">${initials(job.company)}</div>
      <div><span class="badge ${riskClass}">${safe(job.status)}</span><h2>${safe(job.title)}</h2><p class="detail-company">${safe(job.company)}</p></div>
    </div>
    <div class="detail-grid">
      <div class="detail-box"><small>Location</small><strong>${safe(job.location)}</strong></div>
      <div class="detail-box"><small>Job Type</small><strong>${safe(job.type)}</strong></div>
      <div class="detail-box"><small>Salary</small><strong>${safe(job.salary)}</strong></div>
      <div class="detail-box"><small>Risk Assessment</small><strong>${safe(job.riskLevel)} — ${job.riskScore}/100</strong></div>
    </div>
    <p class="detail-description">${safe(job.description)}</p>
    <div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="applyDemoBtn">Apply Now</button>
      <button class="btn btn-outline" id="reportJobBtn">Report Job</button>
    </div>`;
  $("#jobModal").classList.remove("hidden");
  $("#applyDemoBtn").onclick = () => showToast("Application flow will connect to the backend later.");
  $("#reportJobBtn").onclick = () => showToast("Report system will connect to the Express.js API later.");
}

function renderCompanies(list) {
  const grid = $("#companiesGrid");
  grid.innerHTML = "";
  list.forEach(company => {
    const card = document.createElement("article");
    card.className = "company-card";
    card.innerHTML = `
      <div class="company-logo">${initials(company.name)}</div>
      <h3>${safe(company.name)}</h3>
      <p>${safe(company.industry)}</p>
      <span class="badge ${company.verified ? "badge-safe" : "badge-warning"}">${company.verified ? "✓ Verified Company" : "◷ Under Review"}</span>`;
    grid.appendChild(card);
  });
}

function setupAuth() {
  $("#loginBtn").onclick = () => openAuth("login");
  $("#registerBtn").onclick = () => openAuth("register");
  $("#switchAuth").onclick = () => openAuth(authMode === "login" ? "register" : "login");
  $("#authForm").addEventListener("submit", handleAuth);
}

function openAuth(mode) {
  authMode = mode;
  const fields = document.querySelectorAll(".register-only");
  const register = mode === "register";

  $("#authLabel").textContent = register ? "CREATE ACCOUNT" : "WELCOME BACK";
  $("#authTitle").textContent = register ? "Join JobShield" : "Login to JobShield";
  $("#authSubtitle").textContent = register ? "Create a secure recruitment account." : "Access your secure recruitment account.";
  $("#authSubmit").textContent = register ? "Create Account" : "Login";
  $("#switchText").textContent = register ? "Already have an account?" : "Don't have an account?";
  $("#switchAuth").textContent = register ? "Login" : "Register";
  fields.forEach(el => el.classList.toggle("hidden", !register));
  $("#authModal").classList.remove("hidden");
}

async function handleAuth(e) {
  e.preventDefault();

  const email = $("#authEmail").value.trim();
  const password = $("#authPassword").value;

  if (!API_BASE_URL) {
    if (authMode === "register") {
      if (!$("#fullName").value.trim() || !$("#phone").value.trim() || !$("#gender").value || !$("#nid").value.trim()) {
        showToast("Please complete all registration fields.");
        return;
      }
      showToast("Demo account created successfully.");
    } else {
      showToast("Demo login successful.");
    }
    $("#authModal").classList.add("hidden");
    return;
  }

  const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
  const payload = authMode === "login"
    ? {email, password}
    : {
        name: $("#fullName").value.trim(),
        email,
        password,
        phone: $("#phone").value.trim(),
        gender: $("#gender").value,
        nid: $("#nid").value.trim(),
        role: $("#role").value
      };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Authentication failed.");
    localStorage.setItem("jobshieldUser", JSON.stringify(data.user));
    $("#authModal").classList.add("hidden");
    showToast(data.message || "Success.");
  } catch (error) {
    showToast(error.message);
  }
}

function setupModals() {
  $("#closeAuthModal").onclick = () => $("#authModal").classList.add("hidden");
  $("#closeJobModal").onclick = () => $("#jobModal").classList.add("hidden");
  document.querySelectorAll(".modal-backdrop").forEach(b => b.onclick = () => b.parentElement.classList.add("hidden"));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      $("#authModal").classList.add("hidden");
      $("#jobModal").classList.add("hidden");
    }
  });
}

function setupActions() {
  $("#postJobBtn").onclick = () => {
    showToast("Employer job-posting form will connect to the Express.js API.");
    openAuth("login");
  };
  $("#postJobHeroBtn").onclick = () => {
    showToast("Employer job-posting form will connect to the Express.js API.");
    openAuth("login");
  };
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0,2).map(x => x[0]).join("").toUpperCase();
}

function safe(value) {
  return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function showToast(message) {
  const container = $("#toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}
