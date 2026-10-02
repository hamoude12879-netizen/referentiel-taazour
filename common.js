// Shared constants, helpers and data loading for both pages.
// Include data.js BEFORE this file.
"use strict";

// Minimal stroke-based icon set (replaces emoji throughout the site) --
// each returns an inline <svg> string, 24x24 viewBox, currentColor stroke.
const ICONS = {
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  mapOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-2.2.7"/><path d="M9 4v14M15 6v9.5"/><path d="M3 3l18 18"/></svg>',
  sun: '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.3M12 19.2v2.3M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.4 19.6 6 18M18 6l1.6-1.6"/></svg>',
  moon: '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16.5 4.6a3.2 3.2 0 0 1 0 6.3M21.5 20c0-3-2-5.2-4.8-5.8"/></svg>',
  coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v9M9.3 15a2.7 2.7 0 0 0 2.7 1.5c1.7 0 2.7-.8 2.7-2s-1-1.8-2.7-2.2-2.7-1-2.7-2.2 1-2 2.7-2a2.7 2.7 0 0 1 2.7 1.5"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.6L16.2 9"/></svg>',
  alertCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.3h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/></svg>',
  table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M9 9.5V19.5"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5"/><path d="M4 18v1.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V18"/></svg>',
};
function icon(name, cls){ return (ICONS[name]||"").replace("<svg ", `<svg ${cls?`class="${cls}" `:""}`); }

const PROGRAMMES = [
  {k:"DARI", c:"var(--cat1)"},
  {k:"Tékavoul", c:"var(--cat2)"},
  {k:"Temwine", c:"var(--cat3)"},
  {k:"Albarka", c:"var(--cat4)"},
  {k:"Registre social", c:"var(--cat5)"},
  {k:"Cheyla", c:"var(--cat7)"}
];
const TYPES_INTERV = ["Infrastructure","Transfert monétaire","Boutiques Temwine","AGR","Distribution","Ciblage / registre social","Assurance maladie (CNAM)","Autre"];
// Les types d'intervention affichés sur index.html / referentiel.html (filtre
// "Type", graphique "par type") ne sont plus les 8 familles génériques
// ci-dessus -- depuis que la saisie propose des types précis par programme
// (voir PROGRAM_FORM_SCHEMA), ces pages listent dynamiquement les valeurs
// réellement présentes dans les données plutôt qu'une liste figée.
function distinctTypes(records){
  const set = new Set();
  records.forEach(r=>{ if(r.type_intervention) set.add(r.type_intervention); });
  return Array.from(set).sort((a,b)=> a.localeCompare(b, "fr"));
}
const STATUTS = [
  {k:"Planifié", c:"var(--muted)"},
  {k:"En cours", c:"var(--warning)"},
  {k:"Actif", c:"var(--cat3)"},
  {k:"En retard", c:"var(--serious)"},
  {k:"Achevé", c:"var(--good)"},
  {k:"Suspendu", c:"var(--critical)"},
  {k:"Résilié", c:"var(--cat7)"},
  {k:"Clôturé", c:"var(--cat1)"}
];
const REGIONS = ["Nouakchott-Ouest","Nouakchott-Nord","Nouakchott-Sud","Hodh Ech Chargui","Hodh El Gharbi","Assaba","Gorgol","Brakna","Trarza","Adrar","Dakhlet Nouadhibou","Tagant","Guidimagha","Tiris Zemmour","Inchiri"];
const TYPES_INFRA = ["École","Logements sociaux","Internat","Poste de santé","Forage équipé","Forage","Centrale électrique","Extension réseau électrique","Raccordement eau","Barrage","Poste de dialyse","Boutique communautaire","Complexe TAAZOUR","Mahdara","Mosquée","Autre"];
const PERIODICITES = ["Ponctuel","Mensuel","Bimestriel","Trimestriel","Semestriel","Annuel","Autre"];

