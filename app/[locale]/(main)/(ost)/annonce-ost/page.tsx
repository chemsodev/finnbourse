import { ListeOperationsSurTitres } from "@/components/operations-sur-titres/liste-operations-sur-titres";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "OperationsSurTitres" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default function OperationsSurTitresPage() {
  const t = useTranslations("OperationsSurTitres");

  return (
    <div className="container mx-auto py-6">
      <ListeOperationsSurTitres />
    </div>
  );
}
