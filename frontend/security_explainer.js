function explainSecurity(result){

let explanation=""

if(result.blocked && result.blocked_by==="lakera"){

explanation=`

<h3>Lakera Guard Intervention</h3>

Lakera analyzes every user prompt before it reaches the AI model.

<b>Threat detected:</b> Prompt Injection attempt

This request attempted to override the assistant’s internal instructions.
Attackers often use this technique to manipulate AI systems and bypass safety rules.

<b>Security action:</b> Lakera blocked the request before it reached the AI model.

<b>Why this matters:</b>

Blocking adversarial prompts prevents attackers from manipulating
the AI assistant and protects patients from unsafe or misleading medical guidance.

`

}

else if(result.model_blocked){

explanation=`

<h3>AI Model Safety Protection</h3>

Lakera analyzed the prompt and did not detect adversarial manipulation.

However the AI model identified the request as unsafe.

<b>Threat detected:</b> Potentially harmful or misleading content

<b>Security action:</b> The AI model refused to generate a harmful response.

<b>Security impact:</b>

This prevents reputational damage and protects patients
from misleading or unsafe medical information.

`

}

else{

explanation=`

<h3>Secure Interaction</h3>

The prompt passed through the entire AI security pipeline.

<b>Lakera Guard:</b> No adversarial prompt detected.

<b>AI Model Safety:</b> Response generated within safety guidelines.

The interaction is considered secure.

`

}

return explanation

}