"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function LogoutNotification() {
  const t = useTranslations("tokenRevoked");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          signOut();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-br from-primary to-green-900 flex items-center justify-center p-4 cursor-not-allowed pointer-events-none z-50">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-8 shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 text-white animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white text-center">
          {t("sessionConfilct")}
        </h1>
        <p className="text-white text-center mb-6">{t("warningMessage")}</p>
        <div className="text-6xl font-bold text-white text-center mb-6 animate-bounce">
          {countdown}
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-6">
          <div
            className="bg-white rounded-full h-2 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 10) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-white text-center">{t("contactSupport")}</p>
      </div>
    </div>
  );
}
