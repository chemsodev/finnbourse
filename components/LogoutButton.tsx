"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useMenuContext } from "@/contexts/MenuContext";
import { clearAllSessionData } from "@/lib/utils/menuUtils";
import { handleInvalidTokenCleanup } from "@/lib/utils/tokenCleanup";

export default function LogoutButton() {
  const t = useTranslations("DeconnexionDialog");
  const { clearMenu } = useMenuContext();

  const handleLogout = async () => {
    try {
      console.log("🚪 Starting logout process...");

      // Clear menu context first
      clearMenu();

      // Clear all session data using both utilities for comprehensive cleanup
      clearAllSessionData();
      await handleInvalidTokenCleanup();

      // Sign out with proper cleanup
      await signOut({ redirect: true, callbackUrl: "/login" });
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Force redirect even if logout fails
      window.location.href = "/login";
    }
  };

  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      onClick={handleLogout}
    >
      {t("deconnexion")}
    </button>
  );
}
