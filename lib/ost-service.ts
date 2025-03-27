import type { OstAnnouncement } from "./interfaces";

// This would be replaced with actual API calls in a production environment
let mockData: OstAnnouncement[] = [
  {
    id: "1",
    titrePrincipal: "Biopharm",
    evenement: "primaire",
    descriptionOst: "Versement de dividendes annuels",
    typeOst: "dividendes",
    dateOperation: new Date("2023-12-15"),
    dateDebut: new Date("2023-12-01"),
    dateFin: new Date("2023-12-31"),
    dateRep: new Date("2024-01-15"),
    dateValeurPaiement: new Date("2024-01-20"),
    rappel: new Date("2023-12-25"),
    titrePrincipalField: "Biopharm",
    titreResultat: "Dividende Biopharm 2023",
    actionAnc: "100",
    nelleAction: "0",
    montantUnitaire: "120",
    montantBrut: "150",
    commentaire: "Dividende annuel pour les actionnaires de Biopharm",
  },
  {
    id: "2",
    titrePrincipal: "Alliance Assurances",
    evenement: "secondaire",
    descriptionOst: "Prélèvement des droits de garde",
    typeOst: "droits_de_garde",
    dateOperation: new Date("2024-02-10"),
    dateDebut: new Date("2024-02-01"),
    dateFin: new Date("2024-02-28"),
    dateRep: new Date("2024-03-15"),
    dateValeurPaiement: new Date("2024-03-20"),
    rappel: new Date("2024-02-20"),
    titrePrincipalField: "Alliance Assurances",
    titreResultat: "Droits de garde 2024",
    actionAnc: "0",
    nelleAction: "0",
    montantUnitaire: "50",
    montantBrut: "60",
    commentaire: "Prélèvement annuel des droits de garde",
  },
  {
    id: "3",
    titrePrincipal: "Saidal",
    evenement: "primaire",
    descriptionOst: "Paiement de coupon",
    typeOst: "coupon",
    dateOperation: new Date("2024-04-05"),
    dateDebut: new Date("2024-04-01"),
    dateFin: new Date("2024-04-30"),
    dateRep: new Date("2024-05-15"),
    dateValeurPaiement: new Date("2024-05-20"),
    rappel: new Date("2024-04-25"),
    titrePrincipalField: "Saidal",
    titreResultat: "Coupon Saidal 2024",
    actionAnc: "0",
    nelleAction: "0",
    montantUnitaire: "80",
    montantBrut: "100",
    commentaire: "Paiement semestriel du coupon pour les obligations Saidal",
  },
];

// Get all OST announcements
export async function getOstAnnouncements(): Promise<OstAnnouncement[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockData;
}

// Get a single OST announcement by ID
export async function getOstAnnouncementById(
  id: string
): Promise<OstAnnouncement | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockData.find((announcement) => announcement.id === id);
}

// Create a new OST announcement
export async function createOstAnnouncement(
  data: Omit<OstAnnouncement, "id">
): Promise<OstAnnouncement> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newAnnouncement: OstAnnouncement = {
    ...data,
    id: Date.now().toString(),
  };

  mockData.push(newAnnouncement);
  return newAnnouncement;
}

// Update an existing OST announcement
export async function updateOstAnnouncement(
  id: string,
  data: Partial<OstAnnouncement>
): Promise<OstAnnouncement | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const index = mockData.findIndex((announcement) => announcement.id === id);
  if (index === -1) return undefined;

  mockData[index] = { ...mockData[index], ...data };
  return mockData[index];
}

// Delete an OST announcement
export async function deleteOstAnnouncement(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const initialLength = mockData.length;
  mockData = mockData.filter((announcement) => announcement.id !== id);
  return mockData.length < initialLength;
}
