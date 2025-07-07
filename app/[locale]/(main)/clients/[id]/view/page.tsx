"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import Loading from "@/components/ui/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ClientView() {
  const t = useTranslations("ClientDashboard");
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { getClientById, deleteClient, loading } = useClients();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(clientId);
        setClient(data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId, getClientById]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteClient(clientId);
      router.push("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading || !client) {
    return <Loading className="min-h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {client.clientType === "personne_physique"
              ? client.name
              : client.raisonSociale}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/clients/${clientId}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t("edit")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("delete")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("clientDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("code")}
                </h3>
                <p className="mt-1">{client.clientCode || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("type")}
                </h3>
                <p className="mt-1">
                  {client.clientType === "personne_physique"
                    ? t("individual")
                    : client.clientType === "personne_morale"
                    ? t("company")
                    : t("financialInstitution")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {client.clientType === "personne_physique"
                    ? t("name")
                    : t("companyName")}
                </h3>
                <p className="mt-1">
                  {client.clientType === "personne_physique"
                    ? client.name
                    : client.raisonSociale}
                </p>
              </div>
              {client.clientType === "personne_morale" && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("nif")}
                    </h3>
                    <p className="mt-1">{client.nif || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("regNumber")}
                    </h3>
                    <p className="mt-1">{client.regNumber || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("legalForm")}
                    </h3>
                    <p className="mt-1">{client.legalForm || "-"}</p>
                  </div>
                </>
              )}
              {client.clientType === "personne_physique" && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("nin")}
                    </h3>
                    <p className="mt-1">{client.nin || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("nationality")}
                    </h3>
                    <p className="mt-1">{client.nationalite || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("wilaya")}
                    </h3>
                    <p className="mt-1">{client.wilaya || "-"}</p>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("email")}
                </h3>
                <p className="mt-1">{client.email || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("phone")}
                </h3>
                <p className="mt-1">
                  {client.phoneNumber || client.mobilePhone || "-"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("address")}
                </h3>
                <p className="mt-1">{client.address || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("status")}
                </h3>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "actif"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {client.status === "actif" ? t("active") : t("inactive")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteClientConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loading className="mr-2 h-4 w-4" />
                  {t("deleting")}
                </>
              ) : (
                t("delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
