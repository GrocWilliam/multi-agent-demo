---
name: project-docs
description: Conventions de documentation et de suivi du projet (docs/, journal, fiches de demande REQ-xxx). À utiliser par tous les agents avant de lire ou écrire de la documentation, et par l'orchestrateur à chaque nouvelle demande.
---

# Suivi par la documentation

Tout le suivi du projet vit dans `docs/` à la racine du projet. La documentation est la **mémoire partagée** des agents : un agent ne connaît le travail des autres que par ces fichiers.

## Arborescence

```
docs/
  README.md           index + propriétaires des documents
  journal.md          une ligne par demande (REQ-xxx)
  requests/REQ-NNN-slug.md   fiche détaillée d'une demande
  requirements.md     user stories + critères d'acceptation   (propriétaire : product-owner)
  architecture.md     stack, structure, décisions (ADR)       (propriétaire : architect)
  api-contract.md     contrat d'API, source de vérité         (propriétaire : architect)
  test-plan.md        scénarios de test + résultats           (propriétaire : qa-engineer)
  security-review.md  constats de sécurité                    (propriétaire : security-reviewer)
  integration-review.md  incohérences détectées/corrigées     (propriétaire : reviewer)
```

Règles :
- Un agent ne modifie que **son** document (le developer modifie le code, pas la doc des autres). Pour demander un changement ailleurs, il le signale dans sa réponse.
- Mettre à jour un document existant (section « Historique » en bas : `- REQ-NNN (date) : changement`), ne jamais le réécrire de zéro.
- Dates au format `AAAA-MM-JJ`. Rédiger en français.

## Format de réponse OBLIGATOIRE d'un sous-agent

L'orchestrateur s'en sert pour alimenter la fiche de demande :

```
AGENT: <nom>
LU: <documents/fichiers lus, séparés par des virgules>
PRODUIT: <documents/fichiers créés ou modifiés>
RÉSUMÉ: <2-4 lignes>
POINTS D'ATTENTION: <incohérences, questions, risques ; "aucun" sinon>
```

## Fiche de demande `docs/requests/REQ-NNN-slug.md` (créée par l'orchestrateur)

```markdown
# REQ-NNN — <titre>
- **Date** : AAAA-MM-JJ
- **Statut** : En cours | Terminée | Bloquée
- **Demande utilisateur** : <texte repris tel quel>

## Plan
1. <agent> — <objectif>

## Échanges entre agents
| # | Agent | Lit | Produit | Résumé |
|---|---|---|---|---|

## Décisions et points d'attention
- ...

## Résultat
<ce qui a changé, fichiers touchés, comment vérifier>
```

## Journal `docs/journal.md`

Tableau : `| REQ | Date | Demande | Agents | Statut | Fiche |`. Ajouter une ligne à la création de la demande, mettre à jour le statut à la fin. Le numéro suivant = dernier numéro + 1 (3 chiffres).
