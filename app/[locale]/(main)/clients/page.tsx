"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Shuffle,
  Pencil,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";

import { useClients } from "@/hooks/useClients";
// Define a more complete Client type for the component
interface Client {
  id: string;
  type?: string;
  agence?: string;
  agency_name?: string;
  client_code?: string;
  client_source?: string;
  email?: string;
  phone_number?: string;
  mobile_phone?: string;
  id_type?: string;
  cash_account_bank_code?: string;
  cash_account_agency_code?: string;
  cash_account_number?: string;
  cash_account_rip_key?: string;
  cash_account_rip_full?: string;
  securities_account_number?: string;
  name?: string;
  id_number?: string;
  nin?: string;
  nationalite?: string;
  wilaya?: string;
  address?: string;
  lieu_naissance?: string;
  employe_a_la_institution_financiere?: boolean;
  raison_sociale?: string;
  nif?: string;
  reg_number?: string;
  legal_form?: string;
  status?: string;
  date_naissance?: string;
  [key: string]: any;
}

export default function ClientDashboard() {
  const t = useTranslations("ClientDashboard");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the new clients hook
  const {
    clients,
    loading,
    fetchClients,
    deleteClient: deleteClientAPI,
    hasToken,
  } = useClients();

  useEffect(() => {
    loadClients();
  }, [hasToken]);

  useEffect(() => {
    // Also try to load clients when the component mounts
    if (hasToken && clients.length === 0) {
      loadClients();
    }
  }, []);

  const loadClients = async () => {
    try {
      console.log("🔄 Loading clients, hasToken:", hasToken);
      if (!hasToken) {
        console.log("⚠️ No token available, skipping client fetch");
        return;
      }

      const data = await fetchClients();
      console.log("✅ Clients loaded:", data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      (client.type === "individual"
        ? client.name || ""
        : client.raison_sociale || ""
      )
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (client.nin || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone_number || client.mobile_phone || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (client.client_code || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedClient) return;
    try {
      setIsDeleting(true);
      await deleteClientAPI(selectedClient.id);
      // The hook will update the clients state automatically
      setSelectedClient(null);
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <Loading className="min-h-[400px]" />;
  }

  return (
    <div>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-secondary">
            {t("title")}
          </h1>
          <div className="flex justify-end gap-4">
            <div className="bg-primary justify-between gap-20 p-2 text-sm rounded-md shadow-sm flex text-white">
              <div className="flex flex-col gap-1">
                <div>{t("totalClients")}</div>
                <div className="font-bold text-2xl">{clients.length}</div>
                <div>{t("total")}</div>
              </div>
              <div className="flex flex-col justify-end">
                <Shuffle />
              </div>
            </div>
            <div className="bg-primary justify-between gap-8 p-2 text-sm rounded-md shadow-sm flex text-white">
              <div className="flex flex-col gap-1">
                <div>{t("numberByClientType")}</div>
                <div className="font-bold text-2xl">
                  {clients.filter((c) => c.type === "individual").length}
                </div>
                <div>{t("individuals")}</div>
              </div>
              <div className="flex flex-col justify-end">
                <Shuffle />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative flex items-center w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t("searchClients")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push("/clients/new")}>
            <Plus className="mr-2 h-4 w-4" /> {t("addClient")}
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-white font-medium w-[80px]">
                  {t("code")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("name")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("email")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("phone")}
                </TableHead>
                <TableHead className="text-white font-medium text-right">
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {searchQuery ? t("noClientsFound") : t("noClientsYet")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-primary">
                      {client.client_code || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {client.type === "individual"
                        ? client.name
                        : client.raison_sociale}
                    </TableCell>
                    <TableCell>{client.email || "-"}</TableCell>
                    <TableCell>
                      {client.phone_number || client.mobile_phone || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/clients/${client.id}/view`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/clients/${client.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedClient(client);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmation")}{" "}
              <span className="font-medium">
                {selectedClient?.raison_sociale}
              </span>
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
