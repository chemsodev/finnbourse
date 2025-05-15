export type AccountHolderData = {
  id: number;
  code: string;
  libelle: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  telephone: string;
  email: string;
  statut: string;
  dateCreation: string;
  swift?: string;
  typeCompte?: string;
  iban?: string;
  numeroCompte?: string;
  devise?: string;
  contactNom?: string;
  contactPrenom?: string;
  contactTelephone?: string;
  contactEmail?: string;
  numeroAgrement?: string;
  dateAgrement?: string;
  autoriteSurveillance?: string;
  codeCorrespondant?: string;
  nomCorrespondant?: string;
  commissionFixe?: string;
  commissionVariable?: string;
  tauxTva?: string;
  commentaire?: string;
};

export const accountHolderData: AccountHolderData[] = [
  {
    id: 1,
    code: "TCT001",
    libelle: "BANQUE DE DEVELOPPEMENT LOCAL",
    adresse: "38, Rue des Frères Bouaddou, Bir Mourad Rais",
    codePostal: "16000",
    ville: "Alger",
    pays: "Algérie",
    telephone: "+213 23 56 91 57",
    email: "contact@bdl.dz",
    statut: "Actif",
    dateCreation: "2019-11-05",
    typeCompte: "Banque Locale",
    numeroAgrement: "COSOB-BDL-01",
    autoriteSurveillance: "COSOB",
    commentaire:
      "Direction de la Trésorerie et des Marchés(DTM), Département des Valeurs Mobilières (DVM)",
  },
  {
    id: 2,
    code: "TCT002",
    libelle: "BANQUE EXTERIEURE D'ALGERIE",
    adresse: "2, Boulevard Mohamed V",
    codePostal: "16000",
    ville: "Alger",
    pays: "Algérie",
    telephone: "+213 21 63 72 42",
    email: "contact@bea.dz",
    statut: "Actif",
    dateCreation: "2019-10-15",
    typeCompte: "Banque Locale",
    numeroAgrement: "COSOB-BEA-02",
    autoriteSurveillance: "COSOB",
    commentaire: "Direction de la Trésorerie et du Marché (DTM)",
  },
  {
    id: 3,
    code: "TCT003",
    libelle: "BANQUE DE L'AGRICULTURE ET DU DÉVELOPPEMENT RURAL",
    adresse: "01, Rue Azile Ali",
    codePostal: "16000",
    ville: "Alger",
    pays: "Algérie",
    telephone: "+213 21 74 31 93",
    email: "contact@badr.dz",
    statut: "Actif",
    dateCreation: "2019-09-20",
    typeCompte: "Banque Locale",
    numeroAgrement: "COSOB-BADR-03",
    autoriteSurveillance: "COSOB",
    commentaire: "Direction de la Trésorerie et des Marchés des Capitaux",
  },
  {
    id: 4,
    code: "TCT004",
    libelle: "CREDIT POPULAIRE D'ALGERIE",
    adresse: "Résidence Chaabani Bloc A3, Val d'Hydra",
    codePostal: "16035",
    ville: "Alger",
    pays: "Algérie",
    telephone: "+213 21 60 12 65",
    email: "contact@cpa.dz",
    statut: "Actif",
    dateCreation: "2020-02-10",
    typeCompte: "Conservateur",
    numeroAgrement: "COSOB-CPA-04",
    autoriteSurveillance: "COSOB",
    commentaire: "Direction de la Gestion des Valeurs Mobilières (DGVM)",
  },
  {
    id: 5,
    code: "TCT005",
    libelle: "BANQUE NATIONALE D'ALGERIE",
    adresse: "12, Rue Hassiba Ben Bouali",
    codePostal: "16000",
    ville: "Alger",
    pays: "Algérie",
    telephone: "+213 21 73 29 51",
    email: "contact@bna.dz",
    statut: "Actif",
    dateCreation: "2019-05-20",
    typeCompte: "Dépositaire",
    numeroAgrement: "COSOB-BNA-05",
    autoriteSurveillance: "COSOB",
    commentaire: "Direction des Finances et des Marchés Financiers (DMF)",
  },
  {
    id: 6,
    code: "TCT006",
    libelle: "CAISSE NATIONALE D'EPARGNE ET DE PREVOYANCE",
    adresse: "Tour Les Halls Hassiba Ben Bouali",
    codePostal: "16000",
    ville: "Alger",
    pays: "Algérie",
    telephone: "+213 21 51 12 22",
    email: "contact@cnepbanque.dz",
    statut: "Actif",
    dateCreation: "2019-04-15",
    typeCompte: "Banque Locale",
    numeroAgrement: "COSOB-CNEP-06",
    autoriteSurveillance: "COSOB",
    commentaire: "Direction des finances (DF)",
  },
];
export type Marche = {
  id: number;
  titre: string;
  code: string;
  ouverture: number;
  var: string;
  validite: string;
  cloture: string;
};
export const data: Marche[] = [
  {
    id: 1,
    titre: "Biopharm",
    code: "bio",
    ouverture: 450.0,
    cloture: "NC",
    var: "0.00",
    validite: "1 janvier 2024",
  },
  {
    id: 2,
    titre: "Alliance Assurances",
    code: "all",
    ouverture: 990.0,
    cloture: "NC",
    var: "0.00",
    validite: "1 janvier 2024",
  },
  {
    id: 3,
    titre: "EGH El Aurassi",
    code: "egh",
    ouverture: 2050.0,
    cloture: "NC",
    var: "0.00",
    validite: "1 janvier 2024",
  },
  {
    id: 4,
    titre: "Credit Populaire D'Algérie",
    code: "cpa",
    ouverture: 1200.0,
    cloture: "NC",
    var: "0.00",
    validite: "1 janvier 2024",
  },
];

