/* =========================================================
   AI JOBGUARD
   Fake Job & Internship Detector
   Complete Client-Side JavaScript
   Rule-Based + Explainable + Local History
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. ELEMENTS
    ===================================================== */

    const $ = (id) => document.getElementById(id);

    const analyzeButton = $("analyzeButton");
    const jobDescription = $("jobDescription");
    const resultSection = $("resultSection");

    const riskCard = $("riskCard");
    const riskScore = $("riskScore");
    const riskLevel = $("riskLevel");
    const riskExplanation = $("riskExplanation");
    const riskPill = $("riskPill");
    const riskTitle = $("riskTitle");

    const meterValue = $("meterValue");
    const meterFill = $("meterFill");

    const riskBreakdown = $("riskBreakdown");
    const warningList = $("warningList");
    const detailedExplanation = $("detailedExplanation");
    const recommendation = $("recommendation");

    const highlightedText = $("highlightedText");
    const contactAnalysis = $("contactAnalysis");
    const salaryAnalysis = $("salaryAnalysis");
    const personalDataWarning = $("personalDataWarning");

    const downloadReport = $("downloadReport");

    const characterCount = $("characterCount");
    const clearButton = $("clearButton");

    const loadingArea = $("loadingArea");
    const loadingText = $("loadingText");
    const errorMessage = $("errorMessage");

    const historyList = $("historyList");
    const clearHistory = $("clearHistory");

    const totalScans = $("totalScans");
    const highRiskCount = $("highRiskCount");
    const suspiciousCount = $("suspiciousCount");
    const lowRiskCount = $("lowRiskCount");

    const languageSelector = $("languageSelector");

    const backgroundCanvas = $("backgroundCanvas");

    const HISTORY_KEY = "aiJobGuardHistory";
    const LANGUAGE_KEY = "aiJobGuardLanguage";

    let lastAnalysis = null;
    let loadingTimer = null;


    /* =====================================================
       2. SUSPICIOUS PATTERNS
    ===================================================== */

    const suspiciousPatterns = [

        {
            id: "registration-fee",
            name: "Registration Fee",
            points: 25,
            keywords: [
                "registration fee",
                "registration fees",
                "pay registration",
                "registration payment",
                "registration charge"
            ],
            warning: "A registration fee or registration payment is requested."
        },

        {
            id: "application-fee",
            name: "Application / Joining Fee",
            points: 20,
            keywords: [
                "application fee",
                "processing fee",
                "processing fees",
                "joining fee",
                "joining fees",
                "application charge"
            ],
            warning: "An application, processing or joining fee is mentioned."
        },

        {
            id: "upfront-payment",
            name: "Upfront Payment",
            points: 25,
            keywords: [
                "upfront payment",
                "pay upfront",
                "advance payment",
                "pay in advance",
                "pay money",
                "send money",
                "transfer money",
                "payment required"
            ],
            warning: "The applicant is asked to make an upfront or advance payment."
        },

        {
            id: "deposit",
            name: "Security Deposit",
            points: 20,
            keywords: [
                "security deposit",
                "refundable deposit",
                "deposit money",
                "pay deposit",
                "security fee"
            ],
            warning: "A security deposit or money transfer is requested."
        },

        {
            id: "no-interview",
            name: "No Interview",
            points: 15,
            keywords: [
                "no interview",
                "without interview",
                "no interview required",
                "interview not required",
                "direct selection",
                "selected without interview"
            ],
            warning: "The opportunity suggests that an interview is not required."
        },

        {
            id: "guaranteed-job",
            name: "Guaranteed Selection",
            points: 18,
            keywords: [
                "guaranteed selection",
                "100% selection",
                "job guaranteed",
                "guaranteed job",
                "guaranteed placement",
                "100% job guarantee"
            ],
            warning: "A guaranteed job, placement or selection claim is present."
        },

        {
            id: "unrealistic-income",
            name: "Unrealistic Income",
            points: 20,
            keywords: [
                "guaranteed salary",
                "guaranteed income",
                "earn huge",
                "earn lakhs",
                "unlimited income",
                "easy money",
                "easy income",
                "earn money easily"
            ],
            warning: "The message contains unusually strong or guaranteed income claims."
        },

        {
            id: "whatsapp-only",
            name: "WhatsApp-Only Contact",
            points: 10,
            keywords: [
                "whatsapp only",
                "contact only on whatsapp",
                "whatsapp number",
                "whatsapp us",
                "contact through whatsapp",
                "message us on whatsapp"
            ],
            warning: "The opportunity relies heavily on WhatsApp communication."
        },

        {
            id: "urgent",
            name: "Urgency / Pressure",
            points: 12,
            keywords: [
                "act now",
                "apply now",
                "apply immediately",
                "urgent",
                "immediately",
                "limited seats",
                "limited positions",
                "limited time",
                "today only",
                "last chance",
                "hurry",
                "confirm today"
            ],
            warning: "Urgent or pressure-based language is being used."
        },

        {
            id: "urgent-payment",
            name: "Urgent Payment",
            points: 18,
            keywords: [
                "pay immediately",
                "payment immediately",
                "pay now",
                "urgent payment",
                "urgent fee",
                "pay today",
                "transfer immediately"
            ],
            warning: "The message combines payment with urgent language."
        },

        {
            id: "sensitive-data",
            name: "Sensitive Information",
            points: 25,
            keywords: [
                "aadhaar",
                "aadhar",
                "pan card",
                "pan number",
                "bank account",
                "bank details",
                "account number",
                "otp",
                "one time password",
                "upi pin",
                "credit card",
                "debit card",
                "cvv",
                "password"
            ],
            warning: "Sensitive personal or financial information is requested."
        },

        {
            id: "gift-card",
            name: "Gift Card / Crypto / Transfer",
            points: 25,
            keywords: [
                "gift card",
                "bitcoin",
                "crypto payment",
                "cryptocurrency",
                "usdt",
                "wire transfer",
                "money transfer"
            ],
            warning: "The message requests an unusual payment method or money transfer."
        },

        {
            id: "work-home-high-income",
            name: "Work-From-Home High Income",
            points: 10,
            keywords: [
                "work from home",
                "work-from-home",
                "wfh"
            ],
            special: "highIncome"
        }

    ];


    /* =====================================================
       3. SAMPLE JOBS
    ===================================================== */

    const sampleJobs = {

        low: `Software Development Intern

Company: ABC Technologies

We are looking for a motivated software development intern.

Requirements:
- Basic knowledge of Python or JavaScript
- Good communication skills
- Willingness to learn

The selection process includes a technical interview.

Apply through our official careers page.

Stipend: ₹15,000 per month.

No registration fee or payment is required.

Contact: careers@example.com`,

        medium: `Digital Marketing Internship

Work from home opportunity.

Earn ₹40,000 per month.

Limited positions available.

Candidates should contact our recruiter on WhatsApp:
+91 9876543210

A small processing fee may be required.

Apply immediately to secure your position.`,

        high: `URGENT WORK FROM HOME JOB!

Earn ₹2 lakh per month with no experience.

NO INTERVIEW REQUIRED.

100% JOB GUARANTEE.

Pay a refundable registration fee immediately.

Send money through UPI to secure your position.

Contact only through WhatsApp:
+91 9876543210

Send your Aadhaar card, PAN card, bank account details and OTP.

Limited seats. Apply NOW!`

    };


    /* =====================================================
       4. HELPER FUNCTIONS
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function unique(values) {
        return [...new Set(values)];
    }


    function showError(message) {

        if (!errorMessage) return;

        errorMessage.textContent = message;
        errorMessage.style.display = "block";

    }


    function hideError() {

        if (!errorMessage) return;

        errorMessage.textContent = "";
        errorMessage.style.display = "none";

    }


    function updateCharacterCount() {

        if (!jobDescription || !characterCount) return;

        characterCount.textContent =
            jobDescription.value.length.toLocaleString();

    }


    function normalizeText(text) {

        return String(text)
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

    }


    function clampScore(score) {

        return Math.max(0, Math.min(100, Math.round(score)));

    }


    /* =====================================================
       5. CONTACT DETECTION
    ===================================================== */

    function detectContacts(text) {

        const phones = unique(
            text.match(/(?:\+91[\s-]?)?[6-9]\d{9}\b/g) || []
        );

        const emails = unique(
            text.match(
                /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
            ) || []
        );

        const urls = unique(
            text.match(
                /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi
            ) || []
        );

        const personalEmails = emails.filter((email) => {

            const domain = email
                .split("@")[1]
                ?.toLowerCase();

            return [
                "gmail.com",
                "yahoo.com",
                "yahoo.in",
                "outlook.com",
                "hotmail.com",
                "protonmail.com",
                "proton.me"
            ].includes(domain);

        });

        const whatsapp =
            /whatsapp|wa\.me/i.test(text);

        const upi = unique(
            text.match(
                /\b[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9._-]{2,}\b/g
            ) || []
        );

        return {
            phones,
            emails,
            urls,
            personalEmails,
            whatsapp,
            upi
        };

    }


    /* =====================================================
       6. PERSONAL DATA DETECTION
    ===================================================== */

    function detectPersonalData(text) {

        const found = [];

        const checks = [

            {
                name: "Aadhaar",
                regex: /\baadhaar\b|\baadhar\b|\baadhaar card\b/i
            },

            {
                name: "PAN Card",
                regex: /\bpan card\b|\bpan number\b|\bpan details\b/i
            },

            {
                name: "Bank Account",
                regex: /\bbank account\b|\bbank details\b|\baccount number\b|\bbank credentials\b/i
            },

            {
                name: "OTP",
                regex: /\botp\b|\bone[- ]time password\b|\bverification code\b/i
            },

            {
                name: "Credit Card",
                regex: /\bcredit card\b|\bcard number\b/i
            },

            {
                name: "Debit Card",
                regex: /\bdebit card\b/i
            },

            {
                name: "CVV",
                regex: /\bcvv\b|\bcvc\b/i
            },

            {
                name: "UPI PIN",
                regex: /\bupi pin\b|\bupi password\b/i
            },

            {
                name: "Password",
                regex: /\bpassword\b|\blogin credentials\b/i
            }

        ];

        checks.forEach((item) => {

            if (item.regex.test(text)) {
                found.push(item.name);
            }

        });

        return found;

    }


    /* =====================================================
       7. SALARY ANALYSIS
    ===================================================== */

    function analyzeSalary(text) {

        const amounts = unique(
            text.match(
                /(?:₹|rs\.?|inr)\s?\d+(?:[.,]\d+)?\s?(?:k|K|lakh|lakhs|lpa|LPA)?/gi
            ) || []
        );

        const lakhPerMonth =
            /\b(?:₹|rs\.?|inr)?\s?\d+(?:\.\d+)?\s?(?:lakh|lakhs)\s?(?:per month|monthly)\b/i
                .test(text);

        const hugeNumber =
            /\b(?:₹|rs\.?|inr)\s?(?:[5-9]\d{4}|[1-9]\d{5,})\s?(?:per day|daily)\b/i
                .test(text);

        const guaranteedIncome =
            /guaranteed\s+(?:salary|income|earnings)|earn\s+(?:huge|lakhs)|unlimited\s+income|easy\s+(?:money|income)/i
                .test(text);

        const unrealistic =
            lakhPerMonth ||
            hugeNumber ||
            guaranteedIncome;

        return {
            amounts,
            unrealistic
        };

    }


    /* =====================================================
       8. COMPANY ANALYSIS
    ===================================================== */

    function analyzeCompany(text, contacts) {

        let companyName = "";

        const companyPatterns = [

            /company\s*:\s*([^\n]+)/i,
            /company\s+name\s*:\s*([^\n]+)/i,
            /at\s+([A-Z][A-Za-z0-9&.,' -]{2,50})/i,
            /we\s+are\s+([A-Z][A-Za-z0-9&.,' -]{2,50})/i

        ];

        for (const regex of companyPatterns) {

            const match = text.match(regex);

            if (match && match[1]) {
                companyName = match[1].trim();
                break;
            }

        }

        const website =
            contacts.urls.length > 0
                ? contacts.urls[0]
                : "";

        let emailDomain = "";

        if (contacts.emails.length > 0) {

            emailDomain =
                contacts.emails[0]
                    .split("@")[1]
                    ?.toLowerCase() || "";

        }

        const personalDomain =
            [
                "gmail.com",
                "yahoo.com",
                "yahoo.in",
                "outlook.com",
                "hotmail.com",
                "protonmail.com",
                "proton.me"
            ].includes(emailDomain);

        const httpsWebsite =
            website.startsWith("https://");

        return {
            companyName,
            website,
            emailDomain,
            personalDomain,
            httpsWebsite,
            basicOnly: true
        };

    }


    /* =====================================================
       9. MAIN ANALYZER
    ===================================================== */

    function performAnalysis(text) {

        const normalized = normalizeText(text);

        let score = 0;

        const findings = [];
        const detectedPatterns = [];

        suspiciousPatterns.forEach((pattern) => {

            let matched = false;

            if (pattern.special === "highIncome") {

                const salary = analyzeSalary(text);

                matched =
                    /work\s*[- ]?\s*from\s*[- ]?\s*home|wfh/i.test(text) &&
                    salary.unrealistic;

            } else {

                matched = pattern.keywords.some((keyword) =>
                    normalized.includes(keyword.toLowerCase())
                );

            }

            if (matched) {

                score += pattern.points;

                detectedPatterns.push(pattern);

                findings.push({
                    id: pattern.id,
                    name: pattern.name,
                    warning: pattern.warning,
                    points: pattern.points
                });

            }

        });


        /* -----------------------------------------------
           CONTACTS
        ----------------------------------------------- */

        const contacts = detectContacts(text);

        if (
            contacts.whatsapp &&
            !detectedPatterns.some(
                (item) => item.id === "whatsapp-only"
            )
        ) {

            score += 5;

            findings.push({
                id: "whatsapp-contact",
                name: "WhatsApp Contact",
                warning:
                    "WhatsApp communication is present. Verify the recruiter independently.",
                points: 5
            });

        }


        /* -----------------------------------------------
           URL RISK
        ----------------------------------------------- */

        const suspiciousURLs = contacts.urls.filter((url) =>
            /bit\.ly|tinyurl|t\.co|goo\.gl|shorturl|cutt\.ly/i.test(url)
        );

        if (suspiciousURLs.length > 0) {

            score += 15;

            findings.push({
                id: "short-link",
                name: "Shortened Link",
                warning:
                    "A shortened URL was detected. The final destination should be verified before opening.",
                points: 15
            });

        }


        /* -----------------------------------------------
           PERSONAL DATA
        ----------------------------------------------- */

        const personalData = detectPersonalData(text);

        const sensitiveAlreadyDetected =
            detectedPatterns.some(
                (item) => item.id === "sensitive-data"
            );

        if (
            personalData.length > 0 &&
            !sensitiveAlreadyDetected
        ) {

            score += 25;

            findings.push({
                id: "personal-data",
                name: "Sensitive Personal Data",
                warning:
                    "Sensitive personal or financial information appears in the request.",
                points: 25
            });

        }


        /* -----------------------------------------------
           SALARY
        ----------------------------------------------- */

        const salary = analyzeSalary(text);

        if (
            salary.unrealistic &&
            !detectedPatterns.some(
                (item) => item.id === "unrealistic-income"
            )
        ) {

            score += 15;

            findings.push({
                id: "salary-risk",
                name: "Salary Reality Warning",
                warning:
                    "The salary or income claim appears unusually high or guaranteed.",
                points: 15
            });

        }


        /* -----------------------------------------------
           MULTI-SIGNAL BONUS
        ----------------------------------------------- */

        if (
            /work\s*[- ]?\s*from\s*[- ]?\s*home|wfh/i.test(text) &&
            salary.unrealistic &&
            (
                /no interview|without interview|direct selection/i.test(text)
            )
        ) {

            score += 8;

            findings.push({
                id: "combined-risk",
                name: "Multiple High-Risk Claims",
                warning:
                    "Work-from-home, high-income and weak-selection claims appear together.",
                points: 8
            });

        }


        /* -----------------------------------------------
           COMPANY
        ----------------------------------------------- */

        const company = analyzeCompany(
            text,
            contacts
        );


        /* -----------------------------------------------
           FINAL SCORE
        ----------------------------------------------- */

        score = clampScore(score);

        let level;
        let explanation;
        let riskClass;

        if (score < 30) {

            level = "Low Risk";
            riskClass = "low";

            explanation =
                "Few common warning indicators were detected. This does not prove that the opportunity is genuine, so verify the employer independently.";

        } else if (score < 60) {

            level = "Suspicious";
            riskClass = "suspicious";

            explanation =
                "Several warning indicators were detected. Investigate the employer and avoid payments or unnecessary personal-data sharing until verification.";

        } else {

            level = "High Risk";
            riskClass = "high";

            explanation =
                "Multiple strong warning indicators were detected. Do not send money, OTPs, UPI PINs or unnecessary financial information without independent verification.";

        }


        const result = {

            score,
            level,
            riskClass,
            explanation,

            findings,
            rules: findings,

            contacts,
            salary,
            personalData,
            company,

            text,

            timestamp: new Date().toISOString()

        };

        lastAnalysis = result;

        renderAnalysis(result);

        saveHistory(result);

        updateDashboard();

    }


    /* =====================================================
       10. RENDER ANALYSIS
    ===================================================== */

    function renderAnalysis(result) {

        const {
            score,
            level,
            riskClass,
            explanation,
            findings
        } = result;


        /* Score */

        if (riskScore) {
            riskScore.textContent = score;
        }

        if (riskLevel) {
            riskLevel.textContent = level;
        }

        if (riskTitle) {
            riskTitle.textContent = level;
        }

        if (riskPill) {
            riskPill.textContent = level;
        }

        if (riskExplanation) {
            riskExplanation.textContent = explanation;
        }


        /* Risk classes */

        if (riskCard) {

            riskCard.classList.remove(
                "low",
                "suspicious",
                "high",
                "risk-low",
                "risk-suspicious",
                "risk-high"
            );

            riskCard.classList.add(
                riskClass,
                `risk-${riskClass}`
            );

        }


        /* Meter */

        if (meterValue) {
            meterValue.textContent = `${score}%`;
        }

        if (meterFill) {

            requestAnimationFrame(() => {

                meterFill.style.width = `${score}%`;

            });

        }


        /* Warnings */

        renderWarnings(findings);

        /* Breakdown */

        renderBreakdown(findings);

        /* Explanation */

        renderDetailedExplanation(result);

        /* Recommendation */

        renderRecommendation(result);

        /* Contacts */

        renderContacts(result);

        /* Salary */

        renderSalary(result);

        /* Personal data */

        renderPersonalData(result);

        /* Company */

        renderCompany(result);

        /* Highlight */

        renderHighlightedText(result.text, findings);

        /* Action buttons */

        ensureActionButtons();

        /* Show result */

        if (resultSection) {

            resultSection.classList.remove("hidden");

            resultSection.style.display = "block";

        }

    }


    /* =====================================================
       11. WARNINGS
    ===================================================== */

    function renderWarnings(findings) {

        if (!warningList) return;

        warningList.innerHTML = "";

        if (!findings.length) {

            const li = document.createElement("li");

            li.textContent =
                "No common suspicious warning signs were detected.";

            warningList.appendChild(li);

            return;

        }

        findings.forEach((finding) => {

            const li = document.createElement("li");

            li.className = "warning-item";

            li.innerHTML = `
                <span class="warning-item-icon">⚠</span>
                <span>
                    <strong>${escapeHTML(finding.name)}</strong>
                    <br>
                    ${escapeHTML(finding.warning)}
                </span>
            `;

            warningList.appendChild(li);

        });

    }


    /* =====================================================
       12. RISK BREAKDOWN
    ===================================================== */

    function renderBreakdown(findings) {

        if (!riskBreakdown) return;

        riskBreakdown.innerHTML = "";

        if (!findings.length) {

            riskBreakdown.innerHTML =
                `<p>No major suspicious patterns detected.</p>`;

            return;

        }

        findings.forEach((finding) => {

            const item =
                document.createElement("div");

            item.className =
                "breakdown-item risk-breakdown-item";

            const percentage =
                Math.min(
                    100,
                    Math.round(
                        (finding.points / 30) * 100
                    )
                );

            item.innerHTML = `
                <div class="breakdown-info">
                    <span class="breakdown-name">
                        ${escapeHTML(finding.name)}
                    </span>

                    <span class="breakdown-points">
                        +${finding.points}
                    </span>
                </div>

                <div class="breakdown-bar">
                    <div
                        class="breakdown-bar-fill"
                        style="width:${percentage}%"
                    ></div>
                </div>
            `;

            riskBreakdown.appendChild(item);

        });

    }


    /* =====================================================
       13. DETAILED EXPLANATION
    ===================================================== */

    function renderDetailedExplanation(result) {

        if (!detailedExplanation) return;

        const names =
            result.findings
                .map((item) => item.name)
                .join(", ");

        if (!result.findings.length) {

            detailedExplanation.textContent =
                "AI JobGuard did not find the specific warning patterns checked by this version. This does not guarantee that the opportunity is genuine.";

            return;

        }

        detailedExplanation.textContent =
            `AI JobGuard detected ${result.findings.length} warning signal(s): ` +
            `${names}. These patterns can sometimes be associated with ` +
            `fraudulent or misleading job and internship offers. The result ` +
            `is a risk assessment, not proof that an employer is fraudulent.`;

    }


    /* =====================================================
       14. RECOMMENDATION
    ===================================================== */

    function renderRecommendation(result) {

        if (!recommendation) return;

        if (result.score >= 60) {

            recommendation.textContent =
                "⚠️ Recommendation: Do not send money, OTPs, UPI PINs, passwords or unnecessary financial information. Verify the employer through independent official sources.";

        } else if (result.score >= 30) {

            recommendation.textContent =
                "⚠️ Recommendation: Research the employer, verify its official website and contact information, and avoid making payments before verification.";

        } else {

            recommendation.textContent =
                "✅ No major warning signs were detected. Still verify the employer independently before accepting the opportunity.";

        }

    }


    /* =====================================================
       15. CONTACT ANALYSIS
    ===================================================== */

    function renderContacts(result) {

        if (!contactAnalysis) return;

        const c = result.contacts;

        const rows = [];

        if (c.phones.length) {

            rows.push(`
                <div class="analysis-row">
                    <strong>📱 Phone</strong>
                    <span>${escapeHTML(c.phones.join(", "))}</span>
                </div>
            `);

        }

        if (c.emails.length) {

            rows.push(`
                <div class="analysis-row">
                    <strong>✉️ Email</strong>
                    <span>${escapeHTML(c.emails.join(", "))}</span>
                </div>
            `);

        }

        if (c.personalEmails.length) {

            rows.push(`
                <div class="analysis-row">
                    <strong>⚠️ Personal Email</strong>
                    <span>${escapeHTML(c.personalEmails.join(", "))}</span>
                </div>
            `);

        }

        if (c.urls.length) {

            rows.push(`
                <div class="analysis-row">
                    <strong>🔗 Links</strong>
                    <span>${escapeHTML(c.urls.join(", "))}</span>
                </div>
            `);

        }

        if (c.upi.length) {

            rows.push(`
                <div class="analysis-row">
                    <strong>💳 Possible UPI</strong>
                    <span>${escapeHTML(c.upi.join(", "))}</span>
                </div>
            `);

        }

        if (c.whatsapp) {

            rows.push(`
                <div class="analysis-row">
                    <strong>⚠️ WhatsApp</strong>
                    <span>WhatsApp communication detected</span>
                </div>
            `);

        }

        if (!rows.length) {

            rows.push(
                "<p>No contact information detected.</p>"
            );

        }

        contactAnalysis.innerHTML =
            rows.join("");

    }


    /* =====================================================
       16. SALARY ANALYSIS
    ===================================================== */

    function renderSalary(result) {

        if (!salaryAnalysis) return;

        const salary = result.salary;

        if (!salary.amounts.length) {

            salaryAnalysis.innerHTML =
                "<p>No clear salary amount detected.</p>";

            return;

        }

        const amounts =
            escapeHTML(
                salary.amounts.join(", ")
            );

        if (salary.unrealistic) {

            salaryAnalysis.innerHTML = `
                <p>
                    <strong>Salary detected:</strong>
                    ${amounts}
                </p>

                <p>
                    ⚠️ The claim appears unusually high,
                    guaranteed or unrealistic.
                    Verify it through official employer sources.
                </p>
            `;

        } else {

            salaryAnalysis.innerHTML = `
                <p>
                    <strong>Salary detected:</strong>
                    ${amounts}
                </p>

                <p>
                    ℹ️ The amount alone is not proof of fraud.
                    Verify the role and employer independently.
                </p>
            `;

        }

    }


    /* =====================================================
       17. PERSONAL DATA
    ===================================================== */

    function renderPersonalData(result) {

        if (!personalDataWarning) return;

        if (!result.personalData.length) {

            personalDataWarning.innerHTML =
                "<p>✓ No Aadhaar, PAN, bank, OTP, card or UPI PIN request detected.</p>";

            return;

        }

        personalDataWarning.innerHTML = `
            <p>
                ⚠️ <strong>Sensitive information detected:</strong>
                ${escapeHTML(result.personalData.join(", "))}
            </p>

            <p>
                Never share OTPs, UPI PINs, passwords, card details
                or unnecessary financial information with an unverified recruiter.
            </p>
        `;

    }


    /* =====================================================
       18. COMPANY VERIFICATION
    ===================================================== */

    function renderCompany(result) {

        const container =
            document.getElementById("companyAnalysis");

        if (!container) return;

        const company = result.company;

        container.innerHTML = `
            <div class="analysis-row">
                <strong>🏢 Company</strong>
                <span>
                    ${escapeHTML(
                        company.companyName || "Not detected"
                    )}
                </span>
            </div>

            <div class="analysis-row">
                <strong>🌐 Website</strong>
                <span>
                    ${
                        company.website
                            ? escapeHTML(company.website)
                            : "Not detected"
                    }
                </span>
            </div>

            <div class="analysis-row">
                <strong>✉️ Email Domain</strong>
                <span>
                    ${
                        company.emailDomain
                            ? escapeHTML(company.emailDomain)
                            : "Not detected"
                    }
                </span>
            </div>

            <div class="analysis-row">
                <strong>🔐 HTTPS</strong>
                <span>
                    ${
                        company.website
                            ? (
                                company.httpsWebsite
                                    ? "HTTPS detected"
                                    : "HTTP / no HTTPS detected"
                            )
                            : "No website detected"
                    }
                </span>
            </div>

            <p class="company-note">
                ℹ️ This is a basic client-side check.
                AI JobGuard does not perform live company verification
                or prove that a company is legitimate.
            </p>
        `;

    }


    /* =====================================================
       19. HIGHLIGHT SUSPICIOUS TEXT
    ===================================================== */

    function renderHighlightedText(text, findings) {

        if (!highlightedText) return;

        let html = escapeHTML(text);

        const words = [];

        findings.forEach((finding) => {

            const pattern =
                suspiciousPatterns.find(
                    (item) => item.id === finding.id
                );

            if (!pattern) return;

            pattern.keywords.forEach((keyword) => {

                words.push(keyword);

            });

        });

        const uniqueWords =
            unique(words)
                .sort((a, b) => b.length - a.length);

        uniqueWords.forEach((keyword) => {

            const escaped =
                escapeHTML(keyword)
                    .replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    );

            try {

                const regex =
                    new RegExp(
                        `(${escaped})`,
                        "gi"
                    );

                html =
                    html.replace(
                        regex,
                        "<mark>$1</mark>"
                    );

            } catch (error) {
                /* Ignore invalid highlight pattern */
            }

        });

        highlightedText.innerHTML = html;

    }


    /* =====================================================
       20. ANALYZE BUTTON
    ===================================================== */

    function analyzeJob() {

        if (!jobDescription) return;

        hideError();

        const text =
            jobDescription.value.trim();

        if (!text) {

            showError(
                "Please paste a job or internship description first."
            );

            jobDescription.focus();

            return;

        }

        if (text.length < 20) {

            showError(
                "Please provide a little more job information for a useful analysis."
            );

            jobDescription.focus();

            return;

        }

        startLoading();

        setTimeout(() => {

            try {

                performAnalysis(text);

            } catch (error) {

                console.error(
                    "AI JobGuard analysis error:",
                    error
                );

                showError(
                    "Something went wrong while analyzing this job. Please try again."
                );

            } finally {

                stopLoading();

            }

        }, 650);

    }


    /* =====================================================
       21. LOADING
    ===================================================== */

    function startLoading() {

        if (loadingArea) {
            loadingArea.classList.remove("hidden");
        }

        if (analyzeButton) {
            analyzeButton.disabled = true;
        }

        const messages = [
            "Scanning job description...",
            "Checking suspicious patterns...",
            "Analyzing salary claims...",
            "Checking contact information...",
            "Detecting sensitive data...",
            "Building explainable risk score..."
        ];

        let index = 0;

        if (loadingText) {
            loadingText.textContent = messages[0];
        }

        clearInterval(loadingTimer);

        loadingTimer =
            setInterval(() => {

                index =
                    (index + 1) %
                    messages.length;

                if (loadingText) {
                    loadingText.textContent =
                        messages[index];
                }

            }, 250);

    }


    function stopLoading() {

        clearInterval(loadingTimer);

        if (loadingArea) {
            loadingArea.classList.add("hidden");
        }

        if (analyzeButton) {
            analyzeButton.disabled = false;
        }

    }


    /* =====================================================
       22. SAMPLE BUTTONS
    ===================================================== */

    document
        .querySelectorAll("[data-sample]")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const type =
                        button.getAttribute(
                            "data-sample"
                        );

                    if (!sampleJobs[type]) return;

                    if (jobDescription) {

                        jobDescription.value =
                            sampleJobs[type];

                        updateCharacterCount();

                        hideError();

                        jobDescription.focus();

                    }

                }
            );

        });


    /* =====================================================
       23. CLEAR ANALYZER
    ===================================================== */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                if (jobDescription) {
                    jobDescription.value = "";
                }

                updateCharacterCount();
                hideError();

                lastAnalysis = null;

                if (resultSection) {

                    resultSection.classList.add("hidden");

                    resultSection.style.display =
                        "none";

                }

            }
        );

    }


    /* =====================================================
       24. CHARACTER COUNT
    ===================================================== */

    if (jobDescription) {

        jobDescription.addEventListener(
            "input",
            updateCharacterCount
        );

    }


    /* =====================================================
       25. HISTORY
    ===================================================== */

    function getHistory() {

        try {

            const data =
                localStorage.getItem(
                    HISTORY_KEY
                );

            if (!data) return [];

            const parsed =
                JSON.parse(data);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.warn(
                "History could not be read:",
                error
            );

            return [];

        }

    }


    function saveHistory(result) {

        try {

            const history =
                getHistory();

            const entry = {

                id:
                    Date.now().toString(),

                score:
                    result.score,

                level:
                    result.level,

                text:
                    result.text.substring(
                        0,
                        160
                    ),

                findings:
                    result.findings.length,

                date:
                    new Date().toLocaleString()

            };

            history.unshift(entry);

            localStorage.setItem(
                HISTORY_KEY,
                JSON.stringify(
                    history.slice(0, 25)
                )
            );

        } catch (error) {

            console.warn(
                "History save error:",
                error
            );

        }

    }


    function renderHistory(history) {

        if (!historyList) return;

        historyList.innerHTML = "";

        if (!history.length) {

            historyList.innerHTML =
                "<p>No analyses yet.</p>";

            return;

        }

        history.forEach((item) => {

            const div =
                document.createElement("div");

            div.className =
                "history-item";

            div.innerHTML = `
                <div>
                    <strong>
                        ${escapeHTML(item.level)}
                    </strong>

                    <span class="history-score">
                        ${item.score}/100
                    </span>
                </div>

                <p>
                    ${escapeHTML(item.text)}
                </p>

                <small>
                    ${escapeHTML(item.date)}
                    · ${item.findings || 0} warning(s)
                </small>

                <button
                    type="button"
                    class="history-reanalyze"
                    data-history-id="${escapeHTML(item.id)}"
                >
                    Re-analyze
                </button>
            `;

            historyList.appendChild(div);

        });

    }


    function updateDashboard() {

        const history =
            getHistory();

        let high = 0;
        let suspicious = 0;
        let low = 0;

        history.forEach((item) => {

            if (item.level === "High Risk") {
                high++;
            } else if (item.level === "Suspicious") {
                suspicious++;
            } else {
                low++;
            }

        });

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

        renderHistory(history);

    }


    /* =====================================================
       26. HISTORY RE-ANALYZE
    ===================================================== */

    if (historyList) {

        historyList.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        ".history-reanalyze"
                    );

                if (!button) return;

                const id =
                    button.dataset.historyId;

                const history =
                    getHistory();

                const item =
                    history.find(
                        (entry) =>
                            entry.id === id
                    );

                if (!item) return;

                if (jobDescription) {

                    jobDescription.value =
                        item.text;

                    updateCharacterCount();

                    analyzeJob();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    /* =====================================================
       27. CLEAR HISTORY
    ===================================================== */

    if (clearHistory) {

        clearHistory.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    HISTORY_KEY
                );

                updateDashboard();

            }
        );

    }


    /* =====================================================
       28. DOWNLOAD REPORT
    ===================================================== */

    function buildReport() {

        if (!lastAnalysis) return "";

        const r =
            lastAnalysis;

        const warnings =
            r.findings.length
                ? r.findings
                    .map(
                        (item) =>
                            `- ${item.name}: ${item.warning} (+${item.points})`
                    )
                    .join("\n")
                : "- No common warning patterns detected.";

        return `
AI JOBGUARD
FAKE JOB & INTERNSHIP RISK REPORT
=========================================

Date:
${new Date().toLocaleString()}

Risk Score:
${r.score}/100

Risk Level:
${r.level}

EXPLANATION
-----------------------------------------
${r.explanation}

WARNING SIGNALS
-----------------------------------------
${warnings}

CONTACT ANALYSIS
-----------------------------------------
Phones: ${r.contacts.phones.join(", ") || "None"}
Emails: ${r.contacts.emails.join(", ") || "None"}
URLs: ${r.contacts.urls.join(", ") || "None"}
Personal emails: ${r.contacts.personalEmails.join(", ") || "None"}
WhatsApp: ${r.contacts.whatsapp ? "Detected" : "Not detected"}

SALARY ANALYSIS
-----------------------------------------
${r.salary.amounts.join(", ") || "No clear salary detected"}
${r.salary.unrealistic ? "Salary claim requires additional verification." : "No strong salary warning detected."}

PERSONAL DATA
-----------------------------------------
${r.personalData.join(", ") || "No sensitive data keywords detected"}

COMPANY CHECK
-----------------------------------------
Company: ${r.company.companyName || "Not detected"}
Website: ${r.company.website || "Not detected"}
Email domain: ${r.company.emailDomain || "Not detected"}
HTTPS: ${
            r.company.website
                ? (
                    r.company.httpsWebsite
                        ? "Detected"
                        : "Not detected"
                )
                : "Not available"
        }

JOB DESCRIPTION
-----------------------------------------
${r.text}

SAFETY NOTICE
-----------------------------------------
AI JobGuard uses client-side rule-based pattern analysis.
The result is NOT proof that an employer or opportunity
is fraudulent.

Always independently verify:
- Official company website
- Recruiter identity
- Job posting source
- Interview process
- Payment requirements

Never share OTPs, UPI PINs, passwords or unnecessary
financial information with an unverified recruiter.

If money has already been lost:
Preserve transaction details and contact your bank/payment
provider immediately. In India, use the official cybercrime
reporting channels such as 1930 and cybercrime.gov.in.

=========================================
AI JOBGUARD
`;

    }


    if (downloadReport) {

        downloadReport.addEventListener(
            "click",
            () => {

                if (!lastAnalysis) {

                    showError(
                        "Please analyze a job before downloading the report."
                    );

                    return;

                }

                const report =
                    buildReport();

                const blob =
                    new Blob(
                        [report],
                        {
                            type:
                                "text/plain;charset=utf-8"
                        }
                    );

                const url =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    "AI-JobGuard-Risk-Report.txt";

                document.body.appendChild(link);

                link.click();

                link.remove();

                URL.revokeObjectURL(url);

            }
        );

    }


    /* =====================================================
       29. COPY / SHARE BUTTONS
    ===================================================== */

    function getShareText() {

        if (!lastAnalysis) {

            return "AI JobGuard analysis is not available yet.";

        }

        return (
            `AI JobGuard Analysis\n` +
            `Risk Score: ${lastAnalysis.score}/100\n` +
            `Risk Level: ${lastAnalysis.level}\n` +
            `Warning Signals: ${lastAnalysis.findings.length}\n\n` +
            `This is a rule-based risk assessment, not proof of fraud.`
        );

    }


    async function copyAnalysis() {

        const text =
            getShareText();

        try {

            await navigator.clipboard.writeText(
                text
            );

            showTemporaryMessage(
                "Analysis copied to clipboard."
            );

        } catch (error) {

            const area =
                document.createElement("textarea");

            area.value = text;

            document.body.appendChild(area);

            area.select();

            document.execCommand("copy");

            area.remove();

            showTemporaryMessage(
                "Analysis copied."
            );

        }

    }


    async function shareAnalysis() {

        const text =
            getShareText();

        if (
            navigator.share
        ) {

            try {

                await navigator.share({
                    title: "AI JobGuard Analysis",
                    text
                });

                return;

            } catch (error) {

                if (
                    error &&
                    error.name === "AbortError"
                ) {
                    return;
                }

            }

        }

        await copyAnalysis();

    }


    function showTemporaryMessage(message) {

        let toast =
            document.getElementById(
                "jobguardToast"
            );

        if (!toast) {

            toast =
                document.createElement("div");

            toast.id =
                "jobguardToast";

            toast.style.position =
                "fixed";

            toast.style.bottom =
                "24px";

            toast.style.left =
                "50%";

            toast.style.transform =
                "translateX(-50%)";

            toast.style.zIndex =
                "99999";

            toast.style.padding =
                "12px 18px";

            toast.style.borderRadius =
                "12px";

            toast.style.background =
                "rgba(8, 15, 35, 0.94)";

            toast.style.color =
                "#fff";

            toast.style.border =
                "1px solid rgba(255,255,255,.15)";

            toast.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.3)";

            document.body.appendChild(toast);

        }

        toast.textContent =
            message;

        clearTimeout(
            toast._timer
        );

        toast._timer =
            setTimeout(
                () => {
                    toast.remove();
                },
                2500
            );

    }


    function ensureActionButtons() {

        if (!resultSection) return;

        let actions =
            document.getElementById(
                "analysisActions"
            );

        if (!actions) {

            actions =
                document.createElement("div");

            actions.id =
                "analysisActions";

            actions.style.display =
                "flex";

            actions.style.flexWrap =
                "wrap";

            actions.style.gap =
                "10px";

            actions.style.marginTop =
                "14px";

            const download =
                downloadReport;

            if (download && download.parentElement) {

                download.parentElement.appendChild(
                    actions
                );

            } else {

                resultSection.appendChild(
                    actions
                );

            }

        }

        if (
            !document.getElementById(
                "copyAnalysis"
            )
        ) {

            const copy =
                document.createElement("button");

            copy.id =
                "copyAnalysis";

            copy.type =
                "button";

            copy.className =
                "outline-button";

            copy.textContent =
                "📋 Copy Analysis";

            copy.addEventListener(
                "click",
                copyAnalysis
            );

            actions.appendChild(copy);

        }

        if (
            !document.getElementById(
                "shareAnalysis"
            )
        ) {

            const share =
                document.createElement("button");

            share.id =
                "shareAnalysis";

            share.type =
                "button";

            share.className =
                "outline-button";

            share.textContent =
                "↗ Share Analysis";

            share.addEventListener(
                "click",
                shareAnalysis
            );

            actions.appendChild(share);

        }

    }


    /* =====================================================
       30. CHECKLIST PERSISTENCE
    ===================================================== */

    const checklist =
        document.querySelectorAll(
            'input[type="checkbox"]'
        );

    checklist.forEach((checkbox, index) => {

        const key =
            `aiJobGuardChecklist_${index}`;

        try {

            checkbox.checked =
                localStorage.getItem(key) === "true";

        } catch (error) {}

        checkbox.addEventListener(
            "change",
            () => {

                try {

                    localStorage.setItem(
                        key,
                        String(checkbox.checked)
                    );

                } catch (error) {}

            }
        );

    });


    /* =====================================================
       31. LANGUAGE SUPPORT
    ===================================================== */

    const translations = {

        en: {
            analyze: "Analyze Job",
            clear: "Clear",
            download: "Download Report",
            low: "Low Risk",
            suspicious: "Suspicious",
            high: "High Risk"
        },

        te: {
            analyze: "విశ్లేషించండి",
            clear: "క్లియర్",
            download: "రిపోర్ట్ డౌన్‌లోడ్",
            low: "తక్కువ ప్రమాదం",
            suspicious: "అనుమానాస్పదం",
            high: "అధిక ప్రమాదం"
        },

        hi: {
            analyze: "विश्लेषण करें",
            clear: "साफ करें",
            download: "रिपोर्ट डाउनलोड करें",
            low: "कम जोखिम",
            suspicious: "संदिग्ध",
            high: "उच्च जोखिम"
        }

    };


    function applyLanguage(language) {

        const t =
            translations[language] ||
            translations.en;

        if (analyzeButton) {
            analyzeButton.textContent =
                t.analyze;
        }

        if (clearButton) {
            clearButton.textContent =
                t.clear;
        }

        if (downloadReport) {
            downloadReport.textContent =
                t.download;
        }

        try {

            localStorage.setItem(
                LANGUAGE_KEY,
                language
            );

        } catch (error) {}

    }


    if (languageSelector) {

        languageSelector.addEventListener(
            "change",
            () => {

                applyLanguage(
                    languageSelector.value
                );

            }
        );

        let savedLanguage = "en";

        try {

            savedLanguage =
                localStorage.getItem(
                    LANGUAGE_KEY
                ) || "en";

        } catch (error) {}

        if (
            translations[savedLanguage]
        ) {

            languageSelector.value =
                savedLanguage;

            applyLanguage(
                savedLanguage
            );

        }

    }


    /* =====================================================
       32. LIVE CYBER BACKGROUND
    ===================================================== */

    function initCyberBackground() {

        if (!backgroundCanvas) return;

        const ctx =
            backgroundCanvas.getContext("2d");

        if (!ctx) return;

        const reducedMotion =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        let width = 0;
        let height = 0;
        let particles = [];

        const isMobile =
            window.innerWidth < 700;

        const particleCount =
            reducedMotion
                ? 0
                : isMobile
                    ? 38
                    : 75;


        function resizeCanvas() {

            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

            width =
                window.innerWidth;

            height =
                window.innerHeight;

            backgroundCanvas.width =
                Math.floor(
                    width * dpr
                );

            backgroundCanvas.height =
                Math.floor(
                    height * dpr
                );

            backgroundCanvas.style.width =
                `${width}px`;

            backgroundCanvas.style.height =
                `${height}px`;

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

            createParticles();

        }


        function createParticles() {

            particles = [];

            for (
                let i = 0;
                i < particleCount;
                i++
            ) {

                particles.push({

                    x:
                        Math.random() *
                        width,

                    y:
                        Math.random() *
                        height,

                    vx:
                        (Math.random() - 0.5) *
                        0.35,

                    vy:
                        (Math.random() - 0.5) *
                        0.35,

                    size:
                        Math.random() *
                            1.8 +
                        0.5,

                    alpha:
                        Math.random() *
                            0.45 +
                        0.15

                });

            }

        }


        function draw() {

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            /* Particles */

            particles.forEach((particle) => {

                particle.x +=
                    particle.vx;

                particle.y +=
                    particle.vy;


                if (
                    particle.x < -10 ||
                    particle.x > width + 10
                ) {

                    particle.vx *= -1;

                }

                if (
                    particle.y < -10 ||
                    particle.y > height + 10
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

                ctx.fillStyle =
                    `rgba(83, 180, 255, ${particle.alpha})`;

                ctx.fill();

            });


            /* Network lines */

            const maxDistance =
                width < 700
                    ? 105
                    : 135;

            for (
                let i = 0;
                i < particles.length;
                i++
            ) {

                for (
                    let j = i + 1;
                    j < particles.length;
                    j++
                ) {

                    const a =
                        particles[i];

                    const b =
                        particles[j];

                    const dx =
                        a.x - b.x;

                    const dy =
                        a.y - b.y;

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );

                    if (
                        distance <
                        maxDistance
                    ) {

                        const opacity =
                            (1 -
                                distance /
                                maxDistance) *
                            0.18;

                        ctx.beginPath();

                        ctx.moveTo(
                            a.x,
                            a.y
                        );

                        ctx.lineTo(
                            b.x,
                            b.y
                        );

                        ctx.strokeStyle =
                            `rgba(70, 160, 255, ${opacity})`;

                        ctx.lineWidth =
                            0.6;

                        ctx.stroke();

                    }

                }

            }


            /* Moving scan line */

            const scanY =
                (Date.now() * 0.035) %
                (height + 160) -
                80;

            const gradient =
                ctx.createLinearGradient(
                    0,
                    scanY - 35,
                    0,
                    scanY + 35
                );

            gradient.addColorStop(
                0,
                "rgba(80,170,255,0)"
            );

            gradient.addColorStop(
                0.5,
                "rgba(80,170,255,0.08)"
            );

            gradient.addColorStop(
                1,
                "rgba(80,170,255,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.fillRect(
                0,
                scanY - 35,
                width,
                70
            );


            if (!reducedMotion) {
                requestAnimationFrame(draw);
            }

        }


        resizeCanvas();

        window.addEventListener(
            "resize",
            resizeCanvas,
            { passive: true }
        );

        if (!reducedMotion) {
            requestAnimationFrame(draw);
        }

    }


    /* =====================================================
       33. NAVIGATION ACTIVE STATE
    ===================================================== */

    function initNavigation() {

        const navLinks =
            document.querySelectorAll(
                'a[href^="#"]'
            );

        navLinks.forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.forEach(
                        (item) =>
                            item.classList.remove(
                                "active"
                            )
                    );

                    link.classList.add(
                        "active"
                    );

                }
            );

        });

    }


    /* =====================================================
       34. INITIALIZE
    ===================================================== */

    updateCharacterCount();

    updateDashboard();

    initCyberBackground();

    initNavigation();

    console.log(
        "AI JobGuard loaded successfully."
    );

});
