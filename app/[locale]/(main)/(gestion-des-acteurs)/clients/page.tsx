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

import { getClients, deleteClient } from "@/lib/client-service";
import type { Client } from "./schema";
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
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [t]);

  const filteredClients = clients.filter(
    (client) =>
      (client.clientType === "personne_physique"
        ? client.name
        : client.raisonSociale
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
      await deleteClient(selectedClient.id);
      setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
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

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M4 7V2h10v4a2 2 0 0 0 2 2h4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
                <path d="M10 12h4" />
                <path d="M10 16h4" />
                <path d="M10 8h1" />
              </svg>
              {t("exportExcel")}
            </Button>
            <Button onClick={() => router.push("/clients/create-client")}>
              <Plus className="mr-2 h-4 w-4" /> {t("add")}
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
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
                  <TableCell colSpan={7} className="text-center py-8">
                    {t("noClientsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-slate-50">
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
                      {client.status === "verified" ? (
                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full w-fit">
                          <span className="text-xs font-medium">
                            {t("verified")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full w-fit">
                          <span className="text-xs font-medium">
                            {t("notVerified")}
                          </span>
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
    </div>
  );
}
