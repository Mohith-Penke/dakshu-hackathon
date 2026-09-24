/* =========================================================
   AI JOBGUARD — COMPLETE JAVASCRIPT
   Rule-based Job & Internship Risk Analyzer
========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
========================================================= */

const STORAGE_KEY = "aiJobGuardHistory";
const MAX_TEXT_LENGTH = 10000;

let currentAnalysis = null;
let scanTimer = null;

/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   DOM ELEMENTS
========================================================= */

const jobDescription = $("#jobDescription");
const characterCount = $("#characterCount");

const clearButton = $("#clearButton");
const analyzeButton = $("#analyzeButton");

const loadingArea = $("#loadingArea");
const loadingText = $("#loadingText");
const scanProgressFill = $(".scan-progress-fill");

const errorMessage = $("#errorMessage");

const resultSection = $("#resultSection");
const riskCard = $("#riskCard");

const riskScore = $("#riskScore");
const riskPill = $("#riskPill");
const riskTitle = $("#riskTitle");
const riskExplanation = $("#riskExplanation");

const meterValue = $("#meterValue");
const meterFill = $("#meterFill");

const riskBreakdown = $("#riskBreakdown");
const warningList = $("#warningList");
const detailedExplanation = $("#detailedExplanation");
const recommendation = $("#recommendation");

const highlightedText = $("#highlightedText");

const contactAnalysis = $("#contactAnalysis");
const salaryAnalysis = $("#salaryAnalysis");
const personalDataWarning = $("#personalDataWarning");

const downloadReport = $("#downloadReport");
const copyAnalysis = $("#copyAnalysis");
const shareAnalysis = $("#shareAnalysis");

const clearHistory = $("#clearHistory");

const totalScans = $("#totalScans");
const highRiskCount = $("#highRiskCount");
const suspiciousCount = $("#suspiciousCount");
const lowRiskCount = $("#lowRiskCount");
const historyList = $("#historyList");

/* =========================================================
   NEW — INSTANT RISK PREVIEW ELEMENTS
========================================================= */

const instantRiskArea = $("#instantRiskArea");
const instantRiskScore = $("#instantRiskScore");
const instantRiskPill = $("#instantRiskPill");
const instantRiskTitle = $("#instantRiskTitle");
const instantRiskReason = $("#instantRiskReason");
const instantRiskTips = $("#instantRiskTips");
const instantRiskAvoid = $("#instantRiskAvoid");

/* =========================================================
   NEW — SCORE EXPLANATION ELEMENTS
========================================================= */

const riskWhySection = $("#riskWhySection");
const riskWhyList = $("#riskWhyList");

const doSection = $("#doSection");
const doList = $("#doList");

const avoidSection = $("#avoidSection");
const avoidList = $("#avoidList");

const riskActionTitle = $("#riskActionTitle");

/* =========================================================
   SAMPLE JOBS
========================================================= */

const sampleJobs = {
    low: `
Software Development Intern

Company: TechNova Solutions
Location: Hyderabad / Hybrid
Duration: 6 months

We are looking for a motivated software development intern to join our engineering team.

Requirements:
- Basic knowledge of Python or JavaScript
- Good problem-solving skills
- Willingness to learn
- Ability to work with a team

Responsibilities:
- Assist developers with software development tasks
- Write and test basic code
- Participate in code reviews
- Attend weekly team meetings

Selection process:
1. Resume screening
2. Technical interview
3. HR discussion

Stipend: ₹15,000 per month

Please apply through the official company careers page.
No registration fee or payment is required.
    `.trim(),

    medium: `
Urgent Hiring — Work From Home Internship

We are urgently looking for students for a work-from-home internship.

Salary: ₹40,000 - ₹60,000 per month

No experience required. Immediate joining available.

Selected candidates may be asked to attend a short online interview.

Contact HR through WhatsApp for faster processing.

Limited vacancies available. Apply immediately to secure your position.

Send your resume and contact details to hr.jobs2026@gmail.com.
    `.trim(),

    high: `
CONGRATULATIONS!!!

You have been selected for an immediate work-from-home job with an international company.

Salary: ₹1,50,000 per month guaranteed.

No interview required.
No experience required.

To confirm your job, you must pay a refundable registration fee of ₹2,999 today.

Payment must be made through UPI to:
jobsecure@upi

Your offer will expire in 30 minutes.

Send your Aadhaar number, PAN number, bank account details and OTP for verification.

WhatsApp HR immediately on +91 9876543210.

Failure to complete the payment will result in cancellation of your offer.
    `.trim()
};