// Form schema for saisie.html -- common fields always shown, then one group
// per "Type d'intervention" shown only once that type is selected. Mirrors
// COLUMNS in xlsx_build/build_base_taazour.py and the Supabase schema
// (supabase/schema.sql) field-for-field.
const FORM_COMMON = [
  {key:"intitule", label:"Intitulé", type:"text", required:true},
  {key:"programme", label:"Programme", type:"select", options:PROGRAMMES.map(p=>p.k), required:true},
  {key:"type_intervention", label:"Type d'intervention", type:"select", options:TYPES_INTERV, required:true},
  {key:"region", label:"Région", type:"select", options:REGIONS},
  {key:"moughataa", label:"Moughataa", type:"text"},
  {key:"commune", label:"Commune", type:"text"},
  {key:"statut", label:"Statut", type:"select", options:STATUTS.map(s=>s.k), required:true},
  {key:"avancement_pct", label:"Avancement (%)", type:"number", step:"1"},
  {key:"beneficiaires_cibles", label:"Bénéficiaires ciblés (nb.)", type:"number"},
  {key:"beneficiaires_atteints", label:"Bénéficiaires atteints (nb.)", type:"number"},
  {key:"montant_engage", label:"Montant engagé (MRU)", type:"number"},
  {key:"montant_decaisse", label:"Montant décaissé (MRU)", type:"number"},
  {key:"partenaire", label:"Partenaire / opérateur", type:"text"},
  {key:"financement", label:"Financement / bailleur", type:"text"},
  {key:"periodicite", label:"Périodicité", type:"select", options:PERIODICITES},
  {key:"date_demarrage", label:"Date de démarrage", type:"date"},
  {key:"date_fin", label:"Date de fin / fin prévue", type:"date"},
  {key:"notes", label:"Notes", type:"textarea"},
];
const FORM_GROUPS_BY_TYPE = {
  // Champ générique de quantité -- logements construits, salles de classe,
  // forages, châteaux d'eau, etc. selon le type d'intervention précis. Un seul
  // champ plutôt qu'un champ par nature d'ouvrage, pour rester valable quel
  // que soit le type ajouté plus tard dans PROGRAM_FORM_SCHEMA.
  "Infrastructure": [
    {key:"nb_unites", label:"Nombre d'unités réalisées", type:"number"},
    {key:"lat", label:"Latitude", type:"number", step:"any"},
    {key:"lng", label:"Longitude", type:"number", step:"any"},
    {key:"marche_numero", label:"N° de marché", type:"text"},
    {key:"bureau_suivi", label:"Bureau de suivi", type:"text"},
    {key:"montant_contrat_bureau_suivi", label:"Montant du contrat du bureau de suivi (MRU)", type:"number"},
    {key:"maitre_ouvrage", label:"Maître d'ouvrage", type:"text"},
    {key:"date_reception_provisoire", label:"Réception provisoire", type:"date"},
    {key:"date_reception_definitive", label:"Réception définitive", type:"date"},
  ],
  // Albarka -- type "Barrages" uniquement : mêmes champs que "Infrastructure"
  // ci-dessus, plus la superficie (ha), propre aux barrages et sans objet
  // pour les autres types d'infrastructure.
  "Barrage": [
    {key:"nb_unites", label:"Nombre d'unités réalisées", type:"number"},
    {key:"superficie_ha", label:"Superficie (ha)", type:"number", step:"any"},
    {key:"lat", label:"Latitude", type:"number", step:"any"},
    {key:"lng", label:"Longitude", type:"number", step:"any"},
    {key:"marche_numero", label:"N° de marché", type:"text"},
    {key:"bureau_suivi", label:"Bureau de suivi", type:"text"},
    {key:"montant_contrat_bureau_suivi", label:"Montant du contrat du bureau de suivi (MRU)", type:"number"},
    {key:"maitre_ouvrage", label:"Maître d'ouvrage", type:"text"},
    {key:"date_reception_provisoire", label:"Réception provisoire", type:"date"},
    {key:"date_reception_definitive", label:"Réception définitive", type:"date"},
  ],
  "Transfert monétaire": [
    {key:"montant_par_transfert", label:"Montant par transfert (MRU)", type:"number"},
    {key:"nb_cycles", label:"Nombre de cycles réalisés", type:"number"},
  ],
  "Boutiques Temwine": [
    {key:"nb_boutiques", label:"Nombre de boutiques", type:"number"},
    {key:"nb_boutiques_approvisionnees", label:"Nombre de boutiques approvisionnées", type:"number"},
    {key:"quantite_approvisionnee_tonnes", label:"Quantité approvisionnée (tonnes)", type:"number"},
  ],
  // Spécifique au type "Cartes Temwine" -- distinct de "Boutiques Temwine"
  // ci-dessus depuis que les deux types ont leurs propres compteurs.
  "Cartes Temwine": [
    {key:"nb_boutiques_homologuees", label:"Nombre de boutiques homologuées", type:"number"},
    {key:"nb_cartes_distribuees", label:"Nombre de cartes distribuées", type:"number"},
    {key:"montant_transactions_menages", label:"Montant utilisé par les ménages sur les transactions (MRU)", type:"number"},
    {key:"quantite_vendue", label:"Quantité vendue", type:"number"},
  ],
  // Groupe conservé pour "Projet communautaire" (Albarka) -- champ générique
  // de description, distinct des compteurs AGR/MPE ci-dessous.
  "AGR": [
    {key:"secteur_agr", label:"Secteur d'activité (AGR)", type:"text"},
  ],
  // Albarka -- type "AGR/MPE" : financement d'Activités Génératrices de
  // Revenus et de Micro-Projets Économiques, toujours annoncé en lot
  // ("Financement de N AGR et de M MPE") dans l'inventaire des réalisations.
  "AGR/MPE": [
    {key:"nb_agr_financees", label:"Nombre d'AGR financées", type:"number"},
    {key:"nb_mpe_finances", label:"Nombre de MPE financés", type:"number"},
  ],
  // Albarka -- type "Appui aux coopératives".
  "Appui aux coopératives": [
    {key:"nb_cooperatives_appuyees", label:"Nombre de coopératives appuyées", type:"number"},
  ],
  // Albarka -- type "Équipement communautaire" : checklist (case à cocher +
  // nombre) plutôt qu'un champ texte libre unique, une ligne par nature
  // d'équipement réellement rencontrée dans l'inventaire des réalisations.
  // type:"checknum" est rendu par saisie.html comme une case à cocher qui
  // révèle un champ nombre associé (voir fieldHtml()).
  "Équipement communautaire": [
    {key:"nb_tricycles", label:"Tricycles", type:"checknum"},
    {key:"nb_motos", label:"Motos", type:"checknum"},
    {key:"nb_moulins", label:"Moulins à grains", type:"checknum"},
    {key:"nb_congelateurs", label:"Congélateurs solaires", type:"checknum"},
    {key:"nb_citernes", label:"Citernes", type:"checknum"},
    {key:"nb_motopompes", label:"Motopompes", type:"checknum"},
    {key:"nb_toktok", label:"TOK TOK", type:"checknum"},
    {key:"nb_camions", label:"Camions", type:"checknum"},
  ],
  // Groupe générique réutilisé par Cheyla (intrants nutritionnels, kits de
  // gaz, etc.) -- ne pas modifier pour un besoin propre à Temwine, voir
  // "Distribution Temwine" ci-dessous.
  "Distribution": [
    {key:"nature_distribution", label:"Nature de la distribution", type:"text"},
  ],
  // Temwine -- Opération Ramadan / Opération spéciale.
  "Distribution Temwine": [
    {key:"quantite_distribuee", label:"Quantité distribuée", type:"number"},
  ],
  // Temwine -- SAVS (Stocks Alimentaires Villageois de Sécurité).
  "SAVS": [
    {key:"quantite_stock", label:"Quantité en stock", type:"number"},
    {key:"quantite_distribuee", label:"Quantité distribuée", type:"number"},
  ],
  "Ciblage / registre social": [
    {key:"methode_ciblage", label:"Méthode de ciblage / source", type:"text"},
  ],
  "Assurance maladie (CNAM)": [
    {key:"menages_assures_cnam", label:"Ménages assurés (nb.)", type:"number"},
    {key:"personnes_assurees_cnam", label:"Personnes assurées (nb.)", type:"number"},
    {key:"lieu_distribution_cnam", label:"Lieu de distribution", type:"text"},
  ],
  // Équipement / logistique (fournitures et équipements -- Cheyla) : juste le
  // décompte et sa destination, pas de fiche de chantier.
  "Équipement": [
    {key:"equip_nombre", label:"Nombre", type:"number"},
    {key:"equip_affectation", label:"Affectation", type:"text"},
  ],
  // Mise à jour du Registre social : un seul type d'intervention, avec ses
  // propres compteurs (le coût et la durée utilisent les champs communs
  // montant_engage / date_demarrage / date_fin, déjà dans FORM_COMMON).
  "Registre": [
    {key:"registre_menages_recenses", label:"Nombre de ménages recensés", type:"number"},
    {key:"registre_menages_registre", label:"Nombre de ménages dans le registre (cumulé)", type:"number"},
    {key:"registre_reclamations", label:"Nombre de réclamations", type:"number"},
  ],
};

// --- Formulaire de saisie, filtré par programme -----------------------------
// Chaque programme a sa propre liste de types d'intervention, pertinente pour
// ses activités réelles (plutôt que les 8 catégories génériques ci-dessus,
// gardées uniquement comme "familles de champs" réutilisées par ces types
// précis). Trois formes possibles :
//   - mode "flat"    : une simple liste de types (Tékavoul, Temwine)
//   - mode "cascade" : Projet/Catégorie -> Type (DARI, Albarka, Cheyla)
//   - mode "fixed"   : un seul type imposé, avec ses champs propres (Registre social)
// `group` pointe vers une clé de FORM_GROUPS_BY_TYPE (ou null si le type n'a
// pas de champs spécifiques au-delà des champs communs).
const PROGRAM_FORM_SCHEMA = {
  "DARI": { mode:"cascade", groups: [
    { categorie:"Les logements sociaux", types:[
      {label:"Construction des logements", group:"Infrastructure"},
    ]},
    { categorie:"Les regroupements villageois", types:[
      {label:"Aménagements et constructions des infrastructures", group:"Infrastructure"},
    ]},
    { categorie:"Infrastructure et équipements collectifs", types:[
      {label:"Réhabilitation des internats et des centres de formation", group:"Infrastructure"},
      {label:"Construction des internats", group:"Infrastructure"},
      {label:"Construction des équipements de TAAZOUR (siège, bureaux des programmes)", group:"Infrastructure"},
      {label:"Construction de centre de dialyse", group:"Infrastructure"},
    ]},
    { categorie:"Accompagnement des logements", types:[
      {label:"Raccordement eau/électricité des logements", group:"Infrastructure"},
      {label:"Gardiennage des logements", group:"Infrastructure"},
    ]},
  ]},
  "Tékavoul": { mode:"flat", types:[
    {label:"Cash transfert régulier", group:"Transfert monétaire"},
    {label:"Tékavoul choc", group:"Transfert monétaire"},
    {label:"Aides sociales", group:"Transfert monétaire"},
  ]},
  "Temwine": { mode:"flat", types:[
    {label:"Boutiques Temwine", group:"Boutiques Temwine"},
    {label:"Cartes Temwine", group:"Cartes Temwine"},
    {label:"Opération Ramadan", group:"Distribution Temwine"},
    {label:"Opération spéciale", group:"Distribution Temwine"},
    {label:"SAVS (Stocks Alimentaires Villageois de Sécurité)", group:"SAVS"},
  ]},
  "Albarka": { mode:"cascade", groups: [
    { categorie:"Infrastructures", types:[
      {label:"Barrages", group:"Barrage"},
      {label:"Complexe TAAZOUR", group:"Infrastructure"},
      {label:"Complexe religieux", group:"Infrastructure"},
      {label:"Mahdra", group:"Infrastructure"},
      {label:"Mosquée", group:"Infrastructure"},
      {label:"Marché", group:"Infrastructure"},
      {label:"Siège commune", group:"Infrastructure"},
      {label:"Boutique (construction et approvisionnement)", group:"Infrastructure"},
    ]},
    { categorie:"Inclusion économique", types:[
      {label:"AGR/MPE", group:"AGR/MPE"},
      {label:"Appui aux coopératives", group:"Appui aux coopératives"},
      {label:"Distribution de bétail", group:"Distribution"},
      {label:"Équipement communautaire (tricycles, moulins, congélateurs, citernes…)", group:"Équipement communautaire"},
      {label:"Fourniture de matériaux", group:"Distribution"},
      {label:"Projet communautaire", group:"AGR"},
    ]},
  ]},
  "Registre social": { mode:"fixed",
    type: {label:"Mise à jour du registre", group:"Registre"} },
  "Cheyla": { mode:"cascade", groups: [
    { categorie:"Projet Éducation et Formation", types:[
      {label:"Construction d'écoles, collèges, lycées et salles de classe", group:"Infrastructure"},
      {label:"Réhabilitation et extension d'infrastructures scolaires", group:"Infrastructure"},
      {label:"Équipement des établissements scolaires et fourniture d'équipements pédagogiques", group:"Équipement"},
    ]},
    { categorie:"Projet Santé-Nutrition", types:[
      {label:"Construction de postes de santé", group:"Infrastructure"},
      {label:"Réhabilitation et achèvement d'infrastructures sanitaires", group:"Infrastructure"},
      {label:"Équipement des structures sanitaires et renforcement des plateaux techniques", group:"Équipement"},
      {label:"Affiliation et prise en charge de l'assurance maladie des ménages vulnérables", group:"Assurance maladie (CNAM)"},
      {label:"Acquisition et mise à disposition d'intrants nutritionnels", group:"Distribution"},
      {label:"Appui à la prise en charge de la malnutrition", group:"Distribution"},
    ]},
    { categorie:"Projet Hydraulique", types:[
      {label:"Réalisation d'études géophysiques", group:null},
      {label:"Réalisation d'études hydrauliques", group:null},
      {label:"Réalisation de forages", group:"Infrastructure"},
      {label:"Équipement des forages", group:"Équipement"},
      {label:"Équipement et réhabilitation des puits", group:"Infrastructure"},
      {label:"Construction de châteaux d'eau", group:"Infrastructure"},
      {label:"Fourniture et installation de bâches protégées de stockage d'eau", group:"Équipement"},
      {label:"Fourniture et installation de réservoirs de stockage d'eau en PEHD", group:"Équipement"},
      {label:"Réalisation de réseaux d'adduction d'eau potable (AEP)", group:"Infrastructure"},
      {label:"Construction et installation de bornes-fontaines", group:"Infrastructure"},
      {label:"Réalisation de branchements particuliers aux réseaux d'eau potable", group:"Infrastructure"},
      {label:"Fourniture et installation de groupes électrogènes", group:"Équipement"},
    ]},
    { categorie:"Projet Energie", types:[
      {label:"Réalisation des études de faisabilité d'électrification", group:null},
      {label:"Construction et installation de mini-centrales hybrides solaires-thermiques", group:"Infrastructure"},
      {label:"Électrification des localités rurales", group:"Infrastructure"},
      {label:"Extension et raccordement aux réseaux électriques BT et MT", group:"Infrastructure"},
      {label:"Distribution de kits de gaz butane aux ménages vulnérables", group:"Distribution"},
    ]},
  ]},
};

