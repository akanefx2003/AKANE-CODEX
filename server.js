// AKANE CODEX — serveur unique
// Sert l'application (PWA installable) ET protège la clé API Anthropic.
// Un seul déploiement Railway suffit pour tout.

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "www")));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;

if (!ANTHROPIC_API_KEY) {
  console.warn("⚠️  ANTHROPIC_API_KEY manquante. Ajoute-la dans les Variables Railway.");
}

app.post("/api/generate", async (req, res) => {
  const { prompt, language } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Le prompt est vide." });
  }

  const langInstruction =
    !language || language === "Auto-détection"
      ? "Choisis toi-même le langage le plus adapté à la demande."
      : `Le langage demandé est : ${language}.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `Tu es un générateur de code expert, capable d'écrire dans n'importe quel langage de programmation. ${langInstruction}

Demande de l'utilisateur : "${prompt}"

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, sans balises markdown, au format exact suivant :
{"language": "nom du langage utilisé", "filename": "nom_de_fichier.ext", "code": "le code complet, fonctionnel et commenté", "explanation": "explication courte en français (3-4 phrases max)"}

Le champ "code" doit contenir des retours à la ligne échappés en \\n comme dans du JSON valide. Le code doit être complet, propre, et directement exécutable.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || "Erreur API Anthropic" });
    }

    const raw = data?.content?.find((b) => b.type === "text")?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Échec de la génération côté serveur." });
  }
});

app.listen(PORT, () => console.log(`AKANE CODEX en écoute sur le port ${PORT}`));
