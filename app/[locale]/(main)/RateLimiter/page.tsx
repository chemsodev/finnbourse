"use client";

import { redirect, useRouter } from "@/i18n/routing";
import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const page = () => {
  const t = useTranslations("rateLimitReached");
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(60); // Changed from 90 to 60

  useEffect(() => {
    if (timeLeft === 0) {
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const progress = ((60 - timeLeft) / 60) * 100; // This formula now works correctly with 60 seconds

  return (
    <div className="absolute z-50  top-0 left-0 right-0 bg-gradient-to-br from-primary to-green-900 w-screen h-screen justify-center items-center flex flex-col gap-4 cursor-not-allowed">
      <Gauge className="text-white font-bold w-32 h-32" />
      <div className="text-5xl font-bold text-orange-500">429</div>
      <div className="text-3xl font-bold text-white">
        {t("rateLimitReached")}
      </div>
      <p className="text-white text-center max-w-md">
        {t("desc1")} <span className="text-orange-500">{timeLeft}</span>{" "}
        {t("desc2")}
      </p>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mt-12">
        <div
          className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default page;
