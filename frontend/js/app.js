// ==========================================
// JobShield - Frontend JavaScript
// ==========================================

const API_URL = "/api";


// ==========================================
// THEME TOGGLE
// ==========================================

const themeToggle = document.getElementById("theme-toggle");

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("jobshield-theme", theme);

    if (themeToggle) {
        themeToggle.textContent =
            theme === "dark" ? "☀️" : "🌙";
    }
}


const savedTheme =
    localStorage.getItem("jobshield-theme") || "light";

setTheme(savedTheme);


if (themeToggle) {
    themeToggle.addEventListener("click", () => {

        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        setTheme(
            currentTheme === "dark"
                ? "light"
                : "dark"
        );

    });
}


// ==========================================
// LOAD JOBS
// ==========================================

async function loadJobs(searchTerm = "") {

    const jobList =
        document.getElementById("job-list");

    if (!jobList) return;


    jobList.innerHTML = `
        <div class="loading">
            Loading jobs...
        </div>
    `;


    try {

        const response =
            await fetch(`${API_URL}/jobs`);


        if (!response.ok) {
            throw new Error("Unable to load jobs");
        }


        const jobs =
            await response.json();


        let filteredJobs = jobs;


        // Search filtering
        if (searchTerm.trim() !== "") {

            const search =
                searchTerm.toLowerCase();


            filteredJobs = jobs.filter(job =>

                String(job.title || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(job.company_name || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(job.category || "")
                    .toLowerCase()
                    .includes(search)

                ||

                String(job.location || "")
                    .toLowerCase()
                    .includes(search)

            );
        }


        if (filteredJobs.length === 0) {

            jobList.innerHTML = `
                <div class="loading">
                    No matching jobs found.
                </div>
            `;

            return;
        }


        jobList.innerHTML =
            filteredJobs.map(createJobCard).join("");


    } catch (error) {

        console.error(error);


        // Temporary demo jobs
        // Used until backend is connected

        const demoJobs = [

            {
                id: 1,
                title: "Software Engineer",
                company_name: "TechNova Ltd.",
                location: "Dhaka, Bangladesh",
                category: "Technology",
                job_type: "Full-time",
                risk_level: "very_low"
            },

            {
                id: 2,
                title: "Frontend Developer",
                company_name: "Digital Solutions",
                location: "Remote",
                category: "Technology",
                job_type: "Full-time",
                risk_level: "low"
            },

            {
                id: 3,
                title: "Marketing Executive",
                company_name: "GrowthHub",
                location: "Dhaka, Bangladesh",
                category: "Marketing",
                job_type: "Full-time",
                risk_level: "moderate"
            }

        ];


        let demoFiltered =
            demoJobs;


        if (searchTerm.trim() !== "") {

            const search =
                searchTerm.toLowerCase();


            demoFiltered =
                demoJobs.filter(job =>

                    job.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    job.company_name
                        .toLowerCase()
                        .includes(search)

                    ||

                    job.category
                        .toLowerCase()
                        .includes(search)

                );
        }


        jobList.innerHTML =
            demoFiltered
                .map(createJobCard)
                .join("");
    }
}


// ==========================================
// CREATE JOB CARD
// ==========================================

function createJobCard(job) {

    const risk =
        job.risk_level || "low";


    const riskText =
        risk.replace("_", " ").toUpperCase();


    return `

        <article class="job-card">

            <h3>
                ${escapeHTML(job.title || "Untitled Job")}
            </h3>


            <p class="job-company">
                🏢
                ${escapeHTML(
                    job.company_name ||
                    "Unknown Company"
                )}
            </p>


            <div class="job-meta">

                <span>
                    📍
                    ${escapeHTML(
                        job.location ||
                        "Location not specified"
                    )}
                </span>


                <span>
                    💼
                    ${escapeHTML(
                        job.job_type ||
                        "Job type not specified"
                    )}
                </span>

            </div>


            <span class="badge risk-${risk}">
                Risk: ${riskText}
            </span>

        </article>

    `;
}


// ==========================================
// SEARCH
// ==========================================

const searchInput =
    document.getElementById("search-input");

const searchButton =
    document.getElementById("search-btn");


if (searchButton) {

    searchButton.addEventListener(
        "click",
        () => {

            const value =
                searchInput
                    ? searchInput.value
                    : "";

            loadJobs(value);

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keypress",
        event => {

            if (event.key === "Enter") {

                loadJobs(
                    searchInput.value
                );

            }

        }
    );

}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;
}


// ==========================================
// INITIAL LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadJobs();

    }
);
