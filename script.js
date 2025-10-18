
const TIPS = [
  "Start your morning with a glass of warm water and lemon to support digestion.",
  "Take short standing breaks every 60 minutes to improve circulation and posture.",
  "Spend 10 minutes outdoors in natural light to help regulate your sleep cycle.",
  "Add a serving of lentils or beans to at least one meal for steady protein & fiber.",
  "Try a 5-minute breathing break (inhale 4s, hold 2s, exhale 6s) when stressed.",
  "Aim to finish heavy meals at least 2–3 hours before bedtime for better sleep."
];

const elements = {
  tipText: null,
  newTipBtn: null,
  progressBar: null,
  getAdviceBtn: null,
  resetBtn: null,
  quizResult: null,
  scoreSummary: null,
  detailedAdvice: null,
  saveResultBtn: null,
  shareResultBtn: null,
  toggleThemeBtn: null
};

document.addEventListener("DOMContentLoaded", () => {
  
  elements.tipText = document.getElementById("daily-tip");
  elements.newTipBtn = document.getElementById("new-tip");
  elements.progressBar = document.getElementById("progress-bar");
  elements.getAdviceBtn = document.getElementById("get-advice");
  elements.resetBtn = document.getElementById("reset-quiz");
  elements.quizResult = document.getElementById("quiz-result");
  elements.scoreSummary = document.getElementById("score-summary");
  elements.detailedAdvice = document.getElementById("detailed-advice");
  elements.saveResultBtn = document.getElementById("save-result");
  elements.shareResultBtn = document.getElementById("share-result");
  elements.toggleThemeBtn = document.getElementById("toggle-theme");

  
  showRandomTip();

  
  elements.newTipBtn.addEventListener("click", showRandomTip);
  elements.getAdviceBtn.addEventListener("click", handleSubmit);
  elements.resetBtn.addEventListener("click", resetQuiz);
  elements.saveResultBtn.addEventListener("click", saveLastResult);
  elements.shareResultBtn.addEventListener("click", copyResultToClipboard);
  elements.toggleThemeBtn.addEventListener("click", toggleTheme);

  
  const inputs = document.querySelectorAll("#quiz-form input[type='radio']");
  inputs.forEach(i => i.addEventListener("change", updateProgress));

  
  loadLastResult();

  
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
  });
});


function showRandomTip() {
  const idx = Math.floor(Math.random() * TIPS.length);
  elements.tipText.textContent = TIPS[idx];
}


function updateProgress() {
  const totalGroups = 6;
  const filled = [...document.querySelectorAll("#quiz-form fieldset")]
    .reduce((acc, fs) => {
      const chosen = fs.querySelector("input[type='radio']:checked");
      return acc + (chosen ? 1 : 0);
    }, 0);
  const percent = Math.round((filled / totalGroups) * 100);
  elements.progressBar.style.width = percent + "%";
}


function handleSubmit() {
  const form = document.getElementById("quiz-form");
  const formData = new FormData(form);

  
  const required = ["sleep","exercise","diet","water","stress","screens"];
  for (const q of required) {
    if (!formData.has(q)) {
      alert("Please answer all questions so we can provide personalized advice.");
      return;
    }
  }

  
  const scores = {
    sleep: Number(formData.get("sleep")),
    exercise: Number(formData.get("exercise")),
    diet: Number(formData.get("diet")),
    water: Number(formData.get("water")),
    stress: Number(formData.get("stress")),
    screens: Number(formData.get("screens"))
  };

  
  const totalScore = Object.values(scores).reduce((a,b) => a+b, 0);
  const maxScore = 2 + 3 + 2 + 3 + 3 + 3; // based on the options we provided
  const percent = Math.round((totalScore / maxScore) * 100);

  
  let summary, color;
  if (percent >= 75) { summary = "Great — you're maintaining healthy habits!"; color = "positive"; }
  else if (percent >= 50) { summary = "Good — a few areas for improvement."; color = "neutral"; }
  else { summary = "Needs attention — let's focus on small changes."; color = "attention"; }

  
  const perCategoryAdvice = [];
  
  if (scores.sleep <= 1) {
    perCategoryAdvice.push({
      title: "Sleep",
      text: "Your sleep looks insufficient. Try consistent bed/wake times, avoid caffeine after 3pm, reduce screen time 60 minutes before bed. Consider a 20-30 minute wind-down routine (reading, warm shower)."
    });
  } else {
    perCategoryAdvice.push({ title: "Sleep", text: "Sleep appears adequate. Keep consistent schedules and prioritize sleep on stressful days." });
  }

  
  if (scores.exercise <= 1) {
    perCategoryAdvice.push({
      title: "Movement",
      text: "Aim for short, frequent activity: 10–20 min walks, bodyweight circuits, or yoga. Start with 3 days/week and build gradually."
    });
  } else if (scores.exercise === 2) {
    perCategoryAdvice.push({
      title: "Movement",
      text: "You're moderately active — add one longer session or increase intensity for greater benefit (HIIT or strength)."
    });
  } else {
    perCategoryAdvice.push({ title: "Movement", text: "Excellent activity level! Focus on balanced recovery and mobility work." });
  }

  
  if (scores.diet === 0) {
    perCategoryAdvice.push({
      title: "Diet",
      text: "Shift toward whole foods: aim for vegetables at every meal, add legumes or lean protein, reduce ready-made fried items. Small swaps (brown rice, chapati with vegetables) go far."
    });
  } else {
    perCategoryAdvice.push({
      title: "Diet",
      text: "Your diet seems fairly balanced. Continue seasonal produce and reduce excess sugar/fried food when possible."
    });
  }

  
  if (scores.water <= 1) {
    perCategoryAdvice.push({
      title: "Hydration",
      text: "Increase water gradually — add a glass first thing, and sip throughout the day. Carry a bottle and set hourly reminders."
    });
  } else {
    perCategoryAdvice.push({ title: "Hydration", text: "Good hydration — adjust for heat or heavy activity." });
  }

  
  if (scores.stress <= 1) {
    perCategoryAdvice.push({
      title: "Stress",
      text: "High stress is common; try brief daily practices: 5–10 minutes breathing, a short walk, or a journaling prompt. If overwhelm is persistent, consider talking to a counselor."
    });
  } else {
    perCategoryAdvice.push({ title: "Stress", text: "Stress appears manageable. Keep using coping tools and check in weekly with yourself." });
  }

  
  if (scores.screens <= 1) {
    perCategoryAdvice.push({
      title: "Screen Time",
      text: "High screen time can affect sleep and focus. Introduce scheduled breaks (20/20/20 rule for eye strain) and dim screens in the evening."
    });
  } else {
    perCategoryAdvice.push({ title: "Screen Time", text: "Screen use is within a healthy range — keep habits that support sleep and posture." });
  }

  
  const microSteps = generateMicroSteps(scores);

  
  showResult({ totalScore, percent, summary, color, perCategoryAdvice, microSteps });

  
  const snapshot = { when: new Date().toISOString(), percent, summary, perCategoryAdvice, microSteps };
  localStorage.setItem("lastQuizSnapshot", JSON.stringify(snapshot));
}