/* =========================================================
   RULE DEFINITIONS
========================================================= */

const rules = [
    {
        key: "payment",
        name: "Payment Request",
        points: 35,
        patterns: [
            /\bregistration fee\b/i,
            /\bprocessing fee\b/i,
            /\bjoining fee\b/i,
            /\bsecurity deposit\b/i,
            /\brefundable fee\b/i,
            /\bpay\b.{0,40}\bfee\b/i,
            /\bpayment\b.{0,40}\brequired\b/i,
            /\bdeposit\b.{0,30}\bjob\b/i,
            /\bpay\s*(₹|rs\.?|inr)?\s*[\d,]+/i
        ],
        warning:
            "The posting asks the applicant to pay money to obtain or confirm a job."
    },

    {
        key: "noInterview",
        name: "No Interview",
        points: 18,
        patterns: [
            /\bno interview\b/i,
            /\bwithout interview\b/i,
            /\binterview not required\b/i,
            /\bno interview required\b/i,
            /\bselected without interview\b/i
        ],
        warning:
            "The posting describes a job or selection process without a meaningful interview."
    },

    {
        key: "unrealisticSalary",
        name: "Unusual Salary Claim",
        points: 20,
        patterns: [
            /\b₹?\s*1[,.]?[0-9]{2,3}[,.]?[0-9]{2,3}\s*(per month|monthly)\b/i,
            /\b₹?\s*[5-9][0-9],[0-9]{3}\s*(per month|monthly)\b/i,
            /\bguaranteed income\b/i,
            /\bguaranteed salary\b/i,
            /\bearn\s*(₹|rs\.?|inr)?\s*[0-9,]+\s*(per day|daily|per month|monthly)\b/i,
            /\bhigh salary\b.{0,30}\bno experience\b/i,
            /\b1 lakh\b/i,
            /\b2 lakh\b/i,
            /\b3 lakh\b/i
        ],
        warning:
            "The salary or earning promise appears unusually high or guaranteed for the stated requirements."
    },

    {
        key: "urgency",
        name: "Urgency / Pressure",
        points: 15,
        patterns: [
            /\burgent(?:ly)?\b/i,
            /\bimmediate(?:ly)? joining\b/i,
            /\blimited vacancies\b/i,
            /\bapply immediately\b/i,
            /\bact now\b/i,
            /\bwithin \d+ minutes?\b/i,
            /\bexpires? in \d+ minutes?\b/i,
            /\btoday only\b/i,
            /\blast chance\b/i,
            /\bconfirm today\b/i
        ],
        warning:
            "The posting uses urgency or pressure to encourage a quick decision."
    },

    {
        key: "personalEmail",
        name: "Personal Email",
        points: 10,
        patterns: [
            /\b[\w.+-]+@(gmail|yahoo|outlook|hotmail|protonmail)\.(com|in|co|net)\b/i
        ],
        warning:
            "A free personal email provider is used instead of a company email domain."
    },

    {
        key: "whatsapp",
        name: "WhatsApp Recruitment Contact",
        points: 8,
        patterns: [
            /\bwhatsapp\b/i,
            /\bcontact.{0,20}whatsapp\b/i,
            /\bmessage.{0,20}whatsapp\b/i
        ],
        warning:
            "The posting directs applicants toward WhatsApp for recruitment communication."
    },

    {
        key: "otp",
        name: "OTP Request",
        points: 35,
        patterns: [
            /\bshare\b.{0,30}\botp\b/i,
            /\bsend\b.{0,30}\botp\b/i,
            /\botp\b.{0,30}\bverification\b/i,
            /\bverification\b.{0,30}\botp\b/i
        ],
        warning:
            "Applicants should never disclose OTPs to recruiters or employers."
    },

    {
        key: "bank",
        name: "Bank Information Request",
        points: 28,
        patterns: [
            /\bbank account\b/i,
            /\baccount number\b/i,
            /\baccount details\b/i,
            /\bifsc\b/i,
            /\bnet banking\b/i,
            /\bdebit card\b/i,
            /\bcredit card\b/i,
            /\bcard number\b/i
        ],
        warning:
            "The posting requests sensitive financial information."
    },

    {
        key: "aadhaar",
        name: "Aadhaar Request",
        points: 20,
        patterns: [
            /\baadhaar\b/i,
            /\baadhar\b/i,
            /\baadhaar number\b/i
        ],
        warning:
            "The posting requests Aadhaar information during recruitment."
    },

    {
        key: "pan",
        name: "PAN Request",
        points: 18,
        patterns: [
            /\bpan number\b/i,
            /\bpan card\b/i
        ],
        warning:
            "The posting requests PAN information."
    },

    {
        key: "upiPin",
        name: "UPI PIN Request",
        points: 40,
        patterns: [
            /\bupi pin\b/i,
            /\bupi password\b/i,
            /\bpin\b.{0,20}\bupi\b/i
        ],
        warning:
            "A UPI PIN should never be shared with a recruiter or employer."
    },

    {
        key: "fakeSelection",
        name: "Instant Selection",
        points: 18,
        patterns: [
            /\bcongratulations\b.{0,100}\bselected\b/i,
            /\byou have been selected\b/i,
            /\bselected immediately\b/i,
            /\bdirect selection\b/i,
            /\bguaranteed job\b/i
        ],
        warning:
            "The posting appears to promise selection without sufficient evaluation."
    },

    {
        key: "noExperience",
        name: "No Experience Promise",
        points: 8,
        patterns: [
            /\bno experience required\b/i,
            /\bwithout experience\b/i,
            /\banyone can apply\b/i
        ],
        warning:
            "No experience requirements combined with strong promises can increase risk."
    },

    {
        key: "suspiciousLanguage",
        name: "Suspicious Wording",
        points: 10,
        patterns: [
            /\bguaranteed\b/i,
            /\beasy money\b/i,
            /\bquick money\b/i,
            /\bearn money from home\b/i,
            /\brich\b/i,
            /\bsecret opportunity\b/i,
            /\b100% job\b/i
        ],
        warning:
            "The posting contains wording commonly associated with misleading job offers."
    }
];

