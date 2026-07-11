# AKANE CODEX — Version installable, sans PC

Tout se fait depuis ton téléphone, exactement comme tu déploies AKANE MD.

---

## Étape 1 — Mettre le projet sur GitHub

1. Ouvre l'app **GitHub** (ou github.com) sur ton téléphone.
2. Crée un nouveau repo, par exemple `akane-codex`.
3. Upload tous les fichiers de ce dossier dedans (bouton "Add file" → "Upload files").

## Étape 2 — Déployer sur Railway

1. Ouvre Railway sur ton téléphone (railway.app).
2. **New Project** → **Deploy from GitHub repo** → choisis `akane-codex`.
3. Va dans l'onglet **Variables** et ajoute :
   ```
   ANTHROPIC_API_KEY = ta clé API Anthropic
   ```
4. Railway installe et lance tout seul (comme pour AKANE MD).
5. Une fois déployé, va dans **Settings** → **Networking** → **Generate Domain**. Tu obtiens un lien du genre :
   ```
   https://akane-codex-production.up.railway.app
   ```

## Étape 3 — Installer l'app (toi et tout le monde)

1. Ouvre ce lien dans Chrome (Android).
2. Un bouton **"📲 Installer AKANE CODEX"** apparaît en bas de l'écran — appuie dessus.
3. Ou sinon, menu ⋮ du navigateur → **"Ajouter à l'écran d'accueil"**.
4. Une icône AKANE CODEX apparaît sur le téléphone, comme une vraie app.

C'est tout. Partage juste le lien à qui tu veux — chacun installe sur son propre téléphone en 2 secondes, sans store, sans fichier à transférer.

---

## Pourquoi pas un vrai .apk ?

Un .apk demande de compiler avec Android Studio (PC obligatoire). Cette version PWA fait exactement la même chose — icône sur l'écran d'accueil, plein écran, marche hors ligne pour l'interface — mais s'installe d'un lien, sans rien compiler.
