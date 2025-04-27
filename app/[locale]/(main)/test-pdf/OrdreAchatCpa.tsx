"use client";

import { PDFDocument, PDFTextField, StandardFonts } from "pdf-lib";

interface FormValues {
  N: string;
  segment: string; //  "A", "B", "C", or "D"
  propmand: string; // "propre" or "mandataire" or "tuteur_legal"
  phy_morale: string; // "physique" or "morale"
  paiement: string; // "paiement1", "paiement2", or "paiement3"
  full_name: string;
  nee: string;
  adresse: string;
  wilaya: string;
  num_cni_pc: string;
  nationality: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  banque: string;
  agence: string;
  code: string;
  beneficiaire_full_name: string;
  beneficiaire_birth_day: string;
  beneficiaire_birth_month: string;
  beneficiaire_birth_year: string;
  beneficiaire_birth_place: string;
  beneficiaire_cni_pc_nin: string;
  beneficiaire_nationality: string;
  reason_social: string;
  rc_agrement: string;
  nif: string;
  beneficiaire_adress: string;
  beneficiaire_wilaya: string;
  tel_fixe: string;
  mobile: string;
  email: string;
  rib: string;
  declare_letters: string;
  declare_chiffres: string;
  paiement_lettres: string;
  paiement_chiffres: string;
  fait_a: string;
  fait_le: string;
}

export default function OrdreAchatCpa() {
  const defaultFormValues: FormValues = {
    N: "OA-20250424-001",
    segment: "D", //  "A", "B", "C", or "D"
    propmand: "mandataire", // "propre" or "mandataire" or "tuteur_legal"
    phy_morale: "physique", // "physique" or "morale"
    paiement: "paiement3", // "paiement1", "paiement2", or "paiement3"
    full_name: "Amine KHALED",
    nee: "25/11/1985",
    adresse: "Residence El Djenane, Bt 5, Appt 12, Draria, Alger",
    wilaya: "Alger",
    num_cni_pc: "185251108001",
    nationality: "Algérienne",
    birth_day: "25",
    birth_month: "11",
    birth_year: "1985",
    banque: "CPA",
    agence: "Agence CPA Draria",
    code: "00203",
    beneficiaire_full_name: "SARL Numidia Telecom",
    beneficiaire_birth_day: "24",
    beneficiaire_birth_month: "12",
    beneficiaire_birth_year: "1999",
    beneficiaire_birth_place: "Alger",
    beneficiaire_cni_pc_nin: "12345678901234",
    beneficiaire_nationality: "Algérienne",
    reason_social: "SARL Numidia Telecom",
    rc_agrement: "16 B 1234567",
    nif: "0001234567890123",
    beneficiaire_adress: "Zone Industrielle Oued Smar, Alger",
    beneficiaire_wilaya: "Alger",
    tel_fixe: "023556677",
    mobile: "0555112233",
    email: "contact@numidiatel.dz",
    rib: "00100200300400500678",
    declare_letters: "Cent mille dinars algériens",
    declare_chiffres: "100 000,00 DA",
    paiement_lettres: "Cent mille dinars algériens",
    paiement_chiffres: "100 000,00 DA",
    fait_a: "Draria, Alger",
    fait_le: "24/04/2025",
  };

  const handleDownload = async () => {
    const pdfUrl = "/ordre-achat-opv_action-cpa_15012024.pdf";
    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fieldMapping = {
      seg_a: defaultFormValues.segment === "A" ? "X" : "",
      seg_b: defaultFormValues.segment === "B" ? "X" : "",
      seg_c: defaultFormValues.segment === "C" ? "X" : "",
      seg_d: defaultFormValues.segment === "D" ? "X" : "",
      propre: defaultFormValues.propmand === "propre" ? "x" : "",
      mandataire: defaultFormValues.propmand === "mandataire" ? "x" : "",
      tuteur_legal: defaultFormValues.propmand === "tuteur_legal" ? "x" : "",
      physique: defaultFormValues.phy_morale === "physique" ? "x" : "",
      morale: defaultFormValues.phy_morale === "morale" ? "x" : "",
      paiement1: defaultFormValues.paiement === "paiement1" ? "X" : "",
      paiement2: defaultFormValues.paiement === "paiement2" ? "X" : "",
      paiement3: defaultFormValues.paiement === "paiement3" ? "X" : "",
      N: defaultFormValues.N,
      full_name: defaultFormValues.full_name,
      nee: defaultFormValues.nee,
      adresse: defaultFormValues.adresse,
      wilaya: defaultFormValues.wilaya,
      num_cni_pc: defaultFormValues.num_cni_pc,
      nationality: defaultFormValues.nationality,
      birth_day: defaultFormValues.birth_day,
      birth_month: defaultFormValues.birth_month,
      birth_year: defaultFormValues.birth_year,
      banque: defaultFormValues.banque,
      agence: defaultFormValues.agence,
      code: defaultFormValues.code,
      beneficiaire_full_name: defaultFormValues.beneficiaire_full_name,
      beneficiaire_birth_day: defaultFormValues.beneficiaire_birth_day,
      beneficiaire_birth_month: defaultFormValues.beneficiaire_birth_month,
      beneficiaire_birth_year: defaultFormValues.beneficiaire_birth_year,
      beneficiaire_birth_place: defaultFormValues.beneficiaire_birth_place,
      beneficiaire_cni_pc_nin: defaultFormValues.beneficiaire_cni_pc_nin,
      beneficiaire_nationality: defaultFormValues.beneficiaire_nationality,
      reason_social: defaultFormValues.reason_social,
      rc_agrement: defaultFormValues.rc_agrement,
      nif: defaultFormValues.nif,
      beneficiaire_adress: defaultFormValues.beneficiaire_adress,
      beneficiaire_wilaya: defaultFormValues.beneficiaire_wilaya,
      tel_fixe: defaultFormValues.tel_fixe,
      mobile: defaultFormValues.mobile,
      email: defaultFormValues.email,
      rib: defaultFormValues.rib,
      declare_letters: defaultFormValues.declare_letters,
      declare_chiffres: defaultFormValues.declare_chiffres,
      paiement_lettres: defaultFormValues.paiement_lettres,
      paiement_chiffres: defaultFormValues.paiement_chiffres,
      fait_a: defaultFormValues.fait_a,
      fait_le: defaultFormValues.fait_le,
    };

    Object.entries(fieldMapping).forEach(([fieldName, value]) => {
      const field = form.getField(fieldName);
      if (field instanceof PDFTextField) {
        field.setText(value);
        field.defaultUpdateAppearances(helveticaBold);
      }
    });

    // Make all fields read-only
    form.getFields().forEach((field) => {
      field.enableReadOnly();
    });

    // Save and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ordre-achat-cpa-completed.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 rounded-xl shadow-md max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">PDF ORDRE ACHAT CPA</h2>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Télécharger le PDF
      </button>
    </div>
  );
}
