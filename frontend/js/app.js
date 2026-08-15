// JobShield Frontend Application

const API_URL = "/api";

// Load jobs
async function loadJobs() {
    try {
        const response = await fetch(`${API_URL}/jobs`);

        if (!response.ok) {
            throw new Error("Failed to load jobs");
        }

        const jobs = await response.json();

        const jobContainer = document.getElementById("job-list");

        if (!jobContainer) return;

        if (jobs.length === 0) {
            jobContainer.innerHTML = `
                <p>No jobs available at the moment.</p>
            `;
            return;
        }

        jobContainer.innerHTML = jobs.map(job => `
            <div class="job-card">
                <h3>${job.title}</h3>

                <p>
                    <strong>Company:</strong>
                    ${job.company_name || "Unknown Company"}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${job.location || "Not specified"}
                </p>

                <p>
                    <strong>Risk Level:</strong>
                    ${job.risk_level || "Unknown"}
                </p>

                <button onclick="viewJob(${job.id})">
                    View Details
                </button>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error loading jobs:", error);

        const jobContainer = document.getElementById("job-list");

        if (jobContainer) {
            jobContainer.innerHTML = `
                <p>Unable to load jobs.</p>
            `;
        }
    }
}


// View job details
function viewJob(jobId) {
    window.location.href = `job-details.html?id=${jobId}`;
}


// Theme toggle
function toggleTheme() {
    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
}


// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";

    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );
}


// Run when page loads
document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    const themeButton = document.getElementById("theme-toggle");

    if (themeButton) {
        themeButton.addEventListener("click", toggleTheme);
    }

    loadJobs();
});
