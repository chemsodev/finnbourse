import MyMarquee from "@/components/MyMarquee";
import TopBarDash from "@/components/navigation/TopBarDash";
import { getTranslations } from "next-intl/server";
import DashItem2 from "@/components/dashboard/DashItem2";
import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import DynamicBottomNav from "@/components/navigation/DynamicBottomNav";
import MyPortfolio from "@/components/MyPortfolio";
import auth from "@/auth";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import LogOutAgent from "@/components/LogOutAgent";
import { StaticStockTracker } from "@/components/dashboard/StaticStockTracker";
import StaticDashNews from "@/components/dashboard/StaticDashNews";
import TitreTable from "@/components/dashboard/TitreTable";

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
          <div className="mt-8 w-full">
            <DashItem2 />
          </div>
          <div className="mt-8 w-full grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <TitreTable />
            </div>
            <div className="lg:col-span-1">
              <MyPortfolio />
            </div>
            <div className="lg:col-span-1">
              <StaticDashNews />
            </div>
          </div>
        </div>
      </div>
      <DynamicBottomNav />
    </div>
  );
}
