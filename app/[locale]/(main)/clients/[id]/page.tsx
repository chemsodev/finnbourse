"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function ClientRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    // Redirect to the view page
    router.replace(`/clients/${id}/view`);
  }, [id, router]);

  // Return empty content - this won't be visible as we're redirecting
  return null;
}
