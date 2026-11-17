# Revue d'intégration

| # | Écart | Contrat | Backend | Frontend | Correctif | Statut |
|---|---|---|---|---|---|---|
| – | Aucun écart bloquant (REQ-001) | – | – | – | – | OK |
| 1 | Mineur, non bloquant : `request()` mappe tout 404 en `NotFoundError`, y compris `GET /notes` (le contrat ne prévoit le 404 que pour `/notes/:id`) | 404 seulement sur `/notes/:id` | `/notes` ne renvoie jamais 404 | `client.ts` (request, test `res.status === 404`) ; `NotesListPage.tsx:16` traite `notFound` comme erreur générique → comportement final conforme | Aucun requis ; optionnel : ne lever `NotFoundError` que pour `fetchNote` | Info |
| 2 | Mineur : le schéma zod `id: z.number().int()` accepte 0/négatifs, le contrat dit « entier » (cohérent) ; le backend ne génère que des ids ≥ 1 | `id` entier | `store.ts` nextId ≥ 3 | `schemas.ts:5` | Aucun | Info |

Vérifications effectuées (tout conforme) :
- Routes : GET /notes, GET /notes/:id, POST /notes présentes dans `src/app.ts` ; le frontend n'appelle que les deux GET (`client.ts` fetchNotes/fetchNote). POST non consommé : normal.
- 404 `{ "error": "note introuvable" }` : `app.ts` ; `getNote` (`store.ts`) renvoie undefined pour non numérique, 0, négatif, décimal (`/^[1-9]\d*$/`) et entier non sûr → 404, pas de 400. Conforme.
- POST : 201 / 400 `{ "error": "title requis" }`, content défaut `""`. Conforme.
- Schéma `Note` (id int, title, content string) identique entre `store.ts`, contrat et `schemas.ts` ; `NotesSchema` = tableau (`[]` accepté).
- Proxy : `vite.config.ts` `/api` → `http://localhost:3000`, préfixe retiré ; `BASE_URL` par défaut `/api`. Conforme à ADR-008. CORS ouvert inchangé.
- Erreurs frontend : 404 détail → `notFound` (écran « introuvable ») ; autre non-2xx, réseau, JSON invalide, schéma non conforme → `error` + « Réessayer » (`useAsync.ts`, `NoteDetailPage.tsx`). Conforme US-04/US-05. `encodeURIComponent(id)` sur l'id ; AbortError propagé sans écran d'erreur.
- Limite : le contrat décrit des erreurs `{error}` mais le frontend n'en lit pas le corps (suffisant). Pas d'exécution réelle du proxy/serveur : vérification statique uniquement.

## Historique
- REQ-001 : revue initiale contrat / backend / frontend ; aucun conflit, 2 remarques informatives.
