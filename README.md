# Référentiel TAAZOUR — site

Trois pages :

- `index.html` — Vue décideurs (indicateurs clés, graphiques, points d'attention)
- `referentiel.html` — Détail opérationnel (tableau filtrable, carte)
- `saisie.html` — Formulaire de saisie en ligne, réservé aux comptes des programmes
  (voir `supabase/INSTRUCTIONS.md`)

**Deux façons d'alimenter la base, utilisables en parallèle :**
1. Le classeur `Base_Referentiel_TAAZOUR.xlsx` (saisie Excel classique ou via son
   formulaire intégré) — comme avant.
2. Le formulaire en ligne `saisie.html`, une fois Supabase configuré (voir
   `supabase/INSTRUCTIONS.md`) — les comptes des programmes ajoutent directement
   des interventions et des photos, sans passer par Excel.

Tant que Supabase n'est pas configuré (`config.js` vide), le site fonctionne
en mode lecture seule à partir de `data.js`, généré depuis le classeur Excel —
exactement comme avant. Une fois Supabase configuré, `index.html` et
`referentiel.html` affichent les données live de la base en ligne (saisies
par le formulaire ou importées depuis Excel), et basculent automatiquement
sur `data.js` si la base en ligne est temporairement injoignable.

## Déployer sur Netlify

**Option la plus simple (glisser-déposer) :**
1. Allez sur https://app.netlify.com/drop
2. Glissez le dossier `netlify_site` (celui qui contient `index.html`) dans la zone de dépôt
3. Netlify donne immédiatement une URL publique (ex. `https://nom-aleatoire.netlify.app`)
4. Vous pouvez renommer le site et, plus tard, y attacher un nom de domaine depuis le tableau de bord Netlify

Aucune configuration de build n'est requise sur Netlify (c'est un site
statique) ; la seule configuration à faire est celle de Supabase si vous
voulez activer la saisie en ligne — voir `supabase/INSTRUCTIONS.md`.

## Formulaire en ligne (saisie.html)

Pour activer la saisie en ligne avec comptes utilisateurs, suivez
`supabase/INSTRUCTIONS.md` (création d'un projet Supabase gratuit, exécution
du script `supabase/schema.sql`, remplissage de `config.js`, création des
comptes). Cette étape ne se fait qu'une seule fois.

## Comment les programmes alimentent la base (classeur Excel)

`Base_Referentiel_TAAZOUR.xlsx` contient un vrai Tableau Excel (`Interventions`).
Chaque programme peut y ajouter une ligne :
- soit en tapant directement sous l'en-tête,
- soit avec le formulaire de saisie intégré d'Excel ("Formulaire", voir l'onglet
  Instructions du classeur) — pratique quand plusieurs personnes saisissent des
  lignes au fil de l'eau, car il ne touche jamais aux formules ni aux autres lignes.

Le tableau de bord (feuille "Tableau de bord") se recalcule automatiquement,
quel que soit le nombre de lignes.

## Photos

La colonne "Photos" du classeur accepte un ou plusieurs noms de fichiers séparés
par des virgules (ex. `kiffa_internat_1.jpg, kiffa_internat_2.jpg`), ou un lien
web direct vers une photo déjà en ligne (`https://...`).

Pour que les photos nommées par fichier s'affichent sur le site :
1. Envoyez-moi les fichiers image en même temps que le classeur Excel mis à jour.
2. Je les place dans `assets/photos/` (même nom exact que dans la colonne Photos).
3. Les photos apparaissent en miniatures dans la fiche de l'intervention
   correspondante sur le site, avec un clic pour les agrandir.

Les liens `https://...` fonctionnent directement, sans fichier à envoyer.

## Mettre à jour les données

**Si Supabase n'est pas encore configuré** (mode Excel seul) : quand le
classeur est mis à jour, renvoyez-le-moi (et les photos éventuelles) ; je
régénère `data.js` et vous re-glissez le dossier sur Netlify.

**Une fois Supabase configuré** : les interventions saisies via `saisie.html`
apparaissent immédiatement sur le site, sans rien redéployer. Pour les
programmes qui continuent à saisir dans Excel, de temps en temps : renvoyez-moi
le classeur, je lance `xlsx_build/export_to_supabase_csv.py` pour produire un
CSV, puis je l'importe dans la table `interventions` depuis le Tableau de bord
Supabase (Table Editor > Insert > Import data from CSV) — les deux sources
alimentent alors la même base, visible sur `index.html` et `referentiel.html`.

Netlify garde un historique des déploiements : en cas d'erreur, vous pouvez
revenir en un clic à la version précédente.
