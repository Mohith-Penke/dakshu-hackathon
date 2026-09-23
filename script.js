/* ==========================================
   AI JOBGUARD
   Beginner-Friendly Rule-Based Detection
   ========================================== */

"use strict";


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const analyzeButton = document.getElementById("analyzeButton");
const jobDescription = document.getElementById("jobDescription");

const resultSection = document.getElementById("resultSection");

const riskCard = document.getElementById("riskCard");

const riskScore = document.getElementById("riskScore");
const riskLevel = document.getElementById("riskLevel");

const riskExplanation =
    document.getElementById("riskExplanation");

const warningList =
    document.getElementById("warningList");

const detailedExplanation =
    document.getElementById("detailedExplanation");

const recommendation =
    document.getElementById("recommendation");

const errorMessage =
    document.getElementById("errorMessage");


// ==========================================
// OPTIONAL ELEMENTS
// ==========================================

const characterCount =
    document.getElementById("characterCount");

const clearButton =
    document.getElementById("clearButton");

const loadingArea =
    document.getElementById("loadingArea");

const loadingText =
    document.getElementById("loadingText");

const riskPill =
    document.getElementById("riskPill");

const riskTitle =
    document.getElementById("riskTitle");

const meterValue =
    document.getElementById("meterValue");

const meterFill =
    document.getElementById("meterFill");

const riskBreakdown =
    document.getElementById("riskBreakdown");

const highlightedText =
    document.getElementById("highlightedText");

const contactAnalysis =
    document.getElementById("contactAnalysis");

const salaryAnalysis =
    document.getElementById("salaryAnalysis");

const personalDataWarning =
    document.getElementById("personalDataWarning");

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
// SUSPICIOUS PATTERNS
// ==========================================

const suspiciousPatterns = [

    {
        name: "Registration Fee",
        keywords: [
            "registration fee",
            "registration fees",
            "pay registration",
            "registration payment"
        ],
        warning:
            "Registration fee or registration payment requested.",
        points: 20
    },

    {
        name: "Upfront Payment",
        keywords: [
            "upfront payment",
            "pay upfront",
            "advance payment",
            "pay in advance"
        ],
        warning:
            "Upfront or advance payment is requested.",
        points: 20
    },

    {
        name: "Processing / Joining Fee",
        keywords: [
            "processing fee",
            "processing fees",
            "application fee",
            "joining fee"
        ],
        warning:
            "A processing, application or joining fee is mentioned.",
        points: 15
    },

    {
        name: "Money Request",
        keywords: [
            "pay money",
            "send money",
            "transfer money",
            "make a payment",
            "payment required"
        ],
        warning:
            "The applicant is asked to make a payment.",
        points: 20
    },

    {
        name: "No Interview",
        keywords: [
            "no interview",
            "without interview",
            "no interview required",
            "interview not required"
        ],
        warning:
            "The job claims that no interview is required.",
        points: 15
    },

    {
        name: "Unrealistic Salary",
        keywords: [
            "guaranteed salary",
            "guaranteed income",
            "guaranteed job",
            "earn huge",
            "earn lakhs",
            "unlimited income"
        ],
        warning:
            "Unrealistic or guaranteed income promises are present.",
        points: 15
    },

    {
        name: "WhatsApp Contact",
        keywords: [
            "whatsapp only",
            "contact only on whatsapp",
            "whatsapp number",
            "whatsapp us"
        ],
        warning:
            "The opportunity relies heavily on WhatsApp communication.",
        points: 10
    },

    {
        name: "Urgent Payment",
        keywords: [
            "pay immediately",
            "payment immediately",
            "pay now",
            "urgent payment",
            "urgent fee",
            "limited time payment"
        ],
        warning:
            "Urgent payment language is used.",
        points: 20
    },

    {
        name: "Deposit Request",
        keywords: [
            "send your money",
            "deposit money",
            "security deposit",
            "refundable deposit"
        ],
        warning:
            "A deposit or money transfer is requested.",
        points: 20
    },

    {
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
        warning:
            "Sensitive personal or financial information is requested.",
        points: 20
    },

    {
        name: "Guaranteed Selection",
        keywords: [
            "guaranteed selection",
            "100% selection",
            "job guaranteed",
            "guaranteed placement"
        ],
        warning:
            "Guaranteed job or selection claims are present.",
        points: 15
    }

];


// ==========================================
// CHARACTER COUNT
// ==========================================

