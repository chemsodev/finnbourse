"use client";

import { SessionProvider } from "next-auth/react";
import { MenuProvider } from "@/contexts/MenuContext";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <MenuProvider>{children}</MenuProvider>
    </SessionProvider>
  );
}
