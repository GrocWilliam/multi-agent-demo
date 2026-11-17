---
name: security-checklist
description: Check-list de revue de sécurité (OWASP Top 10, JWT, CORS, secrets) et format de docs/security-review.md. À utiliser pour auditer du code ou une architecture, ou pour écrire du code sensible (auth, secrets).
---

# Check-list sécurité

| Domaine | Points à vérifier |
|---|---|
| A01 Contrôle d'accès | Chaque route protégée ; données filtrées par l'utilisateur du jeton (pas d'accès inter-utilisateurs) |
| A02 Crypto | Mots de passe hachés (bcrypt/argon2), jamais en clair ni dans les logs |
| A03 Injection | Requêtes SQL paramétrées, entrées validées |
| A05 Configuration | `helmet`, messages d'erreur sans détails internes, pas de mode debug |
| A07 Authentification | Limitation des tentatives de login, politique de mot de passe |
| JWT | Algorithme fixé (HS256/RS256) à la vérification, expiration courte, secret fort lu depuis l'environnement, pas de données sensibles dans le payload |
| CORS | Origines explicites (jamais `*` avec credentials), méthodes limitées |
| Secrets | Aucun secret en dur ni versionné ; `.env` ignoré par git ; `.env.example` fourni |

## Format de `docs/security-review.md`

```markdown
| # | Domaine | Constat | Sévérité (Faible/Moyenne/Haute) | Recommandation | Statut |
|---|---|---|---|---|---|
```
Un constat = fichier/ligne concerné si possible. Statuts : Ouvert, Corrigé (REQ-NNN), Accepté. Terminer par une conclusion de 2 lignes (priorités). Ne jamais recopier de secret dans la documentation.
