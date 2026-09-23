/* ==========================================
   AI JOBGUARD
   Rule-Based Fake Job & Internship Detector
   ========================================== */

"use strict";


// ==========================================
// DOM ELEMENTS
// ==========================================

const analyzeButton = document.getElementById("analyzeButton");
const jobDescription = document.getElementById("jobDescription");

const resultSection = document.getElementById("resultSection");

const riskCard = document.getElementById("riskCard");
const riskScore = document.getElementById("riskScore");
const riskLevel = document.getElementById("riskLevel");
const riskPill = document.getElementById("riskPill");

const riskTitle = document.getElementById("riskTitle");
const riskExplanation = document.getElementById("riskExplanation");

const meterValue = document.getElementById("meterValue");
const meterFill = document.getElementById("meterFill");

const riskBreakdown = document.getElementById("riskBreakdown");
const warningList = document.getElementById("warningList");

const detailedExplanation =
    document.getElementById("detailedExplanation");

const recommendation =
    document.getElementById("recommendation");

const highlightedText =
    document.getElementById("highlightedText");

const contactAnalysis =
    document.getElementById("contactAnalysis");

const salaryAnalysis =
    document.getElementById("salaryAnalysis");

const personalDataWarning =
    document.getElementById("personalDataWarning");

const errorMessage =
    document.getElementById("errorMessage");

const characterCount =
    document.getElementById("characterCount");

const clearButton =
    document.getElementById("clearButton");

const loadingArea =
    document.getElementById("loadingArea");

const loadingText =
    document.getElementById("loadingText");

const downloadReport =
    document.getElementById("downloadReport");

const languageSelector =
    document.getElementById("languageSelector");

const historyList =
    document.getElementById("historyList");

const clearHistory =
    document.getElementById("clearHistory");

const totalScans =
    document.getElementById("totalScans");

const highRiskCount =
    document.getElementById("highRiskCount");

const suspiciousCount =
    document.getElementById("suspiciousCount");

const lowRiskCount =
    document.getElementById("lowRiskCount");


// ==========================================
// SAFE HELPERS
// ==========================================

function elementExists(element) {
    return element !== null && element !== undefined;
}


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeRegex(text) {

    return String(text).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}


// ==========================================
// SUSPICIOUS PATTERNS
// ==========================================

const suspiciousPatterns = [

    {
        id: "registration",
        name: "Registration Fee",
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
        id: "upfront",
        name: "Upfront Payment",
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
        id: "processing",
        name: "Processing / Joining Fee",
        keywords: [
            "processing fee",
            "processing fees",
            "application fee",
            "joining fee",
            "training fee",
            "certificate fee"
        ],
        warning: "A processing, application, training or joining fee is mentioned.",
        points: 15
    },

    {
        id: "money",
        name: "Money Request",
        keywords: [
            "pay money",
            "send money",
            "transfer money",
            "make a payment",
            "payment required",
            "send payment"
        ],
        warning: "The applicant is asked to make a payment.",
        points: 20
    },

    {
        id: "interview",
        name: "No Interview",
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
        id: "salary",
        name: "Unrealistic Salary",
        keywords: [
            "guaranteed salary",
            "guaranteed income",
            "guaranteed job",
            "earn huge",
            "earn lakhs",
            "unlimited income",
            "100% salary guarantee",
            "high salary no experience"
        ],
        warning: "Unrealistic or guaranteed income promises are present.",
        points: 18
    },

    {
        id: "whatsapp",
        name: "WhatsApp-Only Contact",
        keywords: [
            "whatsapp only",
            "contact only on whatsapp",
            "whatsapp number",
            "whatsapp us",
            "message us on whatsapp",
            "contact us on whatsapp"
        ],
        warning: "The opportunity relies heavily on WhatsApp communication.",
        points: 10
    },

    {
        id: "urgency",
        name: "Urgency Pressure",
        keywords: [
            "pay immediately",
            "payment immediately",
            "pay now",
            "urgent payment",
            "urgent fee",
            "limited time",
            "act now",
            "apply immediately",
            "offer expires",
            "last chance",
            "limited seats",
            "limited positions"
        ],
        warning: "Urgent or pressure-based language is used.",
        points: 15
    },

    {
        id: "deposit",
        name: "Security Deposit",
        keywords: [
            "send your money",
            "deposit money",
            "security deposit",
            "refundable deposit",
            "refundable fee"
        ],
        warning: "A deposit or money transfer is requested from the applicant.",
        points: 20
    },

    {
        id: "personal",
        name: "Sensitive Information",
        keywords: [
            "aadhaar",
            "aadhar",
            "pan card",
            "bank account",
            "bank details",
            "otp",
            "upi pin",
            "credit card",
            "debit card"
        ],
        warning: "Sensitive personal or financial information is requested.",
        points: 20
    },

    {
        id: "guarantee",
        name: "Guaranteed Selection",
        keywords: [
            "guaranteed selection",
            "100% selection",
            "job guaranteed",
            "selected guaranteed",
            "guaranteed placement"
        ],
        warning: "Guaranteed job or selection claims are present.",
        points: 15
    }

];


