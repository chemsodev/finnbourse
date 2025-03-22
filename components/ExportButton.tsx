"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  data: any[];
}

export function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate and download Excel file
    XLSX.writeFile(workbook, "export.xlsx");
  };

  return (
    <Button
      onClick={handleExport}
      rel="noopener noreferrer"
      className="flex gap-2"
    >
      XLSX <FileSpreadsheet />
    </Button>
  );
}
