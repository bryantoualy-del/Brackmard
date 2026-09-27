# Brack Mard — Audit Companion V3

Date : 2026-09-27  
Source de vérité : fiche niveau 10 + grimoire Brack niveau 10, puis règles/table, puis ancien compagnon.

## Diagnostic

L'ancien compagnon avait déjà un bon moteur de combat (PyroMerlin, confirmation Touché/Raté, ressources, PV temporaires, journal, persistance), mais son interface restait structurée comme l'ancien modèle Brack : gros header centré, palette parchemin/feu, ressources avant la hiérarchie de tour et navigation peu proche de Silas.

La migration V3 ne doit donc pas jeter le moteur de combat utile ; elle doit remplacer son squelette visuel et corriger les écarts mécaniques.

## 1. À conserver

- PyroMerlin +11, 1d10+7 contondant + 2d8 feu.
- Deux attaques par action Attaquer.
- 5 dés de supériorité d10, DD 17.
- Manœuvres : Croc-en-jambe, Riposte, Attaque précise, Diversion, Instruction, Attaque menaçante, Attaque de poussée.
- Cogneur lourd, Sentinelle, Vigueur naine, Second souffle, Inflexible.
- Souffle de la forge : action, cône 9 m, DEX DD 16, 6d6 feu, moitié sur réussite, 1/jour.
- PV temporaires, repos, localStorage, journal, confirmation Touché/Raté, modes de jet auto/manuel.
- Undo atomique fourni par la couche Companion V3.
- Social, inventaire, notes et import/export JSON.

## 2. À supprimer / corriger

- Ancien header centré et esthétique parchemin/brun comme structure principale.
- Fougue traitée comme une action bonus : corrigée. Fougue n'utilise ni action ni action bonus et fournit une action supplémentaire.
- Limite artificielle « aura PyroMerlin 1 fois par tour » : retirée. Le bouton résout un déclenchement au début du tour d'un hostile au corps à corps.
- Critiques de réactions demandant encore Touché/Raté : corrigés ; 1 naturel = échec automatique, 20 naturel = critique automatique.
- Journal qui ne conservait que le total de certaines frappes : le détail des sources de dégâts est maintenant enregistré.
- Déblocage Cogneur lourd uniquement sur critique : ajout d'un déclencheur explicite « cible à 0 PV ».

## 3. À reconstruire

- Squelette visuel sur la grammaire Silas : identité à gauche, emblème propre, vitaux compacts, cartes denses, fond noir/charbon.
- Barre de tour sticky : Action, Bonus, Réaction, Mouvement, dégâts/soins entrants, concentration N/A, tour suivant.
- Combat prioritaire avec PyroMerlin en carte signature.
- Ressources compactes dans une grille claire au lieu d'un bandeau décoratif dominant.
- Navigation responsive et dock mobile pour Combat / Social / Inventaire / Journal.
- Résultat de jet en ruban bas non bloquant, hors de la zone sticky.
- Journal / Notes réunis dans un même espace avec deux sous-vues.

## 4. Mécaniques spécifiques V3

1. **PyroMerlin** : attaque guidée, dégâts séparés contondant/feu, critique automatique, Cogneur lourd.
2. **Maître de Guerre** : dés d10, DD 17, sept manœuvres, intégration directe aux attaques.
3. **Fougue** : vraie action supplémentaire indépendante de l'action bonus.
4. **Cogneur lourd** : mode -5/+10 + attaque bonus sur critique ou cible mise à 0 PV.
5. **Sentinelle / Riposte** : vraie économie de réaction et résolution d'attaque complète.
6. **Vigueur naine** : Esquiver + dé de vie + soin.
7. **PyroMerlin passif / souffle** : aura répétable par déclenchement et souffle quotidien.
8. **Observation de l'ennemi** : rappel dédié hors combat.

## 5. Architecture finale

- `index.html` : shell Silas-like, moteur combat Brack, état, ressources, attaques, repos, FX légers.
- `companion-v3.js` : Social, inventaire illustrable, journal/notes, import/export, mouvement, undo, disponibilité des actions.
- `companion-v3.css` : surfaces V3 communes au personnage, dock mobile, inventaire, social et journal.
- `localStorage` :
  - `brackmard-v2` pour le moteur de combat, conservé pour compatibilité.
  - espace V3 séparé pour inventaire/notes/PNJ/configuration.

## Inventaire initial aligné sur la fiche

- PyroMerlin.
- Armure de plate du Duergar.
- Ceinturon de force de géant des collines.
- Pôpa.
- Gorlock.

## Vérifications effectuées

- Compilation JavaScript des scripts inline : OK.
- Compilation `companion-v3.js` : OK.
- IDs HTML dupliqués : aucun.
- État initial / reload localStorage : OK.
- Fougue sans consommation Action/Bonus : OK.
- Repos court / long : OK.
- Second souffle : OK.
- Tour suivant : OK.
- PV temporaires absorbant les dégâts : OK.
- Soins plafonnés aux PV max : OK.
- Aura répétable : OK.
- Déblocage attaque bonus Cogneur lourd sur cible à 0 : OK.
- Attaque 1 naturel : OK.
- Attaque 20 naturel + critique + attaque bonus : OK.
- Réaction 1 naturel : OK.
- Riposte critique et consommation du dé : OK.
- Snapshot / restauration Undo : OK.
- Présence du Social enrichi, inventaire seedé, Journal mécanique / Notes de session : OK.

## Responsive

- Desktop : grille 12 colonnes et usage complet de la largeur.
- iPad : composition proche desktop, cartes adaptées en 6/12 colonnes.
- iPhone : header condensé, vitaux 3 colonnes, barre de tour horizontale scrollable, cartes empilées, navigation sticky + dock V3.
