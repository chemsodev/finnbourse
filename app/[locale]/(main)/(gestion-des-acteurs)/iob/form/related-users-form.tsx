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
  status: number | string;
  position?: string;
  organisation?: string;
  matricule?: string;
}

interface RelatedUsersFormProps {
  defaultValues: {
    users: User[];
  };
  onFormChange: (values: User[]) => void;
  entityName?: string;
}

export function RelatedUsersForm({
  defaultValues,
  onFormChange,
  entityName = "",
}: RelatedUsersFormProps) {
  const t = useTranslations("IOBPage");
  const [users, setUsers] = useState<User[]>(defaultValues.users || []);

  const handleUsersChange = (newUsers: User[]) => {
    setUsers(newUsers);
    onFormChange(newUsers);
  };

  return (
    <UserSelectionForm
      selectedUsers={users}
      onUsersChange={handleUsersChange}
      entityType="IOB"
      entityName={entityName}
    />
  );
}