// Flat [{label, group, categorie}] list for a programme, whatever its mode --
// used to find a type's field-group regardless of flat/cascade/fixed shape.
function flattenProgramTypes(programme){
  const schema = PROGRAM_FORM_SCHEMA[programme];
  if(!schema) return [];
  if(schema.mode === "flat") return schema.types.map(t=> Object.assign({categorie:null}, t));
  if(schema.mode === "fixed") return [Object.assign({categorie:null}, schema.type)];
  if(schema.mode === "cascade"){
    const out = [];
    schema.groups.forEach(g=> g.types.forEach(t=> out.push(Object.assign({categorie:g.categorie}, t))));
    return out;
  }
  return [];
}
function typeGroupFields(programme, typeLabel){
  const found = flattenProgramTypes(programme).find(t=> t.label === typeLabel);
  return (found && found.group) ? (FORM_GROUPS_BY_TYPE[found.group] || []) : [];
}

const DETAIL_GROUPS = [
  {title:"Détails", fields:[
    ["region","Région"],["moughataa","Moughataa"],["commune","Commune"],
    ["partenaire","Partenaire / opérateur"],["financement","Financement / bailleur"],
    ["periodicite","Périodicité"]
  ]},
  {title:"Ciblage & montants", fields:[
    ["beneficiaires_cibles","Bénéficiaires ciblés","num"],
    ["beneficiaires_atteints","Bénéficiaires atteints","num"],
    ["montant_engage","Montant engagé","mru"],
    ["montant_decaisse","Montant décaissé","mru"]
  ]},
  {title:"Calendrier", fields:[
    ["date_demarrage","Démarrage","date"],["date_fin","Fin / fin prévue","date"]
  ]},
  {title:"Avancement", fields:[
    ["avancement_pct","Avancement","pct"]
  ]},
  {title:"Infrastructure", fields:[
    ["nb_unites","Nombre d'unités réalisées","num"],
    ["superficie_ha","Superficie (ha)","num"],
    ["lat","Latitude"],["lng","Longitude"],
    ["marche_numero","N° de marché"],["bureau_suivi","Bureau de suivi"],
    ["montant_contrat_bureau_suivi","Montant du contrat du bureau de suivi","mru"],
    ["maitre_ouvrage","Maître d'ouvrage"],
    ["date_reception_provisoire","Réception provisoire","date"],
    ["date_reception_definitive","Réception définitive","date"]
  ]},
  {title:"Transfert monétaire", fields:[
    ["montant_par_transfert","Montant par transfert","mru"],["nb_cycles","Cycles réalisés","num"]
  ]},
  {title:"Boutiques Temwine", fields:[
    ["nb_boutiques","Nombre de boutiques","num"],
    ["nb_boutiques_approvisionnees","Boutiques approvisionnées","num"],
    ["quantite_approvisionnee_tonnes","Quantité approvisionnée (tonnes)","num"]
  ]},
  {title:"Cartes Temwine", fields:[
    ["nb_boutiques_homologuees","Boutiques homologuées","num"],
    ["nb_cartes_distribuees","Cartes distribuées","num"],
    ["montant_transactions_menages","Montant utilisé par les ménages","mru"],
    ["quantite_vendue","Quantité vendue","num"]
  ]},
  {title:"AGR", fields:[["secteur_agr","Secteur d'activité"]]},
  {title:"AGR/MPE", fields:[
    ["nb_agr_financees","Nombre d'AGR financées","num"],
    ["nb_mpe_finances","Nombre de MPE financés","num"]
  ]},
  {title:"Appui aux coopératives", fields:[["nb_cooperatives_appuyees","Nombre de coopératives appuyées","num"]]},
  {title:"Équipement communautaire", fields:[
    ["nb_tricycles","Tricycles","num"],
    ["nb_motos","Motos","num"],
    ["nb_moulins","Moulins à grains","num"],
    ["nb_congelateurs","Congélateurs solaires","num"],
    ["nb_citernes","Citernes","num"],
    ["nb_motopompes","Motopompes","num"],
    ["nb_toktok","TOK TOK","num"],
    ["nb_camions","Camions","num"]
  ]},
  {title:"Distribution", fields:[["nature_distribution","Nature de la distribution"]]},
  {title:"Distribution Temwine", fields:[
    ["quantite_stock","Quantité en stock","num"],["quantite_distribuee","Quantité distribuée","num"]
  ]},
  {title:"Ciblage / registre social", fields:[["methode_ciblage","Méthode de ciblage / source"]]},
  {title:"Assurance maladie (CNAM)", fields:[
    ["menages_assures_cnam","Ménages assurés","num"],
    ["personnes_assurees_cnam","Personnes assurées","num"],
    ["lieu_distribution_cnam","Lieu de distribution"]
  ]},
  {title:"Équipement", fields:[
    ["equip_nombre","Nombre","num"],["equip_affectation","Affectation"]
  ]},
  {title:"Registre social", fields:[
    ["registre_menages_recenses","Ménages recensés","num"],
    ["registre_menages_registre","Ménages dans le registre (cumulé)","num"],
    ["registre_reclamations","Réclamations","num"]
  ]},
  {title:"Notes", fields:[["notes","Notes"]]}
];

// Flat key -> French label lookup (used by the audit-log diff viewer so
// changed fields read as "Avancement" rather than "avancement_pct").
const FIELD_LABELS = {};
FORM_COMMON.forEach(f=> FIELD_LABELS[f.key] = f.label);
Object.values(FORM_GROUPS_BY_TYPE).forEach(group=> group.forEach(f=> FIELD_LABELS[f.key] = f.label));

const SIGNALEMENT_CATEGORIES = ["Retard","Budget","Sécurité","Qualité","Administratif","Autre"];