export const invoices = [
  {
    id: 1,
    titre: "Biopharm",
    code: "BIO",
    sens: "achat",
    quantite: "98",
    statut: "Validé",
    type: "action",
  },
  {
    id: 2,
    titre: "Saidal",
    code: "SAI",
    sens: "vente",
    quantite: "23",
    statut: "En Attente",
    type: "action",
  },
  {
    id: 3,
    titre: "Alliance Assurances",
    code: "ALL",
    sens: "achat",
    quantite: "11",
    statut: "En Cours",
    type: "obligation",
  },
  {
    id: 4,
    titre: "EGH El Aurassi",
    code: "EGH",
    sens: "vente",
    quantite: "124",
    statut: "Échu",
    type: "obligation",
  },
  {
    id: 5,
    titre: "Credit Populaire D'algérie",
    code: "CPA",
    sens: "achat",
    quantite: "65",
    statut: "Validé Partiellement",
    type: "action",
  },
];

export const chartData = [
  { date: "2024-04-27", Saidal: 383, Biopharm: 420 },
  { date: "2024-04-28", Saidal: 122, Biopharm: 180 },
  { date: "2024-04-29", Saidal: 315, Biopharm: 240 },
  { date: "2024-04-30", Saidal: 454, Biopharm: 380 },
  { date: "2024-05-01", Saidal: 165, Biopharm: 220 },
  { date: "2024-05-02", Saidal: 293, Biopharm: 310 },
  { date: "2024-05-03", Saidal: 247, Biopharm: 190 },
  { date: "2024-05-04", Saidal: 385, Biopharm: 420 },
  { date: "2024-05-05", Saidal: 481, Biopharm: 390 },
  { date: "2024-05-06", Saidal: 498, Biopharm: 520 },
  { date: "2024-05-30", Saidal: 340, Biopharm: 280 },
  { date: "2024-05-31", Saidal: 178, Biopharm: 230 },
  { date: "2024-06-01", Saidal: 178, Biopharm: 200 },
  { date: "2024-06-02", Saidal: 470, Biopharm: 410 },
  { date: "2024-06-03", Saidal: 103, Biopharm: 160 },
  { date: "2024-06-04", Saidal: 439, Biopharm: 380 },
  { date: "2024-06-05", Saidal: 88, Biopharm: 140 },
  { date: "2024-06-06", Saidal: 294, Biopharm: 250 },
  { date: "2024-06-07", Saidal: 323, Biopharm: 370 },
  { date: "2024-06-08", Saidal: 385, Biopharm: 320 },
  { date: "2024-06-09", Saidal: 438, Biopharm: 480 },
  { date: "2024-06-10", Saidal: 155, Biopharm: 200 },
  { date: "2024-06-11", Saidal: 92, Biopharm: 150 },
  { date: "2024-06-12", Saidal: 492, Biopharm: 420 },
  { date: "2024-06-13", Saidal: 81, Biopharm: 130 },
  { date: "2024-06-14", Saidal: 426, Biopharm: 380 },
  { date: "2024-06-15", Saidal: 307, Biopharm: 350 },
  { date: "2024-06-16", Saidal: 371, Biopharm: 310 },
  { date: "2024-06-17", Saidal: 475, Biopharm: 520 },
  { date: "2024-06-18", Saidal: 107, Biopharm: 170 },
  { date: "2024-06-19", Saidal: 341, Biopharm: 290 },
  { date: "2024-06-28", Saidal: 149, Biopharm: 200 },
  { date: "2024-06-29", Saidal: 103, Biopharm: 160 },
  { date: "2024-06-30", Saidal: 446, Biopharm: 400 },
];

