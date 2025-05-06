"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MyMarquee from "@/components/MyMarquee";
import ObligationsTable from "../../../../../../components/actions-obligations/ObligationsTable";
import { useRouter } from "@/i18n/routing";

export default function ObligationsListPage() {
  const t = useTranslations("Obligations");
  const router = useRouter();

  const handleCreateNew = () => {
    router.push("/obligations/create");
  };

  return (
    <div className="container mx-auto pb-6">
      <div className="pb-6">
        <MyMarquee />
      </div>

      <ObligationsTable onCreateNew={handleCreateNew} />
    </div>
  );
}
