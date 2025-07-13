"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  Building,
  CreditCard,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useClientApi } from "@/hooks/useClientApi";
import { ClientFormValues } from "@/lib/services/client-api";
import { useToast } from "@/hooks/use-toast";

interface ClientListItem {
  id: string;
  clientCode: string;
  email: string;
  phoneNumber: string;
  clientType:
    | "personne_physique"
    | "personne_morale"
    | "institution_financiere";
  name?: string;
  raisonSociale?: string;
  wilaya: string;
  numeroCompteTitre: string;
  createdAt: Date;
}

export default function ClientsPage() {
  const t = useTranslations("ClientsPage");
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState<ClientListItem[]>([]);

  const {
    getAllClients,
    transformBackendToForm,
    isLoading,
    error,
    clearError,
  } = useClientApi();

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await getAllClients({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        type: filterType !== "all" ? filterType : undefined,
      });

      // Transform backend data to frontend format
      const transformedClients = Array.isArray(response)
        ? response.map(transformClientData)
        : response?.data?.map(transformClientData) || [];

      setClients(transformedClients);
    } catch (error) {
      console.error("Failed to load clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    }
  };

  const transformClientData = (backendClient: any): ClientListItem => {
    return {
      id: backendClient.id,
      clientCode: backendClient.client_code || backendClient.clientCode,
      email: backendClient.email,
      phoneNumber: backendClient.phone_number || backendClient.phoneNumber,
      clientType:
        backendClient.type === "individual"
          ? "personne_physique"
          : backendClient.type === "company"
          ? "personne_morale"
          : "institution_financiere",
      name: backendClient.name || backendClient.client_details?.name,
      raisonSociale:
        backendClient.raison_sociale ||
        backendClient.client_details?.raison_sociale,
      wilaya:
        backendClient.wilaya || backendClient.client_details?.wilaya || "",
      numeroCompteTitre:
        backendClient.securities_account_number ||
        backendClient.numeroCompteTitre,
      createdAt: new Date(backendClient.createdAt || Date.now()),
    };
  };

  // Filter clients based on search and filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.name &&
        client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.raisonSociale &&
        client.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === "all" || client.clientType === filterType;

    return matchesSearch && matchesType;
  });

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case "personne_physique":
        return <Users className="h-4 w-4" />;
      case "personne_morale":
        return <Building className="h-4 w-4" />;
      case "institution_financiere":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getClientTypeBadge = (type: string) => {
    const variants = {
      personne_physique: "default",
      personne_morale: "secondary",
      institution_financiere: "outline",
    } as const;

    const labels = {
      personne_physique: "Particulier",
      personne_morale: "Entreprise",
      institution_financiere: "Institution",
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] || "default"}>
        {getClientTypeIcon(type)}
        <span className="ml-1">
          {labels[type as keyof typeof labels] || type}
        </span>
      </Badge>
    );
  };

  const handleCreateClient = () => {
    router.push("/clients/new");
  };

  const handleEditClient = (clientId: string) => {
    router.push(`/clients/${clientId}/edit`);
  };

  const handleViewClient = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  // Show loading state
  if (isLoading && clients.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">Loading client data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
        <div className="flex gap-2">
          <Button
            onClick={loadClients}
            variant="outline"
            size="icon"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            onClick={handleCreateClient}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("addNewClient")}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-700">{error}</p>
              <Button variant="outline" size="sm" onClick={clearError}>
                {t("dismiss")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Clients ({filteredClients.length})</span>
            <Users className="h-5 w-5 text-gray-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm ? t("noClientsFound") : t("noClientsYet")}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? t("noClientsFoundDescription")
                  : t("noClientsDescription")}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleCreateClient}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("createFirstClient")}
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">{t("code")}</TableHead>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("phone")}</TableHead>
                    <TableHead>{t("accountNumber")}</TableHead>
                    <TableHead className="w-[80px]">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {client.clientCode}
                      </TableCell>
                      <TableCell>
                        {client.name || client.raisonSociale || "-"}
                      </TableCell>
                      <TableCell>
                        {getClientTypeBadge(client.clientType)}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phoneNumber}</TableCell>
                      <TableCell>{client.numeroCompteTitre}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewClient(client.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {t("view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClient(client.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t("edit")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredClients.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              {t("previous")}
            </Button>

            <span className="px-4 py-2 text-sm text-gray-600">
              {t("page")} {currentPage}
            </span>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={filteredClients.length < 20}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
