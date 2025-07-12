"use client";

import { useRouter } from "next/navigation";
import { SimpleClientForm } from "@/components/create-user-forms/SimpleClientForm";

export default function NewClientPage() {
  const router = useRouter();

  const handleSuccess = (client: any) => {
    console.log("Client created successfully:", client);
    router.push("/clients");
  };

  const handleCancel = () => {
    router.push("/clients");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <SimpleClientForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