// --- Historique des modifications (audit) -----------------------------------
// Fields that are purely technical / already shown elsewhere -- never worth
// showing as a "changed field" in the diff view.
const AUDIT_IGNORE_KEYS = new Set(["updated_at","created_at","modifie_par","ajoute_par","id","source"]);

async function fetchAuditLog(interventionId){
  if(!supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from("intervention_audit_log")
    .select("*")
    .eq("intervention_id", interventionId)
    .order("acted_at", { ascending:false });
  if(error){ console.error("Historique indisponible :", error); return []; }
  return data || [];
}

// Compares old/new row snapshots (jsonb from the audit log) and returns only
// the meaningfully-changed fields: [{label, before, after}].
function diffAudit(oldData, newData){
  const out = [];
  const keys = new Set([...Object.keys(oldData||{}), ...Object.keys(newData||{})]);
  keys.forEach(key=>{
    if(AUDIT_IGNORE_KEYS.has(key)) return;
    const before = oldData ? oldData[key] : undefined;
    const after = newData ? newData[key] : undefined;
    const beforeStr = before==null ? "" : String(before);
    const afterStr = after==null ? "" : String(after);
    if(beforeStr === afterStr) return;
    out.push({ label: FIELD_LABELS[key] || key, before: beforeStr, after: afterStr });
  });
  return out;
}

function renderAuditLog(container, logs){
  if(!logs.length){
    container.innerHTML = '<div class="empty-ok">Aucune modification enregistrée.</div>';
    return;
  }
  container.innerHTML = `<ul class="audit-list">${logs.map(l=>{
    const isInsert = l.action === "insert";
    const diffs = isInsert ? [] : diffAudit(l.old_data, l.new_data);
    return `<li class="audit-item">
      <div class="audit-top">
        <span class="pill ${isInsert? "good":"warn"}">${isInsert? "Création" : "Modification"}</span>
        <span class="audit-date">${new Date(l.acted_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
      </div>
      <div class="audit-meta">Par ${esc(l.acted_by_name||l.acted_by_email||"—")}</div>
      ${diffs.length ? `<div class="audit-diff">${diffs.map(d=>`
        <div class="audit-field"><strong>${esc(d.label)}</strong> : <span class="before">${esc(d.before||"—")}</span> → <span class="after">${esc(d.after||"—")}</span></div>`).join("")}</div>`
        : (isInsert ? "" : '<div class="audit-diff"><span style="color:var(--text-2);font-size:12px">Aucun champ substantiel modifié.</span></div>')}
    </li>`;
  }).join("")}</ul>`;
}

const esc = (s)=> String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtNum = (n)=> (n==null||n==="" || isNaN(n)) ? "—" : Number(n).toLocaleString("fr-FR");
const fmtMRU = (n)=> (n==null||n==="" || isNaN(n)) ? "—" : Number(n).toLocaleString("fr-FR")+" MRU";
const fmtDate = (s)=> !s ? "—" : new Date(s+"T00:00:00").toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"});
const fmtField = (val, kind)=>{
  if(val==null || val==="") return null;
  if(kind==="num") return fmtNum(val);
  if(kind==="mru") return fmtMRU(val);
  if(kind==="pct") return (isNaN(val)?val:Number(val).toLocaleString("fr-FR"))+"%";
  if(kind==="date") return fmtDate(val);
  return esc(val);
};
const statutDef = (k)=> STATUTS.find(s=>s.k===k) || STATUTS[0];
const statusChip = (k)=>{
  const d = statutDef(k);
  return `<span class="chip" style="background:color-mix(in srgb, ${d.c} 16%, transparent); color:${d.c}"><span class="dot" style="background:${d.c}"></span>${esc(k||"—")}</span>`;
};

// Automatic "En retard" -- never overwrites the stored statut (a coordinator's
// own choice is never silently clobbered), just what's *displayed*: an
// ongoing intervention whose planned end date has passed reads as "En retard"
// everywhere (chip, map, table, charts, filters) until someone updates it.
const ONGOING_STATUTS = ["Planifié","En cours","Actif"];
function effectiveStatut(r){
  if(r.date_fin && ONGOING_STATUTS.includes(r.statut)){
    const today = new Date().toISOString().slice(0,10);
    if(String(r.date_fin).slice(0,10) < today) return "En retard";
  }
  return r.statut;
}

// Supabase client (null when config.js has no URL/key -- offline/Excel-only
// mode). Loaded from config.js + the supabase-js CDN script, both included
// before this file.
const supabaseClient = (window.__SUPABASE_URL__ && window.__SUPABASE_ANON_KEY__ && window.supabase)
  ? window.supabase.createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__)
  : null;

let RECORDS = [];
let LAST_UPDATED = window.__TAAZOUR_UPDATED__ || "";
// Optional hook a page can set to re-render its own stats/charts/table after
// a successful delete from the detail modal (openDetail already removes the
// row from RECORDS before calling this).
let onInterventionDeleted = null;

// Shared auth awareness across index.html / referentiel.html (saisie.html
// manages its own full-page login flow separately, but all three pages share
// the same Supabase session via localStorage, so logging in on one is
// reflected here too). app_metadata is trusted (only SQL/admin can set it);
// user_metadata is not used for anything security-related.
let CURRENT_USER = null;
async function initAuth(onChange){
  if(!supabaseClient) return null;
  const { data: { user } } = await supabaseClient.auth.getUser();
  CURRENT_USER = user || null;
  // Re-fetch via getUser() on every change rather than trusting the callback's
  // session payload directly -- matches the pattern already proven reliable
  // in saisie.html and avoids any ambiguity across supabase-js versions/events.
  supabaseClient.auth.onAuthStateChange(async ()=>{
    const { data: { user: u } } = await supabaseClient.auth.getUser();
    CURRENT_USER = u || null;
    if(onChange) onChange(CURRENT_USER);
  });
  return CURRENT_USER;
}
function isAdmin(){ return !!(CURRENT_USER && CURRENT_USER.app_metadata && CURRENT_USER.app_metadata.role === "admin"); }
// Seul le Délégué Général doit recevoir les alertes et y répondre -- les
// autres comptes admin gardent un accès complet aux interventions mais ne
// voient pas le formulaire de réponse aux signalements (appliqué aussi
// côté base via la policy RLS "Reponse par Delegue General").
function canRespondSignalements(){ return !!(CURRENT_USER && CURRENT_USER.app_metadata && CURRENT_USER.app_metadata.peut_repondre_signalements === true); }
// Mêmes droits que pour modifier une intervention : admin, ou coordinateur
// du programme concerné (appliqué aussi côté base via RLS).
function canDeleteIntervention(r){
  if(!CURRENT_USER || !CURRENT_USER.app_metadata) return false;
  const meta = CURRENT_USER.app_metadata;
  return meta.role === "admin" || (meta.role === "coordinateur_programme" && meta.programme === r.programme);
}
async function deleteIntervention(id){
  if(!supabaseClient) throw new Error("Hors-ligne : impossible de supprimer.");
  const { error } = await supabaseClient.from("interventions").delete().eq("id", id);
  if(error) throw error;
}

// Compact login/logout widget, reused in the topbar of index.html and
// referentiel.html (saisie.html has its own full login page already).
function renderAuthWidget(el){
  if(!supabaseClient){ el.innerHTML = ""; return; }
  if(CURRENT_USER){
    const meta = CURRENT_USER.app_metadata || {};
    el.innerHTML = `<span class="auth-pill">${esc(meta.full_name || CURRENT_USER.email)}</span>
      <button class="btn btn-ghost btn-sm" id="authLogoutBtn">Se déconnecter</button>`;
    document.getElementById("authLogoutBtn").onclick = async ()=>{ await supabaseClient.auth.signOut(); location.reload(); };
  } else {
    el.innerHTML = `<button class="btn btn-ghost btn-sm" id="authLoginBtn">Se connecter</button>`;
    document.getElementById("authLoginBtn").onclick = openLoginModal;
  }
}
function openLoginModal(){
  const root = document.getElementById("modalRoot");
  if(!root) return;
  root.innerHTML = `<div class="overlay" id="ovLogin"><div class="modal" style="max-width:360px">
    <button class="btn btn-ghost close" id="closeLogin">${icon("x")}</button>
    <h2>Connexion</h2>
    <div id="loginModalMsg"></div>
    <form id="loginModalForm">
      <div class="field"><label>Adresse e-mail</label><input type="email" id="lmEmail" required></div>
      <div class="field"><label>Mot de passe</label><input type="password" id="lmPassword" required></div>
      <button class="btn" type="submit" style="width:100%;justify-content:center">Se connecter</button>
    </form>
  </div></div>`;
  const close = ()=> root.innerHTML = "";
  document.getElementById("closeLogin").onclick = close;
  document.getElementById("ovLogin").addEventListener("mousedown",(e)=>{ if(e.target.id==="ovLogin") close(); });
  document.getElementById("loginModalForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = document.getElementById("lmEmail").value.trim();
    const password = document.getElementById("lmPassword").value;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if(error){
      document.getElementById("loginModalMsg").innerHTML =
        `<div class="form-msg err">${error.message==="Invalid login credentials"?"E-mail ou mot de passe incorrect.":esc(error.message)}</div>`;
      return;
    }
    close();
  });
}

// --- Signalements : un point important sur une intervention, à l'attention
// des décideurs, avec réponse directement sur le site ----------------------
async function fetchSignalements(filter){
  if(!supabaseClient) return [];
  let q = supabaseClient.from("signalements").select("*").order("created_at", { ascending:false });
  if(filter && filter.intervention_id) q = q.eq("intervention_id", filter.intervention_id);
  const { data, error } = await q;
  if(error){ console.error("Signalements indisponibles :", error); return []; }
  return data || [];
}
// `opts` = {message, urgent, categorie, photoFile}. photoFile (optional) is
// uploaded to the shared "photos" storage bucket under signalements/ first.
async function createSignalement(interventionId, opts){
  if(!supabaseClient) throw new Error("Hors-ligne : impossible d'envoyer un signalement.");
  let photo_url = null;
  if(opts.photoFile){
    const path = `signalements/${interventionId}/${Date.now()}_${opts.photoFile.name}`;
    const { error: upErr } = await supabaseClient.storage.from("photos").upload(path, opts.photoFile);
    if(upErr) throw upErr;
    const { data: pub } = supabaseClient.storage.from("photos").getPublicUrl(path);
    photo_url = pub.publicUrl;
  }
  const { error } = await supabaseClient.from("signalements")
    .insert([{ intervention_id: interventionId, message: opts.message, urgent: !!opts.urgent,
      categorie: opts.categorie || null, photo_url }]);
  if(error) throw error;
}
async function respondSignalement(id, reponse){
  if(!supabaseClient) throw new Error("Hors-ligne.");
  const { error } = await supabaseClient.from("signalements").update({ reponse }).eq("id", id);
  if(error) throw error;
}
function signalementStatusChip(s){
  return s === "traite"
    ? `<span class="chip" style="background:color-mix(in srgb, var(--good) 16%, transparent); color:var(--good)"><span class="dot" style="background:var(--good)"></span>Traité</span>`
    : `<span class="chip" style="background:color-mix(in srgb, var(--warning) 16%, transparent); color:var(--warning)"><span class="dot" style="background:var(--warning)"></span>Ouvert</span>`;
}
// `items` = rows from public.signalements. `opts.showIntervention` prefixes
// each entry with the intervention's title (for the index.html panel, which
// lists signalements across every activity). `opts.allowReply` injects an
// inline reply form under each still-open item for admin accounts; the
// reply itself sets statut='traite' server-side (trigger), never the client.
function renderSignalementsList(container, items, opts){
  opts = opts || {};
  if(!items.length){
    container.innerHTML = '<div class="empty-ok">Aucun signalement pour le moment.</div>';
    return;
  }
  container.innerHTML = `<ul class="signal-list">${items.map(s=>{
    const rec = opts.showIntervention ? RECORDS.find(r=>r.id===s.intervention_id) : null;
    return `<li class="signal-item${s.urgent? " urgent":""}">
      <div class="signal-top">
        ${signalementStatusChip(s.statut)}
        ${s.urgent? '<span class="pill warn">Urgent</span>' : ""}
        ${s.categorie? `<span class="pill">${esc(s.categorie)}</span>` : ""}
        <span class="signal-date">${new Date(s.created_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})}</span>
      </div>
      ${rec? `<div class="signal-title">${esc(rec.intitule||"(sans titre)")}${rec.programme? " · "+esc(rec.programme):""}</div>` : ""}
      <div class="signal-msg">${esc(s.message)}</div>
      ${s.photo_url? `<a href="${esc(s.photo_url)}" target="_blank" rel="noopener"><img src="${esc(s.photo_url)}" alt="Photo jointe" class="signal-photo"></a>` : ""}
      <div class="signal-meta">Signalé par ${esc(s.cree_par||"—")}</div>
      ${s.reponse
        ? `<div class="signal-reply"><strong>Réponse${s.repondu_par? " de "+esc(s.repondu_par):""} :</strong> ${esc(s.reponse)}</div>`
        : (opts.allowReply ? `<div class="signal-reply-slot" data-id="${esc(s.id)}"></div>` : "")}
    </li>`;
  }).join("")}</ul>`;
  if(opts.allowReply){
    items.filter(s=> s.statut!=="traite").forEach(s=>{
      const slot = container.querySelector(`.signal-reply-slot[data-id="${s.id}"]`);
      if(!slot) return;
      slot.innerHTML = `<form class="signal-reply-form">
        <textarea placeholder="Votre réponse…" required></textarea>
        <div class="signal-reply-msg"></div>
        <button class="btn btn-sm" type="submit">Répondre</button>
      </form>`;
      slot.querySelector("form").addEventListener("submit", async (e)=>{
        e.preventDefault();
        const form = e.target;
        const ta = form.querySelector("textarea");
        const btn = form.querySelector("button");
        const msg = form.querySelector(".signal-reply-msg");
        btn.disabled = true;
        try{
          await respondSignalement(s.id, ta.value.trim());
          if(opts.onChange) opts.onChange();
        }catch(err){
          msg.innerHTML = `<div class="form-msg err">Erreur : ${esc(err.message||String(err))}</div>`;
          btn.disabled = false;
        }
      });
    });
  }
}

