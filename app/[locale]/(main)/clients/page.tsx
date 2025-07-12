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
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useClientApi } from "@/hooks/useClientApi";
import { ClientFormValues } from "@/lib/services/client-api";
import { toast } from "@/hooks/use-toast";

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
  status: "actif" | "inactif";
  createdAt: Date;
}

export default function ClientsPage() {
  const t = useTranslations("ClientsPage");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
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
      status: "actif", // Default status
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
    const matchesStatus =
      filterStatus === "all" || client.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
          <p className="text-gray-600 mt-2">{t("description")}</p>
        </div>
        <Button
          onClick={handleCreateClient}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("addNewClient")}
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t("filtersAndSearch")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder={t("filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTypes")}</SelectItem>
                <SelectItem value="personne_physique">
                  {t("individual")}
                </SelectItem>
                <SelectItem value="personne_morale">{t("company")}</SelectItem>
                <SelectItem value="institution_financiere">
                  {t("financialInstitution")}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="actif">{t("active")}</SelectItem>
                <SelectItem value="inactif">{t("inactive")}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={loadClients}
              disabled={isLoading}
            >
              {isLoading ? t("loading") : t("refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>

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

      {/* Clients List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">{t("noClientsFound")}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {t("noClientsDescription")}
                </p>
                <Button onClick={handleCreateClient} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("createFirstClient")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getClientTypeIcon(client.clientType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {client.name ||
                            client.raisonSociale ||
                            client.clientCode}
                        </h3>
                        {getClientTypeBadge(client.clientType)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{t("code")}:</span>{" "}
                          {client.clientCode}
                        </div>
                        <div>
                          <span className="font-medium">{t("email")}:</span>{" "}
                          {client.email}
                        </div>
                        <div>
                          <span className="font-medium">{t("phone")}:</span>{" "}
                          {client.phoneNumber}
                        </div>
                        <div>
                          <span className="font-medium">{t("wilaya")}:</span>{" "}
                          {client.wilaya}
                        </div>
                        <div>
                          <span className="font-medium">
                            {t("accountNumber")}:
                          </span>{" "}
                          {client.numeroCompteTitre}
                        </div>
                        <div>
                          <span className="font-medium">{t("status")}:</span>
                          <Badge
                            variant={
                              client.status === "actif"
                                ? "default"
                                : "secondary"
                            }
                            className="ml-1"
                          >
                            {client.status === "actif"
                              ? t("active")
                              : t("inactive")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClient(client.id)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{t("view")}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClient(client.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">{t("edit")}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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
