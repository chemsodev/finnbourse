import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import DynamicBottomNav from "@/components/navigation/DynamicBottomNav";
import TokenValidator from "@/components/TokenValidator";
import { getServerSession } from "next-auth/next";
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
  const session = (await getServerSession(auth)) as any;
  if (session?.user?.error === "RefreshAccessTokenError") {
    return <LogOutAgent />;
  }
  return (
    <TokenValidator>
      <div className={`flex`}>
        <DynamicSidebar />
        <div className="p-4 overflow-scroll h-screen md:w-5/6 mb-12 md:mb-0">
          {children}
        </div>
        <DynamicBottomNav />
      </div>
    </TokenValidator>
  );
}
