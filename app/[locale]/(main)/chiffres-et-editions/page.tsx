import { Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTranslations } from "next-intl/server";

export default async function ChiffresEtEditions() {
  const t = await getTranslations("ChiffresEtEditions");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-secondary">
        {t("title")}
      </h1>

      {/* Filters Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm mb-8 border bg-primary cursor-pointer hover:scale-105 transition-transform duration-500 ease-in-out">
        <h2 className="text-2xl font-medium mb-4 text-white">{t("period")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="debut" className="text-sm font-medium text-white">
              {t("start")}
            </label>
            <Input id="debut" type="date" placeholder={t("pickStartDate")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="fin" className="text-sm font-medium text-white">
              {t("end")}
            </label>
            <Input id="fin" type="date" placeholder={t("pickEndDate")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="isin" className="text-sm font-medium text-white">
              {t("isinCode")}
            </label>
            <Select>
              <SelectTrigger id="isin">
                <SelectValue placeholder={t("selectIsin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCodes")}</SelectItem>
                <SelectItem value="fr0000123456">FR0000123456</SelectItem>
                <SelectItem value="us0378331005">US0378331005</SelectItem>
                <SelectItem value="de0007664039">DE0007664039</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Portefeuilles Titres Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-secondary">
          {t("portfolioSecurities")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <OptionCard
            title={t("history")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("portfoliosByClient")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("prtfHistoryByIOB")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("portfolio")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
        </div>
      </section>

      {/* Pointage A/C Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-secondary">
          {t("accountReconciliation")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <OptionCard
            title={t("ownAccountBalances")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("clientAssetBalances")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("globalAssetBalances")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("stockMarketOperationsCount")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
        </div>
      </section>

      {/* Transactions Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-secondary">
          {t("transactions")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <OptionCard
            title={t("transactionHistoryByTitle")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("operationDetailsBySessionDate")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("iobTransactionsByTitle")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
        </div>
      </section>

      {/* Autres Activités Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-secondary">
          {t("otherActivities")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <OptionCard
            title={t("clientAccountStatementsByAgency")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("openSecuritiesAccountsListing")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("agencyAssetsByTitle")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("clientTypes")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title={t("securitiesAccountCountByClientType")}
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
        </div>
      </section>
    </div>
  );
}

function OptionCard({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <Card className="hover:border-primary/50 transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
        <div className="bg-primary/10 p-4 rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <p className="text-sm font-medium">{title}</p>
      </CardContent>
    </Card>
  );
}