export const orders = [
  {
    id: "ORD-001",
    titre: "Biopharm",
    sens: "achat",
    validite: "GTC", // Good Till Canceled
    quantite: "98",
    nature: "action",
  },
  {
    id: "ORD-002",
    titre: "Saidal",
    sens: "vente",
    validite: "Jour", // Day
    quantite: "23",
    nature: "action",
  },
  {
    id: "ORD-003",
    titre: "Alliance Assurances",
    sens: "achat",
    validite: "A la clôture", // At the Close
    quantite: "11",
    nature: "obligation",
  },
  {
    id: "ORD-004",
    titre: "EGH El Aurassi",
    sens: "vente",
    validite: "GTC",
    quantite: "124",
    nature: "obligation",
  },
  {
    id: "ORD-005",
    titre: "Crédit Populaire D'Algérie",
    sens: "achat",
    validite: "Jour",
    quantite: "65",
    nature: "action",
  },
  {
    id: "ORD-006",
    titre: "Sonatrach",
    sens: "achat",
    validite: "A la clôture",
    quantite: "156",
    nature: "action",
  },
  {
    id: "ORD-007",
    titre: "Air Algérie",
    sens: "vente",
    validite: "Jour",
    quantite: "34",
    nature: "obligation",
  },
  {
    id: "ORD-008",
    titre: "Mobilis",
    sens: "achat",
    validite: "GTC",
    quantite: "78",
    nature: "action",
  },
];

export const clients = [
  {
    id: "CLI-001",
    nom: "Ali Ben Mohamed",
    type: "particulier",
    adresse: "12 Rue des Jasmins, Alger",
    telephone: "+213 555 123 456",
  },
  {
    id: "CLI-002",
    nom: "Entreprise Saïdal",
    type: "entreprise",
    adresse: "Zone Industrielle, Sidi Bel Abbes",
    telephone: "+213 550 987 654",
  },
  {
    id: "CLI-003",
    nom: "Fatima Amrani",
    type: "particulier",
    adresse: "45 Boulevard Zighoud Youcef, Oran",
    telephone: "+213 661 789 012",
  },
  {
    id: "CLI-004",
    nom: "FinnBourse Algérie",
    type: "entreprise",
    adresse: "10 Avenue Khemisti, Alger",
    telephone: "+213 770 321 654",
  },
  {
    id: "CLI-005",
    nom: "Rachid Boukhalfa",
    type: "particulier",
    adresse: "5 Rue Larbi Ben M'Hidi, Constantine",
    telephone: "+213 662 345 678",
  },
  {
    id: "CLI-006",
    nom: "Cevital",
    type: "entreprise",
    adresse: "Rue de la Zone Industrielle, Béjaïa",
    telephone: "+213 550 654 321",
  },
  {
    id: "CLI-007",
    nom: "Yasmine Belkacem",
    type: "particulier",
    adresse: "22 Rue des Roses, Annaba",
    telephone: "+213 661 987 543",
  },
  {
    id: "CLI-008",
    nom: "Air Algérie",
    type: "entreprise",
    adresse: "Aéroport Houari Boumediene, Alger",
    telephone: "+213 770 555 777",
  },
  {
    id: "CLI-009",
    nom: "Mourad Djouadi",
    type: "particulier",
    adresse: "7 Rue des Oliviers, Blida",
    telephone: "+213 555 678 910",
  },
  {
    id: "CLI-010",
    nom: "Sonatrach",
    type: "entreprise",
    adresse: "Complexe Sonatrach, Hassi Messaoud",
    telephone: "+213 770 888 999",
  },
];

