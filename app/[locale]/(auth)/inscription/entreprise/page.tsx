import FloatingShapes from "@/components/FloatingShapes";
import FormInscriptionEntreprise from "@/components/create-user-forms/FormInscriptionEntreprise";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const page = () => {
  const t = useTranslations("Inscription");
  return (
    <>
      <FloatingShapes />
      <div className="bg-primary h-screen w-screen flex justify-center items-center">
        <Card className=" flex flex-col gap-4 hover:scale-105 transition-transform duration-300 z-10">
          <CardHeader className="flex justify-center items-center">
            <Image src="/favicon.ico" alt="logo" width={100} height={100} />
            <h1 className="text-2xl font-bold text-primary text-center">
              {t("entreprise")}
            </h1>
          </CardHeader>

          <CardContent className="flex justify-center">
            <FormInscriptionEntreprise />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default page;
