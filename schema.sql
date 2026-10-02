-- Référentiel TAAZOUR -- schéma Supabase
-- À coller une seule fois dans Supabase > SQL Editor > New query > Run.
-- Peut être exécuté plusieurs fois sans danger (IF NOT EXISTS / OR REPLACE partout).

-- 1) Table principale -------------------------------------------------------
create table if not exists public.interventions (
  id uuid primary key default gen_random_uuid(),
  intitule text,
  programme text,
  type_intervention text,
  region text,
  moughataa text,
  commune text,
  statut text,
  avancement_pct numeric check (avancement_pct is null or (avancement_pct >= 0 and avancement_pct <= 100)),
  beneficiaires_cibles numeric,
  beneficiaires_atteints numeric,
  montant_engage numeric,
  montant_decaisse numeric,
  partenaire text,
  financement text,
  periodicite text,
  date_demarrage date,
  date_fin date,
  notes text,
  -- Infrastructure -- nb_unites : quantité générique d'unités réalisées
  -- (logements, salles de classe, forages, châteaux d'eau, etc. selon le
  -- type d'intervention précis -- un seul champ plutôt qu'un champ par
  -- nature d'ouvrage).
  nb_unites numeric,
  -- Albarka -- type "Barrages" uniquement.
  superficie_ha numeric,
  lat numeric,
  lng numeric,
  marche_numero text,
  bureau_suivi text,
  montant_contrat_bureau_suivi numeric,
  maitre_ouvrage text,
  date_reception_provisoire date,
  date_reception_definitive date,
  -- Transfert monétaire
  montant_par_transfert numeric,
  nb_cycles numeric,
  -- Boutiques Temwine
  nb_boutiques numeric,
  nb_boutiques_approvisionnees numeric,
  quantite_approvisionnee_tonnes numeric,
  -- Cartes Temwine
  nb_boutiques_homologuees numeric,
  nb_cartes_distribuees numeric,
  montant_transactions_menages numeric,
  quantite_vendue numeric,
  -- AGR (type "Projet communautaire" d'Albarka)
  secteur_agr text,
  -- Albarka -- AGR/MPE (financement en lot d'AGR et de Micro-Projets Économiques)
  nb_agr_financees numeric,
  nb_mpe_finances numeric,
  -- Albarka -- Appui aux coopératives
  nb_cooperatives_appuyees numeric,
  -- Albarka -- Équipement communautaire (checklist case à cocher + nombre,
  -- une colonne par nature d'équipement)
  nb_tricycles numeric,
  nb_motos numeric,
  nb_moulins numeric,
  nb_congelateurs numeric,
  nb_citernes numeric,
  nb_motopompes numeric,
  nb_toktok numeric,
  nb_camions numeric,
  -- Distribution (générique, réutilisé par Cheyla)
  nature_distribution text,
  -- Distribution Temwine (Opération Ramadan / Opération spéciale / SAVS)
  quantite_distribuee numeric,
  quantite_stock numeric,
  -- Ciblage / registre social
  methode_ciblage text,
  -- Assurance maladie (CNAM)
  menages_assures_cnam numeric,
  personnes_assurees_cnam numeric,
  lieu_distribution_cnam text,
  -- Équipement / logistique (ex. Camion -- Albarka ; équipements et
  -- fournitures -- Cheyla)
  equip_nombre numeric,
  equip_affectation text,
  -- Mise à jour du Registre social
  registre_menages_recenses numeric,
  registre_menages_registre numeric,
  registre_reclamations numeric,
  -- Photos : [{"url": "...", "name": "..."}]
  photos jsonb not null default '[]'::jsonb,
  -- Traçabilité : qui a ajouté / qui a modifié en dernier (nom complet,
  -- lu depuis app_metadata -- jamais depuis user_metadata, qui est
  -- modifiable par la personne connectée elle-même)
  ajoute_par text,
  modifie_par text,
  source text not null default 'web', -- 'web' (formulaire en ligne) ou 'excel' (import)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Mise à jour automatique de "ajoute_par" / "modifie_par" / "updated_at" --
create or replace function public.set_intervention_metadata()
returns trigger
language plpgsql
set search_path to 'public'
as $$
declare
  actor text;
begin
  actor := coalesce(auth.jwt() -> 'app_metadata' ->> 'full_name', auth.jwt() ->> 'email', 'web');
  if tg_op = 'INSERT' then
    if new.ajoute_par is null or new.ajoute_par = '' then
      new.ajoute_par := actor;
    end if;
  elsif tg_op = 'UPDATE' then
    new.modifie_par := actor;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_intervention_metadata on public.interventions;
create trigger trg_intervention_metadata
  before insert or update on public.interventions
  for each row execute function public.set_intervention_metadata();

-- 3) Historique des ajouts/modifications (traçabilité complète) -------------
create table if not exists public.intervention_audit_log (
  id uuid primary key default gen_random_uuid(),
  intervention_id uuid,
  action text not null,
  acted_by_name text,
  acted_by_email text,
  acted_at timestamptz not null default now(),
  old_data jsonb,
  new_data jsonb
);
alter table public.intervention_audit_log enable row level security;
drop policy if exists "Lecture historique par connectés" on public.intervention_audit_log;
create policy "Lecture historique par connectés" on public.intervention_audit_log
  for select to authenticated using (true);

create or replace function public.log_intervention_change()
returns trigger
security definer
language plpgsql
set search_path to 'public'
as $$
declare
  actor text;
  actor_email text;
begin
  actor := coalesce(auth.jwt() -> 'app_metadata' ->> 'full_name', auth.jwt() ->> 'email', 'web');
  actor_email := auth.jwt() ->> 'email';
  if tg_op = 'INSERT' then
    insert into public.intervention_audit_log(intervention_id, action, acted_by_name, acted_by_email, new_data)
    values (new.id, 'insert', actor, actor_email, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.intervention_audit_log(intervention_id, action, acted_by_name, acted_by_email, old_data, new_data)
    values (new.id, 'update', actor, actor_email, to_jsonb(old), to_jsonb(new));
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.intervention_audit_log(intervention_id, action, acted_by_name, acted_by_email, old_data)
    values (old.id, 'delete', actor, actor_email, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;
revoke execute on function public.log_intervention_change() from public;

drop trigger if exists trg_log_intervention_change on public.interventions;
create trigger trg_log_intervention_change
  after insert or update on public.interventions
  for each row execute function public.log_intervention_change();

-- Suppression tracée séparément (voir note plus bas sur DROP TRIGGER) :
drop trigger if exists trg_log_intervention_delete on public.interventions;
create trigger trg_log_intervention_delete
  after delete on public.interventions
  for each row execute function public.log_intervention_change();

-- 4) Sécurité (RLS) -----------------------------------------------------------
-- Chaque compte porte son rôle/programme dans app_metadata (jamais
-- user_metadata, qui est modifiable par la personne connectée elle-même) :
--   update auth.users set raw_app_meta_data = raw_app_meta_data ||
--     '{"full_name":"...", "role":"admin"}'::jsonb where email = '...';
--   -- ou role':'coordinateur_programme','programme':'Tékavoul' pour un coordinateur
--   -- ou avec en plus 'categorie':'Projet Hydraulique' pour un "chef de
--   -- projet" restreint à une seule catégorie d'un programme en cascade
--   -- (voir public.type_categories et public.can_write_intervention ci-dessous)
-- role = 'admin'                  -> lit/ajoute/modifie tous les programmes
-- role = 'coordinateur_programme' -> ajoute/modifie uniquement son programme
--   (et, si categorie renseignée, uniquement les types de cette catégorie)
alter table public.interventions enable row level security;

drop policy if exists "Lecture publique" on public.interventions;
create policy "Lecture publique" on public.interventions
  for select using (true);

-- Table de correspondance type_intervention -> catégorie, par programme.
-- Sert uniquement à restreindre l'accès d'un compte "chef de projet"
-- (app_metadata.categorie) à une seule catégorie d'un programme en mode
-- cascade. À tenir à jour manuellement si PROGRAM_FORM_SCHEMA (common.js)
-- change pour Cheyla, ou à étendre si le même mécanisme est créé pour
-- DARI/Albarka plus tard.
create table if not exists public.type_categories (
  programme text not null,
  type_intervention text not null,
  categorie text not null,
  primary key (programme, type_intervention)
);
alter table public.type_categories enable row level security;
drop policy if exists "Lecture publique type_categories" on public.type_categories;
create policy "Lecture publique type_categories" on public.type_categories
  for select using (true);

insert into public.type_categories (programme, type_intervention, categorie) values
  ('Cheyla', 'Construction d''écoles, collèges, lycées et salles de classe', 'Projet Éducation et Formation'),
  ('Cheyla', 'Réhabilitation et extension d''infrastructures scolaires', 'Projet Éducation et Formation'),
  ('Cheyla', 'Équipement des établissements scolaires et fourniture d''équipements pédagogiques', 'Projet Éducation et Formation'),
  ('Cheyla', 'Construction de postes de santé', 'Projet Santé-Nutrition'),
  ('Cheyla', 'Réhabilitation et achèvement d''infrastructures sanitaires', 'Projet Santé-Nutrition'),
  ('Cheyla', 'Équipement des structures sanitaires et renforcement des plateaux techniques', 'Projet Santé-Nutrition'),
  ('Cheyla', 'Affiliation et prise en charge de l''assurance maladie des ménages vulnérables', 'Projet Santé-Nutrition'),
  ('Cheyla', 'Acquisition et mise à disposition d''intrants nutritionnels', 'Projet Santé-Nutrition'),
  ('Cheyla', 'Appui à la prise en charge de la malnutrition', 'Projet Santé-Nutrition'),
  ('Cheyla', 'Réalisation d''études géophysiques', 'Projet Hydraulique'),
  ('Cheyla', 'Réalisation d''études hydrauliques', 'Projet Hydraulique'),
  ('Cheyla', 'Réalisation de forages', 'Projet Hydraulique'),
  ('Cheyla', 'Équipement des forages', 'Projet Hydraulique'),
  ('Cheyla', 'Équipement et réhabilitation des puits', 'Projet Hydraulique'),
  ('Cheyla', 'Construction de châteaux d''eau', 'Projet Hydraulique'),
  ('Cheyla', 'Fourniture et installation de bâches protégées de stockage d''eau', 'Projet Hydraulique'),
  ('Cheyla', 'Fourniture et installation de réservoirs de stockage d''eau en PEHD', 'Projet Hydraulique'),
  ('Cheyla', 'Réalisation de réseaux d''adduction d''eau potable (AEP)', 'Projet Hydraulique'),
  ('Cheyla', 'Construction et installation de bornes-fontaines', 'Projet Hydraulique'),
  ('Cheyla', 'Réalisation de branchements particuliers aux réseaux d''eau potable', 'Projet Hydraulique'),
  ('Cheyla', 'Fourniture et installation de groupes électrogènes', 'Projet Hydraulique'),
  ('Cheyla', 'Réalisation des études de faisabilité d''électrification', 'Projet Energie'),
  ('Cheyla', 'Construction et installation de mini-centrales hybrides solaires-thermiques', 'Projet Energie'),
  ('Cheyla', 'Électrification des localités rurales', 'Projet Energie'),
  ('Cheyla', 'Extension et raccordement aux réseaux électriques BT et MT', 'Projet Energie'),
  ('Cheyla', 'Distribution de kits de gaz butane aux ménages vulnérables', 'Projet Energie')
on conflict (programme, type_intervention) do update set categorie = excluded.categorie;

-- Fonction centrale d'autorisation d'écriture, utilisée par les 3 policies
-- insert/update/delete ci-dessous. role=admin garde un accès total ; un
-- coordinateur_programme doit être sur son programme ; si en plus son compte
-- porte un app_metadata.categorie (ex. "chef de projet" Cheyla), le
-- type_intervention doit appartenir à cette catégorie précise.
create or replace function public.can_write_intervention(p_programme text, p_type text)
returns boolean
language sql stable
as $$
  select
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    or (
      p_programme = (auth.jwt() -> 'app_metadata' ->> 'programme')
      and (
        (auth.jwt() -> 'app_metadata' ->> 'categorie') is null
        or exists (
          select 1 from public.type_categories tc
          where tc.programme = p_programme
            and tc.type_intervention = p_type
            and tc.categorie = (auth.jwt() -> 'app_metadata' ->> 'categorie')
        )
      )
    );
$$;

drop policy if exists "Ajout par utilisateurs connectés" on public.interventions;
create policy "Ajout par utilisateurs connectés" on public.interventions
  for insert to authenticated
  with check ( public.can_write_intervention(programme, type_intervention) );

drop policy if exists "Modification par utilisateurs connectés" on public.interventions;
create policy "Modification par utilisateurs connectés" on public.interventions
  for update to authenticated
  using ( public.can_write_intervention(programme, type_intervention) )
  with check ( public.can_write_intervention(programme, type_intervention) );

drop policy if exists "Suppression par utilisateurs connectés" on public.interventions;
create policy "Suppression par utilisateurs connectés" on public.interventions
  for delete to authenticated
  using ( public.can_write_intervention(programme, type_intervention) );

-- 5) Stockage des photos ------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "Lecture publique des photos" on storage.objects;
create policy "Lecture publique des photos" on storage.objects
  for select using (bucket_id = 'photos');

drop policy if exists "Dépôt de photos par utilisateurs connectés" on storage.objects;
create policy "Dépôt de photos par utilisateurs connectés" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos');

-- 6) Signalements aux décideurs -----------------------------------------------
-- Permet à n'importe quelle personne connectée de signaler un point important
-- sur une intervention ; seuls les comptes role='admin' (décideurs) peuvent
-- y répondre. Lecture publique, comme pour les interventions.
create table if not exists public.signalements (
  id uuid primary key default gen_random_uuid(),
  intervention_id uuid not null references public.interventions(id) on delete cascade,
  message text not null,
  urgent boolean not null default false,
  statut text not null default 'ouvert', -- 'ouvert' / 'traite'
  cree_par text,
  cree_par_email text,
  created_at timestamptz not null default now(),
  reponse text,
  repondu_par text,
  repondu_at timestamptz,
  categorie text, -- une des valeurs de SIGNALEMENT_CATEGORIES (libre, non contraint en base)
  photo_url text  -- photo jointe, déposée dans le bucket "photos" sous signalements/
);
alter table public.signalements enable row level security;

drop policy if exists "Lecture publique signalements" on public.signalements;
create policy "Lecture publique signalements" on public.signalements
  for select using (true);

drop policy if exists "Creation par connectés" on public.signalements;
create policy "Creation par connectés" on public.signalements
  for insert to authenticated with check (true);

-- Seul le Délégué Général reçoit les alertes et doit pouvoir y répondre :
-- marquer son compte avec peut_repondre_signalements = true, par ex. :
--   update auth.users set raw_app_meta_data = raw_app_meta_data ||
--     '{"peut_repondre_signalements": true}'::jsonb where email = '...';
-- Les autres comptes "admin" gardent un accès complet aux interventions
-- (voir plus haut) mais ne peuvent pas répondre à un signalement.
drop policy if exists "Reponse par admins" on public.signalements;
drop policy if exists "Reponse par Delegue General" on public.signalements;
create policy "Reponse par Delegue General" on public.signalements
  for update to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'peut_repondre_signalements')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'peut_repondre_signalements')::boolean, false));

create or replace function public.set_signalement_metadata()
returns trigger
language plpgsql
set search_path to 'public'
as $$
declare
  actor text;
  actor_email text;
begin
  actor := coalesce(auth.jwt() -> 'app_metadata' ->> 'full_name', auth.jwt() ->> 'email', 'web');
  actor_email := auth.jwt() ->> 'email';
  if tg_op = 'INSERT' then
    new.cree_par := actor;
    new.cree_par_email := actor_email;
    new.statut := coalesce(new.statut, 'ouvert');
  elsif tg_op = 'UPDATE' then
    if new.reponse is not null and (old.reponse is null or new.reponse <> old.reponse) then
      new.repondu_par := actor;
      new.repondu_at := now();
      new.statut := 'traite';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_signalement_metadata on public.signalements;
create trigger trg_signalement_metadata
  before insert or update on public.signalements
  for each row execute function public.set_signalement_metadata();
