# Healthcare AI Security Demo – Lakera Guard Integration

## Overview

This project demonstrates how an AI security layer can protect a Large Language Model (LLM) from adversarial prompts and malicious inputs.

The demo simulates a healthcare assistant powered by OpenAI. Lakera Guard sits in front of the model and analyzes every user prompt before it reaches the LLM. The interface allows users to test real attack scenarios and observe the difference in behavior with and without the security layer enabled.

---

## Project Architecture

Every request flows through the following pipeline:

```
User Prompt
↓
Lakera Guard Security Layer (optional)
↓
Threat Detection
↓
LLM (OpenAI)
↓
Assistant Response
```

Two security layers are demonstrated:

1. **Pre-LLM Security (Lakera Guard)** — screens the prompt before the model sees it
2. **Model Safety Policies** — the LLM's built-in refusal mechanisms as a fallback

Detecting and blocking attacks before they reach the model is significantly more reliable than relying on the model alone.

---

## Project Structure

```
llm-healthcare/
  backend/
    main.py                  FastAPI server, Lakera + OpenAI integration
    config.py		     Loads environment variables and configuration
  frontend/
    index.html               Main chat interface
    dashboard.html           Security metrics dashboard
    app.js                   Chat logic, session state, attack simulator
    pipeline_renderer.js     Animated security pipeline visualization
    security_explainer.js    Dynamic threat explanation panel
    style.css                Shared styles
  .env                       API keys (not committed)
  requirements.txt           Python dependencies
```

---

## Setup & Running the Demo

### Step 1 – Create a virtual environment

```bash
python -m venv venv
```

Activate it:

```bash
# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate.bat
```

---

### Step 2 – Install Python dependencies

```bash
pip install -r requirements.txt
```

---

### Step 3 – Configure API keys

Create a `.env` file in the root of the project:

```
OPENAI_API_KEY=your_openai_key
LAKERA_API_KEY=your_lakera_key
```

---

### Step 4 – Start the backend server

```bash
uvicorn backend.main:app --reload
```

The API will be available at:

```
http://127.0.0.1:8000
```

---

### Step 5 – Open the interface

Open `frontend/index.html` in your browser. No build step is required.

---

## Features

### Lakera Guard Toggle

A toggle at the top of the interface enables or disables the Lakera security layer. When disabled, prompts go directly to the LLM. This lets you demonstrate the difference in behavior side by side.

### Attack Simulator

A dropdown pre-loads realistic attack prompts across all Lakera detector categories:

- **Prompt Attack** — attempts to override system instructions
- **PII** — SSN, phone number, email, credit card
- **Moderated Content** — crime, hate speech, violence, weapons

Selecting a category and clicking **Inject Attack** loads a random prompt from that category into the input field.

### Threat Log

The Threat Log displays the most recent attack detected by the system. It identifies the category of the prompt, such as prompt injection, data exfiltration, jailbreak attempt, or reputation attack. This helps users understand what type of adversarial behavior was detected and why the request was blocked or flagged by the security layer.


### Security Analysis Panel

After each request, the panel shows a dynamic explanation driven by Lakera's actual response — the threat type, the specific detector that fired, and a contextual explanation of the risk. The explanation adapts to every detector type rather than showing a generic message.

Possible states:

- **Threat Blocked (Red)** — Lakera detected and intercepted the prompt before it reached the model
- **Secure Interaction (Green)** — the prompt passed all detectors and a safe response was generated

---

### Security Metrics Dashboard

A separate dashboard tab (`dashboard.html`) shows session-level metrics:

| Metric           	| Description                                      			 |
| ---------------- 	| -----------------------------------------------------------------------|
| Total Screened   	| Total Number Requests analyzed by Lakera                      	 |
| Threats Blocked  	| Flagged and intercepted requests before reaching the LLM      	 |	
| Requests Allowed 	| Requests that passed all detectors and forwarded to the LLM   	 |
| Blocked Request Rate% | Percentage of screened requests that were attacks and blocked by Lakera|

Two charts are displayed:

- **Detector Distribution** — donut chart showing which detector types fired during the session such as prompt attacks, PII exposure, or moderated content.
- **Request Overview** — horizontal bar comparing screened vs blocked vs allowed

---

## Threat Classification

Threat labels are derived directly from Lakera's `detector_type` field in the `breakdown` array. The first item where `detected` is `true` is used as the primary classification. This replaces any regex-based approach and ensures labels are always accurate and consistent with what Lakera actually detected.

Supported detector types:

| Lakera `detector_type`          | Label shown in UI |
| ------------------------------- | ----------------- |
| `prompt_attack`                 | Prompt Attack     |
| `pii/us_social_security_number` | PII – SSN         |
| `pii/phone_number`              | PII – Phone       |
| `pii/email`                     | PII – Email       |
| `pii/name`                      | PII – Name        |
| `pii/credit_card`               | PII – Credit Card |
| `moderated_content/crime`       | Crime             |
| `moderated_content/hate`        | Hate Speech       |
| `moderated_content/violence`    | Violence          |
| `moderated_content/weapons`     | Weapons           |
| `unknown_links`                 | Unknown Links     |

---

## Why Pre-LLM Protection Matters

LLMs rely on probabilistic safety mechanisms and may sometimes:

- Misinterpret adversarial prompts
- Partially comply with malicious instructions
- Reveal unintended information under certain phrasings

A dedicated security layer like Lakera Guard provides deterministic, policy-driven protection before the model ever processes the request.

**Advantages of pre-LLM protection:**

- Prevents prompt manipulation and system prompt leakage
- Reduces the risk of sensitive data exposure
- Adds an auditable, configurable security control and visibility across your apps
- Protects patients from unsafe or misleading medical guidance
