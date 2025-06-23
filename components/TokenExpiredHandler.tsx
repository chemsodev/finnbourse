"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { useRestToken } from "@/hooks/useRestToken";
import { useTranslations } from "next-intl";

export default function TokenExpiredHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Auth");
  const { restToken, isLoading, fetchAndStoreRestToken } = useRestToken();
  const [retryCount, setRetryCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Show message after a short delay to avoid flashing
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // If authenticated but no REST token, try to fetch it
    if (status === "authenticated" && !restToken && retryCount < 3) {
      const timer = setTimeout(() => {
        fetchAndStoreRestToken();
        setRetryCount((prev) => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status, restToken, retryCount]);

  if (!showMessage) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>

      <h2 className="text-xl font-semibold mb-2">
        {status === "loading" ? t("loading") : t("authRequired")}
      </h2>

      <p className="text-gray-500 text-center max-w-md">
        {status === "loading"
          ? t("pleaseWait")
          : !restToken
          ? t("tokenRequired")
          : t("preparingInterface")}
      </p>
    </div>
  );
}
