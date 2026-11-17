# Script de démo

Lancer `copilot --agent orchestrator` dans `demo-project/`. Entre chaque demande, ouvrir `docs/journal.md` et la fiche REQ.

1. « Ajoute l'authentification JWT (inscription, connexion) et protège les routes de notes. »
   → product-owner, architect, developer, qa-engineer, security-reviewer
2. « Ajoute la modification, la suppression et la recherche de notes. »
   → product-owner, architect, developer, qa-engineer
3. « Ajoute un frontend React + TypeScript qui consomme l'API. »
   → architect, developer
4. **Conflit** : dire « Renomme la route GET /notes en GET /user-notes dans le backend uniquement » (développeur seul), puis :
   « Vérifie la cohérence entre le contrat, le backend et le frontend et corrige. »
   → reviewer détecte l'écart, developer corrige, reviewer revérifie
5. « Fais une revue de sécurité complète. » → security-reviewer
6. « Fais le point sur l'avancement. » → lecture du journal uniquement
