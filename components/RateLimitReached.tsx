"use client";

import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const RateLimitReached = () => {
  // Completely hide rate limit UI
  return null;

  /* DISABLED - Rate limit UI hidden
  const t = useTranslations("rateLimitReached");

  const [timeLeft, setTimeLeft] = useState(90);

  useEffect(() => {
    if (timeLeft === 0) {
      window.location.reload();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const progress = ((90 - timeLeft) / 90) * 100;

  return (
    <div className="absolute z-50  top-0 left-0 right-0 bg-gradient-to-br from-primary to-green-900 w-screen h-screen justify-center items-center flex flex-col gap-4 cursor-not-allowed">
      <Gauge className="text-white font-bold w-32 h-32" />
      <div className="text-5xl font-bold text-secondary">429</div>
      <div className="text-3xl font-bold text-white">
        {t("rateLimitReached")}
      </div>
      <p className="text-white text-center max-w-md">
        {t("desc1")} {timeLeft} {t("desc2")}
      </p>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mt-12">
        <div
          className="h-full bg-secondary transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
  */
};

export default RateLimitReached;
