/* ==========================================
   AI JOBGUARD
   Beginner-Friendly Rule-Based Detection
   ========================================== */


// Get HTML elements
const analyzeButton = document.getElementById("analyzeButton");
const jobDescription = document.getElementById("jobDescription");

const resultSection = document.getElementById("resultSection");
const riskCard = document.getElementById("riskCard");

const riskScore = document.getElementById("riskScore");
const riskLevel = document.getElementById("riskLevel");

const riskExplanation = document.getElementById("riskExplanation");
const warningList = document.getElementById("warningList");

const detailedExplanation =
    document.getElementById("detailedExplanation");

const recommendation =
    document.getElementById("recommendation");

const errorMessage =
    document.getElementById("errorMessage");


// ==========================================
// SUSPICIOUS PATTERNS
// ==========================================

const suspiciousPatterns = [

    {
        keywords: [
            "registration fee",
            "registration fees",
            "pay registration",
            "registration payment"
        ],
        warning: "Registration fee or registration payment requested.",
        points: 20
    },

    {
        keywords: [
            "upfront payment",
            "pay upfront",
            "advance payment",
            "pay in advance"
        ],
        warning: "Upfront or advance payment is requested.",
        points: 20
    },

    {
        keywords: [
            "processing fee",
            "processing fees",
            "application fee",
            "joining fee"
        ],
        warning: "A processing, application or joining fee is mentioned.",
        points: 15
    },

    {
        keywords: [
            "pay money",
            "send money",
            "transfer money",
            "make a payment",
            "payment required"
        ],
        warning: "The applicant is asked to make a payment.",
        points: 20
    },

    {
        keywords: [
            "no interview",
            "without interview",
            "no interview required",
            "interview not required"
        ],
        warning: "The job claims that no interview is required.",
        points: 15
    },

    {
        keywords: [
            "guaranteed salary",
            "guaranteed income",
            "guaranteed job",
            "earn huge",
            "earn lakhs",
            "unlimited income"
        ],
        warning: "Unrealistic or guaranteed income promises are present.",
        points: 15
    },

    {
        keywords: [
            "whatsapp only",
            "contact only on whatsapp",
            "whatsapp number",
            "whatsapp us"
        ],
        warning: "The opportunity relies heavily on WhatsApp-only communication.",
        points: 10
    },

    {
        keywords: [
            "pay immediately",
            "payment immediately",
            "pay now",
            "urgent payment",
            "urgent fee",
            "limited time payment"
        ],
        warning: "Urgent payment language is used.",
        points: 20
    },

    {
        keywords: [
            "send your money",
            "deposit money",
            "security deposit",
            "refundable deposit"
        ],
        warning: "A deposit or money transfer is requested from the applicant.",
        points: 20
    }

];


// ==========================================
// ANALYZE BUTTON
// ==========================================

analyzeButton.addEventListener("click", analyzeJob);


// ==========================================
// MAIN ANALYSIS FUNCTION
// ==========================================

function analyzeJob() {

    const text = jobDescription.value.trim();

    // Clear previous error
    errorMessage.style.display = "none";

    // Check if input is empty
    if (text === "") {

        errorMessage.textContent =
            "Please paste a job or internship description first.";

        errorMessage.style.display = "block";

        return;
    }


    // Convert text to lowercase
    const lowerText = text.toLowerCase();


    // Store detected warnings
    const detectedWarnings = [];

    let score = 0;


    // ==========================================
    // CHECK EACH SUSPICIOUS PATTERN
    // ==========================================

    suspiciousPatterns.forEach(function(pattern) {

        let found = false;

        pattern.keywords.forEach(function(keyword) {

            if (lowerText.includes(keyword)) {
                found = true;
            }

        });


        if (found) {

            detectedWarnings.push(pattern.warning);

            score += pattern.points;
        }

    });


    // ==========================================
    // LIMIT SCORE TO 100
    // ==========================================

    if (score > 100) {
        score = 100;
    }


    // ==========================================
    // DETERMINE RISK LEVEL
    // ==========================================

    let level;
    let explanation;

    if (score <= 30) {

        level = "Low Risk";

        explanation =
            "Only a few or no common suspicious indicators were detected. " +
            "However, users should still verify the employer independently.";

    }

    else if (score <= 60) {

        level = "Suspicious";

        explanation =
            "Several warning signs were detected. " +
            "The opportunity should be investigated carefully before sharing " +
            "personal information or making payments.";

    }

    else {

        level = "High Risk";

        explanation =
            "Multiple strong warning signs were detected. " +
            "Exercise extreme caution and independently verify the employer " +
            "before proceeding.";

    }


    // ==========================================
    // DISPLAY SCORE
    // ==========================================

    riskScore.textContent = score;
    riskLevel.textContent = level;
    riskExplanation.textContent = explanation;


    // ==========================================
    // CHANGE RISK CARD COLOR
    // ==========================================

    riskCard.classList.remove(
        "low",
        "suspicious",
        "high"
    );


    if (score <= 30) {

        riskCard.classList.add("low");

    }

    else if (score <= 60) {

        riskCard.classList.add("suspicious");

    }

    else {

        riskCard.classList.add("high");

    }


    // ==========================================
    // DISPLAY WARNING SIGNS
    // ==========================================

    warningList.innerHTML = "";


    if (detectedWarnings.length === 0) {

        const listItem = document.createElement("li");

        listItem.textContent =
            "No common suspicious warning signs were detected.";

        warningList.appendChild(listItem);

    }

    else {

        detectedWarnings.forEach(function(warning) {

            const listItem = document.createElement("li");

            listItem.textContent = warning;

            warningList.appendChild(listItem);

        });

    }


    // ==========================================
    // DETAILED EXPLANATION
    // ==========================================

    if (detectedWarnings.length === 0) {

        detailedExplanation.textContent =
            "The job description did not contain the specific suspicious " +
            "phrases checked by this first version of AI JobGuard. " +
            "This does not guarantee that the opportunity is genuine.";

    }

    else {

        detailedExplanation.textContent =
            "AI JobGuard detected " +
            detectedWarnings.length +
            " common warning sign(s) in the description. " +
            "These patterns can sometimes be associated with fraudulent " +
            "or misleading job and internship offers. " +
            "The result is only a risk assessment and should not be treated " +
            "as proof that the employer is fraudulent.";

    }


    // ==========================================
    // RECOMMENDATION
    // ==========================================

    if (score > 60) {

        recommendation.textContent =
            "⚠️ Recommendation: Do not send money or sensitive personal " +
            "information until the employer and opportunity have been " +
            "independently verified.";

    }

    else if (score > 30) {

        recommendation.textContent =
            "⚠️ Recommendation: Research the employer, verify its official " +
            "website and contact information, and avoid making payments " +
            "before verification.";

    }

    else {

        recommendation.textContent =
            "✅ No major warning signs were detected. Still verify the " +
            "employer independently before accepting the opportunity.";

    }


    // ==========================================
    // SHOW RESULTS
    // ==========================================

    resultSection.classList.remove("hidden");


    // Scroll to results
    resultSection.scrollIntoView({
        behavior: "smooth"
    });

}
