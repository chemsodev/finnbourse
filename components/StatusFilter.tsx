"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
const StatusFilter = () => {
  const t = useTranslations("StatusFilter");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const status = searchParams.get("status") || "1";

  const handleStatusChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", parseInt(type, 10).toString());
    router.replace(`${pathname}?${params}`);
  };

  return (
    <div className="flex bg-gray-50/80 rounded-md p-1 text-sm items-center text-gray-300 font-medium capitalize">
      <button
        className={`py-1 px-4 cursor-pointer rounded-md  ${
          status === "1" ? "bg-primary shadow" : ""
        }`}
        onClick={() => handleStatusChange("1")}
      >
        {t("active")}
      </button>
      <button
        className={`py-1 px-4 cursor-pointer rounded-md ${
          status === "0" ? "bg-primary shadow" : ""
        }`}
        onClick={() => handleStatusChange("0")}
      >
        {t("inactif")}
      </button>
    </div>
  );
};

export default StatusFilter;
