/* Annexes : introductions des parties, examen final, mémo, glossaire, ressources */
(function () {
  const X = Course.extras;

  X.parts = {
    olap: 'Huit notions pour passer de « c\'est quoi un cube ? » à l\'écriture de requêtes analytiques avec sous-totaux, rangs et comparaisons N-1. Chaque notion se termine par 5 exercices corrigés.',
    apex: 'Huit notions pour construire des applications Oracle APEX : pages, rapports, formulaires, logique PL/SQL, Dynamic Actions et sécurité. La dernière notion assemble tout dans un tableau de bord OLAP complet.'
  };

  X.exam = [
    {
      q: '[OLAP] Que désigne le <strong>grain</strong> d\'une table de faits ?',
      options: ['Le nombre de dimensions', 'Ce que représente exactement une ligne de la table', 'La taille de la table en Go', 'Le niveau le plus agrégé de la hiérarchie temps'],
      answer: 1,
      explain: 'Le grain est la définition d\'une ligne de faits (« une ligne = un article sur un ticket »). C\'est la décision la plus importante de la modélisation (notion OLAP 3).'
    },
    {
      q: '[OLAP] Le stock est de 40 unités chaque jour de la semaine. Quelle valeur afficher pour « stock de la semaine » ?',
      options: ['280 (somme des 7 jours)', '40 (valeur de fin de période ou moyenne)', '5,7 (280 / 49)', 'On ne peut rien afficher'],
      answer: 1,
      explain: 'Le stock est <strong>semi-additif</strong> : il se somme entre produits ou magasins, mais pas sur le temps. On prend la dernière valeur (ou la moyenne) de la période (notion OLAP 6).'
    },
    {
      q: '[OLAP] Combien de regroupements produit <code>GROUP BY CUBE(annee, region, categorie)</code> ?',
      options: ['3', '4', '6', '8'],
      answer: 3,
      explain: 'CUBE sur n colonnes produit toutes les combinaisons : 2³ = <strong>8</strong>. ROLLUP en produirait n + 1 = 4 (notion OLAP 8).'
    },
    {
      q: '[OLAP] Un client (SCD 2) a déménagé de Lyon à Nantes en juin. Une vente de mars est chargée en retard, en juillet. Quelle clé client utiliser ?',
      options: ['La clé de la version courante (Nantes)', 'La clé de la version valide à la date de la vente (Lyon)', 'La clé naturelle du client', 'La clé -1 « Inconnu »'],
      answer: 1,
      explain: 'On cherche la version dont la période de validité contient la <strong>date de la vente</strong> : <code>date_vente BETWEEN date_debut AND date_fin</code>. La vente de mars reste rattachée à Lyon (notion OLAP 6).'
    },
    {
      q: '[OLAP] Quelle table de faits choisir pour suivre chaque commande à travers ses étapes (commandée, expédiée, livrée) ?',
      options: ['Transactionnelle', 'Snapshot périodique', 'Snapshot cumulatif', 'Factless'],
      answer: 2,
      explain: 'Le <strong>snapshot cumulatif</strong> a une ligne par commande, mise à jour à chaque étape, avec une date par jalon et des délais calculés (notion OLAP 3).'
    },
    {
      q: '[OLAP] Pourquoi Kimball recommande-t-il l\'étoile plutôt que le flocon par défaut ?',
      options: ['Parce que le flocon ne supporte pas les hiérarchies', 'Pour des requêtes plus simples et plus rapides, au prix d\'une redondance négligeable dans les dimensions', 'Parce que l\'étoile n\'a pas de clés étrangères', 'Parce que le flocon interdit les dimensions conformes'],
      answer: 1,
      explain: 'Une jointure par dimension, un modèle lisible par les métiers, des optimisations dédiées. La redondance reste faible car les dimensions sont petites face aux faits (notion OLAP 4).'
    },
    {
      q: '[APEX] Où s\'exécute le code PL/SQL d\'un processus APEX ?',
      options: ['Dans le navigateur', 'Dans ORDS', 'Dans la base de données Oracle', 'Sur un serveur Node.js'],
      answer: 2,
      explain: 'Le moteur APEX et votre code PL/SQL s\'exécutent dans la base. ORDS ne fait que relayer les requêtes HTTP (notion APEX 1).'
    },
    {
      q: '[APEX] Quelle écriture utiliser dans la requête SQL d\'un rapport pour filtrer sur l\'item P4_ANNEE ?',
      options: ['<code>WHERE annee = &amp;P4_ANNEE.</code>', '<code>WHERE annee = :P4_ANNEE</code>', '<code>WHERE annee = #P4_ANNEE#</code>', '<code>WHERE annee = $v(\'P4_ANNEE\')</code>'],
      answer: 1,
      explain: 'Variable de liaison <code>:P4_ANNEE</code> : sûre et performante. La substitution <code>&amp;…</code> dans le SQL ouvre la porte à l\'injection (notions APEX 4 et 7).'
    },
    {
      q: '[APEX] À la soumission, une validation échoue. Que se passe-t-il ?',
      options: ['Les processus s\'exécutent quand même', 'Les processus et branches ne s\'exécutent pas ; la page se réaffiche avec le message', 'La session est fermée', 'Les données sont enregistrées puis annulées'],
      answer: 1,
      explain: 'Ordre : After Submit → Validations → Processus → Branches. Une validation en échec interrompt la suite (notion APEX 5).'
    },
    {
      q: '[APEX + OLAP] Dans un Interactive Report, quelle action permet à l\'utilisateur d\'afficher les trimestres en colonnes et les régions en lignes ?',
      options: ['Highlight', 'Control Break', 'Pivot', 'Flashback'],
      answer: 2,
      explain: 'Le <strong>Pivot</strong> de l\'IR transforme les valeurs d\'une colonne (trimestres) en colonnes, avec une agrégation : c\'est l\'opération OLAP du même nom (notion APEX 3).'
    },
    {
      q: '[APEX] Une action « Execute Server-side Code » calcule un total dans <code>:P1_TOTAL</code>. Comment l\'afficher dans la page sans la recharger ?',
      options: ['Ajouter P1_TOTAL dans Items to Return', 'Ajouter P1_TOTAL dans Page Items to Submit', 'Utiliser &amp;P1_TOTAL. dans le PL/SQL', 'Cocher Fire on Initialization'],
      answer: 0,
      explain: '<b>Items to Return</b> renvoie les valeurs modifiées par le PL/SQL vers le navigateur (notion APEX 6).'
    },
    {
      q: '[APEX + OLAP] Un manager clique sur une barre « Occitanie » et arrive sur la liste des tickets de la région. Quelle opération OLAP a-t-il réalisée ?',
      options: ['Roll-up', 'Pivot', 'Drill-through', 'Dice'],
      answer: 2,
      explain: 'Passer d\'un agrégat aux lignes de détail qui le composent est un <strong>drill-through</strong>. S\'il était arrivé sur le CA par magasin de la région, ce serait un drill-down (notions OLAP 5 et APEX 8).'
    }
  ];

  X.memo = `
    <section class="part-olap">
      <h4>OLAP : sous-totaux</h4>
      ${H.code('sql', `
        GROUP BY ROLLUP(a, b)        -- (a,b) (a) ()        n+1 niveaux
        GROUP BY CUBE(a, b)          -- (a,b) (a) (b) ()    2^n niveaux
        GROUP BY GROUPING SETS((a), (b), ())
        GROUPING(a)        -- 1 si a est agrégée sur la ligne
        GROUPING_ID(a, b)  -- 0 détail, 1 total de a, 3 total général
      `)}
      <h4>OLAP : fonctions de fenêtrage</h4>
      ${H.code('sql', `
        RANK()       OVER (PARTITION BY cat ORDER BY ca DESC)
        SUM(ca)      OVER (PARTITION BY annee ORDER BY mois
                           ROWS UNBOUNDED PRECEDING)         -- cumul
        AVG(ca)      OVER (ORDER BY mois
                           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
        LAG(ca)      OVER (PARTITION BY mois ORDER BY annee) -- N-1
        RATIO_TO_REPORT(ca) OVER (PARTITION BY region)       -- part
      `)}
      <h4>OLAP : règles d'agrégation</h4>
      ${H.tbl(['Mesure', 'Agrégation'], [
        ['Additive (CA, qté)', '<code>SUM</code> partout'],
        ['Semi-additive (stock)', 'Pas de SUM sur le temps'],
        ['Ratio (taux de marge)', '<code>SUM(num) / SUM(den)</code>'],
        ['Distinct (clients)', 'Recalculer <code>COUNT(DISTINCT)</code>']
      ])}
      <h4>OLAP : opérations</h4>
      ${H.tbl(['Opération', 'SQL'], [
        ['Slice / dice', '<code>WHERE</code> (= / <code>IN</code>)'],
        ['Roll-up / drill-down', '<code>GROUP BY</code> niveau + haut / + bas'],
        ['Pivot', '<code>PIVOT (SUM(x) FOR col IN (…))</code>'],
        ['Drill-through', '<code>SELECT</code> détail du fait filtré']
      ])}
    </section>
    <section class="part-apex">
      <h4>APEX : référencer un item</h4>
      ${H.tbl(['Contexte', 'Syntaxe'], [
        ['SQL, PL/SQL de page', '<code>:P1_ITEM</code>'],
        ['HTML, titres, URL', '<code>&amp;P1_ITEM.</code> (<code>!HTML</code>, <code>!ATTR</code>, <code>!JS</code>)'],
        ['Package PL/SQL', '<code>V(\'P1_ITEM\')</code>, <code>NV(…)</code>'],
        ['Colonne de rapport', '<code>#COLONNE#</code>'],
        ['JavaScript', '<code>$v(\'P1_ITEM\')</code>, <code>$s(\'P1_ITEM\', v)</code>'],
        ['Graphique (lien)', '<code>&amp;LABEL.</code>, <code>&amp;VALUE.</code>']
      ])}
      <h4>APEX : API JavaScript</h4>
      ${H.code('js', `
        apex.item('P1_ANNEE').getValue();
        apex.item('P1_ANNEE').setValue('2025');
        apex.region('chart_ca').refresh();
        apex.message.showPageSuccess('Enregistré');
        apex.server.process('MON_CALLBACK', { x01: 'a' }, { dataType: 'json' })
          .done(function (d) { console.log(d); });
        apex.page.submit('SAVE');
      `)}
      <h4>APEX : cycle de vie</h4>
      ${H.tbl(['Phase', 'Ordre'], [
        ['Affichage', 'Before Header → régions → After Footer'],
        ['Soumission', 'After Submit → Validations → Processus → Branches']
      ])}
      <h4>APEX : réflexes</h4>
      ${H.tbl(['Symptôme', 'Remède'], [
        ['Région pas à jour', 'Page Items to Submit + DA Refresh'],
        ['Valeur PL/SQL non affichée', 'Items to Return'],
        ['Show/Hide incohérent au chargement', 'Fire on Initialization'],
        ['URL modifiable', 'Session State Protection + checksum'],
        ['Code dupliqué', 'Package PL/SQL, LOV partagée']
      ])}
    </section>
  `;

  X.glossary = [
    { term: 'OLAP', part: 'olap', def: 'Online Analytical Processing : analyse rapide et multidimensionnelle de grands volumes de données historiques.' },
    { term: 'OLTP', part: 'olap', def: 'Online Transaction Processing : traitement des transactions du quotidien (commandes, paiements), optimisé pour l\'écriture.' },
    { term: 'Data warehouse', part: 'olap', def: 'Entrepôt de données orienté sujet, intégré, historisé et non volatil, alimenté par les sources pour la décision.' },
    { term: 'Datamart', part: 'olap', def: 'Sous-ensemble de l\'entrepôt consacré à un métier (ventes, RH, finance).' },
    { term: 'ETL / ELT', part: 'olap', def: 'Extract, Transform, Load : chaîne d\'alimentation. En ELT, les transformations se font dans la base cible après chargement.' },
    { term: 'Staging', part: 'olap', def: 'Zone tampon où l\'on dépose les données extraites avant transformation.' },
    { term: 'Fait', part: 'olap', def: 'Table centrale contenant les mesures d\'un processus métier et les clés vers les dimensions.' },
    { term: 'Dimension', part: 'olap', def: 'Axe d\'analyse (temps, produit, client) portant des attributs descriptifs pour filtrer et regrouper.' },
    { term: 'Mesure', part: 'olap', def: 'Valeur numérique agrégeable (CA, quantité, marge).' },
    { term: 'Grain', part: 'olap', def: 'Niveau de détail d\'une ligne de faits. À déclarer avant de choisir dimensions et mesures.' },
    { term: 'Clé de substitution', part: 'olap', def: 'Surrogate key : identifiant technique entier d\'une ligne de dimension, indépendant des sources.' },
    { term: 'Clé naturelle', part: 'olap', def: 'Identifiant métier venant de la source (code produit, numéro client).' },
    { term: 'Schéma en étoile', part: 'olap', def: 'Fait central relié directement à des dimensions dénormalisées.' },
    { term: 'Schéma en flocon', part: 'olap', def: 'Variante de l\'étoile où les dimensions sont normalisées en plusieurs tables.' },
    { term: 'Constellation', part: 'olap', def: 'Plusieurs tables de faits partageant des dimensions conformes.' },
    { term: 'Dimension conforme', part: 'olap', def: 'Dimension strictement identique partagée par plusieurs faits, permettant le drill-across.' },
    { term: 'Dimension dégénérée', part: 'olap', def: 'Identifiant (n° de ticket) stocké directement dans le fait, sans table de dimension.' },
    { term: 'Hiérarchie', part: 'olap', def: 'Organisation des niveaux d\'une dimension (jour → mois → année) qui permet roll-up et drill-down.' },
    { term: 'Cube', part: 'olap', def: 'Représentation des mesures croisées par plusieurs dimensions ; chaque cellule est un agrégat.' },
    { term: 'Slice', part: 'olap', def: 'Fixer une valeur sur une dimension pour extraire une tranche du cube.' },
    { term: 'Dice', part: 'olap', def: 'Restreindre plusieurs dimensions à des sous-ensembles pour obtenir un sous-cube.' },
    { term: 'Roll-up', part: 'olap', def: 'Agréger en montant dans une hiérarchie (mois → trimestre).' },
    { term: 'Drill-down', part: 'olap', def: 'Détailler en descendant dans une hiérarchie (année → mois).' },
    { term: 'Drill-through', part: 'olap', def: 'Afficher les lignes de détail qui composent une cellule agrégée.' },
    { term: 'Drill-across', part: 'olap', def: 'Comparer des mesures de plusieurs faits sur des dimensions conformes.' },
    { term: 'Pivot', part: 'olap', def: 'Échanger les axes affichés d\'un tableau croisé.' },
    { term: 'Mesure semi-additive', part: 'olap', def: 'Mesure qu\'on peut sommer sauf sur certaines dimensions, en général le temps (stock, solde).' },
    { term: 'SCD', part: 'olap', def: 'Slowly Changing Dimension : stratégie de gestion des changements d\'attributs (type 1 écrase, type 2 versionne, type 3 garde la valeur précédente).' },
    { term: 'MOLAP / ROLAP / HOLAP', part: 'olap', def: 'Stockage multidimensionnel précalculé, relationnel interrogé en SQL, ou hybride.' },
    { term: 'Vue matérialisée', part: 'olap', def: 'Résultat de requête stocké physiquement ; avec query rewrite, l\'optimiseur l\'utilise automatiquement.' },
    { term: 'ROLLUP / CUBE', part: 'olap', def: 'Extensions du GROUP BY produisant des sous-totaux hiérarchiques (n+1) ou toutes les combinaisons (2^n).' },
    { term: 'Fonction analytique', part: 'olap', def: 'Fonction avec OVER() qui calcule par ligne sur une fenêtre de lignes : rang, cumul, LAG, part du total.' },
    { term: 'APEX', part: 'apex', def: 'Oracle Application Express : plateforme low-code incluse dans la base Oracle pour créer des applications web.' },
    { term: 'ORDS', part: 'apex', def: 'Oracle REST Data Services : serveur web Java entre le navigateur et la base ; sert aussi les API REST.' },
    { term: 'Workspace', part: 'apex', def: 'Espace de travail APEX isolé, associé à un ou plusieurs schémas, contenant utilisateurs et applications.' },
    { term: 'Page Designer', part: 'apex', def: 'Éditeur principal d\'une page : arborescence, layout et propriétés.' },
    { term: 'Région', part: 'apex', def: 'Bloc de contenu d\'une page : rapport, formulaire, graphique, cartes, HTML…' },
    { term: 'Item', part: 'apex', def: 'Champ portant une valeur, nommé P<page>_<NOM> pour un item de page.' },
    { term: 'Session state', part: 'apex', def: 'Valeurs des items conservées côté serveur pour la session de l\'utilisateur.' },
    { term: 'LOV', part: 'apex', def: 'List of Values : liste de couples valeur affichée / valeur retournée, statique ou issue d\'une requête.' },
    { term: 'Shared Components', part: 'apex', def: 'Composants réutilisables de l\'application : LOV, menus, sécurité, fichiers statiques, templates…' },
    { term: 'Interactive Report', part: 'apex', def: 'Rapport exploré par l\'utilisateur : filtres, ruptures, agrégats, Group By, Pivot, export, rapports sauvegardés.' },
    { term: 'Interactive Grid', part: 'apex', def: 'Grille éditable type tableur avec enregistrement automatique des modifications.' },
    { term: 'Dynamic Action', part: 'apex', def: 'Comportement déclaratif côté navigateur : événement, condition, actions vraies et fausses.' },
    { term: 'Ajax Callback', part: 'apex', def: 'Processus PL/SQL appelé en JavaScript par apex.server.process, sans rechargement de page.' },
    { term: 'Validation', part: 'apex', def: 'Contrôle exécuté à la soumission avant les processus ; en cas d\'échec, la page se réaffiche avec un message.' },
    { term: 'Processus', part: 'apex', def: 'Code serveur exécuté à un point du cycle de vie (DML automatique, PL/SQL, e-mail…).' },
    { term: 'Branche', part: 'apex', def: 'Redirection effectuée après le traitement de la page.' },
    { term: 'Authentication Scheme', part: 'apex', def: 'Méthode d\'identification des utilisateurs (comptes APEX, LDAP, SSO, OAuth2…).' },
    { term: 'Authorization Scheme', part: 'apex', def: 'Règle nommée vrai/faux qui conditionne l\'accès à une page, une région, un bouton, un processus.' },
    { term: 'Session State Protection', part: 'apex', def: 'Protection par somme de contrôle des valeurs d\'items passées dans les URL.' },
    { term: 'Universal Theme', part: 'apex', def: 'Thème standard responsive d\'APEX, personnalisable via Theme Roller et Template Options.' },
    { term: 'Supporting Objects', part: 'apex', def: 'Scripts d\'installation joints à l\'export d\'une application (tables, données, packages).' }
  ];

  X.resources = [
    { title: 'Documentation Oracle APEX', url: 'https://docs.oracle.com/en/database/oracle/apex/', desc: 'Guides officiels : App Builder, API PL/SQL, API JavaScript.' },
    { title: 'apex.oracle.com', url: 'https://apex.oracle.com/', desc: 'Demander un workspace gratuit pour pratiquer.' },
    { title: 'Universal Theme', url: 'https://apex.oracle.com/ut', desc: 'Application de référence : templates, composants et classes CSS utilitaires.' },
    { title: 'Oracle Cloud Free Tier', url: 'https://www.oracle.com/cloud/free/', desc: 'Base Autonomous « Always Free » avec APEX préinstallé.' },
    { title: 'Oracle Live SQL', url: 'https://livesql.oracle.com/', desc: 'Exécuter du SQL Oracle dans le navigateur pour s\'entraîner aux requêtes analytiques.' },
    { title: 'Oracle Data Warehousing Guide', url: 'https://docs.oracle.com/en/database/oracle/oracle-database/19/dwhsg/', desc: 'Vues matérialisées, dimensions, ROLLUP/CUBE, fonctions analytiques, partitionnement.' },
    { title: 'Kimball : techniques de modélisation', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/', desc: 'Le catalogue des techniques dimensionnelles (grain, SCD, types de faits…).' },
    { title: 'The Data Warehouse Toolkit', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/', desc: 'Kimball & Ross, la référence de la modélisation dimensionnelle.' }
  ];
})();
