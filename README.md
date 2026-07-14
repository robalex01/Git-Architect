# Git Architect

Logiciel de bureau (Electron) permettant de concevoir et gérer un dépôt Git visuellement.

> **Note licence :** le projet est fourni sous **LICENCE** (fichier `LICENCE` inclus avec l’archive/exe). Toute redistribution doit conserver la licence et les mentions de copyright, et respecter les interdictions indiquées.

---

## Objectif
- Graph interactif (React Flow)
- Drag & Drop (prévu) → modifications réelles sur le système de fichiers
- Synchronisation Git (simple-git)
- Monaco Editor intégré (prévu)
- Synchronisation temps réel via watcher (prévu)
- Historique commits/branches (prévu)

---

## Statut (MVP)
- Ouverture / clonage de dépôt
- Arborescence réelle affichée dans le graphe
- Statut Git
- Commit (avec push automatique)
- Pull et Fetch

---

## Fonctionnalités UI ajoutées
- **Légende** du graphe (dossier / fichier)
- **Outils de vue** : Fit + Zoom
- **Recherche** dans l’arbre
- **Panneau latéral** : affichage du fichier sélectionné (le rendu du contenu peut évoluer selon les prochaines étapes)

---

## Développement

### Pré-requis
- Node.js (version compatible avec `package.json`)
- Git installé (pour `simple-git`)

### Lancer en mode dev
```bash
npm run start
```

### Build
```bash
npm run build
```

### Créé le .exe
```bash
npm run make
```


---

## Liens
- Dépôt GitHub : `robalex01` (voir `LICENCE` / mentions de contact)
- Discord : voir `LICENCE`

---

## Licence
Le projet est distribué sous la **licence incluse dans le fichier `LICENCE`**.
Pour les conditions exactes (droits, interdictions, redistribution), consultez `LICENCE`.

