---
name: user-stories
description: Format des User Stories et des critères d'acceptation Given/When/Then (docs/requirements.md). À utiliser pour rédiger ou relire des exigences, ou écrire des scénarios de test traçables.
---

# User Stories

Dans `docs/requirements.md`, une story par section, numérotée `US-NN` (jamais renumérotée) :

```markdown
### US-03 — Créer une note
En tant qu'utilisateur connecté, je veux créer une note afin de mémoriser une information.
- **Given** je suis connecté **When** je soumets un titre et un contenu **Then** la note apparaît dans ma liste.
- **Given** un titre vide **When** je soumets **Then** une erreur de validation (400) est renvoyée.
**Statut** : À faire | En cours | Livrée (REQ-NNN)
```

Règles : pas de technologie dans une story ; 2 à 4 critères testables par story ; un critère = un scénario de test (le QA référence `US-NN`). Toujours inclure au moins un cas d'erreur.
