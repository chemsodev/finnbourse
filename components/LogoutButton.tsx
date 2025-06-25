"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const t = useTranslations("DeconnexionDialog");

  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      onClick={() =>{
     if(typeof window !== "undefined") {
        sessionStorage.removeItem("finnbourse-menu");
     }
        signOut()
      }}
    >
      {t("deconnexion")}
    </button>
  );
}
