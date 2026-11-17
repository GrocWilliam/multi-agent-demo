# Plan de test

| ID | US | Scénario | Résultat attendu | Résultat | REQ |
|---|---|---|---|---|---|
| TA-01 | US-03 | Liste : l'API renvoie 2 notes, ouverture de `/` | 2 cartes, chacune avec son titre | Passé (vitest) | REQ-001 |
| TA-02 | US-03 | Liste : note au contenu très long (8000 car.) | Aperçu tronqué (`line-clamp-3`, `break-words`), liste lisible. Le rendu visuel réel de la troncature reste à vérifier manuellement (jsdom n'applique pas le CSS) | Passé (classes) / à vérifier manuellement (rendu) | REQ-001 |
| TA-03 | US-03 | Rechargement : remontage de l'app après ajout d'une note côté API | Nouvel appel API, liste à jour (3 notes). Rechargement navigateur réel (F5, y compris sur `/notes/1`) à vérifier manuellement | Passé (remontage) / à vérifier manuellement (F5) | REQ-001 |
| TA-04 | US-04 | Clic sur une note de la liste | Page détail avec titre (h1) et contenu complet (retours à la ligne conservés) | Passé (vitest) | REQ-001 |
| TA-05 | US-04 | Détail affiché, clic « Retour à la liste » | La liste est de nouveau affichée | Passé (vitest) | REQ-001 |
| TA-06 | US-04 | Erreur : `/notes/999` (API 404) | Message « note introuvable », lien retour fonctionnel, pas de bouton Réessayer | Passé (vitest) | REQ-001 |
| TA-07 | US-04 | Erreur : route inconnue `/nimportequoi` | Page « Page introuvable » avec lien vers `/` | Passé (vitest) | REQ-001 |
| TA-08 | US-04/05 | Erreur : détail avec API 500 puis Réessayer (API rétablie) | Message d'erreur générique (role=alert), puis note affichée, 2 appels | Passé (vitest) | REQ-001 |
| TA-09 | US-04 | Note au contenu vide | Texte de substitution « (Note sans contenu) » | Passé (vitest) | REQ-001 |
| TA-10 | US-05 | Récupération en cours (réponse différée) | Indicateur de chargement explicite, remplacé par la liste à l'arrivée | Passé (vitest) | REQ-001 |
| TA-11 | US-05 | API renvoie `[]` | Message « aucune note », pas d'alerte d'erreur | Passé (vitest) | REQ-001 |
| TA-12.1 | US-05 | Erreur : API HTTP 500 | Message d'erreur compréhensible, sans détail technique, pas de plantage | Passé (vitest) | REQ-001 |
| TA-12.2 | US-05 | Erreur : erreur réseau (fetch rejeté) | Idem | Passé (vitest) | REQ-001 |
| TA-12.3 | US-05 | Erreur : corps non JSON (HTML) | Idem | Passé (vitest) | REQ-001 |
| TA-12.4 | US-05 | Erreur : JSON non conforme au schéma zod | Idem (réponse invalide traitée comme erreur) | Passé (vitest) | REQ-001 |
| TA-12.5 | US-05 | Erreur : 404 sur la liste | Idem (erreur générique, pas « note introuvable ») | Passé (vitest) | REQ-001 |
| TA-13 | US-05 | Erreur puis clic Réessayer (API rétablie) | Nouvel appel, liste affichée, alerte disparue | Passé (vitest) | REQ-001 |
| TA-14 | US-05 | Erreur, Réessayer, nouvel échec | L'erreur reste affichée, pas de plantage | Passé (vitest) | REQ-001 |
| TA-15 | US-05 | Exception de rendu dans un composant | ErrorBoundary : message d'erreur sans détail, bouton Réessayer | Passé (vitest) | REQ-001 |
| TF-01 | US-05 | Schéma `Note` : note valide, `content` vide | Accepté | Passé (vitest) | REQ-001 |
| TF-02 | US-05 | Schéma `Note` : champ manquant, `id` string/décimal, `title` null | Rejeté | Passé (vitest) | REQ-001 |
| TF-03 | US-05 | Schéma `Notes` : `[]` / objet non tableau | `[]` accepté, objet rejeté | Passé (vitest) | REQ-001 |
| TF-04 | US-05 | Schéma `Notes` : un élément invalide | Rejeté en entier | Passé (vitest) | REQ-001 |
| TC-01 | US-03 | Client `fetchNotes` nominal | Notes validées, URL `/api/notes` | Passé (vitest) | REQ-001 |
| TC-02 | US-04 | Client `fetchNote` nominal, id `a/b` | Note retournée, id encodé (`a%2Fb`) | Passé (vitest) | REQ-001 |
| TC-03 | US-04 | Client : 404 | `NotFoundError` | Passé (vitest) | REQ-001 |
| TC-04 | US-05 | Client : 500 | `HttpError` | Passé (vitest) | REQ-001 |
| TC-05 | US-05 | Client : fetch rejeté | `NetworkError` | Passé (vitest) | REQ-001 |
| TC-06 | US-05 | Client : JSON invalide | `InvalidResponseError` | Passé (vitest) | REQ-001 |
| TC-07 | US-05 | Client : réponse non conforme (liste et détail) | `InvalidResponseError` | Passé (vitest) | REQ-001 |
| TC-08 | US-05 | Client : requête annulée (AbortError) | Propagée telle quelle | Passé (vitest) | REQ-001 |
| TC-09 | US-05 | Client : 404 sur la liste | `NotFoundError` (la page l'affiche comme erreur, cf. TA-12.5) | Passé (vitest) | REQ-001 |
| TB-01 | US-04 | Backend `GET /notes/1` | 200 + note complète | Passé (jest+supertest) ; vérifié aussi sur backend en cours (port 3000) | REQ-001 |
| TB-02 | US-04 | Backend `GET /notes/9999` | 404 `{error:"note introuvable"}` | Passé ; vérifié aussi sur port 3000 | REQ-001 |
| TB-03 | US-04 | Backend `GET /notes/:id` avec `abc`, `0`, `-1`, `1.5`, `01`, `1e3`, `%20`, entier hors plage sûre | 404 (pas 400/500) | Passé (8 cas) ; `abc` vérifié via proxy Vite 5173 | REQ-001 |
| TB-04 | US-04 | Backend : note créée via POST puis GET par id | 200 + même note | Passé | REQ-001 |
| TB-05 | US-01 | Backend `GET /notes` (non-régression) | 200, tableau de Note | Passé | REQ-001 |
| TB-06 | US-02 | Backend `POST /notes` sans titre (non-régression) | 400 `{error:"title requis"}` | Passé | REQ-001 |
| TV-01 | US-06 | Fond sombre évoquant l'espace, accents néon, typographie futuriste, sur les 5 écrans (liste, détail, chargement, vide, erreur) | Identité cohérente | À vérifier manuellement | REQ-001 |
| TV-02 | US-06 | Lisibilité/contraste du texte des titres et contenus | Contraste suffisant (ex. WCAG AA ≥ 4.5:1) | À vérifier manuellement | REQ-001 |
| TV-03 | US-06 | Petit écran (~360 px) et grand écran (≥1280 px) | Interface utilisable et cohérente (grille 1/2/3 colonnes) | À vérifier manuellement | REQ-001 |
| TV-04 | US-06 | Préférence système « réduire les animations » | Animations réduites/désactivées. Présent dans le code : `motion-safe:` + règle `prefers-reduced-motion` dans `index.css` ; effet réel à vérifier manuellement | À vérifier manuellement | REQ-001 |

Exécution : `cd frontend && npm test` (vitest, 32 tests, tous passés) ; racine : `npm test` (jest, 13 tests, tous passés). `tsc -b --noEmit` frontend : OK.

## Historique
- REQ-001 : ajout des scénarios US-03 à US-06 (TA/TF/TC frontend, TB backend, TV visuels manuels) ; tests dans `frontend/tests/` et `tests/`
