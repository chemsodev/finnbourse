/**
 * DynamicMainLayout.tsx
 * -----------------------
 * Alternative main layout using dynamic navigation components
 * Can be used to replace the current layout for testing
 */

import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import DynamicBottomNav from "@/components/navigation/DynamicBottomNav";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import LogOutAgent from "@/components/LogOutAgent";

export default async function DynamicMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(auth)) as any;

  if (session?.user?.error === "RefreshAccessTokenError") {
    return <LogOutAgent />;
  }

  return (
    <div className="flex">
      <DynamicSidebar />
      <div className="p-4 overflow-scroll h-screen md:w-5/6 mb-12 md:mb-0">
        {children}
      </div>
      <DynamicBottomNav />
    </div>
  );
}

export { DynamicMainLayout };
