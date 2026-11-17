# REQ-001 — Frontend d'affichage des notes
- **Date** : 2026-11-16
- **Statut** : Terminée
- **Demande utilisateur** : Je veux un frontend pour afficher mes notes. Il doit etre fait avec react en SPA. Utilise zod pour valider les api. Utilise tailwind pour le css. Defini un design system evoquant un space opera

## Plan
1. product-owner — user stories d'affichage des notes
2. architect — architecture frontend (React SPA, zod, Tailwind, design system space opera), contrat d'API
3. developer — implémentation
4. reviewer — cohérence contrat / backend / frontend
5. qa-engineer — scénarios et tests
6. security-reviewer — revue (CORS, validation, XSS)

## Échanges entre agents
| # | Agent | Lit | Produit | Résumé |
|---|---|---|---|---|
| 1 | product-owner | docs/ | requirements.md | US-03 à US-06 |
| 2 | architect | requirements, architecture, api-contract | architecture.md, api-contract.md | ADR-001..009, ajout GET /notes/:id |
| 3 | developer | docs/ | src/, frontend/, README.md | Backend GET /notes/:id + SPA React/zod/Tailwind ; builds et curl OK |
| 4 | reviewer | contrat, src, frontend | integration-review.md | Aucun conflit |
| 5 | qa-engineer | requirements, code | test-plan.md, tests frontend (vitest 32/32) et backend (jest 13/13) | Aucun écart ; US-06 à vérifier manuellement |
| 6 | security-reviewer | code | security-review.md | S-01..S-07, aucun bloquant |

## Décisions et points d'attention
- Contraintes : React SPA, zod pour valider les réponses d'API, Tailwind, design system « space opera ».
- Détail d'une note : ajout de GET /notes/:id au contrat.
- Non vérifié : rendu visuel en navigateur (US-06) et `npm audit` (S-07).
- Constats sécurité à traiter dans une prochaine demande : S-01 (validation POST /notes), S-02 (CORS), S-03 (gestion d'erreurs).

## Résultat
Terminée. SPA dans `frontend/` (Vite, React, react-router, zod, Tailwind, design system space opera), backend étendu avec `GET /notes/:id`. Lancement : `npm run dev` à la racine (API :3000), puis `npm run dev` dans `frontend/` (:5173). Tests : `npm test` à la racine et dans `frontend/`.
