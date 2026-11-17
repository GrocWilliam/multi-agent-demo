# Revue de sécurité

| # | Constat | Sévérité | Recommandation | Statut |
|---|---|---|---|---|
| S-01 | `POST /notes` ne valide pas les types : `title`/`content` non-string (objet, nombre, tableau) sont acceptés et stockés (`src/app.ts`, `src/store.ts`). Une seule requête peut « empoisonner » `GET /notes` : le schéma zod du frontend (`title: z.string()`) rejette alors toute la liste → écran d'erreur pour tous les utilisateurs (déni de service applicatif). Aucune borne de longueur non plus (limite par défaut d'`express.json` : 100 ko). | Moyenne | Valider côté serveur (typeof string, `title` non vide après trim, longueurs max, ex. 200/10 000) → 400 `{error}` ; idéalement zod également côté API. | Ouvert |
| S-02 | CORS totalement ouvert : `app.use(cors())` (`src/app.ts`), documenté « inchangé » dans `api-contract.md`. Combiné à l'absence d'auth, tout site tiers peut lire/écrire les notes depuis le navigateur d'un visiteur. Inutile en dev (proxy Vite). | Moyenne | Restreindre `origin` à une liste blanche configurée par variable d'environnement (ex. origine du frontend déployé) ; désactiver CORS si le frontend est servi en même origine. | Ouvert |
| S-03 | Fuite d'infos dans les erreurs : aucun gestionnaire d'erreurs Express ; un corps JSON invalide sur `POST /notes` déclenche le handler par défaut qui renvoie la stack trace/chemins de fichiers tant que `NODE_ENV` ≠ `production` (`src/app.ts`, `src/server.ts`). Ne respecte pas non plus le format `{ "error": string }`. | Moyenne | Ajouter un middleware d'erreurs final renvoyant `{error:"requête invalide"}` (400) / `{error:"erreur interne"}` (500) sans détail ; définir `NODE_ENV=production` au déploiement. | Ouvert |
| S-04 | Aucun en-tête de sécurité : pas de `helmet`, `X-Powered-By: Express` exposé (`src/app.ts`) ; pas de CSP/`frame-ancestors` pour le frontend (`frontend/index.html`, `vite.config.ts` ne configure aucun header). | Faible | `app.disable("x-powered-by")` + `helmet()` côté API ; CSP stricte (`default-src 'self'`, `connect-src 'self'`, `font-src 'self'`, `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff` et `Referrer-Policy` au niveau du serveur/CDN qui sert `frontend/dist`. | Ouvert |
| S-05 | Pas de limitation de débit sur l'API (écriture anonyme, stockage en mémoire non borné → épuisement mémoire possible via `POST /notes`) (`src/store.ts`). | Faible | `express-rate-limit` sur `POST /notes`, plafond du nombre de notes ; acceptable pour une démo, à traiter avant toute exposition publique. | Ouvert |
| S-06 | `.gitignore` (racine et `frontend/`) n'ignore que `.env` : `.env.local`, `.env.*.local` (chargés par Vite) pourraient être commités. Seul `frontend/.env.example` existe (sans secret ; ne contient que `VITE_API_BASE_URL=/api`). | Faible | Ajouter `.env.*` et `!.env.example` aux deux `.gitignore`. | Ouvert |
| S-07 | `npm audit` non exécuté pendant cette revue (outil shell indisponible pour l'agent). Constat d'après les lockfiles : `frontend` → `vite 5.4.21` / `esbuild 0.21.5` (la série esbuild ≤ 0.24.2 est visée par un avis « dev server » de sévérité modérée, vecteur limité au serveur de dev) ; API → `express 4.x`, `body-parser`, `path-to-regexp`, `qs` à vérifier. | Faible (à confirmer) | Lancer `npm audit` (racine et `frontend/`) en CI ; mettre à jour vite ≥ 6 si l'avis est confirmé ; ne jamais exposer le serveur de dev (`vite`) hors localhost. | Ouvert |

## Points vérifiés sans constat (REQ-001)
- **XSS** : aucun `dangerouslySetInnerHTML`, `innerHTML`, `eval` ni `document.write` dans `frontend/src`. `title`/`content` sont rendus en nœuds texte React (échappés ; `whitespace-pre-wrap` n'interprète pas le HTML) dans `NoteDetailPage.tsx` et `NoteCard.tsx`. Titre de page via `useDocumentTitle` (texte). OK.
- **Validation zod** : `NoteSchema`/`NotesSchema` appliqués à toute réponse (`api/client.ts`) ; JSON invalide ou non conforme → erreur générique. `:id` encodé via `encodeURIComponent` ; lien `/notes/${note.id}` construit depuis un entier validé. OK.
- **`GET /notes/:id`** : regex `^[1-9]\d*$` + `isSafeInteger` → 404 uniforme, pas d'injection ni de prototype lookup (`src/store.ts`). OK.
- **Erreurs côté UI** : messages génériques (`copy.error`), aucun détail serveur affiché ; `ErrorBoundary` ne montre rien de technique (seul `console.error` en console navigateur). OK.
- **Polices / CDN** : `@fontsource/orbitron` et `@fontsource/exo-2` importés depuis `node_modules` et empaquetés dans `dist/assets/*.woff2` ; aucune URL `http(s)://` dans `frontend/src` ni `index.html`. OK.
- **Variables `VITE_`** : seule `VITE_API_BASE_URL` (publique, valeur `/api`), aucun secret exposé dans le bundle. OK.
- **Secrets / auth / JWT** : aucun secret dans le code ; pas d'auth ni de JWT dans le périmètre (API publique par conception, cf. contrat).

## Conclusion
Aucune sévérité Haute : pas de blocage pour REQ-001. Le frontend est sain (pas de vecteur XSS, validation zod, polices locales). Les risques résident dans l'API existante (non modifiée par REQ-001). Priorités :
1. S-01 (validation serveur de `POST /notes`) — impacte directement la disponibilité du frontend.
2. S-03 (handler d'erreurs sans stack trace) et S-02 (CORS en liste blanche).
3. S-07 (exécuter `npm audit`), puis S-04, S-06, S-05.

## Historique
- 2026-11-16 — REQ-001 : revue frontend + `GET /notes/:id` ; constats S-01 à S-07 ouverts, aucun Haut.
