"use client";

import { useState } from "react";
import type { PDFFont } from "pdf-lib";

type PdfData = {
  date: string;
  destinataire: string;
  indice: string;
  agence: string;
  ref: string;
  typeOperation: string;
  titre: string;
  isin: string;
  quantite: string;
  montant: string;
  executionDate: string;
  compte: string;
  marche: string;
  reglement: string;
};

type Position = {
  left: number; // percentage (0-100)
  top: number; // percentage (0-100)
};

export default function AvisExecution(): JSX.Element {
  const [buttonState, setButtonState] = useState<{
    text: string;
    disabled: boolean;
  }>({
    text: "Télécharger le PDF",
    disabled: false,
  });

  const generatePdf = async (pdfName: string): Promise<void> => {
    try {
      // Dynamically import pdf-lib to avoid SSR issues
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

      const response = await fetch("/avis_excution_tcc.pdf");
      if (!response.ok) throw new Error("Failed to load PDF template");
      const existingPdfBytes = await response.arrayBuffer();

      const data: PdfData = {
        date: "23/04/2025",
        destinataire: "Monsieur Dupont",
        indice: "A123",
        agence: "Agence El Madania",
        ref: "REF-2025-04",
        typeOperation: "Achat",
        titre: "Société Générale Algérie",
        isin: "DZ1234567890",
        quantite: "1000",
        montant: "1,500,000 DA",
        executionDate: "22/04/2025",
        compte: "ACC-456789",
        marche: "Secondaire",
        reglement: "DVP",
      };

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font: PDFFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.getPages()[0];

      // Function to convert percentage to PDF coordinates
      const getPdfCoordinates = (pos: Position): { x: number; y: number } => {
        // A4 dimensions: 595 x 842 points
        const x = (pos.left / 100) * 595;
        // PDF y=0 is bottom of page, so we invert the top percentage
        const y = 842 - (pos.top / 100) * 842;
        return { x, y };
      };

      const drawText = (text: string, pos: Position, size: number = 10) => {
        const { x, y } = getPdfCoordinates(pos);
        page.drawText(text, { x, y, size, font });
      };

      // Field positions in percentages (left, top)
      const positions = {
        date: { left: 72.45, top: 9.9 }, //  date
        destinataire: { left: 76.85, top: 12.7 }, // Recipient
        indice: { left: 71.2, top: 15.5 }, // Index
        agence: { left: 72.34, top: 18.1 }, // Agency
        ref: { left: 17.6, top: 20.8 }, // Reference number
        typeOperation: { left: 35.5, top: 38 }, // Operation type
        titre: { left: 33.8, top: 39.7 }, // Title
        isin: { left: 29, top: 41.4 }, // ISIN code
        quantite: { left: 37.4, top: 43 }, // Quantity
        montant: { left: 32.5, top: 44.8 }, // Amount
        executionDate: { left: 37.9, top: 46.65 }, // Execution date
        compte: { left: 43, top: 48.29 }, // Account
        marche: { left: 26.58, top: 50.15 }, // Market
        reglement: { left: 47.4, top: 51.8 }, // Payment method
      };

      // Draw all fields using percentage positions
      drawText(data.date, positions.date);
      drawText(data.destinataire, positions.destinataire);
      drawText(data.indice, positions.indice);
      drawText(data.agence, positions.agence);
      drawText(data.ref, positions.ref);

      drawText(data.typeOperation, positions.typeOperation);
      drawText(data.titre, positions.titre);
      drawText(data.isin, positions.isin);
      drawText(data.quantite, positions.quantite);
      drawText(data.montant, positions.montant);
      drawText(data.executionDate, positions.executionDate);
      drawText(data.compte, positions.compte);
      drawText(data.marche, positions.marche);
      drawText(data.reglement, positions.reglement);

      // Optional: Draw grid for debugging (remove in production)
      const drawGrid = () => {
        for (let x = 0; x < 595; x += 50) {
          page.drawLine({
            start: { x, y: 0 },
            end: { x, y: 842 },
            thickness: 0.5,
            color: rgb(0.8, 0, 0),
          });
        }
        for (let y = 0; y < 842; y += 50) {
          page.drawLine({
            start: { x: 0, y },
            end: { x: 595, y },
            thickness: 0.5,
            color: rgb(0, 0.8, 0),
          });
        }
      };

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${pdfName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setButtonState({ text: "Télécharger le PDF", disabled: false });
    }
  };

  const handleClick = () => {
    setButtonState({ text: "Génération en cours...", disabled: true });
    generatePdf("avis_execution_rempli");
  };

  return (
    <main className="p-6 text-center">
      <h1 className="text-2xl font-bold">Génération du Avis d'Execution PDF</h1>
      <p>Cliquez sur le bouton pour télécharger le PDF.</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
        disabled={buttonState.disabled}
      >
        {buttonState.text}
      </button>
    </main>
  );
}
