"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Printer } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface CloseSessionProps {
  customTitle?: string;
  customIcon?: "printer" | "document";
}

const CloseSession = ({
  customTitle,
  customIcon = "printer",
}: CloseSessionProps = {}) => {
  const t = useTranslations("mesOrdres");
  const tMarche = useTranslations("PasserUnOrdre");

  return (
    <Button 
      className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md shadow text-sm flex gap-2 items-center"
      onClick={(e) => e.preventDefault()}
    >
      Action
    </Button>
  );
};

export default CloseSession;
