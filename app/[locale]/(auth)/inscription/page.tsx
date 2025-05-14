import FloatingShapes from "@/components/FloatingShapes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Building, Landmark, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const Page = () => {
  const t = useTranslations("Inscription");
  return (
    <>
      <FloatingShapes />
      <div className="bg-primary h-screen w-screen flex justify-center items-center">
        <Card className="bg-white p-4 rounded-md flex flex-col gap-4 shadow-md hover:scale-105 transition-transform duration-300 px-20 z-10">
          <CardTitle className="flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <Image src="/favicon.ico" alt="logo" width={100} height={100} />
              <h1 className="text-2xl font-bold text-primary text-center">
                {t("createAccount")}
              </h1>
            </div>
          </CardTitle>
          <CardContent className="flex gap-6 justify-center my-6">
            <Link
              href="/inscription/particulier"
              className="w-32 h-32 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2 text-primary text-center"
            >
              <UserRound size={50} />
              <div>{t("particulier")}</div>
            </Link>
            <Link
              href="/inscription/entreprise"
              className="w-32 h-32 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2 text-primary text-center"
            >
              <Building size={50} />
              <div>{t("entreprise")}</div>
            </Link>
            <Link
              href="/inscription/entreprise"
              className="w-32 h-32 rounded-md bg-gray-100 shadow-inner flex justify-center items-center group hover:bg-primary hover:text-white hover:drop-shadow-md flex-col  cursor-pointer gap-2 text-primary text-center"
            >
              <Landmark size={50} />
              <div>{t("financialInstitution")}</div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
