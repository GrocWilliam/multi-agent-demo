# Contrat d'API

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| GET | /notes | Aucune | Liste des notes → 200, tableau de `Note` (éventuellement `[]`) |
| GET | /notes/:id | Aucune | Détail d'une note → 200 `Note`, 404 si inconnue ou `:id` non entier positif |
| POST | /notes | Aucune | Crée une note `{title, content}` → 201 `Note`, 400 si title manquant |

Base : `http://localhost:3000`. Le frontend y accède via `/api` (proxy de dev, préfixe retiré ; architecture ADR-008). JSON partout. Erreurs : `{ "error": string }`.

## Schémas

`Note` (validé côté frontend par zod, champs requis) :
```json
{ "id": 1, "title": "Bienvenue", "content": "Première note de démonstration" }
```
`id` entier, `title` string, `content` string (peut être vide, longueur non bornée).

### GET /notes
200 :
```json
[
  { "id": 1, "title": "Bienvenue", "content": "Première note de démonstration" },
  { "id": 2, "title": "Courses", "content": "Pain, lait, café" }
]
```
Contenu complet inclus ; l'aperçu est géré par le frontend.

### GET /notes/:id (nouveau, REQ-001 / US-04)
200 : un objet `Note`. 404 :
```json
{ "error": "note introuvable" }
```
Un `:id` non numérique, nul, négatif ou décimal renvoie aussi 404 (pas de 400).

### POST /notes
Requête :
```json
{ "title": "Titre", "content": "optionnel, défaut \"\"" }
```
201 : la `Note` créée. 400 :
```json
{ "error": "title requis" }
```

## Traitement des erreurs côté frontend
- 404 sur `GET /notes/:id` → écran « note introuvable » (US-04).
- Autre statut non 2xx, erreur réseau, JSON invalide ou réponse non conforme au schéma → écran d'erreur générique avec « Réessayer » (US-05).

## CORS
`cors()` ouvert, inchangé. Le proxy de dev rend le CORS inutile en dev.

## Historique
- Initial : endpoints existants
- REQ-001 : ajout `GET /notes/:id` (US-04), schéma `Note`, conventions d'erreur et d'accès frontend
