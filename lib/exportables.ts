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
  agenceCode: string;
  libAgence: string;
  codeVille: string;
  ordreDe: string;
  parDefault: string;
  compensation: string;
  nom: string;
  prenom: string;
  codeBanque?: string;
  regionAgence?: string;
  codeBC?: string;
  nomCorrespondant?: string;
  prenomCorrespondant?: string;
  fonction?: string;
  telephone1?: string;
  telephone2?: string;
  fax?: string;
  email?: string;
  telex?: string;
  addresse?: string;
  codePostal?: string;
  commentaire?: string;
};

export const agencyData: AgencyData[] = [
  {
    id: 1,
    agenceCode: "001",
    libAgence: "AGENCE PRINCIPALE",
    codeVille: "0001",
    ordreDe: "0",
    parDefault: "0",
    compensation: "0",
    nom: "NOM",
    prenom: "PRENOM",
    codeBanque: "91001",
    regionAgence: "ALGER",
    codeBC: "BC001",
    nomCorrespondant: "DUPONT",
    prenomCorrespondant: "JEAN",
    fonction: "DIRECTEUR",
    telephone1: "021-111-222",
    telephone2: "021-333-444",
    fax: "021-555-666",
    email: "contact@agence.dz",
    telex: "12345",
    addresse: "123 Rue Principale, Alger",
    codePostal: "16000",
    commentaire: "Agence principale du réseau",
  },
  {
    id: 2,
    agenceCode: "002",
    libAgence: "AGENCE SECONDAIRE",
    codeVille: "0002",
    ordreDe: "1",
    parDefault: "0",
    compensation: "0",
    nom: "MARTIN",
    prenom: "MARIE",
  },
  {
    id: 3,
    agenceCode: "003",
    libAgence: "AGENCE ORAN",
    codeVille: "0003",
    ordreDe: "2",
    parDefault: "0",
    compensation: "1",
    nom: "BENALI",
    prenom: "KARIM",
  },
];

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
    libelle: "SOCIETE GENERALE",
    adresse: "29 Boulevard Haussmann",
    codePostal: "75009",
    ville: "Paris",
    pays: "France",
    telephone: "+33-1-4213-9700",
    email: "securities@socgen.fr",
    statut: "Actif",
    dateCreation: "2020-03-22",
    swift: "SOGEFRPP",
    typeCompte: "Conservateur",
    iban: "FR7630003000502345678901833",
    numeroCompte: "30003000502345678901833",
    devise: "EUR",
    contactNom: "Martin",
    contactPrenom: "Sophie",
    contactTelephone: "+33-1-4213-9701",
    contactEmail: "sophie.martin@socgen.fr",
    numeroAgrement: "AMF-2020-456",
    dateAgrement: "2020-02-15",
    autoriteSurveillance: "AMF",
    codeCorrespondant: "CORR002",
    nomCorrespondant: "Euroclear France",
    commissionFixe: "12.50",
    commissionVariable: "0.20",
    tauxTva: "20.00",
    commentaire: "Partenaire principal pour les marchés français",
  },
  {
    id: 2,
    code: "TCT002",
    libelle: "BNP PARIBAS",
    adresse: "16 Boulevard des Italiens",
    codePostal: "75009",
    ville: "Paris",
    pays: "France",
    telephone: "+33-1-4014-4546",
    email: "custody@bnp.fr",
    statut: "Actif",
    dateCreation: "2020-01-15",
    swift: "BNPAFRPP",
    typeCompte: "Dépositaire",
  },
  {
    id: 3,
    code: "TCT003",
    libelle: "BANQUE DE DEVELOPPEMENT LOCAL",
    adresse: "5 Rue Gaci Amar",
    codePostal: "16000",
    ville: "Alger",
    pays: "Algérie",
    telephone: "+213-21-91-88-88",
    email: "contact@bdl.dz",
    statut: "Actif",
    dateCreation: "2019-11-05",
    typeCompte: "Banque Locale",
  },
];
