"use client";

import { useState } from "react";
import type { PDFFont } from "pdf-lib";

type PdfData = {
  date: string;
  destinataire: string;
  indice: string;
  agence: string;
  refNumber: string;
  operationBoursiere: string;
  clientName: string;
  compteReference: string;
  operationDate: string;
  typeOperation: "Achat" | "Vente";
  instrument: string;
  isin: string;
  quantite: string;
  prixUnitaire: string;
  montantTotal: string;
  marche: "Marché primaire" | "Marché secondaire";
  reglement: "Espèce" | "Virement" | "Compte espèces lié";
  dateReglement: string;
  instructionTransmise: "En agence" | "En ligne" | "Par email" | "Autre";
  agentName: string;
  refOperation: string;
  refIOB: string;
  autreInstruction?: string;
};

type Position = {
  left: number;
  top: number;
};

export default function CrediPopulaireD(): JSX.Element {
  const [buttonState, setButtonState] = useState<{
    text: string;
    disabled: boolean;
  }>({
    text: "Télécharger le PDF",
    disabled: false,
  });

  const formData: PdfData = {
    date: new Date().toLocaleDateString("fr-FR"),
    destinataire: "Direction des Marchés",
    indice: "A123",
    agence: "Agence Principale",
    refNumber: "REF-2023-456",
    operationBoursiere: "Achat/Vente de Titres",
    clientName: "Mohamed Benali",
    compteReference: "CT-789456123",
    operationDate: new Date().toLocaleDateString("fr-FR"),
    typeOperation: "Achat",
    instrument: "Sonatrach 2025",
    isin: "DZ098908908098",
    quantite: "500",
    prixUnitaire: "1,250 DA",
    montantTotal: "625,000 DA",
    marche: "Marché secondaire",
    reglement: "Virement",
    dateReglement: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("fr-FR"),
    instructionTransmise: "En ligne",
    agentName: "Karim Bensaid",
    refOperation: "OP-2025-456",
    refIOB: "IOB-789",
  };

  const generatePdf = async (pdfName: string): Promise<void> => {
    try {
      setButtonState({ text: "Génération en cours...", disabled: true });

      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const response = await fetch("/credit_populaire_d.pdf");
      if (!response.ok) throw new Error("Failed to load PDF template");
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font: PDFFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.getPages()[0];

      const getPdfCoordinates = (pos: Position): { x: number; y: number } => {
        const x = (pos.left / 100) * 595;
        const y = 842 - (pos.top / 100) * 842;
        return { x, y };
      };

      const drawText = (text: string, pos: Position, size: number = 10) => {
        const { x, y } = getPdfCoordinates(pos);
        page.drawText(text, { x, y, size, font });
      };

      const drawCheckbox = (pos: Position, checked: boolean) => {
        const { x, y } = getPdfCoordinates(pos);
        if (checked) {
          page.drawText("X", { x, y, size: 14, font });
        }
      };

      const positions = {
        date: { left: 67, top: 9.9 },
        destinataire: { left: 76, top: 12.7 },
        indice: { left: 72, top: 15.3 },
        agence: { left: 73, top: 18 },
        refNumber: { left: 17, top: 20.8 },
        operationBoursiere: { left: 50, top: 26.5 },
        clientName: { left: 18, top: 34.1 },
        compteReference: { left: 30, top: 36 },
        operationDate: { left: 17, top: 37.9 },
        typeOperation: { left: 33, top: 40.7 },
        instrument: { left: 35, top: 42.6 },
        isin: { left: 27, top: 44.5 },
        quantite: { left: 26, top: 46.4 },
        prixUnitaire: { left: 35, top: 48.2 },
        montantTotal: { left: 36, top: 50.2 },
        dateReglement: { left: 44, top: 70.2 },
        agentName: { left: 41, top: 85.3 },
        refOperation: { left: 34, top: 87.1 },
        refIOB: { left: 23, top: 89 },
        autreInstruction: { left: 20, top: 82 },
        marchePrimaire: { left: 11.9, top: 55.5 },
        marcheSecondaire: { left: 11.9, top: 57.6 },
        reglementEspece: { left: 11.9, top: 63 },
        reglementVirement: { left: 11.9, top: 65 },
        reglementCompte: { left: 11.9, top: 67.2 },
        instructionAgence: { left: 11.9, top: 75.9 },
        instructionEnLigne: { left: 11.9, top: 77.9 },
        instructionEmail: { left: 11.9, top: 80 },
        instructionAutre: { left: 11.9, top: 82 },
      };

      drawText(formData.date, positions.date);
      drawText(formData.destinataire, positions.destinataire);
      drawText(formData.indice, positions.indice);
      drawText(formData.agence, positions.agence);
      drawText(formData.refNumber, positions.refNumber);
      drawText(formData.operationBoursiere, positions.operationBoursiere);
      drawText(formData.clientName, positions.clientName);
      drawText(formData.compteReference, positions.compteReference);
      drawText(formData.operationDate, positions.operationDate);
      drawText(formData.typeOperation, positions.typeOperation);
      drawText(formData.instrument, positions.instrument);
      drawText(formData.isin, positions.isin);
      drawText(formData.quantite, positions.quantite);
      drawText(formData.prixUnitaire, positions.prixUnitaire);
      drawText(formData.montantTotal, positions.montantTotal);
      drawText(formData.dateReglement, positions.dateReglement);
      drawText(formData.agentName, positions.agentName);
      drawText(formData.refOperation, positions.refOperation);
      drawText(formData.refIOB, positions.refIOB);

      drawCheckbox(
        positions.marchePrimaire,
        formData.marche === "Marché primaire"
      );
      drawCheckbox(
        positions.marcheSecondaire,
        formData.marche === "Marché secondaire"
      );
      drawCheckbox(positions.reglementEspece, formData.reglement === "Espèce");
      drawCheckbox(
        positions.reglementVirement,
        formData.reglement === "Virement"
      );
      drawCheckbox(
        positions.reglementCompte,
        formData.reglement === "Compte espèces lié"
      );
      drawCheckbox(
        positions.instructionAgence,
        formData.instructionTransmise === "En agence"
      );
      drawCheckbox(
        positions.instructionEnLigne,
        formData.instructionTransmise === "En ligne"
      );
      drawCheckbox(
        positions.instructionEmail,
        formData.instructionTransmise === "Par email"
      );
      drawCheckbox(
        positions.instructionAutre,
        formData.instructionTransmise === "Autre"
      );

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${pdfName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setButtonState({ text: "Télécharger le PDF", disabled: false });
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Génération du credit de population PDF
      </h1>
      <button
        onClick={() => generatePdf("credit_populaire_d_rempli")}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        disabled={buttonState.disabled}
      >
        {buttonState.text}
      </button>
    </main>
  );
}
