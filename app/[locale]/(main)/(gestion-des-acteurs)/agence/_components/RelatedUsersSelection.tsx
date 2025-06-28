"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { UserSelectionForm } from "@/components/UserSelectionForm";

interface User {
  id: string;
  fullname: string;
  email: string;
  phonenumber: string;
  roleid: number;
  status: "active" | "inactive" | number | string;
  position?: string;
  organisation?: string;
  matricule?: string;
  roles?: string[];
}

interface RelatedUsersSelectionProps {
  users: User[];
  onUsersChange: (users: User[]) => void;
  entityName?: string;
}

export function RelatedUsersSelection({
  users,
  onUsersChange,
  entityName = "",
}: RelatedUsersSelectionProps) {
  const t = useTranslations("AgencyPage");

  return (
    <UserSelectionForm
      selectedUsers={users}
      onUsersChange={onUsersChange}
      entityType="AGENCE"
      entityName={entityName}
    />
  );
}
