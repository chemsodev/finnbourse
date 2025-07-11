"use client";
import React, { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const UserFilter = () => {
  const t = useTranslations("UserFilter");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const userType = searchParams.get("userType") || "1";

  // Add debugging to understand what's happening
  useEffect(() => {
    console.log("UserFilter - Current userType:", userType);
  }, [userType]);

  const handleUserTypeChange = (type: string) => {
    console.log("Setting userType to:", type);
    const params = new URLSearchParams(searchParams.toString());
    params.set("userType", parseInt(type, 10).toString());
    router.replace(`${pathname}?${params}`);
  };

  return (
    <div className="flex bg-gray-50/80 rounded-md p-1 text-sm items-center text-gray-300 font-medium capitalize">
      <button
        className={`py-1 px-2 cursor-pointer ${
          userType === "1" &&
          "flex items-center bg-primary text-white rounded-md shadow"
        }`}
        onClick={() => handleUserTypeChange("1")}
      >
        {t("investisseur")}
      </button>
      <button
        className={`p-1 px-2 cursor-pointer ${
          userType === "2" &&
          "flex items-center bg-primary text-white rounded-md shadow"
        }`}
        onClick={() => handleUserTypeChange("2")}
      >
        {t("IOB")}
      </button>

      <button
        className={`p-1 px-2 cursor-pointer ${
          userType === "3" &&
          "flex items-center bg-primary text-white rounded-md shadow"
        }`}
        onClick={() => handleUserTypeChange("3")}
      >
        {t("TTC")}
      </button>
      <button
        className={`p-1 px-2 cursor-pointer ${
          userType === "4" &&
          "flex items-center bg-primary text-white rounded-md shadow"
        }`}
        onClick={() => handleUserTypeChange("4")}
      >
        {t("Agence")}
      </button>
    </div>
  );
};

export default UserFilter;
