"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  ChevronDown,
  Check,
  X,
  Shuffle,
  Pencil,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import { Switch } from "@/components/ui/switch";

import { useClients } from "@/hooks/useClients";
// Define a simple Client type for the component
interface Client {
  id: string;
  clientCode?: string;
  clientType?: string;
  name?: string;
  raisonSociale?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
  [key: string]: any;
}
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

export default function ClientDashboard() {
  const t = useTranslations("ClientDashboard");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clientStatuses, setClientStatuses] = useState<{
    [key: string]: string;
  }>({});
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);
  const [clientToToggleStatus, setClientToToggleStatus] = useState<
    string | null
  >(null);
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

      // Initialize client statuses
      const initialStatuses: { [key: string]: string } = {};
      data.forEach((client: Client) => {
        initialStatuses[client.id] = client.status || "actif";
      });
      setClientStatuses(initialStatuses);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  const toggleClientStatus = (clientId: string) => {
    setClientToToggleStatus(clientId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = () => {
    if (!clientToToggleStatus) return;

    const clientId = clientToToggleStatus;

    // Update the status in state
    setClientStatuses((prev) => ({
      ...prev,
      [clientId]: prev[clientId] === "actif" ? "inactif" : "actif",
    }));

    // In a real app, you would update the status in your database
    console.log(
      `Toggled status for client ID: ${clientId} from ${
        clientStatuses[clientId]
      } to ${clientStatuses[clientId] === "actif" ? "inactif" : "actif"}`
    );

    // Reset the confirmation dialog
    setStatusConfirmDialog(false);
    setClientToToggleStatus(null);
  };

  const cancelToggleStatus = () => {
    setStatusConfirmDialog(false);
    setClientToToggleStatus(null);
  };

  const filteredClients = clients.filter(
    (client) =>
      (client.clientType === "personne_physique"
        ? client.name || ""
        : client.raisonSociale || ""
      )
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (client.nin || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phoneNumber || "")
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
                  {
                    clients.filter((c) => c.clientType === "personne_physique")
                      .length
                  }
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
                <TableHead className="text-white font-medium">
                  {t("code")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("name")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("type")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("email")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("phone")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("address")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("status")}
                </TableHead>
                <TableHead className="text-white font-medium w-[120px]">
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {t("noClientsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-primary">
                      {client.clientCode || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {client.clientType === "personne_physique"
                        ? client.name
                        : client.raisonSociale}
                    </TableCell>
                    <TableCell>
                      {client.clientType === "personne_physique"
                        ? t("individual")
                        : client.clientType === "personne_morale"
                        ? t("company")
                        : t("financialInstitution")}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      {client.phoneNumber || client.mobilePhone}
                    </TableCell>
                    <TableCell>{client.address}</TableCell>
                    <TableCell>
                      {clientStatuses[client.id] === "actif" ? (
                        <div className="flex items-center">
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-center text-xs mr-2">
                            <span className="text-xs font-medium">actif</span>
                          </div>
                          <Switch
                            checked={clientStatuses[client.id] === "actif"}
                            onCheckedChange={() =>
                              toggleClientStatus(client.id)
                            }
                            className="ml-2 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                          >
                            <div className="bg-white h-4 w-4 rounded-full transform transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
                          </Switch>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-center text-xs mr-2">
                            <span className="text-xs font-medium">inactif</span>
                          </div>
                          <Switch
                            checked={clientStatuses[client.id] === "actif"}
                            onCheckedChange={() =>
                              toggleClientStatus(client.id)
                            }
                            className="ml-2 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                          >
                            <div className="bg-white h-4 w-4 rounded-full transform transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
                          </Switch>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                {selectedClient?.clientType === "personne_physique"
                  ? selectedClient.name
                  : selectedClient?.raisonSociale}
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

      {/* Status Toggle Confirmation Dialog */}
      <Dialog open={statusConfirmDialog} onOpenChange={setStatusConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer le changement de statut</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir changer le statut de ce client ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-5">
            <Button variant="outline" onClick={cancelToggleStatus}>
              Annuler
            </Button>
            <Button onClick={confirmToggleStatus} variant="default">
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