function updateCharacterCount() {

    if (!jobDescription || !characterCount) {
        return;
    }

    characterCount.textContent =
        jobDescription.value.length;

}


if (jobDescription) {

    jobDescription.addEventListener(
        "input",
        updateCharacterCount
    );

}


// ==========================================
// ANALYZE BUTTON
// ==========================================

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        analyzeJob
    );

}


// ==========================================
// MAIN ANALYSIS FUNCTION
// ==========================================

function analyzeJob() {

    if (!jobDescription) {
        return;
    }

    const text =
        jobDescription.value.trim();


    // Clear old error
    if (errorMessage) {

        errorMessage.style.display =
            "none";

        errorMessage.textContent =
            "";

    }


    // Empty input
    if (text === "") {

        if (errorMessage) {

            errorMessage.textContent =
                "Please paste a job or internship description first.";

            errorMessage.style.display =
                "block";

        }

        return;

    }


    // Show loading if available
    if (loadingArea) {

        loadingArea.classList.remove(
            "hidden"
        );

    }

    if (loadingText) {

        loadingText.textContent =
            "Analyzing job description...";

    }


    // Small delay for loading animation
    setTimeout(
        function () {

            performAnalysis(text);

            if (loadingArea) {

                loadingArea.classList.add(
                    "hidden"
                );

            }

        },
        400
    );

}


// ==========================================
// PERFORM ANALYSIS
// ==========================================

