import FloatingShapes from "@/components/FloatingShapes";
import FormInscriptionParticulier from "@/components/FormInscriptionParticulier";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const page = () => {
  const t = useTranslations("Inscription");
  return (
    <>
      <FloatingShapes />
      <div className="bg-primary h-screen w-screen flex justify-center items-center">
        <Card className="bg-white p-4 rounded-md flex flex-col gap-4 shadow-md hover:scale-105 transition-transform duration-300 px-12 z-10 ">
          <CardHeader>
            <div className="flex justify-center items-center">
              <Image src="/favicon.ico" alt="logo" width={100} height={100} />
            </div>
            <h1 className="text-2xl font-bold text-primary text-center">
              {t("particulier")}
            </h1>
          </CardHeader>
          <CardContent className="flex justify-center">
            <FormInscriptionParticulier />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default page;
