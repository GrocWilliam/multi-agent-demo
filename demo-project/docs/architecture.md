# Architecture

## État actuel
- Backend : Express + TypeScript (`src/app.ts`, `src/server.ts`)
- Stockage : en mémoire (`src/store.ts`), non persistant
- CORS ouvert, pas d'authentification
- Frontend : conçu (REQ-001, ADR-001 à ADR-009), dossier `frontend/` à créer

## Cible
React + TypeScript, Express + TypeScript, PostgreSQL, JWT.

## Structure des dossiers
```
/ (racine)            backend existant : src/, package.json, tsconfig.json (inchangés)
frontend/             SPA indépendante (package.json, tsconfig, vite.config.ts propres)
  index.html
  tailwind.config.ts  tokens du design system
  src/
    main.tsx          point d'entrée, <BrowserRouter>
    App.tsx           routes
    index.css         directives Tailwind, base (fond, focus, reduced-motion)
    copy.ts           libellés thématiques
    api/client.ts     fetch + parsing zod, erreurs typées
    api/schemas.ts    schémas zod + types inférés
    hooks/            useNotes, useNote (loading/success/error + retry)
    pages/            NotesListPage, NoteDetailPage, NotFoundPage
    components/ui/    composants de base (ADR-006)
```
Deux applications séparées (pas de workspaces : plus simple).

## Décisions (ADR)

### ADR-001 — Vite + React 18 + TypeScript (SPA)
Demande d'une SPA React. Vite (`@vitejs/plugin-react`), TS `strict`, rendu 100 % client, pas de SSR. Pas de store global ni de lib de data-fetching : hooks maison suffisants (2 écrans en lecture).

### ADR-002 — Routage : react-router-dom v6 (`BrowserRouter`)
| Route | Écran |
|---|---|
| `/` | Liste (US-03) |
| `/notes/:id` | Détail (US-04) |
| `*` | « Page introuvable » + lien vers `/` |
Rechargement d'une URL : Vite dev gère le fallback ; en prod le serveur statique doit renvoyer `index.html` pour toute route inconnue. Retour = `<Link to="/">`. Un `:id` inexistant → API 404 → écran « note introuvable » avec lien retour, distinct de l'erreur réseau.

### ADR-003 — Détail : `GET /notes/:id` ajouté au backend
Alternative écartée : retrouver la note dans la liste en mémoire (inopérant sur rechargement/lien direct, et ne distingue pas « introuvable »). Coût backend minime. Le détail est toujours chargé via l'API. Ids = entiers positifs ; autre valeur → 404.

### ADR-004 — Validation des réponses : zod
- `NoteSchema = z.object({ id: z.number().int(), title: z.string(), content: z.string() })`, `NotesSchema = z.array(NoteSchema)` ; types via `z.infer`.
- `client.ts` : toute réponse passe par `safeParse`. Erreurs typées : `NetworkError`, `NotFoundError` (404), `HttpError` (autre non 2xx), `InvalidResponseError` (JSON/schéma non conforme). L'UI mappe tout sauf `NotFoundError` sur un message générique sans détail technique + « Réessayer » (US-05). Un `ErrorBoundary` racine sert de filet.
- Contenu rendu en texte (jamais `dangerouslySetInnerHTML`), `whitespace-pre-wrap` dans le détail.

### ADR-005 — Aperçu des contenus longs (US-03)
La liste reçoit le contenu complet (volumétrie de démo, contrat inchangé). Aperçu côté client via `line-clamp-3` (Tailwind ≥ 3.3), sans troncature JS.

