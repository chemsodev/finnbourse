import { StatAreaChart } from "@/components/StatAreaChart";
import { getTranslations } from "next-intl/server";
import MyPagination from "@/components/navigation/MyPagination";
import TabSearch from "@/components/TabSearch";
import StatCharts from "@/components/StatCharts";
import OrdresTable from "@/components/gestion-des-ordres/OrdresTable";
import DashGraph from "@/components/dashboard/DashGraph";

const page = async (props: {
  searchParams?: Promise<{
    searchquery?: string;
    page?: string;
    state?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const state = searchParams?.state || "99";
  const searchquery = searchParams?.searchquery || "";
  const t = await getTranslations("statistiques");
  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="flex flex-col gap-1 m-8">
        <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
          {t("statistiques")}
        </div>
        <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
          {t("statistiquesDesc")}
        </div>
      </div>
      <StatCharts />
      <div>
        <div className="border border-gray-100 rounded-md p-4 md:m-10">
          <div className="flex justify-between w-full">
            <div className="hidden md:block text-xl font-semibold text-primary ml-2 mt-2 mb-4">
              {t("monHistorique")}
            </div>

            <TabSearch />
          </div>

          <OrdresTable
            pageType="statistiques"
            skip={currentPage}
            searchquery={searchquery}
            state={state}
          />
          <div className="flex justify-end">
            <MyPagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
