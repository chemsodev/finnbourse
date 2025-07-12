"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { EnhancedClientForm } from "@/components/create-user-forms/EnhancedClientForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditClientPageProps {
  params: {
    id: string;
  };
}

export default function EditClientPage({ params }: EditClientPageProps) {
  const router = useRouter();
  const t = useTranslations("ClientsPage");
  const { id } = params;

  const handleSuccess = (client: any) => {
    // Redirect to the client details page
    router.push(`/clients/${client.id}`);
  };

  const handleCancel = () => {
    router.push(`/clients/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/clients/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">{t("editClient")}</h1>
      </div>

      <EnhancedClientForm
        clientId={id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
