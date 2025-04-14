import CommissionManagement from "@/components/commissions/commission-management";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Commissions" });

  return {
    title: t("pageTitle"),
  };
}

export default async function CommissionsPage() {
  const t = await getTranslations("Commissions");

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-secondary">
        {t("pageHeading")}
      </h1>
      <CommissionManagement />
    </main>
  );
}