// ==========================================
// SALARY DETECTION
// ==========================================

function detectSalary(text) {

    const salaryPatterns = [

        /₹\s?\d+(?:[.,]\d+)?\s*(?:lakh|lakhs|lpa)/gi,

        /₹\s?\d+(?:[.,]\d+)?\s*(?:k|K)/g,

        /₹\s?\d+(?:[.,]\d+)?/g,

        /\b\d+(?:[.,]\d+)?\s*(?:lakh|lakhs|lpa)\b/gi,

        /\b\d+(?:[.,]\d+)?\s*(?:k|K)\s*(?:per month|monthly)?/gi

    ];

    const results = [];

    salaryPatterns.forEach(function(pattern) {

        const matches = text.match(pattern);

        if (matches) {

            matches.forEach(function(match) {

                if (!results.includes(match)) {
                    results.push(match);
                }

            });

        }

    });

    return results;

}


// ==========================================
// CONTACT INFORMATION DETECTION
// ==========================================

function analyzeContacts(text) {

    const emails =
        text.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
        ) || [];

    const phones =
        text.match(
            /(?:\+91[\s-]?)?[6-9]\d{9}\b/g
        ) || [];

    const urls =
        text.match(
            /https?:\/\/[^\s]+|www\.[^\s]+/gi
        ) || [];

    const upi =
        text.match(
            /\b[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\b/g
        ) || [];

    const whatsapp =
        /whatsapp/i.test(text);

    return {
        emails: [...new Set(emails)],
        phones: [...new Set(phones)],
        urls: [...new Set(urls)],
        upi: [...new Set(upi)],
        whatsapp: whatsapp
    };

}


// ==========================================
// PERSONAL INFORMATION DETECTION
// ==========================================

function detectPersonalInformation(text) {

    const findings = [];

    const checks = [

        {
            name: "Aadhaar",
            regex: /\baadhaar\b|\baadhar\b/i
        },

        {
            name: "PAN Card",
            regex: /\bpan card\b|\bpan number\b/i
        },

        {
            name: "Bank Account",
            regex: /\bbank account\b|\bbank details\b|\baccount number\b/i
        },

        {
            name: "OTP",
            regex: /\botp\b|\bone time password\b/i
        },

        {
            name: "Credit Card",
            regex: /\bcredit card\b/i
        },

        {
            name: "Debit Card",
            regex: /\bdebit card\b/i
        },

        {
            name: "UPI PIN",
            regex: /\bupi pin\b|\bupi password\b/i
        }

    ];

    checks.forEach(function(check) {

        if (check.regex.test(text)) {

            findings.push(check.name);

        }

    });

    return findings;

}


// ==========================================
// RISK LEVEL
// ==========================================

function getRiskLevel(score) {

    if (score <= 30) {

        return {
            level: "Low Risk",
            className: "low",
            title: "Low Risk",
            explanation:
                "Only a few or no common suspicious indicators were detected. " +
                "However, you should still verify the employer independently."
        };

    }

    if (score <= 60) {

        return {
            level: "Suspicious",
            className: "suspicious",
            title: "Suspicious",
            explanation:
                "Several warning signs were detected. " +
                "Investigate the opportunity carefully before sharing information " +
                "or making payments."
        };

    }

    return {
        level: "High Risk",
        className: "high",
        title: "High Risk",
        explanation:
            "Multiple strong warning signs were detected. " +
            "Exercise extreme caution and independently verify the employer " +
            "before proceeding."
    };

}


