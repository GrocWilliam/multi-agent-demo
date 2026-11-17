# Démo multi-agents (Copilot CLI)

Uniquement des **agents** et des **skills** Copilot CLI, pas de code d'orchestration.
Vous parlez à l'agent `orchestrator`, qui délègue aux agents spécialisés. Le suivi se fait dans `docs/`.

```
agents/    orchestrator, product-owner, architect, developer, reviewer, qa-engineer, security-reviewer
skills/    project-docs, api-contract, user-stories, security-checklist
demo-project/   projet de départ (API Express minimale + docs/ de suivi)
```

## Installation (global)
```powershell
.\install.ps1            # copie dans ~/.copilot/agents et ~/.copilot/skills
.\install.ps1 -Uninstall
```

## Lancement
```powershell
cd demo-project
npm install
copilot --agent orchestrator
```
Sur un autre projet : copiez simplement le dossier `docs/` de `demo-project` à sa racine, puis lancez la même commande.

## Suivi
Chaque demande crée `docs/requests/REQ-NNN-*.md` (plan, tableau agent / lit / produit) et une ligne dans `docs/journal.md`. Voir [DEMO-SCRIPT.md](DEMO-SCRIPT.md).

## Limites
La délégation dépend du modèle et de la version du CLI : les agents sont appelés via l'outil `agent`. Les noms des agents sont affichés par l'orchestrateur à chaque étape.
