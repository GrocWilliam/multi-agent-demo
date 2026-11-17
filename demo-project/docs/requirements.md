# Exigences

Application de gestion de notes.

## US-01 — Lister les notes
En tant qu'utilisateur, je veux voir mes notes.
- Given des notes existent, When j'appelle la liste, Then je reçois toutes les notes.
- Statut : Fait

## US-02 — Créer une note
En tant qu'utilisateur, je veux créer une note avec un titre et un contenu.
- Given un titre valide, When je crée la note, Then elle est ajoutée et retournée.
- Given un titre manquant, When je crée la note, Then j'obtiens une erreur 400.
- Statut : Fait

## US-03 — Consulter la liste de mes notes dans une interface web (REQ-001)
En tant qu'utilisateur, je veux voir mes notes dans une application web, afin de les parcourir facilement.
- Given des notes existent, When j'ouvre l'application, Then je vois la liste de toutes mes notes, chacune avec son titre.
- Given la liste affichée, When une note a un contenu long, Then la liste n'en montre qu'un aperçu et reste lisible.
- Given l'application ouverte sur la liste, When je recharge la page, Then je retrouve la liste à jour.
- Statut : À faire

## US-04 — Consulter le détail d'une note (REQ-001)
En tant qu'utilisateur, je veux ouvrir une note pour lire son titre et son contenu complets.
- Given la liste affichée, When je sélectionne une note, Then je vois son titre et son contenu complet.
- Given le détail d'une note affiché, When je demande à revenir, Then je retrouve la liste.
- Given je demande une note qui n'existe pas (ex. lien obsolète), When la page s'affiche, Then je vois un message « note introuvable » avec un moyen de revenir à la liste.
- Statut : À faire

## US-05 — États de chargement, liste vide et erreur (REQ-001)
En tant qu'utilisateur, je veux être informé de ce qui se passe quand les notes ne sont pas affichables, afin de ne jamais rester devant un écran vide ou figé.
- Given les notes sont en cours de récupération, When j'attends, Then je vois un indicateur de chargement explicite.
- Given aucune note n'existe, When la récupération aboutit, Then je vois un message « aucune note » distinct d'une erreur.
- Given le service est indisponible ou répond de façon inattendue/invalide, When la récupération échoue, Then je vois un message d'erreur compréhensible, sans détail technique, et sans plantage de l'application.
- Given un message d'erreur affiché, When je demande de réessayer, Then la récupération est relancée.
- Statut : À faire

## US-06 — Identité visuelle « space opera » (REQ-001)
En tant qu'utilisateur, je veux une interface à l'ambiance space opera (cosmos, vaisseaux, épopée galactique), afin que la consultation de mes notes soit immersive.
- Given n'importe quel écran (liste, détail, chargement, vide, erreur), When il s'affiche, Then il respecte une identité visuelle cohérente : fond sombre évoquant l'espace, palette d'accents lumineux (type néons/étoiles), typographie au caractère futuriste, vocabulaire thématique optionnel pour les messages.
- Given l'identité visuelle appliquée, When je lis un titre ou un contenu de note, Then le texte reste lisible (contraste suffisant).
- Given un écran de petite ou grande taille, When j'utilise l'application, Then l'interface reste utilisable et cohérente.
- Given une préférence système de réduction des animations, When l'application affiche des effets animés, Then ceux-ci sont réduits ou désactivés.
- Statut : À faire

## Contraintes exprimées par le demandeur (REQ-001)
Le demandeur a cité : application React monopage (SPA), validation des réponses d'API avec zod, styles avec tailwind. Ce sont des préférences à instruire par l'architecte ; elles ne sont pas des critères d'acceptation fonctionnels. Seul l'effet attendu est exigé ici : une réponse d'API non conforme est traitée comme une erreur (US-05).

## Hors périmètre de REQ-001
Création, modification, suppression, recherche depuis l'interface (la création existe côté API, US-02).

## Backlog (non détaillé)
Authentification, modification, suppression, recherche, création de note depuis l'interface web, persistance PostgreSQL.

## Historique
- Initial : US-01, US-02 (existant)
- REQ-001 : ajout US-03 à US-06 (frontend de consultation des notes, états, identité space opera) ; « interface web » du backlog scindée : consultation = US-03..06, création via interface restant au backlog
