"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MyMarquee from "@/components/MyMarquee";
import ActionsTable from "../../../../../../components/actions-obligations/ActionsTable";
import { useRouter } from "@/i18n/routing";

export default function ActionsListPage() {
  const t = useTranslations("Actions");
  const router = useRouter();

  const handleCreateNew = () => {
    router.push("/actions/create");
  };

  return (
    <div className="container mx-auto pb-6">
      <div className="pb-6">
        <MyMarquee />
      </div>

      <ActionsTable onCreateNew={handleCreateNew} />
    </div>
  );
}