/* =========================================================
   CONTACT DETECTION
========================================================= */

function detectContacts(text) {
    const phones =
        text.match(/(?:\+91[\s-]?)?[6-9]\d{9}\b/g) || [];

    const emails =
        text.match(
            /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
        ) || [];

    const urls =
        text.match(
            /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi
        ) || [];

    const upiCandidates =
        text.match(
            /\b[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}\b/g
        ) || [];

    const upi =
        upiCandidates.filter(
            (value) =>
                !emails.some(
                    (email) =>
                        email.toLowerCase() ===
                        value.toLowerCase()
                )
        );

    const personalEmails = emails.filter((email) =>
        /(gmail|yahoo|outlook|hotmail|protonmail)\./i.test(
            email
        )
    );

    return {
        phones: [...new Set(phones)],
        emails: [...new Set(emails)],
        urls: [...new Set(urls)],
        upi: [...new Set(upi)],
        personalEmails: [...new Set(personalEmails)]
    };
}

/* =========================================================
   PERSONAL DATA DETECTION
========================================================= */

function detectPersonalData(text) {
    const findings = [];

    const checks = [
        {
            label: "Aadhaar number",
            regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/i
        },
        {
            label: "PAN number",
            regex: /\b[A-Z]{5}\d{4}[A-Z]\b/i
        },
        {
            label: "Bank account information",
            regex:
                /\b(bank account|account number|account details|ifsc)\b/i
        },
        {
            label: "OTP",
            regex: /\b(otp|one[-\s]?time password)\b/i
        },
        {
            label: "Credit/debit card information",
            regex:
                /\b(credit card|debit card|card number|cvv)\b/i
        },
        {
            label: "UPI PIN",
            regex: /\bupi\s*pin\b/i
        }
    ];

    checks.forEach((check) => {
        if (check.regex.test(text)) {
            findings.push(check.label);
        }
    });

    return [...new Set(findings)];
}

