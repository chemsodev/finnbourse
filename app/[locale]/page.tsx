import MyMarquee from "@/components/MyMarquee";
import TopBarDash from "@/components/navigation/TopBarDash";
import { getTranslations } from "next-intl/server";
import FormattedDate from "@/components/FormattedDate";
import DashItem3 from "@/components/dashboard/DashItem3";
import DashItem2 from "@/components/dashboard/DashItem2";
import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import DynamicBottomNav from "@/components/navigation/DynamicBottomNav";
import MyPortfolio from "@/components/MyPortfolio";
import auth from "@/auth";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import LogOutAgent from "@/components/LogOutAgent";
import { StaticStockTracker } from "@/components/dashboard/StaticStockTracker";
import { BadgePercent, Database, LineChart, Users } from "lucide-react";
import IPOAnnouncement from "@/components/dashboard/IPOAnnouncement";

export default async function Home() {
  const t = await getTranslations("HomePage");
  const ipoT = await getTranslations("IPOAnnouncement");
  const dateTime = new Date();
  const session = (await getServerSession(auth)) as Session & {
    user: {
      roleid?: number;
      error?: string;
    };
  };
  const userRole = session?.user?.roleid;
  if (session?.user.error === "RefreshAccessTokenError") {
    return <LogOutAgent />;
  }

  // Example IPO data - replace with actual data from your API/database
  const ipoEndDate = new Date();
  ipoEndDate.setDate(ipoEndDate.getDate() + 7); // Set end date to 7 days from now
  return (
    <div className="flex">
      <DynamicSidebar />
      <div className="p-4 overflow-scroll h-screen md:w-5/6 mb-12 md:mb-0 motion-preset-focus motion-duration-2000">
        <div className="relative w-full">
          <MyMarquee />
          <div className="absolute inset-0 z-10 flex justify-end items-start">
            <TopBarDash />
          </div>
          
        </div>
        <div className="">
          <div className="mt-6 w-full">
            <StaticStockTracker />
          </div>
          <div className="mt-8 w-full flex flex-col lg:flex-row gap-4 p-4 h-full">
            <div className="flex-1 h-full">
              <MyPortfolio />
            </div>
            <div className="lg:w-1/4 h-full">
              <DashItem2 />
            </div>
          </div>
        </div>
        <div>          
        </div>{" "}
        <div className="mt-8 w-full">
          <DashItem3 />
        </div>
      </div>
      <DynamicBottomNav />
    </div>
  );
}
