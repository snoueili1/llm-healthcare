function explainSecurity(result) {
  if (result.blocked && result.blocked_by === "lakera") {
    const threat = result.threat || "Adversarial Prompt";
    const fired = result.breakdown?.find((b) => b.detected);
    const detectorId = fired?.detector_id || "unknown";

    const impacts = {
      prompt_attack:
        "Attackers use this to override system instructions and manipulate the AI into ignoring its safety rules.",
      "pii/us_social_security_number":
        "Exposing SSNs can lead to identity theft and violates HIPAA patient data regulations.",
      "pii/phone_number":
        "Patient phone numbers are protected health information — leaking them violates privacy policies.",
      "pii/email":
        "Patient email addresses are sensitive — sharing them without consent breaches data protection rules.",
      "pii/credit_card":
        "Credit card data exposure leads to direct financial fraud and regulatory violations.",
      "moderated_content/crime":
        "This request attempted to extract information that could facilitate illegal activity.",
      "moderated_content/hate":
        "Hate speech in a healthcare context could harm vulnerable patients and damage trust.",
      "moderated_content/violence":
        "Content promoting violence poses a direct safety risk to patients and staff.",
      "moderated_content/weapons":
        "Weapons-related content has no place in a healthcare assistant and signals a security threat.",
      unknown_links:
        "Unrecognized links can be phishing attempts or vectors for indirect prompt injection.",
    };

    const detectorType = fired?.detector_type || "";
    const impact =
      impacts[detectorType] ||
      "This request contains adversarial patterns that could compromise the integrity of the AI assistant.";

    return `
      <h3>🚨 Threat Blocked by Lakera Guard</h3>
      <p><b>Threat type:</b> ${threat}</p>
      <p><b>Detector:</b> ${detectorId}</p>
      <p><b>Why it was blocked:</b> ${impact}</p>
      <p><b>Security action:</b> The request was intercepted before reaching the AI model.</p>
    `;
  }

  if (result.model_blocked) {
    return `
      <h3>⚠️ Blocked by Model Safety</h3>
      <p>Lakera did not detect adversarial manipulation, but the AI model identified the response as potentially unsafe.</p>
      <p><b>Security action:</b> The model refused to generate a harmful response.</p>
    `;
  }

  return `
    <h3>✅ Secure Interaction</h3>
    <p>No threats detected by Lakera Guard. Response generated within safety guidelines.</p>
  `;
}
