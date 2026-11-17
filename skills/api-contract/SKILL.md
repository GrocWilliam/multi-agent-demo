---
name: api-contract
description: Format du contrat d'API (docs/api-contract.md) et procédure de détection d'incohérences entre contrat, backend et frontend. À utiliser pour définir, consommer ou vérifier des endpoints.
---

# Contrat d'API

Le contrat vit dans `docs/api-contract.md`, c'est la **source de vérité**. Une ligne par endpoint, format exact :

```markdown
| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| GET | `/notes` | JWT | Liste les notes de l'utilisateur (filtre `?q=`) |
| PUT | `/notes/:id` | JWT | Modifie une note |
```

Conventions : chemins en minuscules, ressources au pluriel, paramètres `:id`, codes d'erreur standard (400, 401, 404). Ajouter sous le tableau les corps de requête/réponse JSON des nouveaux endpoints.

## Procédure de vérification (reviewer)

1. Extraire les endpoints du **contrat** (`docs/api-contract.md`).
2. Extraire les routes **backend** : `app.use('/prefixe', xRouter)` + `router.get/post/put/delete('/sous-chemin')` + `app.get(...)`.
3. Extraire les appels **frontend** : `fetch(...)`, `axios.*`, client HTTP maison.
4. Comparer les trois ensembles (méthode + chemin normalisé, `:id` = paramètre).
5. Classer : manquant côté backend, manquant côté frontend, hors contrat, méthode différente.
6. Exemple : le frontend appelle `GET /notes`, le backend expose `GET /user-notes` → conflit ; correctif = aligner le code fautif sur le contrat (sauf si le contrat lui-même est faux : le signaler à l'architect).
