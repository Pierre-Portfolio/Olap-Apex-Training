# OLAP & APEX Training

Formation autonome en français pour passer de **débutant à intermédiaire** sur :

1. **OLAP** et la modélisation décisionnelle (50 %) : entrepôt de données, schémas en étoile, cube, hiérarchies, SCD, SQL analytique Oracle ;
2. **Oracle APEX** (50 %) : pages, rapports, formulaires, logique PL/SQL, Dynamic Actions, sécurité, puis un tableau de bord OLAP complet.

Tout tient dans une page web statique : ouvrez `index.html` dans un navigateur, sans installation ni serveur.

## Contenu

| Partie | Notions | Exercices |
| --- | --- | --- |
| OLAP | 1. OLTP vs OLAP · 2. Entrepôt & ETL · 3. Faits, dimensions, grain · 4. Étoile, flocon, constellation · 5. Le cube et ses opérations (avec laboratoire interactif) · 6. Hiérarchies, additivité, SCD · 7. MOLAP/ROLAP, vues matérialisées, partitionnement · 8. SQL analytique (ROLLUP, CUBE, GROUPING SETS, fonctions de fenêtrage) | 40 |
| APEX | 1. Architecture & environnement · 2. Première application · 3. Rapports & graphiques · 4. Formulaires & session state · 5. Logique serveur & PL/SQL · 6. Dynamic Actions & JavaScript · 7. Sécurité · 8. Projet fil rouge : dashboard OLAP et déploiement | 40 |

Chaque notion contient :

- des **objectifs**, un **cours détaillé** avec schémas, tableaux et exemples SQL / PL/SQL / JavaScript réels ;
- un encadré **À retenir** ;
- **5 exercices** : 3 QCM corrigés automatiquement (avec explication) et 2 questions ouvertes (zone de réponse, correction détaillée, points clés attendus, auto-évaluation).

En annexe : **examen final** (12 questions mêlant les deux parties), **mémo express**, **glossaire** filtrable (53 termes) et **ressources**.

La progression (réponses, scores, textes saisis) est enregistrée dans le `localStorage` du navigateur. Le bouton « Réinitialiser ma progression » du sommaire l'efface.

## Projet fil rouge

`sql/fil_rouge_ventes.sql` crée dans votre schéma une étoile de ventes réaliste (enseigne de cycles : 12 magasins, 4 régions, 24 produits, environ 60 000 lignes de faits de 2023 à aujourd'hui), des tables applicatives et une vue pour les rapports interactifs. Il sert aux exercices de la partie OLAP et au projet APEX.

Pour l'exécuter : APEX > **SQL Workshop > SQL Scripts > Upload**, puis **Run** (ou SQL Developer / SQLcl). Le script peut être relancé : il supprime puis recrée ses propres objets.

Un workspace APEX gratuit s'obtient sur [apex.oracle.com](https://apex.oracle.com/) ou via l'offre Always Free d'Oracle Cloud.

## Structure

```
index.html                  Page principale (en-tête, accueil, sommaire)
assets/css/style.css        Thème clair / sombre, mise en page responsive
assets/js/core.js           Registre des notions, coloration SQL/JS, helpers
assets/js/notions/*.js      Une notion par fichier (cours + 5 exercices)
assets/js/extras.js         Examen final, mémo, glossaire, ressources
assets/js/app.js            Rendu, exercices, progression, thème, navigation
sql/fil_rouge_ventes.sql    Jeu de données du projet fil rouge
```

Ajouter une notion : créer un fichier dans `assets/js/notions/` qui appelle `Course.add({...})` (voir un fichier existant pour le format), puis l'inclure dans `index.html` avant `extras.js`.

## Publier en ligne

Le site est 100 % statique : il peut être servi tel quel par GitHub Pages (Settings > Pages > branche `main`, dossier racine).
