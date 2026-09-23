function analyzeJob() {

    const text = document
        .getElementById("jobText")
        .value
        .toLowerCase()
        .trim();

    const result = document.getElementById("result");

    if (text === "") {
        result.style.display = "block";
        result.className = "warning";
        result.innerHTML = `
            ⚠️ <b>Please enter a job or internship description.</b>
        `;
        return;
    }

    // Common warning signs
    const warningSigns = [
        "registration fee",
        "registration fees",
        "processing fee",
        "security deposit",
        "training fee",
        "pay money",
        "pay fee",
        "send money",
        "deposit",
        "guaranteed job",
        "guaranteed salary",
        "no interview",
        "urgent payment",
        "whatsapp only",
        "telegram",
        "pay first