// --- Qualité des données : alertes d'incohérence détectées automatiquement --
// Renvoie [{id, intitule, programme, message}] pour chaque intervention dont
// les champs semblent incohérents entre eux. Purement informatif : n'écrit
// jamais rien en base, sert seulement à attirer l'attention d'un décideur.
function dataQualityIssues(records){
  const issues = [];
  records.forEach(r=>{
    const pct = Number(r.avancement_pct);
    if(!isNaN(pct) && pct >= 100 && !["Achevé","Clôturé"].includes(r.statut)){
      issues.push({ id:r.id, intitule:r.intitule, programme:r.programme,
        message:`Avancement à 100% mais statut toujours « ${r.statut||"—"} ».` });
    }
    const isInfraType = flattenProgramTypes(r.programme).some(t=> t.label === r.type_intervention && t.group === "Infrastructure") || r.type_intervention === "Infrastructure";
    if(isInfraType && !isNaN(pct) && pct >= 80 && (r.lat==null || r.lng==null)){
      issues.push({ id:r.id, intitule:r.intitule, programme:r.programme,
        message:`Infrastructure avancée à ${Math.round(pct)}% sans coordonnées géographiques renseignées.` });
    }
  });
  return issues;
}
function renderDataQuality(container, records){
  const issues = dataQualityIssues(records);
  if(!issues.length){
    container.innerHTML = '<div class="empty-ok">Aucune incohérence détectée.</div>';
    return;
  }
  container.innerHTML = `<ul class="alert-list">${issues.map(it=>`
    <li data-id="${esc(it.id)}" style="cursor:pointer">
      <span><span class="t">${esc(it.intitule||"(sans titre)")}</span><br><span class="s">${esc(it.message)}</span></span>
      ${it.programme? `<span class="pill">${esc(it.programme)}</span>` : ""}
    </li>`).join("")}</ul>`;
  container.querySelectorAll("li[data-id]").forEach(li=> li.onclick = ()=> openDetail(li.dataset.id));
}

// Small red dot on "Vue décideurs" in the nav when at least one urgent
// signalement is still open -- present on all 3 pages as a lightweight
// substitute for email alerts (works even without an email service wired up).
async function renderNavBadge(){
  const el = document.getElementById("navUrgentBadge");
  if(!el || !supabaseClient) return;
  const items = await fetchSignalements();
  const count = items.filter(s=> s.urgent && s.statut!=="traite").length;
  el.hidden = count === 0;
}

