"use client";

import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SessionManagement from "@/components/bourse-sessions/session-management";
import SessionOrders from "@/components/bourse-sessions/session-orders";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BourseSessionsPage() {
  const t = useTranslations("bourseSessions");
  const tForm = useTranslations("FormPassationOrdreObligation");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("management");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  // Gérer les paramètres d'URL pour l'onglet et la session
  useEffect(() => {
    const tab = searchParams.get("tab") || "management";
    const sessionId = searchParams.get("sessionId");
    setActiveTab(tab);
    setSelectedSessionId(sessionId);
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`);
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setActiveTab("orders");
    const params = new URLSearchParams();
    params.set("tab", "orders");
    params.set("sessionId", sessionId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="motion-preset-focus motion-duration-2000">
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
          <Link
            href={
              activeTab === "orders" ? "/ordres/sessions" : "/ordres/execution"
            }
          >
            <Button
              type="button"
              variant="outline"
              className="flex gap-2 items-center border rounded-md py-1.5 px-2 bg-primary text-white hover:bg-primary hover:text-white w-fit"
            >
              <ArrowLeft className="w-5" /> <div>{tForm("retour")}</div>
            </Button>
          </Link>
        </div>
      </div>

      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsContent value="management" className="mt-6">
            <SessionManagement onSessionSelect={handleSessionSelect} />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <SessionOrders selectedSessionId={selectedSessionId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
