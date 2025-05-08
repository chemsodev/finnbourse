"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Printer } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const PDFDropdownMenu = () => {
  const t = useTranslations("mesOrdres");
  const tMarche = useTranslations("PasserUnOrdre");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md shadow text-sm flex gap-2 items-center">
        <Printer size={20} />
        {t("print")}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href="/carnetordres/pdf?marketType=all"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            {t("printAll")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/carnetordres/pdf?marketType=primaire"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            {tMarche("marcheprimaire")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/carnetordres/pdf?marketType=secondaire"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            {tMarche("marchesecondaire")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PDFDropdownMenu;