function generateMicroSteps(scores) {
  // find lowest scored categories
  const entries = Object.entries(scores);
  entries.sort((a,b) => a[1] - b[1]);
  const steps = [];
  for (let i=0;i<3;i++){
    const [cat] = entries[i];
    if (cat === "sleep") steps.push("Create a fixed sleep/wake schedule — try going to bed 15 minutes earlier this week.");
    if (cat === "exercise") steps.push("Add a 10-minute walk after a meal on at least 3 days this week.");
    if (cat === "diet") steps.push("Add one extra serving of vegetables to today's lunch or dinner.");
    if (cat === "water") steps.push("Keep a water bottle visible and set two hourly refill reminders.");
    if (cat === "stress") steps.push("Try a 5-minute breathing practice (4–2–6) each morning.");
    if (cat === "screens") steps.push("Turn off non-essential notifications and set a 60-minute pre-bed screen curfew.");
  }
  
  return [...new Set(steps)].slice(0,3);
}


function showResult({ totalScore, percent, summary, color, perCategoryAdvice, microSteps }) {
  elements.quizResult.hidden = false;
  elements.scoreSummary.innerHTML = `<strong>${percent}%</strong> — ${summary}`;
  
  elements.detailedAdvice.innerHTML = "";

  perCategoryAdvice.forEach(item => {
    const el = document.createElement("div");
    el.className = "advice-item";
    el.innerHTML = `<strong>${escapeHtml(item.title)}</strong><div>${escapeHtml(item.text)}</div>`;
    elements.detailedAdvice.appendChild(el);
  });

  
  const planEl = document.createElement("div");
  planEl.className = "advice-item";
  planEl.innerHTML = `<strong>3 small actions to start</strong><ol>${microSteps.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ol>`;
  elements.detailedAdvice.appendChild(planEl);

  
  elements.quizResult.scrollIntoView({ behavior: "smooth", block: "center" });
}


function saveLastResult() {
  const last = localStorage.getItem("lastQuizSnapshot");
  if (!last) {
    alert("No result found to save. Please take the quiz first.");
    return;
  }
  
  alert("Result saved locally. You can retake the quiz anytime — the last snapshot is stored on this device.");
}

function copyResultToClipboard() {
  const last = localStorage.getItem("lastQuizSnapshot");
  if (!last) {
    alert("No result found to copy. Please take the quiz first.");
    return;
  }
  const snapshot = JSON.parse(last);
  const text = [
    `Wellness snapshot — ${new Date(snapshot.when).toLocaleString()}`,
    `Summary: ${snapshot.summary || "—"}`,
    `Score: ${snapshot.percent}%`,
    "Advises:",
    ...snapshot.perCategoryAdvice?.map(a => `${a.title}: ${a.text}`) || []
  ].join("\n\n");
  navigator.clipboard?.writeText(text).then(() => {
    alert("Advice copied to clipboard — you can paste it into notes or messages.");
  }, () => alert("Unable to copy — please allow clipboard permissions."));
}


function loadLastResult() {
  const raw = localStorage.getItem("lastQuizSnapshot");
  if (!raw) return;
  try {
    const snapshot = JSON.parse(raw);
    
    elements.quizResult.hidden = false;
    elements.scoreSummary.textContent = `${snapshot.percent}% — ${snapshot.summary}`;
    elements.detailedAdvice.innerHTML = `<div class="advice-item"><strong>Saved on</strong><div>${new Date(snapshot.when).toLocaleString()}</div></div>`;
  } catch (e) {
    console.warn("Failed to parse saved snapshot", e);
  }
}


function resetQuiz() {
  document.getElementById("quiz-form").reset();
  elements.progressBar.style.width = "0%";
  elements.quizResult.hidden = true;
  elements.detailedAdvice.innerHTML = "";
}


function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "" : "dark";
  root.setAttribute("data-theme", next);
  elements.toggleThemeBtn.setAttribute("aria-pressed", String(next === "dark"));
}


function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

