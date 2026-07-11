// Pas besoin d'URL externe : l'app et l'API sont sur le même serveur.
const API_URL = "";

const LANGUAGES = [
  "Auto-détection", "JavaScript", "TypeScript", "Python", "Java", "C++", "C#",
  "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "SQL", "Bash", "HTML/CSS"
];

const promptInput = document.getElementById("promptInput");
const langSelect = document.getElementById("langSelect");
const generateBtn = document.getElementById("generateBtn");
const errorBox = document.getElementById("errorBox");
const resultBox = document.getElementById("resultBox");
const emptyState = document.getElementById("emptyState");
const resultFilename = document.getElementById("resultFilename");
const resultLang = document.getElementById("resultLang");
const codeOutput = document.getElementById("codeOutput");
const explanationBox = document.getElementById("explanationBox");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const historyBtn = document.getElementById("historyBtn");
const historyCount = document.getElementById("historyCount");
const historyDrawer = document.getElementById("historyDrawer");
const closeHistory = document.getElementById("closeHistory");
const historyList = document.getElementById("historyList");
const installBtn = document.getElementById("installBtn");

let currentResult = null;
let history = JSON.parse(localStorage.getItem("akaneCodexHistory") || "[]");
let deferredPrompt = null;

LANGUAGES.forEach((l) => {
  const opt = document.createElement("option");
  opt.value = l;
  opt.textContent = l;
  langSelect.appendChild(opt);
});

renderHistoryCount();

generateBtn.addEventListener("click", generate);
copyBtn.addEventListener("click", copyCode);
downloadBtn.addEventListener("click", downloadCode);
historyBtn.addEventListener("click", () => {
  renderHistoryList();
  historyDrawer.classList.remove("hidden");
});
closeHistory.addEventListener("click", () => historyDrawer.classList.add("hidden"));

// --- Installation PWA (Android / Chrome) ---
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add("hidden");
});
window.addEventListener("appinstalled", () => installBtn.classList.add("hidden"));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

async function generate() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  generateBtn.disabled = true;
  generateBtn.textContent = "GÉNÉRATION...";
  errorBox.classList.add("hidden");
  resultBox.classList.add("hidden");

  try {
    const res = await fetch(`${API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, language: langSelect.value }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur inconnue");

    currentResult = data;
    showResult(data);

    history.unshift({ ...data, prompt, id: Date.now() });
    history = history.slice(0, 20);
    localStorage.setItem("akaneCodexHistory", JSON.stringify(history));
    renderHistoryCount();
  } catch (err) {
    errorBox.textContent = "Échec de la génération. Vérifie ta connexion ou réessaie. (" + err.message + ")";
    errorBox.classList.remove("hidden");
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "GÉNÉRER ▸";
  }
}

function showResult(data) {
  emptyState.classList.add("hidden");
  resultBox.classList.remove("hidden");
  resultFilename.textContent = data.filename || "code.txt";
  resultLang.textContent = "— " + (data.language || "");
  codeOutput.textContent = data.code || "";
  explanationBox.textContent = data.explanation || "";
}

function copyCode() {
  if (!currentResult) return;
  navigator.clipboard.writeText(currentResult.code).then(() => {
    copyBtn.textContent = "✓ Copié";
    setTimeout(() => (copyBtn.textContent = "📋 Copier"), 1500);
  });
}

function downloadCode() {
  if (!currentResult) return;
  const blob = new Blob([currentResult.code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = currentResult.filename || "code.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function renderHistoryCount() {
  historyCount.textContent = history.length > 0 ? `(${history.length})` : "";
}

function renderHistoryList() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = `<div class="empty-history">Aucune génération pour l'instant.</div>`;
    return;
  }
  history.forEach((h) => {
    const btn = document.createElement("button");
    btn.className = "history-item";
    btn.innerHTML = `
      <div class="h-lang">${h.language} · ${h.filename}</div>
      <div class="h-prompt">${h.prompt}</div>
    `;
    btn.addEventListener("click", () => {
      currentResult = h;
      promptInput.value = h.prompt;
      showResult(h);
      historyDrawer.classList.add("hidden");
    });
    historyList.appendChild(btn);
  });
}