### ADR-006 — Tailwind CSS 3 + design system « space opera »
PostCSS + autoprefixer, aucune autre lib UI. Styles via tokens uniquement (pas d'hex en dur dans les composants). Thème sombre unique.

**Palette (`theme.extend.colors`)**
| Token | Hex | Usage |
|---|---|---|
| `void` | `#05060F` | fond de page |
| `nebula` | `#0E1030` | fond de section/dégradé |
| `hull` | `#161A3D` | surface des cartes |
| `hull-edge` | `#2A3070` | bordures |
| `starlight` | `#E8ECFF` | texte principal (≈ 16:1 sur `void`) |
| `stardust` | `#A9B1E0` | texte secondaire (≈ 8:1 sur `void`, ≥ 4.5:1 sur `hull`) |
| `plasma` | `#4DE1FF` | accent principal (liens, focus, titres) |
| `nova` | `#FF4FD8` | accent secondaire (survol) |
| `ember` | `#FFB547` | état vide / avertissement |
| `alert` | `#FF6B6B` | erreur |
Le texte de lecture n'utilise que `starlight`/`stardust` sur `void`/`nebula`/`hull` (WCAG AA ≥ 4.5:1). Les accents servent aux bordures, icônes, grands titres, liens (≥ 4.5:1 vérifié par le developer pour tout texte).

**Typographies** (auto-hébergées via `@fontsource`, pas de CDN) : `display` = Orbitron 700 (titres, logo) ; `sans` = Exo 2 400/600 (texte courant et contenu des notes). Fallback `system-ui`. `display` jamais utilisée pour le contenu long.

**Autres tokens** : `boxShadow.glow` / `glow-nova`, `borderRadius` md/xl, `backgroundImage.starfield` (dégradé radial `nebula`→`void`, sans image binaire), animations `twinkle`, `orbit` (spinner), `float-in`. Breakpoints par défaut, mobile-first (grille 1 col → `sm:2` → `lg:3`).

**Composants de base (`components/ui/`)** : `AppShell` (fond starfield, en-tête « Archives galactiques », `<main>`), `Card`, `Button`/`LinkButton` (primaire plasma, secondaire contour), `Spinner` (`role="status"`), `StatusMessage` (variantes `loading`, `empty`, `error`, `notFound` ; `role="alert"` pour `error`, `status` sinon ; action optionnelle), `NoteCard` (titre + aperçu, un seul `<Link>`), `ErrorBoundary`.

**Libellés thématiques** (dans `copy.ts`) : chargement « Balayage des archives… » ; vide « Aucune note dans cette galaxie » ; erreur « Liaison perdue avec la base stellaire » ; introuvable « Note introuvable : cap hors carte » ; réessayer « Relancer la transmission » ; retour « Retour à la liste ». Toujours compréhensibles, sans détail technique.

### ADR-007 — Accessibilité et `prefers-reduced-motion`
- Animations en `motion-safe:` et/ou neutralisées par `@media (prefers-reduced-motion: reduce)` dans `index.css` (animation/transition `none`). Le spinner reste compréhensible via un texte visible.
- Focus visible `plasma` (`focus-visible:ring-2`), navigation clavier complète, cibles ≥ 44 px.
- Un `<h1>` par page, `<main>`, `lang="fr"`, `document.title` par page, aucune info portée par la couleur seule.

### ADR-008 — URL d'API, CORS, proxy de dev
- Client : `import.meta.env.VITE_API_BASE_URL`, défaut `/api` ; `frontend/.env.example` fourni.
- **Dev** : proxy Vite `/api` → `http://localhost:3000` avec `rewrite` retirant `/api` (le backend n'a pas de préfixe). Même origine → pas de CORS. Port Vite 5173.
- **Prod** : reverse proxy même origine (recommandé), ou `VITE_API_BASE_URL` absolue figée au build, auquel cas le CORS backend doit autoriser l'origine.
- CORS backend : `cors()` ouvert suffit pour REQ-001 ; restriction (`CORS_ORIGIN`) à traiter avec JWT (backlog).
- Aucun secret côté frontend (`VITE_*` est public).

### ADR-009 — Outillage et tests
Scripts : `dev`, `build` (`tsc -b && vite build`), `preview`, `test` (vitest + Testing Library, jsdom). Tests attendus : schémas zod (valide/invalide), client (404, réseau, JSON invalide), états liste/détail (chargement, vide, erreur + réessayer, introuvable). Dépendances : react, react-dom, react-router-dom, zod ; dev : vite, @vitejs/plugin-react, typescript, tailwindcss@3, postcss, autoprefixer, vitest, @testing-library/*, @fontsource/orbitron, @fontsource/exo-2.

## Impact backend (developer)
- Ajouter `GET /notes/:id` (`getNote(id)` dans `store.ts`), 404 `{ "error": "note introuvable" }`. Rien d'autre.

## Historique
- Initial : état existant décrit
- REQ-001 : ADR-001 à ADR-009 (frontend, routage, `GET /notes/:id`, zod, Tailwind, design system, accessibilité, proxy/CORS)
