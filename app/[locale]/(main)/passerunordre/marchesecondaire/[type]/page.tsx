"use client";

import { TitresTableREST } from "@/components/gestion-des-titres/TitresTableREST";
import { TitresTableObligation } from "@/components/gestion-des-titres/TitresTableObligation";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import TokenExpiredHandler from "@/components/TokenExpiredHandler";
import { useRestToken } from "@/hooks/useRestToken";

const SecondaryMarketPage = ({ params }: { params: { type: string } }) => {
  const { type } = params;
  const t = useTranslations("Titres");
  const { data: session, status } = useSession();
  const { restToken, isLoading } = useRestToken();

  // Log the type for debugging
  useEffect(() => {
    console.log("Marche Secondaire type:", type);
  }, [type]);

  const userRole = (session?.user as any)?.roleid;

  // Show loading or authentication required state
  if (status === "loading" || isLoading || !restToken) {
    return (
      <>
        <TokenExpiredHandler />
        <div className="fixed top-4 right-4">
          <button
            onClick={() => {
              // Enable debug mode
              localStorage.setItem("finnbourse_debug", "true");
              window.location.reload();
            }}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs"
          >
            Debug Mode
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Link
        href="/passerunordre/marchesecondaire"
        className="flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white w-fit  md:mt-4 -mb-12"
      >
        <ArrowLeft className="w-5" /> <div>{t("back")}</div>
      </Link>
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8 text-center md:ltr:text-left md:rtl:text-right">
        <div className="text-3xl font-bold text-primary">
          {t("marcheSecondaire")}
          <span className="text-lg text-black mx-1">
            {type === "action"
              ? t("actions")
              : type === "obligation"
              ? t("obligations")
              : ""}
          </span>
        </div>
        <div className="text-xs text-gray-500">{t("expl")}</div>{" "}
      </div>

      <div className="border ml-4 border-gray-100 rounded-md p-4 bg-gray-50/80">
        {/* Use the same tables as Marché Secondaire */}
        {type === "action" ? (
          <TitresTableREST type={type} isPrimary={false} />
        ) : (
          <TitresTableObligation type={type} isPrimary={false} />
        )}
      </div>
    </>
  );
};

export default SecondaryMarketPage;