// ==========================================
// ANALYZE JOB
// ==========================================

function analyzeJob() {

    const text =
        elementExists(jobDescription)
            ? jobDescription.value.trim()
            : "";

    if (elementExists(errorMessage)) {
        errorMessage.style.display = "none";
        errorMessage.textContent = "";
    }

    if (text === "") {

        if (elementExists(errorMessage)) {

            errorMessage.textContent =
                "Please paste a job or internship description first.";

            errorMessage.style.display = "block";

        }

        return;

    }


    // Show loading
    if (elementExists(loadingArea)) {
        loadingArea.classList.remove("hidden");
        loadingArea.style.display = "block";
    }

    if (elementExists(loadingText)) {
        loadingText.textContent =
            "AI JobGuard is analyzing the job description...";
    }


    // Small delay gives loading animation time to appear
    setTimeout(function() {

        performAnalysis(text);

        if (elementExists(loadingArea)) {
            loadingArea.classList.add("hidden");
            loadingArea.style.display = "none";
        }

    }, 500);

}


// ==========================================
// PERFORM ANALYSIS
// ==========================================

function performAnalysis(text) {

    const lowerText = text.toLowerCase();

    let score = 0;

    const detectedPatterns = [];
    const detectedWarnings = [];

    // --------------------------------------
    // Suspicious pattern checking
    // --------------------------------------

    suspiciousPatterns.forEach(function(pattern) {

        let found = false;

        pattern.keywords.forEach(function(keyword) {

            if (lowerText.includes(keyword.toLowerCase())) {
                found = true;
            }

        });

        if (found) {

            score += pattern.points;

            detectedPatterns.push(pattern);

            detectedWarnings.push(pattern.warning);

        }

    });


    // --------------------------------------
    // Contact information
    // --------------------------------------

    const contacts =
        analyzeContacts(text);


    // --------------------------------------
    // Personal information
    // --------------------------------------

    const personalInfo =
        detectPersonalInformation(text);


    // --------------------------------------
    // Salary
    // --------------------------------------

    const salaries =
        detectSalary(text);


    // --------------------------------------
    // Personal information extra score
    // --------------------------------------

    if (personalInfo.length > 0) {

        const alreadyDetected =
            detectedPatterns.some(function(pattern) {

                return pattern.id === "personal";

            });

        if (!alreadyDetected) {

            score += 20;

        }

    }


    // --------------------------------------
    // Email domain check
    // --------------------------------------

    const personalEmailDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "rediffmail.com"
    ];

    let personalEmailFound = false;

    contacts.emails.forEach(function(email) {

        const parts = email.toLowerCase().split("@");

        if (
            parts.length === 2 &&
            personalEmailDomains.includes(parts[1])
        ) {

            personalEmailFound = true;

        }

    });


    if (personalEmailFound) {

        score += 5;

    }


    // --------------------------------------
    // WhatsApp extra score
    // --------------------------------------

    if (
        contacts.whatsapp &&
        contacts.phones.length > 0
    ) {

        const whatsappPatternDetected =
            detectedPatterns.some(function(pattern) {

                return pattern.id === "whatsapp";

            });

        if (!whatsappPatternDetected) {

            score += 5;

        }

    }


    // --------------------------------------
    // Salary reality check
    // --------------------------------------

    let unrealisticSalary = false;

    const salaryText =
        text.toLowerCase();

    if (

        salaryText.includes("₹1 lakh") ||
        salaryText.includes("₹2 lakh") ||
        salaryText.includes("₹3 lakh") ||
        salaryText.includes("1 lakh per month") ||
        salaryText.includes("2 lakh per month") ||
        salaryText.includes("3 lakh per month") ||
        salaryText.includes("100000 per month") ||
        salaryText.includes("200000 per month")

    ) {

        unrealisticSalary = true;

        score += 10;

    }


    // --------------------------------------
    // Limit score
    // --------------------------------------

    if (score > 100) {
        score = 100;
    }


    // --------------------------------------
    // Risk
    // --------------------------------------

    const risk =
        getRiskLevel(score);


    // --------------------------------------
    // Display everything
    // --------------------------------------

    displayResults({
        text: text,
        score: score,
        risk: risk,
        detectedPatterns: detectedPatterns,
        detectedWarnings: detectedWarnings,
        contacts: contacts,
        personalInfo: personalInfo,
        salaries: salaries,
        personalEmailFound: personalEmailFound,
        unrealisticSalary: unrealisticSalary
    });


    // --------------------------------------
    // Save history
    // --------------------------------------

    saveHistory({
        date: new Date().toLocaleString(),
        score: score,
        level: risk.level,
        preview: text.substring(0, 100)
    });


    updateDashboard();

}


// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(data) {

    const {
        text,
        score,
        risk,
        detectedPatterns,
        detectedWarnings,
        contacts,
        personalInfo,
        salaries,
        personalEmailFound,
        unrealisticSalary
    } = data;


    // ======================================
    // SCORE
    // ======================================

    if (elementExists(riskScore)) {
        riskScore.textContent = score;
    }

    if (elementExists(riskLevel)) {
        riskLevel.textContent = risk.level;
    }

    if (elementExists(riskPill)) {
        riskPill.textContent = risk.level;
    }

    if (elementExists(riskTitle)) {
        riskTitle.textContent = risk.title;
    }

    if (elementExists(riskExplanation)) {
        riskExplanation.textContent = risk.explanation;
    }


    // ======================================
    // RISK CARD
    // ======================================

    if (elementExists(riskCard)) {

        riskCard.classList.remove(
            "low",
            "suspicious",
            "high"
        );

        riskCard.classList.add(
            risk.className
        );

    }


    // ======================================
    // METER
    // ======================================

    if (elementExists(meterValue)) {
        meterValue.textContent = score + "%";
    }

    if (elementExists(meterFill)) {

        meterFill.style.width =
            score + "%";

    }


    // ======================================
    // WARNING LIST
    // ======================================

    if (elementExists(warningList)) {

        warningList.innerHTML = "";

        if (detectedWarnings.length === 0) {

            const item =
                document.createElement("li");

            item.textContent =
                "No common suspicious warning signs were detected.";

            warningList.appendChild(item);

        }

        else {

            detectedWarnings.forEach(function(warning) {

                const item =
                    document.createElement("li");

                item.textContent =
                    warning;

                warningList.appendChild(item);

            });

        }

    }


    // ======================================
    // RISK BREAKDOWN
    // ======================================

    if (elementExists(riskBreakdown)) {

        riskBreakdown.innerHTML = "";

        if (detectedPatterns.length === 0) {

            riskBreakdown.innerHTML =
                "<p>No major suspicious patterns detected.</p>";

        }

        else {

            detectedPatterns.forEach(function(pattern) {

                const row =
                    document.createElement("div");

                row.className =
                    "risk-breakdown-item";

                row.innerHTML = `
                    <div class="risk-breakdown-name">
                        ${escapeHTML(pattern.name)}
                    </div>

                    <div class="risk-breakdown-bar">
                        <div
                            class="risk-breakdown-fill"
                            style="width:${Math.min(pattern.points * 4, 100)}%"
                        ></div>
                    </div>

                    <div class="risk-breakdown-points">
                        +${pattern.points}
                    </div>
                `;

                riskBreakdown.appendChild(row);

            });

        }

    }


    // ======================================
    // DETAILED EXPLANATION
    // ======================================

    if (elementExists(detailedExplanation)) {

        if (detectedWarnings.length === 0) {

            detailedExplanation.textContent =
                "AI JobGuard did not detect the specific suspicious phrases " +
                "checked by this rule-based version. This does not guarantee " +
                "that the opportunity is genuine. Always verify the employer.";

        }

        else {

            detailedExplanation.textContent =
                `AI JobGuard detected ${detectedWarnings.length} common ` +
                `warning sign(s) in the description. These patterns can ` +
                `sometimes be associated with fraudulent or misleading job ` +
                `and internship offers. The result is a risk assessment, ` +
                `not proof that the employer is fraudulent.`;

        }

    }


    // ======================================
    // RECOMMENDATION
    // ======================================

    if (elementExists(recommendation)) {

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

    }


    // ======================================
    // CONTACT ANALYSIS
    // ======================================

    if (elementExists(contactAnalysis)) {

        let html = "";

        if (contacts.emails.length > 0) {

            html += `
                <p>
                    <strong>Email:</strong>
                    ${contacts.emails.map(escapeHTML).join(", ")}
                </p>
            `;

        }

        if (contacts.phones.length > 0) {

            html += `
                <p>
                    <strong>Phone:</strong>
                    ${contacts.phones.map(escapeHTML).join(", ")}
                </p>
            `;

        }

        if (contacts.urls.length > 0) {

            html += `
                <p>
                    <strong>Links:</strong>
                    ${contacts.urls.map(escapeHTML).join(", ")}
                </p>
            `;

        }

        if (contacts.upi.length > 0) {

            html += `
                <p>
                    <strong>Possible UPI ID:</strong>
                    ${contacts.upi.map(escapeHTML).join(", ")}
                </p>
            `;

        }

        if (contacts.whatsapp) {

            html += `
                <p>
                    <strong>WhatsApp:</strong>
                    WhatsApp communication detected.
                </p>
            `;

        }

        if (personalEmailFound) {

            html += `
                <p>
                    ⚠️ A personal email provider such as Gmail/Yahoo was detected.
                    Verify the company independently.
                </p>
            `;

        }

        if (html === "") {

            html =
                "<p>No contact information was detected.</p>";

        }

        contactAnalysis.innerHTML =
            html;

    }


    // ======================================
    // SALARY ANALYSIS
    // ======================================

    if (elementExists(salaryAnalysis)) {

        if (salaries.length === 0) {

            salaryAnalysis.innerHTML =
                "<p>No clear salary amount detected.</p>";

        }

        else if (unrealisticSalary) {

            salaryAnalysis.innerHTML =
                `
                <p>
                    <strong>Salary detected:</strong>
                    ${salaries.map(escapeHTML).join(", ")}
                </p>

                <p>
                    ⚠️ The salary claim appears unusually high for a
                    general job/internship description. Verify the offer
                    independently.
                </p>
                `;

        }

        else {

            salaryAnalysis.innerHTML =
                `
                <p>
                    <strong>Salary detected:</strong>
                    ${salaries.map(escapeHTML).join(", ")}
                </p>

                <p>
                    Salary information was detected. Compare it with
                    the company's official job listing before accepting.
                </p>
                `;

        }

    }


    // ======================================
    // PERSONAL DATA WARNING
    // ======================================

    if (elementExists(personalDataWarning)) {

        if (personalInfo.length > 0) {

            personalDataWarning.innerHTML =
                `
                <p>
                    ⚠️ <strong>Sensitive information detected:</strong>
                    ${personalInfo.map(escapeHTML).join(", ")}
                </p>

                <p>
                    Never share OTPs, UPI PINs, passwords, card details
                    or unnecessary financial information with an
                    unverified recruiter.
                </p>
                `;

        }

        else {

            personalDataWarning.innerHTML =
                `
                <p>
                    No Aadhaar, PAN, bank, OTP, card or UPI PIN request
                    was detected.
                </p>
                `;

        }

    }


    // ======================================
    // HIGHLIGHT SUSPICIOUS TEXT
    // ======================================

    if (elementExists(highlightedText)) {

        let highlighted =
            escapeHTML(text);

        suspiciousPatterns.forEach(function(pattern) {

            pattern.keywords.forEach(function(keyword) {

                const regex =
                    new RegExp(
                        escapeRegex(
                            escapeHTML(keyword)
                        ),
                        "gi"
                    );

                highlighted =
                    highlighted.replace(
                        regex,
                        function(match) {

                            return `<mark>${match}</mark>`;

                        }
                    );

            });

        });

        highlightedText.innerHTML =
            highlighted;

    }


    // ======================================
    // SHOW RESULTS
    // ======================================

    if (elementExists(resultSection)) {

        resultSection.classList.remove("hidden");

        resultSection.style.display =
            "block";

        setTimeout(function() {

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }

}


// ==========================================
// CHARACTER COUNT
// ==========================================

function updateCharacterCount() {

    if (
        !elementExists(jobDescription) ||
        !elementExists(characterCount)
    ) {
        return;
    }

    const count =
        jobDescription.value.length;

    characterCount.textContent =
        count;

}


if (elementExists(jobDescription)) {

    jobDescription.addEventListener(
        "input",
        updateCharacterCount
    );

}


// ==========================================
// CLEAR BUTTON
// ==========================================

if (elementExists(clearButton)) {

    clearButton.addEventListener(
        "click",
        function() {

            if (elementExists(jobDescription)) {

                jobDescription.value = "";

            }

            updateCharacterCount();

            if (elementExists(resultSection)) {

                resultSection.classList.add("hidden");

            }

            if (elementExists(errorMessage)) {

                errorMessage.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// SAMPLE JOBS
// ==========================================

const sampleJobs = {

    low:
        `Software Development Intern

Company: ABC Technologies

We are looking for a motivated software development intern.

Requirements:
- Basic knowledge of Python or JavaScript
- Good communication skills
- Willingness to learn

The selection process includes an interview.

Apply through our official careers page.

Stipend: ₹15,000 per month.

No registration fee or payment is required.`,

    medium:
        `Digital Marketing Internship

Work from home opportunity.

Earn ₹40,000 per month.

Limited positions available.

Candidates should contact our recruiter on WhatsApp.

A small processing fee may be required for documentation.

Apply immediately to secure your position.`,

    high:
        `URGENT WORK FROM HOME JOB!

Earn ₹2 lakh per month with no experience.

NO INTERVIEW REQUIRED.

100% JOB GUARANTEE.

Pay a refundable registration fee immediately.

Send money through UPI to secure your position.

Contact only through WhatsApp.

Send your Aadhaar card, PAN card, bank account details and OTP.

Limited seats. Apply NOW!`,

};


// ==========================================
// SAMPLE BUTTONS
// ==========================================

const sampleButtons =
    document.querySelectorAll(
        "[data-sample]"
    );


sampleButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const type =
                button.getAttribute(
                    "data-sample"
                );

            if (
                type &&
                sampleJobs[type] &&
                elementExists(jobDescription)
            ) {

                jobDescription.value =
                    sampleJobs[type];

                updateCharacterCount();

                jobDescription.focus();

            }

        }
    );

});


// ==========================================
// ANALYZE BUTTON EVENT
// ==========================================

if (elementExists(analyzeButton)) {

    analyzeButton.addEventListener(
        "click",
        analyzeJob
    );

}


// ==========================================
// DOWNLOAD REPORT
// ==========================================

if (elementExists(downloadReport)) {

    downloadReport.addEventListener(
        "click",
        function() {

            const text =
                elementExists(jobDescription)
                    ? jobDescription.value.trim()
                    : "";

            if (text === "") {

                return;

            }

            const score =
                elementExists(riskScore)
                    ? riskScore.textContent
                    : "N/A";

            const level =
                elementExists(riskLevel)
                    ? riskLevel.textContent
                    : "N/A";

            const report =

`AI JOBGUARD
Fake Job & Internship Risk Report
====================================

Date:
${new Date().toLocaleString()}

Risk Score:
${score}/100

Risk Level:
${level}

------------------------------------
JOB DESCRIPTION
------------------------------------

${text}

------------------------------------
SAFETY NOTICE
------------------------------------

AI JobGuard uses rule-based suspicious-pattern detection.

The result is a risk assessment and is NOT proof that an employer
or job opportunity is fraudulent.

Always verify the employer through official sources before sharing
personal information or making payments.
`;


            const blob =
                new Blob(
                    [report],
                    {
                        type: "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "AI-JobGuard-Report.txt";


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);

        }
    );

}


// ==========================================
// LOCAL STORAGE HISTORY
// ==========================================

const HISTORY_KEY =
    "aiJobGuardHistory";


function getHistory() {

    try {

        const data =
            localStorage.getItem(
                HISTORY_KEY
            );

        if (!data) {
            return [];
        }

        return JSON.parse(data);

    }

    catch (error) {

        console.error(
            "History read error:",
            error
        );

        return [];

    }

}


function saveHistory(item) {

    try {

        const history =
            getHistory();

        history.unshift(item);

        const limitedHistory =
            history.slice(0, 20);

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(
                limitedHistory
            )
        );

    }

    catch (error) {

        console.error(
            "History save error:",
            error
        );

    }

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const history =
        getHistory();


    let high =
        0;

    let suspicious =
        0;

    let low =
        0;


    history.forEach(function(item) {

        if (item.level === "High Risk") {

            high++;

        }

        else if (item.level === "Suspicious") {

            suspicious++;

        }

        else {

            low++;

        }

    });


    if (elementExists(totalScans)) {

        totalScans.textContent =
            history.length;

    }

    if (elementExists(highRiskCount)) {

        highRiskCount.textContent =
            high;

    }

    if (elementExists(suspiciousCount)) {

        suspiciousCount.textContent =
            suspicious;

    }

    if (elementExists(lowRiskCount)) {

        lowRiskCount.textContent =
            low;

    }


    renderHistory(history);

}


// ==========================================
// RENDER HISTORY
// ==========================================

function renderHistory(history) {

    if (!elementExists(historyList)) {
        return;
    }


    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            "<p>No analyses yet.</p>";

        return;

    }


    history.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className =
            "history-item";


        card.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(item.level)}
                </strong>

                <p>
                    ${escapeHTML(item.preview)}
                </p>

                <small>
                    ${escapeHTML(item.date)}
                </small>

            </div>

            <div>

                <strong>
                    ${item.score}/100
                </strong>

            </div>

        `;


        historyList.appendChild(card);

    });

}


// ==========================================
// CLEAR HISTORY
// ==========================================

if (elementExists(clearHistory)) {

    clearHistory.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                HISTORY_KEY
            );

            updateDashboard();

        }
    );

}


// ==========================================
// LANGUAGE SELECTOR
// ==========================================

if (elementExists(languageSelector)) {

    languageSelector.addEventListener(
        "change",
        function() {

            const language =
                languageSelector.value;


            if (
                language === "te" &&
                elementExists(analyzeButton)
            ) {

                analyzeButton.textContent =
                    "విశ్లేషించండి";

            }

            else if (
                language === "hi" &&
                elementExists(analyzeButton)
            ) {

                analyzeButton.textContent =
                    "विश्लेषण करें";

            }

            else if (
                language === "en" &&
                elementExists(analyzeButton)
            ) {

                analyzeButton.textContent =
                    "Analyze Job";

            }

        }
    );

}


// ==========================================
// OPTIONAL CANVAS BACKGROUND
// ==========================================

const canvas =
    document.getElementById(
        "cyberCanvas"
    );


if (canvas) {

    const ctx =
        canvas.getContext("2d");


    let particles = [];


    function resizeCanvas() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

    }


    function createParticles() {

        particles = [];

        const count =
            Math.min(
                70,
                Math.floor(
                    window.innerWidth / 20
                )
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            particles.push({

                x:
                    Math.random() *
                    canvas.width,

                y:
                    Math.random() *
                    canvas.height,

                vx:
                    (Math.random() - 0.5) *
                    0.4,

                vy:
                    (Math.random() - 0.5) *
                    0.4,

                size:
                    Math.random() *
                    2 +
                    0.5

            });

        }

    }


    function animateCanvas() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        particles.forEach(function(particle) {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;


            if (
                particle.x < 0 ||
                particle.x > canvas.width
            ) {

                particle.vx *= -1;

            }


            if (
                particle.y < 0 ||
                particle.y > canvas.height
            ) {

                particle.vy *= -1;

            }


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

        });


        requestAnimationFrame(
            animateCanvas
        );

    }


    window.addEventListener(
        "resize",
        function() {

            resizeCanvas();

            createParticles();

        }
    );


    resizeCanvas();

    createParticles();

    animateCanvas();

}


// ==========================================
// INITIALIZE
// ==========================================

updateCharacterCount();

updateDashboard();

console.log(
    "AI JobGuard loaded successfully."
);