// Loads records live from Supabase when configured; falls back to the
// data.js snapshot (generated from the Excel workbook) otherwise, or if the
// Supabase request fails (offline, misconfigured keys, etc.) so the site
// never shows a blank page.
async function initRecords(){
  if(supabaseClient){
    try{
      const { data, error } = await supabaseClient
        .from("interventions")
        .select("*")
        .order("created_at", { ascending: true });
      if(error) throw error;
      RECORDS = (data||[]).map(r=> Object.assign({}, r));
      let latest = null;
      RECORDS.forEach(r=>{ if(r.updated_at && (!latest || r.updated_at > latest)) latest = r.updated_at; });
      LAST_UPDATED = latest
        ? new Date(latest).toLocaleDateString("fr-FR", {day:"2-digit", month:"short", year:"numeric"})
        : (window.__TAAZOUR_UPDATED__ || "");
      return RECORDS;
    }catch(e){
      console.error("Supabase indisponible, bascule sur data.js :", e);
    }
  }
  RECORDS = (window.__TAAZOUR_DATA__||[]).map((r,i)=> Object.assign({id:"r"+i}, r));
  LAST_UPDATED = window.__TAAZOUR_UPDATED__ || "";
  return RECORDS;
}

const _chartInstances = {};
function resolveColor(c){
  if(typeof c==="string" && c.startsWith("var(")){
    return getComputedStyle(document.documentElement).getPropertyValue(c.slice(4,-1)).trim();
  }
  return c;
}
// Dynamic, animated horizontal bar chart (Chart.js). `container` is a plain
// <div>; a <canvas> is created inside it. `rows` = [{label, color, count}].
function barChart(container, rows){
  const id = container.id || (container.id = "chart-"+Math.random().toString(36).slice(2));
  if(_chartInstances[id]){ _chartInstances[id].destroy(); delete _chartInstances[id]; }
  if(!rows.length){ container.innerHTML = '<div class="empty-chart">Aucune donnée pour le moment.</div>'; return; }
  container.innerHTML = '<div class="chart-canvas-wrap"><canvas></canvas></div>';
  const canvas = container.querySelector("canvas");
  const textColor = resolveColor("var(--text-2)");
  const gridColor = resolveColor("var(--border)");
  const surface = resolveColor("var(--surface)");
  if(typeof Chart === "undefined"){
    // Chart.js failed to load (offline / blocked CDN) -- fall back to a
    // simple accessible bar list instead of a blank panel.
    const max = Math.max(1, ...rows.map(r=>r.count));
    container.innerHTML = rows.map(r=>`
      <div class="bar-row">
        <div class="nm">${esc(r.label)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(3, r.count/max*100)}%;background:${r.color}"></div></div>
        <div class="ct">${r.count}</div>
      </div>`).join("");
    return;
  }
  _chartInstances[id] = new Chart(canvas, {
    type: "bar",
    data: {
      labels: rows.map(r=>r.label),
      datasets: [{
        data: rows.map(r=>r.count),
        backgroundColor: rows.map(r=>resolveColor(r.color)),
        borderRadius: 5,
        maxBarThickness: 26
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 650, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: surface, titleColor: textColor, bodyColor: textColor,
          borderColor: gridColor, borderWidth: 1, padding: 8,
          callbacks: { label: (ctx)=> " "+Number(ctx.parsed.x).toLocaleString("fr-FR") }
        }
      },
      scales: {
        x: { beginAtZero: true, ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { display: false } }
      }
    }
  });
}

// Donut / share-of-total chart (Chart.js) with a centered total and a legend
// list showing each slice's percentage. `rows` = [{label, color, count}].
function donutChart(container, rows){
  const id = container.id || (container.id = "chart-"+Math.random().toString(36).slice(2));
  if(_chartInstances[id]){ _chartInstances[id].destroy(); delete _chartInstances[id]; }
  if(!rows.length){ container.innerHTML = '<div class="empty-chart">Aucune donnée pour le moment.</div>'; return; }
  rows = rows.slice().sort((a,b)=> b.count - a.count);
  const total = rows.reduce((a,r)=>a+r.count,0);
  const legendHtml = rows.map(r=>`
    <li><i style="background:${resolveColor(r.color)}"></i><span class="dl-label">${esc(r.label)}</span><span class="dl-pct">${total? Math.round(r.count/total*100):0}%</span></li>`).join("");
  container.innerHTML = `<div class="donut-flex">
    <div class="donut-canvas-wrap"><canvas></canvas>
      <div class="donut-center"><div class="donut-total">${fmtNum(total)}</div><div class="donut-total-label">total</div></div>
    </div>
    <ul class="donut-legend">${legendHtml}</ul>
  </div>`;
  if(typeof Chart === "undefined"){
    // Fallback when Chart.js can't load: the legend list above already
    // conveys the breakdown, so just drop the empty canvas wrapper.
    container.querySelector(".donut-canvas-wrap").remove();
    return;
  }
  const canvas = container.querySelector("canvas");
  const textColor = resolveColor("var(--text-2)");
  const surface = resolveColor("var(--surface)");
  const gridColor = resolveColor("var(--border)");
  _chartInstances[id] = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: rows.map(r=>r.label),
      datasets: [{
        data: rows.map(r=>r.count),
        backgroundColor: rows.map(r=>resolveColor(r.color)),
        borderWidth: 2,
        borderColor: surface,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      animation: { duration: 650, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: surface, titleColor: textColor, bodyColor: textColor,
          borderColor: gridColor, borderWidth: 1, padding: 8,
          callbacks: { label: (ctx)=> " "+ctx.label+" : "+Number(ctx.parsed).toLocaleString("fr-FR") }
        }
      }
    }
  });
}

// Two-series horizontal comparison bar chart (Chart.js) -- e.g. engagé vs
// décaissé, or ciblés vs atteints, grouped per category. `rows` =
// [{label, a, b}]. `series` = {aLabel, bLabel, aColor, bColor, fmt}.
function comparisonBarChart(container, rows, series){
  const id = container.id || (container.id = "chart-"+Math.random().toString(36).slice(2));
  if(_chartInstances[id]){ _chartInstances[id].destroy(); delete _chartInstances[id]; }
  if(!rows.length){ container.innerHTML = '<div class="empty-chart">Aucune donnée pour le moment.</div>'; return; }
  rows = rows.slice().sort((x,y)=> (y.a+y.b) - (x.a+x.b));
  const fmt = series.fmt || (n => Number(n).toLocaleString("fr-FR"));
  const legendHtml = `<div class="chart-legend-row">
    <span><i style="background:${resolveColor(series.aColor)}"></i>${esc(series.aLabel)}</span>
    <span><i style="background:${resolveColor(series.bColor)}"></i>${esc(series.bLabel)}</span>
  </div>`;
  container.innerHTML = legendHtml + '<div class="chart-canvas-wrap" style="height:'+Math.max(160, rows.length*54)+'px"><canvas></canvas></div>';
  if(typeof Chart === "undefined"){
    const max = Math.max(1, ...rows.map(r=>Math.max(r.a,r.b)));
    container.querySelector(".chart-canvas-wrap").outerHTML = rows.map(r=>`
      <div class="bar-row" style="grid-template-columns:122px 1fr 70px"><div class="nm">${esc(r.label)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(3,r.a/max*100)}%;background:${resolveColor(series.aColor)}"></div></div>
        <div class="ct">${fmt(r.a)}</div></div>
      <div class="bar-row" style="grid-template-columns:122px 1fr 70px;margin-top:-2px"><div class="nm"></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(3,r.b/max*100)}%;background:${resolveColor(series.bColor)}"></div></div>
        <div class="ct">${fmt(r.b)}</div></div>`).join("");
    return;
  }
  const canvas = container.querySelector("canvas");
  const textColor = resolveColor("var(--text-2)");
  const gridColor = resolveColor("var(--border)");
  const surface = resolveColor("var(--surface)");
  _chartInstances[id] = new Chart(canvas, {
    type: "bar",
    data: {
      labels: rows.map(r=>r.label),
      datasets: [
        { label: series.aLabel, data: rows.map(r=>r.a), backgroundColor: resolveColor(series.aColor), borderRadius: 4, maxBarThickness: 16 },
        { label: series.bLabel, data: rows.map(r=>r.b), backgroundColor: resolveColor(series.bColor), borderRadius: 4, maxBarThickness: 16 },
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 650, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: surface, titleColor: textColor, bodyColor: textColor,
          borderColor: gridColor, borderWidth: 1, padding: 8,
          callbacks: { label: (ctx)=> " "+ctx.dataset.label+" : "+fmt(ctx.parsed.x) }
        }
      },
      scales: {
        x: { beginAtZero: true, ticks: { color: textColor, callback: (v)=> fmt(v) }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { display: false } }
      }
    }
  });
}