function performAnalysis(text) {

    const lowerText =
        text.toLowerCase();


    let score = 0;


    const detectedWarnings = [];

    const detectedPatterns = [];


    // ======================================
    // CHECK SUSPICIOUS PATTERNS
    // ======================================

    suspiciousPatterns.forEach(
        function (pattern) {

            let found = false;


            pattern.keywords.forEach(
                function (keyword) {

                    if (
                        lowerText.includes(
                            keyword.toLowerCase()
                        )
                    ) {

                        found = true;

                    }

                }
            );


            if (found) {

                score += pattern.points;

                detectedPatterns.push(
                    pattern
                );

                detectedWarnings.push(
                    pattern.warning
                );

            }

        }
    );


    // ======================================
    // EXTRA CONTACT DETECTION
    // ======================================

    const phoneMatches =
        text.match(
            /(?:\+91[\s-]?)?[6-9]\d{9}\b/g
        ) || [];


    const emailMatches =
        text.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
        ) || [];


    const urlMatches =
        text.match(
            /https?:\/\/[^\s]+|www\.[^\s]+/gi
        ) || [];


    const upiMatches =
        text.match(
            /\b[\w.-]+@[\w.-]+\b/g
        ) || [];


    // ======================================
    // PERSONAL INFORMATION
    // ======================================

    const personalInfo = [];


    if (
        /\baadhaar\b|\baadhar\b/i.test(text)
    ) {

        personalInfo.push(
            "Aadhaar"
        );

    }


    if (
        /\bpan card\b|\bpan number\b/i.test(text)
    ) {

        personalInfo.push(
            "PAN Card"
        );

    }


    if (
        /\bbank account\b|\bbank details\b|\baccount number\b/i.test(text)
    ) {

        personalInfo.push(
            "Bank Account"
        );

    }


    if (
        /\botp\b|\bone time password\b/i.test(text)
    ) {

        personalInfo.push(
            "OTP"
        );

    }


    if (
        /\bcredit card\b/i.test(text)
    ) {

        personalInfo.push(
            "Credit Card"
        );

    }


    if (
        /\bdebit card\b/i.test(text)
    ) {

        personalInfo.push(
            "Debit Card"
        );

    }


    if (
        /\bupi pin\b/i.test(text)
    ) {

        personalInfo.push(
            "UPI PIN"
        );

    }


    // ======================================
    // SALARY DETECTION
    // ======================================

    const salaryMatches =
        text.match(
            /₹\s?\d+(?:[.,]\d+)?\s?(?:k|K|lakh|lakhs|LPA)?/gi
        ) || [];


    // ======================================
    // HIGH SALARY WARNING
    // ======================================

    const unrealisticSalary =
        /₹?\s?(?:1|2|3)\s?lakh(?:s)?\s?(?:per month|monthly)?/i.test(
            text
        ) ||
        /₹?\s?\d+\s?lakh\s?per month/i.test(
            text
        );


    if (
        unrealisticSalary &&
        !detectedWarnings.includes(
            "Unrealistic or guaranteed income promises are present."
        )
    ) {

        score += 10;

    }


    // ======================================
    // PERSONAL INFO EXTRA SCORE
    // ======================================

    const personalPatternFound =
        detectedPatterns.some(
            function (pattern) {

                return (
                    pattern.name ===
                    "Sensitive Information"
                );

            }
        );


    if (
        personalInfo.length > 0 &&
        !personalPatternFound
    ) {

        score += 20;

    }


    // ======================================
    // LIMIT SCORE
    // ======================================

    if (score > 100) {

        score = 100;

    }


    // ======================================
    // DETERMINE RISK
    // ======================================

    let level = "";
    let explanation = "";
    let riskClass = "";


    if (score <= 30) {

        level =
            "Low Risk";

        riskClass =
            "low";

        explanation =
            "Only a few or no common suspicious indicators were detected. " +
            "However, users should still verify the employer independently.";

    }

    else if (score <= 60) {

        level =
            "Suspicious";

        riskClass =
            "suspicious";

        explanation =
            "Several warning signs were detected. " +
            "The opportunity should be investigated carefully before " +
            "sharing personal information or making payments.";

    }

    else {

        level =
            "High Risk";

        riskClass =
            "high";

        explanation =
            "Multiple strong warning signs were detected. " +
            "Exercise extreme caution and independently verify the employer " +
            "before proceeding.";

    }


    // ======================================
    // DISPLAY SCORE
    // ======================================

    if (riskScore) {

        riskScore.textContent =
            score;

    }


    if (riskLevel) {

        riskLevel.textContent =
            level;

    }


    if (riskExplanation) {

        riskExplanation.textContent =
            explanation;

    }


    if (riskTitle) {

        riskTitle.textContent =
            level;

    }


    if (riskPill) {

        riskPill.textContent =
            level;

    }


    // ======================================
    // RISK CARD CLASS
    // ======================================

    if (riskCard) {

        riskCard.classList.remove(
            "low",
            "suspicious",
            "high"
        );

        riskCard.classList.add(
            riskClass
        );

    }


    // ======================================
    // METER
    // ======================================

    if (meterValue) {

        meterValue.textContent =
            score + "%";

    }


    if (meterFill) {

        meterFill.style.width =
            score + "%";

    }


    // ======================================
    // WARNING LIST
    // ======================================

    if (warningList) {

        warningList.innerHTML =
            "";


        if (
            detectedWarnings.length === 0
        ) {

            const item =
                document.createElement(
                    "li"
                );

            item.textContent =
                "No common suspicious warning signs were detected.";

            warningList.appendChild(
                item
            );

        }

        else {

            detectedWarnings.forEach(
                function (warning) {

                    const item =
                        document.createElement(
                            "li"
                        );

                    item.textContent =
                        warning;

                    warningList.appendChild(
                        item
                    );

                }
            );

        }

    }


    // ======================================
    // DETAILED EXPLANATION
    // ======================================

    if (detailedExplanation) {

        if (
            detectedWarnings.length === 0
        ) {

            detailedExplanation.textContent =
                "The job description did not contain the specific suspicious " +
                "phrases checked by this version of AI JobGuard. " +
                "This does not guarantee that the opportunity is genuine.";

        }

        else {

            detailedExplanation.textContent =
                "AI JobGuard detected " +
                detectedWarnings.length +
                " common warning sign(s) in the description. " +
                "These patterns can sometimes be associated with fraudulent " +
                "or misleading job and internship offers. " +
                "The result is only a risk assessment and should not be " +
                "treated as proof that the employer is fraudulent.";

        }

    }


    // ======================================
    // RECOMMENDATION
    // ======================================

    if (recommendation) {

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
    // RISK BREAKDOWN
    // ======================================

    if (riskBreakdown) {

        riskBreakdown.innerHTML =
            "";


        if (
            detectedPatterns.length === 0
        ) {

            riskBreakdown.innerHTML =
                "<p>No major suspicious patterns detected.</p>";

        }

        else {

            detectedPatterns.forEach(
                function (pattern) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "risk-breakdown-item";


                    item.innerHTML =
                        `
                        <span>
                            ${pattern.name}
                        </span>

                        <strong>
                            +${pattern.points}
                        </strong>
                        `;


                    riskBreakdown.appendChild(
                        item
                    );

                }
            );

        }

    }


    // ======================================
    // CONTACT ANALYSIS
    // ======================================

    if (contactAnalysis) {

        let contactHTML =
            "";


        if (
            phoneMatches.length > 0
        ) {

            contactHTML +=
                "<p><strong>Phone:</strong> " +
                phoneMatches.join(", ") +
                "</p>";

        }


        if (
            emailMatches.length > 0
        ) {

            contactHTML +=
                "<p><strong>Email:</strong> " +
                emailMatches.join(", ") +
                "</p>";

        }


        if (
            urlMatches.length > 0
        ) {

            contactHTML +=
                "<p><strong>Links:</strong> " +
                urlMatches.join(", ") +
                "</p>";

        }


        if (
            upiMatches.length > 0
        ) {

            contactHTML +=
                "<p><strong>Possible UPI:</strong> " +
                upiMatches.join(", ") +
                "</p>";

        }


        if (
            /whatsapp/i.test(text)
        ) {

            contactHTML +=
                "<p>⚠️ WhatsApp communication detected.</p>";

        }


        if (contactHTML === "") {

            contactHTML =
                "<p>No contact information detected.</p>";

        }


        contactAnalysis.innerHTML =
            contactHTML;

    }


    // ======================================
    // SALARY ANALYSIS
    // ======================================

    if (salaryAnalysis) {

        if (
            salaryMatches.length === 0
        ) {

            salaryAnalysis.innerHTML =
                "<p>No clear salary amount detected.</p>";

        }

        else if (
            unrealisticSalary
        ) {

            salaryAnalysis.innerHTML =
                "<p><strong>Salary detected:</strong> " +
                salaryMatches.join(", ") +
                "</p>" +
                "<p>⚠️ The salary claim appears unusually high. " +
                "Verify it through the employer's official sources.</p>";

        }

        else {

            salaryAnalysis.innerHTML =
                "<p><strong>Salary detected:</strong> " +
                salaryMatches.join(", ") +
                "</p>";

        }

    }


    // ======================================
    // PERSONAL DATA WARNING
    // ======================================

    if (personalDataWarning) {

        if (
            personalInfo.length > 0
        ) {

            personalDataWarning.innerHTML =
                "<p>⚠️ <strong>Sensitive information detected:</strong> " +
                personalInfo.join(", ") +
                "</p>" +
                "<p>Never share OTPs, UPI PINs, passwords, card details " +
                "or unnecessary financial information with an unverified recruiter.</p>";

        }

        else {

            personalDataWarning.innerHTML =
                "<p>No Aadhaar, PAN, bank, OTP, card or UPI PIN request detected.</p>";

        }

    }


    // ======================================
    // HIGHLIGHT SUSPICIOUS TEXT
    // ======================================

    if (highlightedText) {

        let safeText =
            escapeHTML(text);


        suspiciousPatterns.forEach(
            function (pattern) {

                pattern.keywords.forEach(
                    function (keyword) {

                        const escapedKeyword =
                            escapeHTML(keyword)
                                .replace(
                                    /[.*+?^${}()|[\]\\]/g,
                                    "\\$&"
                                );


                        const regex =
                            new RegExp(
                                escapedKeyword,
                                "gi"
                            );


                        safeText =
                            safeText.replace(
                                regex,
                                function (match) {

                                    return (
                                        "<mark>" +
                                        match +
                                        "</mark>"
                                    );

                                }
                            );

                    }
                );

            }
        );


        highlightedText.innerHTML =
            safeText;

    }


    // ======================================
    // SHOW RESULT
    // ======================================

    if (resultSection) {

        resultSection.classList.remove(
            "hidden"
        );


        resultSection.style.display =
            "block";


        setTimeout(
            function () {

                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            100
        );

    }


    // ======================================
    // SAVE HISTORY
    // ======================================

    saveHistory(
        score,
        level,
        text
    );


    updateDashboard();

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
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

A small processing fee may be required.

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

Limited seats. Apply NOW!`

};


// ==========================================
// SAMPLE BUTTONS
// ==========================================

const sampleButtons =
    document.querySelectorAll(
        "[data-sample]"
    );


sampleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const type =
                    button.getAttribute(
                        "data-sample"
                    );


                if (
                    sampleJobs[type] &&
                    jobDescription
                ) {

                    jobDescription.value =
                        sampleJobs[type];

                    updateCharacterCount();

                    jobDescription.focus();

                }

            }
        );

    }
);


// ==========================================
// CLEAR BUTTON
// ==========================================

if (clearButton) {

    clearButton.addEventListener(
        "click",
        function () {

            if (jobDescription) {

                jobDescription.value =
                    "";

            }


            updateCharacterCount();


            if (resultSection) {

                resultSection.classList.add(
                    "hidden"
                );

            }


            if (errorMessage) {

                errorMessage.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// HISTORY
// ==========================================

const HISTORY_KEY =
    "aiJobGuardHistory";


function getHistory() {

    try {

        const stored =
            localStorage.getItem(
                HISTORY_KEY
            );


        if (!stored) {

            return [];

        }


        return JSON.parse(
            stored
        );

    }

    catch (error) {

        return [];

    }

}


function saveHistory(
    score,
    level,
    text
) {

    try {

        const history =
            getHistory();


        history.unshift({

            score:
                score,

            level:
                level,

            text:
                text.substring(
                    0,
                    100
                ),

            date:
                new Date().toLocaleString()

        });


        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(
                history.slice(
                    0,
                    20
                )
            )
        );

    }

    catch (error) {

        console.error(
            "History error:",
            error
        );

    }

}


// ==========================================
// DASHBOARD
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


    history.forEach(
        function (item) {

            if (
                item.level ===
                "High Risk"
            ) {

                high++;

            }

            else if (
                item.level ===
                "Suspicious"
            ) {

                suspicious++;

            }

            else {

                low++;

            }

        }
    );


    if (totalScans) {

        totalScans.textContent =
            history.length;

    }


    if (highRiskCount) {

        highRiskCount.textContent =
            high;

    }


    if (suspiciousCount) {

        suspiciousCount.textContent =
            suspicious;

    }


    if (lowRiskCount) {

        lowRiskCount.textContent =
            low;

    }


    if (historyList) {

        renderHistory(
            history
        );

    }

}


// ==========================================
// RENDER HISTORY
// ==========================================

function renderHistory(history) {

    historyList.innerHTML =
        "";


    if (history.length === 0) {

        historyList.innerHTML =
            "<p>No analyses yet.</p>";

        return;

    }


    history.forEach(
        function (item) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "history-item";


            div.innerHTML =
                `
                <strong>
                    ${escapeHTML(item.level)}
                </strong>

                <span>
                    ${item.score}/100
                </span>

                <p>
                    ${escapeHTML(item.text)}
                </p>

                <small>
                    ${escapeHTML(item.date)}
                </small>
                `;


            historyList.appendChild(
                div
            );

        }
    );

}


// ==========================================
// CLEAR HISTORY
// ==========================================

if (clearHistory) {

    clearHistory.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                HISTORY_KEY
            );

            updateDashboard();

        }
    );

}


// ==========================================
// DOWNLOAD REPORT
// ==========================================

if (downloadReport) {

    downloadReport.addEventListener(
        "click",
        function () {

            if (!jobDescription) {
                return;
            }


            const text =
                jobDescription.value.trim();


            if (text === "") {
                return;
            }


            const score =
                riskScore
                    ? riskScore.textContent
                    : "N/A";


            const level =
                riskLevel
                    ? riskLevel.textContent
                    : "N/A";


            const report =
`
AI JOBGUARD
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

AI JobGuard provides a rule-based risk assessment.

The result is NOT proof that an employer or opportunity
is fraudulent.

Always verify the employer independently before sharing
personal information or making payments.
`;


            const blob =
                new Blob(
                    [report],
                    {
                        type:
                            "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;

            link.download =
                "AI-JobGuard-Report.txt";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        }
    );

}


// ==========================================
// LANGUAGE SELECTOR
// ==========================================

if (languageSelector) {

    languageSelector.addEventListener(
        "change",
        function () {

            const language =
                languageSelector.value;


            if (
                !analyzeButton
            ) {
                return;
            }


            if (
                language === "te"
            ) {

                analyzeButton.textContent =
                    "విశ్లేషించండి";

            }

            else if (
                language === "hi"
            ) {

                analyzeButton.textContent =
                    "विश्लेषण करें";

            }

            else {

                analyzeButton.textContent =
                    "Analyze Job";

            }

        }
    );

}


// ==========================================
// INITIALIZE
// ==========================================

updateCharacterCount();

updateDashboard();


console.log(
    "AI JobGuard loaded successfully."
);
