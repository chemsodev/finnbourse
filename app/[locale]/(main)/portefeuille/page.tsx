import MyMarquee from "@/components/MyMarquee";
import { getTranslations } from "next-intl/server";
import MyPagination from "@/components/navigation/MyPagination";
import TabSearch from "@/components/TabSearch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import auth from "@/auth";

import { getServerSession } from "next-auth";
import AccessDenied from "@/components/AccessDenied";
import { LIST_PORTFOLIIOS_QUERY } from "@/graphql/queries";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";

const page = async (props: {
  searchParams?: Promise<{
    searchquery?: string;
    page?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 0;
  const searchquery = searchParams?.searchquery || "";
  const take = 6;
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;

  if (userRole !== 1) {
    return <AccessDenied />;
  }

  const t = await getTranslations("portefeuille");

  let MyPortfolio;
  try {
    MyPortfolio = await fetchGraphQL<any>(
      LIST_PORTFOLIIOS_QUERY,
      {
        skip: currentPage,
        take,
        userid: session?.user?.id,
        searchquery: searchquery,
      },
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    MyPortfolio = null;
  }
  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8 ">
        <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
          {t("portefeuille")}
        </div>
        <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
          {t("expl")}
        </div>
      </div>

      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <div className="flex justify-end w-full">
          <TabSearch />
        </div>
        <div className=" my-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("issuer")}</TableHead>
                <TableHead>{t("assetType")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("totalPaye")}</TableHead>
                <TableHead>reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MyPortfolio &&
                MyPortfolio?.listPortfolios?.map((asset: any) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.issuer}</TableCell>
                    <TableCell>
                      {(() => {
                        switch (asset.assettype) {
                          case "opv":
                            return t("opv");
                          case "empruntobligataire":
                            return t("empruntObligataire");
                          case "sukukmp":
                          case "sukukms":
                            return t("sukuk");
                          case "titresparticipatifsmp":
                          case "titresparticipatifsms":
                            return t("titresParticipatifs");
                          case "action":
                            return t("action");
                          case "obligation":
                            return t("obligation");
                          default:
                            return asset.assettype;
                        }
                      })()}
                    </TableCell>
                    <TableCell>{asset.quantity}</TableCell>
                    <TableCell
                      style={{
                        color:
                          asset.totalPayed < 0
                            ? "red"
                            : asset.totalPayed > 0
                            ? "green"
                            : "inherit",
                      }}
                    >
                      {asset.totalPayed}
                    </TableCell>
                    <TableCell>{asset.reason}</TableCell>
                  </TableRow>
                ))}
              {(MyPortfolio?.listPortfolios.length === 0 ||
                MyPortfolio?.listPortfolios === undefined) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {t("noData")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end">
          <MyPagination />
        </div>
      </div>
    </div>
  );
};

export default page;
