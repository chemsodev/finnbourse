import ConfettiOnLoad from "@/components/Confetti";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
const page = () => {
  const t = useTranslations("congrats");

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen motion-preset-focus motion-duration-2000">
      <ConfettiOnLoad />

      <div className="flex justify-center items-center">
        <video width="150" height="150" autoPlay preload="auto">
          <source src="/1732454382143.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      <h1 className="text-3xl font-bold text-primary">{t("congrats")}</h1>
      <div className="text-lg">{t("description")}</div>
      <Link href="/" className="bg-blue-600 text-white py-2 px-4 rounded-md">
        {t("retour")}
      </Link>
    </div>
  );
};

export default page;