// Groups records by the month of a date field (e.g. "date_demarrage"),
// returns a chronologically-sorted [{label, ym, count}] covering every month
// from the earliest record to today (so quiet months show as zero, not gaps).
function monthlyCounts(records, dateKey){
  const byMonth = {};
  records.forEach(r=>{
    const raw = r[dateKey];
    if(!raw) return;
    const ym = String(raw).slice(0,7); // "YYYY-MM"
    if(!/^\d{4}-\d{2}$/.test(ym)) return;
    byMonth[ym] = (byMonth[ym]||0) + 1;
  });
  const months = Object.keys(byMonth);
  if(!months.length) return [];
  months.sort();
  let [y,m] = months[0].split("-").map(Number);
  const [ly,lm] = months[months.length-1].split("-").map(Number);
  const out = [];
  while(y < ly || (y===ly && m<=lm)){
    const ym = y+"-"+String(m).padStart(2,"0");
    const d = new Date(y, m-1, 1);
    out.push({ label: d.toLocaleDateString("fr-FR",{month:"short",year:"2-digit"}), ym, count: byMonth[ym]||0 });
    m++; if(m>12){ m=1; y++; }
  }
  return out;
}

// Line/area trend chart (Chart.js) -- `points` = [{label, count}], in
// chronological order. Falls back to a compact bar list when Chart.js can't
// load.
function trendChart(container, points, color){
  const id = container.id || (container.id = "chart-"+Math.random().toString(36).slice(2));
  if(_chartInstances[id]){ _chartInstances[id].destroy(); delete _chartInstances[id]; }
  if(!points.length){ container.innerHTML = '<div class="empty-chart">Aucune donnée pour le moment.</div>'; return; }
  const c = color || "var(--accent)";
  container.innerHTML = '<div class="chart-canvas-wrap" style="height:220px"><canvas></canvas></div>';
  if(typeof Chart === "undefined"){
    const max = Math.max(1, ...points.map(p=>p.count));
    container.innerHTML = points.map(p=>`
      <div class="bar-row"><div class="nm">${esc(p.label)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(3,p.count/max*100)}%;background:${resolveColor(c)}"></div></div>
        <div class="ct">${p.count}</div></div>`).join("");
    return;
  }
  const canvas = container.querySelector("canvas");
  const textColor = resolveColor("var(--text-2)");
  const gridColor = resolveColor("var(--border)");
  const surface = resolveColor("var(--surface)");
  const lineColor = resolveColor(c);
  _chartInstances[id] = new Chart(canvas, {
    type: "line",
    data: {
      labels: points.map(p=>p.label),
      datasets: [{
        data: points.map(p=>p.count),
        borderColor: lineColor,
        backgroundColor: lineColor.startsWith("#")
          ? lineColor + "26"
          : lineColor.replace(/rgba?\(([^)]+)\)/, (m,v)=> "rgba("+v.split(",").slice(0,3).join(",")+",0.15)"),
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: lineColor,
        pointBorderColor: surface,
        pointBorderWidth: 1.5,
        borderWidth: 2.5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 650, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: surface, titleColor: textColor, bodyColor: textColor,
          borderColor: gridColor, borderWidth: 1, padding: 8,
          callbacks: { label: (ctx)=> " "+Number(ctx.parsed.y).toLocaleString("fr-FR")+" intervention(s)" }
        }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } }
      }
    }
  });
}

// Shared stat-tile renderer -- `tiles` = [{label, value, sub, icon}]. Adds a
// staggered rise-in on first render so the row of figures reads as a single
// composed moment rather than popping in all at once.
function renderStatTiles(el, tiles){
  el.innerHTML = tiles.map((t,i)=>`
    <div class="stat rise rise-${Math.min(i+1,6)}">
      <div class="stat-top"><div class="label">${esc(t.label)}</div><div class="stat-icon">${icon(t.icon||"info")}</div></div>
      <div class="value">${t.value}</div>
      <div class="sub">${esc(t.sub||"")}</div>
    </div>`).join("");
}

function renderBanner(el){
  const source = supabaseClient
    ? "Données saisies via le formulaire en ligne et/ou le classeur Excel « Base_Referentiel_TAAZOUR »."
    : "Données saisies dans le classeur Excel « Base_Referentiel_TAAZOUR » puis republiées ici.";
  el.innerHTML = `<div class="readonly-banner">${icon("info")}Toutes interventions TAAZOUR confondues (DARI, Tékavoul, Temwine, Albarka, Cheyla, registre social). ${source}${LAST_UPDATED? " &mdash; dernière mise à jour : "+esc(LAST_UPDATED):""}</div>`;
}

// Theme toggle -- persists the viewer's explicit choice in localStorage
// (per-browser convenience only; never read back by Claude). Falls back to
// following the OS setting (no [data-theme] attribute) when unset or when
// storage is unavailable (private browsing, blocked site data, etc.).
function initThemeToggle(btnId){
  const root = document.documentElement;
  let stored = null;
  try{ stored = localStorage.getItem("taazour-theme"); }catch(e){ /* ignore */ }
  if(stored === "dark" || stored === "light") root.setAttribute("data-theme", stored);
  const btn = document.getElementById(btnId);
  if(!btn) return;
  btn.innerHTML = icon("sun") + icon("moon");
  btn.setAttribute("aria-label", "Changer de thème (clair / sombre)");
  btn.onclick = ()=>{
    const current = root.getAttribute("data-theme")
      || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try{ localStorage.setItem("taazour-theme", next); }catch(e){ /* ignore */ }
  };
}

