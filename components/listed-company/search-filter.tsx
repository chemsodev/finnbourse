"use client";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchFilter = ({ searchTerm, onSearchChange }: SearchFilterProps) => {
  const t = useTranslations("SearchFilter");

  return (
    <div className="relative mb-4">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default SearchFilter;
