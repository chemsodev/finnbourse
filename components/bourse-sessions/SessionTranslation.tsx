"use client";

import { useTranslations } from "next-intl";

// This higher-order component provides translation functionality to session components
export function useSessionTranslations() {
  const t = useTranslations("bourseSessions");
  return t;
}