// Shared Leaflet map renderer -- `mapId` is the id of an empty <div> sized by
// CSS (.geo-map); `rows` are the records to plot (only those with lat/lng
// show). Keeps one Leaflet map instance per mapId across re-renders.
const _leafletMaps = {};
function renderGeoMap(mapId, rows){
  const geo = rows.filter(r=> r.lat!=null && r.lng!=null && r.lat!=="" && r.lng!=="" && !isNaN(r.lat) && !isNaN(r.lng));
  const el = document.getElementById(mapId);
  if(typeof L === "undefined"){
    el.innerHTML = `<div class="empty-state"><div class="big">${icon("mapOff")}</div><h3>Carte indisponible hors-ligne</h3><p>Une connexion internet est nécessaire pour charger le fond de carte.</p></div>`;
    return null; // distinct from 0 (loaded fine, but nothing to plot)
  }
  if(!_leafletMaps[mapId]){
    const map = L.map(mapId, {scrollWheelZoom:false}).setView([20.0, -10.5], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    _leafletMaps[mapId] = { map, layer: L.layerGroup().addTo(map) };
  }
  const { map, layer } = _leafletMaps[mapId];
  layer.clearLayers();
  geo.forEach(r=>{
    const d = statutDef(effectiveStatut(r));
    const marker = L.circleMarker([Number(r.lat), Number(r.lng)], {
      radius: 7, color: "#fff", weight: 1.5, fillColor: resolveColor(d.c), fillOpacity: 0.9
    });
    marker.bindPopup(`<strong>${esc(r.intitule||"(sans titre)")}</strong><br>${esc(r.region||"")}<br>${esc(r.statut||"")}`);
    marker.on("click", ()=> openDetail(r.id));
    marker.addTo(layer);
  });
  setTimeout(()=>{
    map.invalidateSize();
    if(geo.length){
      map.fitBounds(L.latLngBounds(geo.map(r=>[Number(r.lat), Number(r.lng)])).pad(0.25));
    }
  }, 50);
  return geo.length;
}

// Thumbnail strip for a record's photos (r.photos = [{url, name?}, ...]).
// Clicking a thumbnail opens it full-size in a lightweight lightbox layered
// above the detail modal. Returns "" when the record has no photos.
function photoGalleryHtml(r){
  const photos = Array.isArray(r.photos) ? r.photos.filter(p=>p && p.url) : [];
  if(!photos.length) return "";
  const thumbs = photos.map((p,i)=>
    `<div class="photo-thumb" data-idx="${i}" style="background-image:url('${esc(p.url)}')" role="button" aria-label="Agrandir la photo"></div>`
  ).join("");
  return `<div class="section-title">Photos</div><div class="photo-strip">${thumbs}</div>`;
}

function wirePhotoGallery(root, r){
  const photos = Array.isArray(r.photos) ? r.photos.filter(p=>p && p.url) : [];
  root.querySelectorAll(".photo-thumb").forEach(el=>{
    el.onclick = ()=>{
      const p = photos[Number(el.dataset.idx)];
      if(!p) return;
      const lb = document.createElement("div");
      lb.className = "overlay lightbox";
      lb.innerHTML = `<img src="${esc(p.url)}" alt="${esc(p.name||r.intitule||"Photo")}">
        <button class="btn btn-ghost close" style="position:fixed;top:18px;right:18px">${icon("x")}</button>`;
      lb.addEventListener("mousedown",(e)=>{ if(e.target===lb || e.target.classList.contains("close")) lb.remove(); });
      document.body.appendChild(lb);
    };
  });
}

function openDetail(id){
  const r = RECORDS.find(x=>x.id===id);
  if(!r) return;
  const groupsHtml = DETAIL_GROUPS.map(g=>{
    const rows = g.fields.map(([key,label,kind])=>{
      const v = fmtField(r[key], kind);
      return v==null ? null : `<dt>${esc(label)}</dt><dd>${v}</dd>`;
    }).filter(Boolean);
    if(!rows.length) return "";
    return `<div class="section-title">${esc(g.title)}</div>${rows.join("")}`;
  }).join("");
  const root = document.getElementById("modalRoot");
  root.innerHTML = `
    <div class="overlay" id="ovd">
      <div class="modal detail">
        <button class="btn btn-ghost close" id="closeDetail">${icon("x")}</button>
        <h2>${esc(r.intitule||"(sans titre)")}</h2>
        <div class="sub">${esc(r.type_intervention||"")}${r.programme? " · "+esc(r.programme):""} &nbsp; ${statusChip(effectiveStatut(r))}</div>
        ${photoGalleryHtml(r)}
        <dl>${groupsHtml}</dl>
        <div class="meta-line">${r.ajoute_par? "Ajouté par "+esc(r.ajoute_par):""}${r.modifie_par && r.modifie_par!==r.ajoute_par? " · dernière modification par "+esc(r.modifie_par):""}
          ${CURRENT_USER ? ` · <a href="#" id="toggleAudit">Voir l'historique des modifications</a>` : ""}
        </div>
        ${CURRENT_USER ? `<div id="auditSection" hidden><div class="section-title">Historique des modifications</div><div id="auditList"><p style="font-size:12px;color:var(--text-2)">Chargement…</p></div></div>` : ""}
        <div class="section-title">Signalements aux décideurs</div>
        <div id="signalSection"><p style="font-size:12px;color:var(--text-2)">Chargement…</p></div>
        ${CURRENT_USER ? `
          <form id="newSignalForm" class="signal-new">
            <textarea id="signalMsg" placeholder="Signaler un point important sur cette intervention, à l'attention des décideurs…" required></textarea>
            <select id="signalCategorie"><option value="">Catégorie (optionnel)</option>${SIGNALEMENT_CATEGORIES.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("")}</select>
            <input type="file" id="signalPhoto" accept="image/*">
            <label class="signal-urgent-label"><input type="checkbox" id="signalUrgent"> Marquer comme urgent</label>
            <div id="signalFormMsg"></div>
            <button class="btn btn-sm" type="submit">Envoyer aux décideurs</button>
          </form>` : `
          <p style="font-size:12px;color:var(--text-2)">
            <a href="#" id="signalLoginLink">Connectez-vous</a> pour signaler un point sur cette intervention.
          </p>`}
        ${canDeleteIntervention(r) ? `
          <div id="deleteZone">
            <button class="btn btn-ghost" id="deleteBtn" style="color:var(--critical)">${icon("x")} Supprimer cette intervention</button>
          </div>` : ""}
        <div class="modal-actions"><button class="btn" id="closeDetail2">Fermer</button></div>
      </div>
    </div>
  `;
  wirePhotoGallery(root, r);
  const close = ()=> root.innerHTML="";
  document.getElementById("closeDetail").onclick = close;
  document.getElementById("closeDetail2").onclick = close;
  document.getElementById("ovd").addEventListener("mousedown",(e)=>{ if(e.target.id==="ovd") close(); });

  const deleteBtn = document.getElementById("deleteBtn");
  if(deleteBtn){
    deleteBtn.onclick = ()=>{
      const zone = document.getElementById("deleteZone");
      zone.innerHTML = `
        <div class="delete-confirm">
          <span>Supprimer définitivement « ${esc(r.intitule||"cette intervention")} » ? Cette action est irréversible.</span>
          <div class="delete-confirm-actions">
            <button class="btn btn-ghost" id="cancelDeleteBtn">Annuler</button>
            <button class="btn" id="confirmDeleteBtn" style="background:var(--critical);color:#fff">Confirmer la suppression</button>
          </div>
          <div id="deleteMsg"></div>
        </div>`;
      document.getElementById("cancelDeleteBtn").onclick = ()=>{
        zone.innerHTML = `<button class="btn btn-ghost" id="deleteBtn" style="color:var(--critical)">${icon("x")} Supprimer cette intervention</button>`;
        document.getElementById("deleteBtn").onclick = deleteBtn.onclick;
      };
      document.getElementById("confirmDeleteBtn").onclick = async ()=>{
        const confirmBtn = document.getElementById("confirmDeleteBtn");
        const msg = document.getElementById("deleteMsg");
        confirmBtn.disabled = true;
        try{
          await deleteIntervention(r.id);
          close();
          RECORDS = RECORDS.filter(x=> x.id !== r.id);
          if(typeof onInterventionDeleted === "function") onInterventionDeleted(r.id);
        }catch(err){
          msg.innerHTML = `<div class="form-msg err">Erreur : ${esc(err.message||String(err))}</div>`;
          confirmBtn.disabled = false;
        }
      };
    };
  }

  const loginLink = document.getElementById("signalLoginLink");
  if(loginLink) loginLink.onclick = (e)=>{ e.preventDefault(); openLoginModal(); };

  const toggleAudit = document.getElementById("toggleAudit");
  if(toggleAudit){
    let loaded = false;
    toggleAudit.onclick = async (e)=>{
      e.preventDefault();
      const section = document.getElementById("auditSection");
      if(!section) return;
      section.hidden = !section.hidden;
      toggleAudit.textContent = section.hidden ? "Voir l'historique des modifications" : "Masquer l'historique des modifications";
      if(!section.hidden && !loaded){
        loaded = true;
        const logs = await fetchAuditLog(r.id);
        const list = document.getElementById("auditList");
        if(list) renderAuditLog(list, logs);
      }
    };
  }

  async function refreshSignalSection(){
    const section = document.getElementById("signalSection");
    if(!section) return; // modal was closed in the meantime
    const items = await fetchSignalements({ intervention_id: r.id });
    renderSignalementsList(section, items, { allowReply: canRespondSignalements(), onChange: refreshSignalSection });
  }
  refreshSignalSection();

  const newForm = document.getElementById("newSignalForm");
  if(newForm){
    newForm.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const msg = document.getElementById("signalFormMsg");
      const btn = newForm.querySelector("button");
      const text = document.getElementById("signalMsg").value.trim();
      const urgent = document.getElementById("signalUrgent").checked;
      const categorie = document.getElementById("signalCategorie").value;
      const photoFile = document.getElementById("signalPhoto").files[0] || null;
      btn.disabled = true;
      try{
        await createSignalement(r.id, { message:text, urgent, categorie, photoFile });
        newForm.reset();
        msg.innerHTML = `<div class="form-msg ok">Signalement envoyé aux décideurs.</div>`;
        refreshSignalSection();
      }catch(err){
        msg.innerHTML = `<div class="form-msg err">Erreur : ${esc(err.message||String(err))}</div>`;
      }finally{
        btn.disabled = false;
      }
    });
  }
}
