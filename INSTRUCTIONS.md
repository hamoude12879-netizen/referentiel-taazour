# Mettre en place la base en ligne (Supabase) — une seule fois

Cette étape connecte le site à une vraie base de données avec comptes
utilisateurs, pour que les équipes puissent ajouter des interventions et des
photos directement en ligne, en plus (ou à la place) du classeur Excel.

## 1. Créer le projet Supabase (gratuit)

1. Allez sur https://supabase.com et créez un compte (gratuit, pas de carte
   bancaire nécessaire pour le niveau gratuit).
2. Cliquez « New project ». Donnez-lui un nom (ex. `taazour-referentiel`),
   choisissez un mot de passe de base de données (notez-le quelque part de
   sûr — vous n'en aurez normalement plus besoin après cette étape) et une
   région proche (Europe de préférence pour la Mauritanie).
3. Attendez 1 à 2 minutes que le projet soit prêt.

## 2. Créer les tables et les règles de sécurité

1. Dans le menu de gauche du projet Supabase, ouvrez **SQL Editor**.
2. Cliquez **New query**.
3. Ouvrez le fichier `supabase/schema.sql` (fourni avec ce site), copiez tout
   son contenu, collez-le dans l'éditeur SQL de Supabase, puis cliquez **Run**.
4. Vous devriez voir « Success. No rows returned ». C'est normal : cette
   étape crée la table `interventions`, les règles de sécurité et le dossier
   de stockage des photos — elle ne crée aucune donnée.

## 3. Récupérer l'URL et la clé publique du projet

1. Dans le menu de gauche, ouvrez **Project Settings** (ou l'icône ⚙️) >
   **API**.
2. Copiez la valeur **Project URL** (ressemble à `https://xxxxx.supabase.co`).
3. Copiez la valeur **anon public** (sous « Project API keys ») — une longue
   chaîne commençant par `eyJ...`.
4. Ouvrez le fichier `config.js` du site et remplacez les deux lignes par :
   ```js
   window.__SUPABASE_URL__ = "https://xxxxx.supabase.co";
   window.__SUPABASE_ANON_KEY__ = "eyJ...(votre clé anon)...";
   ```
   Cette clé « anon » est faite pour être publique (visible dans le code du
   site) : la sécurité vient des règles créées à l'étape 2, pas du secret de
   cette clé. Ne touchez jamais à la clé **service_role** (gardez-la secrète,
   elle n'est pas utilisée par ce site).
5. Redéployez le site sur Netlify (glisser-déposer le dossier mis à jour).

## 4. Créer les comptes des 10 utilisateurs

1. Dans Supabase, menu de gauche > **Authentication** > **Users**.
2. En haut, assurez-vous que la connexion par e-mail/mot de passe est
   active : **Authentication** > **Providers** > **Email** doit être activé.
3. Désactivez les inscriptions libres pour que seules les personnes que vous
   créez puissent se connecter : **Authentication** > **Providers** > Email >
   désactivez « Allow new users to sign up » (ou équivalent selon la version
   de l'interface).
4. Revenez à **Authentication** > **Users** > **Add user** > **Create new
   user**. Pour chacune des 10 personnes :
   - E-mail : son adresse (ou une adresse interne du type
     `prenom.nom@taazour.mr`)
   - Mot de passe : un mot de passe initial que vous lui communiquez
   - Cochez « Auto Confirm User » pour qu'elle puisse se connecter
     immédiatement sans vérifier son e-mail.
5. Chaque personne peut ensuite se connecter sur `saisie.html` avec cet
   e-mail et ce mot de passe. Elle peut le changer elle-même plus tard via
   « Mot de passe oublié » si vous activez l'envoi d'e-mails dans Supabase,
   ou vous pouvez le réinitialiser vous-même depuis le tableau **Users**.

## Ce que chaque rôle peut faire

- **Grand public / décideurs** : consultent `index.html` et
  `referentiel.html` sans compte — lecture seule.
- **Les 10 comptes créés** : se connectent sur `saisie.html`, ajoutent des
  interventions et des photos. Dans ce premier réglage, toute personne
  connectée peut ajouter ou modifier n'importe quelle intervention (comme un
  tableau Excel partagé) — si vous voulez restreindre chaque compte à son
  seul programme plus tard, c'est un ajustement des règles dans
  `schema.sql` (dites-le moi et je l'adapte).

## En cas de souci

- Le site affiche « Formulaire non configuré » sur `saisie.html` : les deux
  lignes de `config.js` sont encore vides — refaites l'étape 3.
- Une personne ne peut pas se connecter : vérifiez que son compte existe
  dans **Authentication > Users** et que « Auto Confirm User » a bien été
  coché à sa création.
- Les pages publiques (`index.html`, `referentiel.html`) continuent de
  fonctionner même si Supabase est en panne ou mal configuré : elles basculent
  automatiquement sur les données du dernier classeur Excel envoyé
  (`data.js`).
