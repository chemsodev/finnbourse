"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/loading";

export default function AgenceRedirectPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      router.push(`/agence/${params.id}/view`);
    }
  }, [params.id, router]);

  return <Loading className="min-h-[400px]" />;
}
