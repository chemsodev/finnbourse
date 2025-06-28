import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import MyMarquee from "@/components/MyMarquee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionManagement from "@/components/bourse-sessions/session-management";
import SessionOrders from "@/components/bourse-sessions/session-orders";
import SessionStats from "@/components/bourse-sessions/session-stats";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BourseSessionsPage() {
  const session = await getServerSession(auth);
  const userRole = (session as any)?.user?.roleid;

  /* Only allow admin and negotiator roles to access this page
  if (userRole !== 2 && userRole !== 3) {
    const t = await getTranslations("bourseSessions");
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            {t("accessDeniedTitle")}
          </h1>
          <p className="text-gray-600">{t("accessDeniedMessage")}</p>
        </div>
      </div>
    );
  }*/

  const t = await getTranslations("bourseSessions");
  const tForm = await getTranslations("FormPassationOrdreObligation");

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8">
        <div className="w-full flex justify-between items-center mb-2">
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
              Gestion des Sessions de Bourse
            </div>
            <div className="text-xs text-gray-500 text-center md:ltr:text-left md:rtl:text-right">
              {t("description")}
            </div>
          </div>
          <Link href="/ordres/execution">
            <Button type="button" variant="outline" className="flex gap-2 items-center border rounded-md py-1.5 px-2 bg-primary text-white hover:bg-primary hover:text-white w-fit">
            <ArrowLeft className="w-5" /> <div>{tForm("retour")}</div>
            </Button>
          </Link>
        </div>
      </div>

      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="flex w-full border-b bg-transparent p-0 h-auto mb-10">
            <TabsTrigger 
              value="management" 
              className="flex-1 text-md data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent px-4 py-2"
            >
              {t("tabs.management")}
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="flex-1 text-md data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent px-4 py-2"
            >
              {t("tabs.orders")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="management" className="mt-6">
            <SessionManagement />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <SessionOrders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
