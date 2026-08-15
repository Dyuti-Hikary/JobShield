const suspiciousKeywords = [
    "wire transfer",
    "no experience required",
    "earn fast money",
    "work from home",
    "whatsapp only",
    "telegram",
    "crypto payment",
    "send money",
    "registration fee",
    "processing fee",
    "pay first",
    "guaranteed income"
];


// ==========================================
// MAIN FRAUD ANALYSIS FUNCTION
// ==========================================

function analyzeJobRisk(jobData, companyVerified = false) {

    let score = 0;

    const indicators = [];


    // ------------------------------------------
    // 1. Keyword Analysis
    // ------------------------------------------

    const title =
        String(jobData.title || "").toLowerCase();

    const description =
        String(jobData.description || "").toLowerCase();

    const content =
        `${title} ${description}`;


    suspiciousKeywords.forEach(keyword => {

        if (content.includes(keyword)) {

            score += 10;

            indicators.push(
                `Suspicious keyword detected: "${keyword}"`
            );
        }

    });


    // ------------------------------------------
    // 2. Salary Analysis
    // ------------------------------------------

    const salaryMax =
        Number(jobData.salary_max || 0);


    const experience =
        String(
            jobData.experience_level || ""
        ).toLowerCase();


    if (
        salaryMax > 200000 &&
        (
            experience === "entry" ||
            experience === "fresher" ||
            experience === "junior"
        )
    ) {

        score += 20;

        indicators.push(
            "Salary appears unusually high for the stated experience level."
        );
    }


    // ------------------------------------------
    // 3. Public Email Detection
    // ------------------------------------------

    if (
        content.includes("@gmail.com") ||
        content.includes("@yahoo.com") ||
        content.includes("@outlook.com") ||
        content.includes("@hotmail.com")
    ) {

        score += 15;

        indicators.push(
            "Job advertisement uses a public email domain."
        );
    }


    // ------------------------------------------
    // 4. External Messaging Apps
    // ------------------------------------------

    if (
        content.includes("whatsapp") ||
        content.includes("telegram")
    ) {

        score += 15;

        indicators.push(
            "Recruitment communication appears to rely on external messaging applications."
        );
    }


    // ------------------------------------------
    // 5. Payment Request Detection
    // ------------------------------------------

    if (
        content.includes("registration fee") ||
        content.includes("processing fee") ||
        content.includes("pay first") ||
        content.includes("send money")
    ) {

        score += 25;

        indicators.push(
            "Job advertisement appears to request payment from applicants."
        );
    }


    // ------------------------------------------
    // 6. Company Verification
    // ------------------------------------------

    if (!companyVerified) {

        score += 15;

        indicators.push(
            "The company has not been verified by JobShield."
        );
    }


    // ------------------------------------------
    // Keep score within 0 - 100
    // ------------------------------------------

    score =
        Math.min(score, 100);


    // ------------------------------------------
    // Determine Risk Level
    // ------------------------------------------

    let level;


    if (score >= 80) {

        level = "critical";

    } else if (score >= 60) {

        level = "high";

    } else if (score >= 40) {

        level = "moderate";

    } else if (score >= 20) {

        level = "low";

    } else {

        level = "very_low";
    }

    return {

        score,

        level,

        indicators

    };

}
module.exports = {
    analyzeJobRisk
};
