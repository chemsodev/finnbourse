"use client";

import { useLoginMenuFetch } from "@/hooks/useLoginMenuFetch";

export default function MenuFetchInitializer() {
  useLoginMenuFetch();
  return null;
}
