"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
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
import { actorAPI } from "@/app/actions/actorAPI";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ClientView() {
  const t = useTranslations("ClientDashboard");
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<any>(null);
  const [clientUsers, setClientUsers] = useState<any[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const dataFetchedRef = useRef<boolean>(false);

  const { getClientById, deleteClient, loading } = useClients();

  useEffect(() => {
    // Prevent multiple API calls
    if (dataFetchedRef.current) return;

    const fetchClient = async () => {
      try {
        const data = await getClientById(clientId);
        console.log("Client data:", data); // Debug the client data
        setClient(data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };

    const fetchClientUsers = async () => {
      try {
        setLoadingUsers(true);
        // In a real implementation, you would fetch users from the API
        // The endpoint may not yet be fully implemented in actorAPI.client
        // For now, we'll just use an empty array
        // const response = await actorAPI.client.getUsers(clientId);
        // const users = response?.data || response || [];

        console.log(
          "Fetching client users would go here with clientId:",
          clientId
        );
        // Mock empty array for now
        setClientUsers([]);
      } catch (error) {
        console.error("Error fetching client users:", error);
        setClientUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (clientId) {
      dataFetchedRef.current = true;
      fetchClient();
      fetchClientUsers();
    }
  }, [clientId]); // Remove getClientById from dependencies

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
            {client.type === "individual" ? client.name : client.raison_sociale}
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
                <p className="mt-1">{client.client_code || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("type")}
                </h3>
                <p className="mt-1">
                  {client.type === "individual"
                    ? t("individual")
                    : client.type === "corporate"
                    ? t("company")
                    : t("financialInstitution")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {client.type === "individual" ? t("name") : t("companyName")}
                </h3>
                <p className="mt-1">
                  {client.type === "individual"
                    ? client.name
                    : client.raison_sociale}
                </p>
              </div>
              {client.type !== "individual" && (
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
                    <p className="mt-1">{client.reg_number || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("legalForm")}
                    </h3>
                    <p className="mt-1">{client.legal_form || "-"}</p>
                  </div>
                </>
              )}
              {client.type === "individual" && (
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
                      {t("idType")}
                    </h3>
                    <p className="mt-1">{client.id_type || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("idNumber")}
                    </h3>
                    <p className="mt-1">{client.id_number || "-"}</p>
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
                <p className="mt-1">{client.phone_number || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("mobilePhone")}
                </h3>
                <p className="mt-1">{client.mobile_phone || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("wilaya")}
                </h3>
                <p className="mt-1">{client.wilaya || "-"}</p>
              </div>
              {client.securities_account_number && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("securitiesAccount")}
                  </h3>
                  <p className="mt-1">
                    {client.securities_account_number || "-"}
                  </p>
                </div>
              )}
              {client.cash_account_rip_full && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("cashAccount")}
                  </h3>
                  <p className="mt-1">{client.cash_account_rip_full || "-"}</p>
                </div>
              )}
              {!client.cash_account_rip_full &&
                (client.cash_account_bank_code ||
                  client.cash_account_agency_code ||
                  client.cash_account_number) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("cashAccount")}
                    </h3>
                    <p className="mt-1">
                      {[
                        client.cash_account_bank_code,
                        client.cash_account_agency_code,
                        client.cash_account_number,
                        client.cash_account_rip_key,
                      ]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </p>
                  </div>
                )}
              {client.lieu_naissance && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("birthPlace")}
                  </h3>
                  <p className="mt-1">{client.lieu_naissance || "-"}</p>
                </div>
              )}
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

      {/* Related Users Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("relatedUsers")}</CardTitle>
          <Button
            size="sm"
            onClick={() => router.push(`/clients/${clientId}/users/new`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addUser")}
          </Button>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <Loading className="min-h-[200px]" />
          ) : clientUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("noUsersFound")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("userType")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telephone || "-"}</TableCell>
                    <TableCell>
                      {user.clientUserType === "proprietaire"
                        ? t("owner")
                        : user.clientUserType === "mandataire"
                        ? t("agent")
                        : t("legalGuardian")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.role?.map((role: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {role}
                          </Badge>
                        )) || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "actif" ? "default" : "destructive"
                        }
                      >
                        {user.status === "actif" ? t("active") : t("inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/clients/${clientId}/users/${user.id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{t("editUser")}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
