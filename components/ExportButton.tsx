"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  data: any[];
  customTitle?: string;
}

export function ExportButton({ data, customTitle }: ExportButtonProps) {
  const handleExport = () => {
    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate and download Excel file
    const fileName = customTitle
      ? `export_${customTitle.toLowerCase().replace(/\s+/g, "_")}.xlsx`
      : "export.xlsx";

    XLSX.writeFile(workbook, fileName);
  };

  // Check if this is for souscriptions to apply different styling
  const isSouscriptions = customTitle?.toLowerCase() === "souscriptions";

  return (
    <Button
      onClick={handleExport}
      rel="noopener noreferrer"
      className={`flex gap-2 ${
        isSouscriptions ? "bg-secondary hover:bg-secondary/90" : ""
      }`}
      variant="default"
    >
      {customTitle ? `${customTitle} XLSX` : "XLSX"} <FileSpreadsheet />
    </Button>
  );
}
