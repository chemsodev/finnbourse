import SideBar from "@/components/SideBar";
import BottomNavMobile from "@/components/BottomNavMobile";
import { getServerSession } from "next-auth";
import auth from "@/auth";
import { signOut } from "next-auth/react";
import { redirect } from "@/i18n/routing";
import { LogOut } from "lucide-react";
import LogOutAgent from "@/components/LogOutAgent";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(auth);
  if (session?.user.error === "RefreshAccessTokenError") {
    return <LogOutAgent />;
  }
  return (
    <div className={`flex`}>
      <SideBar />
      <div className="p-4 overflow-scroll h-screen md:w-5/6 mb-12 md:mb-0">
        {children}
      </div>
      <BottomNavMobile />
    </div>
  );
}
