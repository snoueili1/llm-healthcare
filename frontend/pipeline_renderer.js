function renderPipeline(result) {
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const step4 = document.getElementById("step4");
  const step5 = document.getElementById("step5");

  step1.className = "step safe";

  if (result.blocked && result.blocked_by === "lakera") {
    step2.className = "step blocked";
    step3.className = "step blocked";
    step4.className = "step";
    step5.className = "step";

    step2.innerHTML = "🚨 Lakera Guard<br>Prompt Injection Detected";
  } else if (result.model_blocked) {
    step2.className = "step safe";
    step3.className = "step warning";
    step4.className = "step blocked";

    step3.innerHTML = "⚠ Risky Request";
    step4.innerHTML = "🚫 Model Safety Block";
  } else {
    step2.className = "step safe";
    step3.className = "step safe";
    step4.className = "step safe";
    step5.className = "step safe";

    step5.innerHTML = "✅ Response Generated";
  }
}
