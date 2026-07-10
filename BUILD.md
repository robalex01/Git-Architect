# Générer le .exe — Git Architect

Ce projet ne peut pas être compilé depuis un environnement sans accès réseau
(il faut télécharger les dépendances npm et les binaires Electron). Voici la
marche à suivre **sur ta machine**, avec Node.js installé (version 18+ recommandée).

## 1. Installer les dépendances

```bash
npm install
```

## 2. Générer l'icône (déjà fait dans ce livrable, à relancer seulement si tu changes le logo)

```bash
npm run icon
```

## 3. Tester en mode développement (optionnel)

```bash
npm run dev
```

## 4. Construire le .exe (Windows)

```bash
npm run make
```

Le résultat se trouve dans `out/make/squirrel.windows/x64/` :
- un installeur `GitArchitectSetup.exe`
- et un `.zip` portable de l'app.

> Important : pour produire un vrai `.exe` Windows, lance `npm run make` **sur une
> machine Windows** (ou via CI Windows). electron-builder/Forge peuvent packager
> pour Windows depuis Linux/macOS dans certains cas (maker-zip fonctionne partout),
> mais le maker Squirrel (installeur .exe) est le plus fiable exécuté directement sous Windows.

## Ce qui a été corrigé dans le code récupéré sur GitHub

- `package.json` : le champ `main` pointait vers un chemin qui n'existait jamais
  (`dist-electron/...` au lieu de `electron/dist-electron/...`) → l'app ne
  démarrait pas du tout une fois compilée.
- Dépendances Electron Forge manquantes (`@electron-forge/cli` et les *makers*
  n'étaient pas installés, seul un vieux paquet `electron-forge` v5, incompatible
  avec le format de config utilisé) → `npm run make` aurait échoué.
- Le fichier de config Forge s'appelait `electronforge.config.js` : Electron
  Forge ne le détecte que sous le nom `forge.config.js` → il était ignoré
  silencieusement. Renommé + nettoyé (des clés inventées comme `mainProcess`
  et `electronVersion` n'existent pas dans l'API de Forge).
- `electron/tsconfig.json` compilait en `module: "preserve"` (ESM), incompatible
  avec `__dirname` et le chargement CommonJS par défaut d'Electron → remis en
  `CommonJS`.
- Le pont `contextBridge` du preload était un faux : il modifiait
  `globalThis.window` au lieu d'utiliser `contextBridge.exposeInMainWorld` réel
  d'Electron. Avec `contextIsolation: true` (activé), ça ne faisait strictement
  rien côté renderer → corrigé pour utiliser la vraie API Electron.
- Deux fichiers `vite.config.ts` contradictoires (racine et `renderer/`),
  aucun ne produisait la sortie attendue par `electron/main/index.ts`
  (`renderer/dist/index.html`), et aucun n'avait `base: './'` → en production,
  l'app chargée en `file://` n'aurait trouvé ni la page ni ses assets (chemins
  absolus cassés). Unifié en un seul fichier cohérent.
- `App.tsx` importait `Background` depuis `@reactflow/background`, un paquet
  jamais installé (et qui n'existe plus pour la v11 de reactflow) → corrigé
  pour importer depuis `reactflow` directement, plus l'import CSS manquant
  `reactflow/dist/style.css` (sans quoi le graphe s'affiche sans style).
- `main.tsx` utilisait `BrowserRouter`, qui repose sur l'API History du
  navigateur — incompatible avec le chargement `file://` de l'app packagée →
  remplacé par `HashRouter`.
- `scripts/generate-ico.js` tentait d'écrire un `.ico` avec `sharp` (qui ne
  supporte pas ce format en sortie), échouait silencieusement et **copiait un
  PNG renommé en `.ico`** — exactement le fichier cassé retrouvé dans le repo
  (`file` confirmait que c'était un PNG, pas un vrai .ico). Réécrit pour
  utiliser `png-to-ico` (déjà présent en dépendance mais jamais utilisé), et
  un vrai `.ico` multi-résolution a été régénéré à partir de
  `Git Architect.png`.
- `tsconfig.json` racine référençait un dossier `src/` inexistant (le vrai
  code est dans `renderer/src`) → chemins corrigés.
- Dépendances en doublon/obsolètes supprimées : `react-flow-renderer` (ancien
  nom de `reactflow`), `electron-prebuilt-compile` (paquet abandonné, issu de
  l'ancien Electron Forge v4), `@tailwindcss/postcss` (plugin Tailwind v4 en
  conflit avec `tailwindcss` v3 réellement utilisé dans `postcss.config.js`).

## Point rencontré lors de ton premier build : scripts npm bloqués

Ton gestionnaire npm bloque par défaut les scripts d'installation
(`allow-scripts`). `electron-winstaller` (utilisé par le maker Squirrel pour
produire l'installeur `.exe`) a besoin d'exécuter son script d'installation
pour récupérer le bon binaire 7-Zip. Si Forge te redit
`the maker declared that it cannot run on win32`, relance :

```powershell
npm approve-scripts electron-winstaller
npm rebuild
npm run make
```

En attendant, `npx electron-forge make --targets=@electron-forge/maker-zip`
produit un `.exe` directement utilisable (sans installeur).

## Nouvelles fonctionnalités Git réelles (cette itération)

- **Ouvrir un dossier** : sélectionne un dossier existant (dépôt Git ou non).
- **Cloner** : demande une URL + un dossier de destination, clone réellement
  via `simple-git`.
- **git init** : bouton affiché si le dossier ouvert n'est pas encore un dépôt.
- **Statut** : branche courante + nombre de fichiers modifiés affichés dans la
  barre d'outils.
- **Graphe réel** : l'arborescence du dépôt (dossiers/fichiers, hors
  `.git`, `node_modules`, `dist*`) est lue et affichée dans le graphe
  ReactFlow (profondeur limitée à 6, 5000 entrées max — à faire évoluer pour
  la virtualisation demandée dans le prompt d'origine sur les très gros
  dépôts).
- **Commit** : fenêtre titre + description → `git add -A` + `git commit`,
  puis **push automatique** (conforme à ton prompt d'origine). Si le push
  échoue (pas de remote, pas de réseau...), le commit reste fait et l'erreur
  est affichée clairement, pas masquée.
- **Fetch / Pull** : boutons dans la barre d'outils.
- **Erreurs Git** : affichées dans un bandeau rouge en haut du graphe,
  lisibles, avec fermeture manuelle ou automatique après quelques secondes.

Fichiers ajoutés/modifiés : `electron/main/git.ts` (toute la logique Git côté
processus principal), `renderer/src/lib/api.ts` (pont vers le preload),
`renderer/src/state/repoStore.ts` (état Zustand), `renderer/src/components/
Toolbar.tsx` et `CommitDialog.tsx`, `App.tsx` (rendu du graphe réel).

## Ce qui manque encore par rapport à ton prompt d'origine

- Drag & drop réel de fichiers (créer/déplacer/renommer/supprimer depuis le
  graphe, import de fichiers/dossiers externes)
- Éditeur Monaco intégré (double-clic sur un fichier)
- Watcher temps réel (détection des changements faits par VS Code / un autre
  dev / un pull)
- Vue historique graphique des commits/branches (les données sont déjà
  récupérées via `api.log`, il reste à les afficher)
- Vue architecture/dépendances (imports entre fichiers TS/JS)
- Sauvegarde de la disposition dans `.gitarchitect/layout.json`
- Virtualisation pour les dépôts de plus de 100 000 fichiers

Dis-moi par quoi tu veux continuer.
