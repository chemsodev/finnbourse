"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const t = useTranslations("DeconnexionDialog");

  const handleLogout = async () => {
    try {
      // Clear all session storage immediately
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.removeItem("finnbourse_rest_token");
        localStorage.removeItem("finnbourse-menu");

        // Clear any token manager state
        if ((window as any).tokenManager) {
          (window as any).tokenManager.reset();
        }
      }

      // Sign out with proper cleanup
      await signOut({ redirect: true, callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if logout fails
      window.location.href = "/login";
    }
  };

  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      onClick={() => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("finnbourse-menu");
        }
        signOut();
      }}
    >
      {t("deconnexion")}
    </button>
  );
}