/* =========================================================
   SALARY ANALYSIS
========================================================= */

function analyzeSalary(text) {
    const salaryPatterns = [
        /₹\s*[\d,]+\s*(?:per month|monthly)/gi,
        /rs\.?\s*[\d,]+\s*(?:per month|monthly)/gi,
        /inr\s*[\d,]+\s*(?:per month|monthly)/gi,
        /₹\s*[\d,]+/gi,
        /\b\d+\s*(?:lakh|lakhs)\b/gi
    ];

    const matches = [];

    salaryPatterns.forEach((pattern) => {
        const found = text.match(pattern);

        if (found) {
            matches.push(...found);
        }
    });

    const uniqueMatches = [...new Set(matches)];

    const unrealistic =
        /\bguaranteed salary\b|\bguaranteed income\b|\b1 lakh\b|\b2 lakh\b|\b3 lakh\b/i.test(
            text
        ) ||
        uniqueMatches.some((value) => {
            const number = parseInt(
                value.replace(/[^\d]/g, ""),
                10
            );

            return number >= 50000;
        });

    let message =
        "No obvious salary red flag detected.";

    if (unrealistic) {
        message =
            "The compensation claim may be unusually high or guaranteed relative to the stated requirements. Verify the employer and role independently.";
    } else if (uniqueMatches.length) {
        message =
            "A salary amount was detected. Compare it with the role, experience requirements and the company's official job listing.";
    }

    return {
        matches: uniqueMatches,
        unrealistic,
        message
    };
}

/* =========================================================
   RULE MATCHING
========================================================= */

function hasNoInterview(triggeredRules) {
    return triggeredRules.some(
        (rule) => rule.key === "noInterview"
    );
}

function evaluateRules(text) {
    const triggered = [];

    rules.forEach((rule) => {
        const matched = rule.patterns.some(
            (pattern) => {
                pattern.lastIndex = 0;
                return pattern.test(text);
            }
        );

        if (matched) {
            triggered.push({
                ...rule
            });
        }
    });

    return triggered;
}

/* =========================================================
   RISK SCORE
========================================================= */

function calculateRisk(
    triggeredRules,
    personalData,
    contacts,
    salaryInfo
) {
    let score = 0;

    triggeredRules.forEach((rule) => {
        score += rule.points;
    });

    /* 2+ personal-data findings */
    if (personalData.length >= 2) {
        score += 10;
    }

    /* Phone + personal email */
    if (
        contacts.phones.length &&
        contacts.personalEmails.length
    ) {
        score += 5;
    }

    /* Salary unusual but salary rule did not already trigger */
    if (
        salaryInfo.unrealistic &&
        !triggeredRules.some(
            (rule) =>
                rule.key === "unrealisticSalary"
        )
    ) {
        score += 10;
    }

    const hasPayment =
        triggeredRules.some(
            (rule) => rule.key === "payment"
        );

    const hasSensitiveData =
        personalData.length > 0 ||
        triggeredRules.some((rule) =>
            [
                "otp",
                "bank",
                "aadhaar",
                "pan",
                "upiPin"
            ].includes(rule.key)
        );

    const hasUrgency =
        triggeredRules.some(
            (rule) => rule.key === "urgency"
        );

    const hasInstantSelection =
        triggeredRules.some(
            (rule) => rule.key === "fakeSelection"
        );

    /* Payment + urgency */
    if (hasPayment && hasUrgency) {
        score += 10;
    }

    /* Payment + sensitive data */
    if (hasPayment && hasSensitiveData) {
        score += 10;
