import MyMarquee from "@/components/MyMarquee";
import TopBarDash from "@/components/navigation/TopBarDash";
import { getTranslations } from "next-intl/server";
import FormattedDate from "@/components/FormattedDate";
import DashItem3 from "@/components/dashboard/DashItem3";
import DashItem2 from "@/components/dashboard/DashItem2";
import DashItem1 from "@/components/dashboard/DashItem1";
import DashGraph from "@/components/dashboard/DashGraph";
import SideBar from "@/components/navigation/SideBar";
import BottomNavMobile from "@/components/navigation/BottomNavMobile";
import MyPortfolio from "@/components/MyPortfolio";
import auth from "@/auth";
import { getServerSession } from "next-auth";

import LogOutAgent from "@/components/LogOutAgent";
import { StockTracker } from "@/components/dashboard/StockTracker";
import DashWidgetTcc from "@/components/dashboard/dash-widget-tcc";
import { BadgePercent, Database, LineChart, Users } from "lucide-react";

export default async function Home() {
  const t = await getTranslations("HomePage");
  const dateTime = new Date();
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  if (session?.user.error === "RefreshAccessTokenError") {
    return <LogOutAgent />;
  }
  return (
    <div className="flex ">
      <SideBar />
      <div className="p-4 overflow-scroll h-screen md:w-5/6 mb-12 md:mb-0 motion-preset-focus motion-duration-2000">
        <TopBarDash />

        {(userRole === 3 || userRole === 2) && (
          <div className="flex justify-between mt-3">
            <DashWidgetTcc
              title={t("clientType")}
              value="12,347"
              subtitle={t("physical")}
              icon={<Users className="w-8" />}
            />
            <DashWidgetTcc
              title={t("shareCount")}
              value="5,033"
              subtitle={t("shares")}
              icon={<Database className="w-8" />}
            />
            <DashWidgetTcc
              title={t("portfolioValue")}
              value="250,347"
              subtitle=""
              icon={<LineChart className="w-8" />}
            />
            <DashWidgetTcc
              title={t("accountCount")}
              value="12,347"
              subtitle="IOB"
              icon={<BadgePercent className="w-8" />}
            />
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="mt-4 md:w-4/6">
            <StockTracker />
          </div>
          <div className="md:m-6 flex flex-col gap-6 md:w-3/6">
            <div className="font-semibold text-center md:ltr:text-left md:rtl:text-right md:text-2xl text-sm">
              {t("portefeuille")}
            </div>
            <MyPortfolio />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1 mx-2 mt-8 md:mt-0">
            <FormattedDate date={dateTime} />
          </div>
          <MyMarquee />
        </div>
        <div className="flex flex-col md:flex-row my-6  justify-between gap-6 md:gap-0">
          <DashItem1 />
          <DashItem2 />
          <DashItem3 />
        </div>
      </div>
      <BottomNavMobile />
    </div>
  );
}
