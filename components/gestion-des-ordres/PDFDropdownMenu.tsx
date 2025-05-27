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

interface PDFDropdownMenuProps {
  customTitle?: string;
  customIcon?: "printer" | "document";
}

const PDFDropdownMenu = ({
  customTitle,
  customIcon = "printer",
}: PDFDropdownMenuProps = {}) => {
  const t = useTranslations("mesOrdres");
  const tMarche = useTranslations("PasserUnOrdre");

  return (
    <DropdownMenu>
      {" "}
      <DropdownMenuTrigger className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md shadow text-sm flex gap-2 items-center">
        {customIcon === "printer" ? (
          <Printer size={20} />
        ) : (
          <FileText size={20} />
        )}
        {customTitle || t("print")}
      </DropdownMenuTrigger>{" "}
      <DropdownMenuContent>
        {customIcon === "document" ? (
          // For souscriptions tab, only show primary market option
          <DropdownMenuItem asChild>
            <Link
              href="/ordres/pdf?marketType=primaire&tab=souscriptions"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              {t("souscriptions")}
            </Link>
          </DropdownMenuItem>
        ) : (
          // For regular orders tab, show all options
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/ordres/pdf?marketType=all&tab=all"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                {t("printAll")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/ordres/pdf?marketType=primaire&tab=all"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                {tMarche("marcheprimaire")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/ordres/pdf?marketType=secondaire&tab=all"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                {tMarche("marchesecondaire")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PDFDropdownMenu;
