"use client";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
const TabSearch = () => {
  const t = useTranslations("Recherche");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("searchquery", term);
    } else {
      params.delete("searchquery");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder={t("rechercher")}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("searchquery")?.toString()}
      />
    </div>
  );
};

export default TabSearch;