export const questions = [
  {
    question: "Question 1 ?",
    answer: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    question: "Question 2 ?",
    answer: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    question: "Question 3 ?",
    answer: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    question: "Question 4 ?",
    answer: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    question: "Question 5 ?",
    answer: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export const messages = [
  {
    id: 1,
    titre: "Message 1",
  },
  {
    id: 2,
    titre: "Message 2",
  },
  {
    id: 3,
    titre: "Message 3",
  },
  {
    id: 4,
    titre: "Message 4",
  },
  {
    id: 5,
    titre: "Message 5",
  },
];

export type AgencyData = {
  id: number;
  nomBanque: string;
  adresseComplete: string;
  codeSwiftBic: string;
  devise: string;
  agenceCode: string;
  directeurNom: string;
  directeurEmail: string;
  directeurTelephone: string;
};
export const agencyData: AgencyData[] = [
  {
    id: 1,
    nomBanque: "BANQUE DE DEVELOPPEMENT LOCAL",
    adresseComplete: "38, Rue des Frères Bouaddou, Bir Mourad Rais",
    codeSwiftBic: "COSOB-BDL-01",
    devise: "DZD",
    agenceCode: "TCT001",
    directeurNom: "Mohamed Benchaib",
    directeurEmail: "m.benchaib@bdl.dz",
    directeurTelephone: "+213 23 56 91 57",
  },
  {
    id: 2,
    nomBanque: "BANQUE EXTERIEURE D'ALGERIE",
    adresseComplete: "2, Boulevard Mohamed V",
    codeSwiftBic: "COSOB-BEA-02",
    devise: "DZD",
    agenceCode: "TCT002",
    directeurNom: "Karima Dahmani",
    directeurEmail: "k.dahmani@bea.dz",
    directeurTelephone: "+213 21 63 72 42",
  },
  {
    id: 3,
    nomBanque: "BANQUE DE L'AGRICULTURE ET DU DÉVELOPPEMENT RURAL",
    adresseComplete: "01, Rue Azile Ali",
    codeSwiftBic: "COSOB-BADR-03",
    devise: "DZD",
    agenceCode: "TCT003",
    directeurNom: "Ahmed Benali",
    directeurEmail: "a.benali@badr.dz",
    directeurTelephone: "+213 21 74 31 93",
  },
  {
    id: 4,
    nomBanque: "CREDIT POPULAIRE D'ALGERIE",
    adresseComplete: "Résidence Chaabani Bloc A3, Val d'Hydra",
    codeSwiftBic: "COSOB-CPA-04",
    devise: "DZD",
    agenceCode: "TCT004",
    directeurNom: "Samira Touati",
    directeurEmail: "s.touati@cpa.dz",
    directeurTelephone: "+213 21 60 12 65",
  },
  {
    id: 5,
    nomBanque: "BANQUE NATIONALE D'ALGERIE",
    adresseComplete: "12, Rue Hassiba Ben Bouali",
    codeSwiftBic: "COSOB-BNA-05",
    devise: "DZD",
    agenceCode: "TCT005",
    directeurNom: "Tarek Belkacem",
    directeurEmail: "t.belkacem@bna.dz",
    directeurTelephone: "+213 21 73 29 51",
  },
  {
    id: 6,
    nomBanque: "CAISSE NATIONALE D'EPARGNE ET DE PREVOYANCE",
    adresseComplete: "Tour Les Halls Hassiba Ben Bouali",
    codeSwiftBic: "COSOB-CNEP-06",
    devise: "DZD",
    agenceCode: "TCT006",
    directeurNom: "Fatima Boudjemaa",
    directeurEmail: "f.boudjemaa@cnepbanque.dz",
    directeurTelephone: "+213 21 51 12 22",
  },
];
