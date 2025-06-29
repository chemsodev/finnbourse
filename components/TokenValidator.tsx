/**
 * TokenValidator.tsx
 * Global component to handle token validation and automatic redirects
 */

"use client";

import React from "react";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import { usePathname } from "next/navigation";

interface TokenValidatorProps {
  children: React.ReactNode;
}

const TokenValidator: React.FC<TokenValidatorProps> = ({ children }) => {
  const pathname = usePathname();

  console.log("🔧 TokenValidator: Validation enabled with lenient settings");

  // Skip token validation for public pages (but NOT the root path which is protected)
  const publicPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/inscription",
    "/motdepasseoublie",
  ];
  const isPublicPage = publicPages.some((page) => pathname.includes(page));

  // Only validate token for protected pages, with lenient settings that respect grace periods
  useTokenValidation({
    redirectOnInvalid: !isPublicPage, // Only redirect if on a protected page
    checkInterval: 300000, // Check every 5 minutes (very lenient)
    enableBackendValidation: false, // Disable backend validation to prevent API-based redirects
    maxRetries: 1, // Minimal retries to avoid aggressive validation
  });

  return <>{children}</>;
};

export default TokenValidator;
