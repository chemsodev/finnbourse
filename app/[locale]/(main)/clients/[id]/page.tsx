"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useClientApi } from "@/hooks/useClientApi";
import { ClientFormValues } from "@/lib/services/client-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Users,
  Building,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Hash,
  Calendar,
  User,
  FileText,
  Loader2,
} from "lucide-react";

interface ClientDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ClientDetailsPage({ params }: ClientDetailsPageProps) {
  const router = useRouter();
  const t = useTranslations("ClientsPage");
  const { id } = params;
  const [client, setClient] = useState<ClientFormValues | null>(null);

  const { getClient, transformBackendToForm, isLoading, error } =
    useClientApi();

  useEffect(() => {
    loadClientDetails();
  }, [id]);

  const loadClientDetails = async () => {
    try {
      const clientData = await getClient(id);
      const transformedClient = transformBackendToForm(clientData);
      setClient(transformedClient);
    } catch (error) {
      console.error("Failed to load client details:", error);
    }
  };

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case "personne_physique":
        return <Users className="h-5 w-5" />;
      case "personne_morale":
        return <Building className="h-5 w-5" />;
      case "institution_financiere":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
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
      institution_financiere: "Institution Financière",
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t("loadingClient")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            {t("clientNotFound")}
          </h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {t("clientNotFoundDescription")}
              </p>
              <Button onClick={() => router.push("/clients")} className="mt-4">
                {t("backToClients")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t("back")}</span>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">
                {client.name || client.raisonSociale || client.clientCode}
              </h1>
              {getClientTypeBadge(client.clientType)}
            </div>
            <p className="text-gray-600">{t("clientDetails")}</p>
          </div>
        </div>

        <Button onClick={() => router.push(`/clients/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          {t("editClient")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("basicInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {t("clientCode")}
                  </p>
                  <p className="text-sm text-gray-900">{client.clientCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {t("email")}
                  </p>
                  <p className="text-sm text-gray-900">{client.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {t("phone")}
                  </p>
                  <p className="text-sm text-gray-900">{client.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {t("location")}
                  </p>
                  <p className="text-sm text-gray-900">{client.wilaya}</p>
                  {client.address && (
                    <p className="text-sm text-gray-600">{client.address}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specific Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getClientTypeIcon(client.clientType)}
              {t("specificInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.clientType === "personne_physique" && (
              <div className="space-y-3">
                {client.name && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("fullName")}
                    </p>
                    <p className="text-sm text-gray-900">{client.name}</p>
                  </div>
                )}

                {client.nationalite && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("nationality")}
                    </p>
                    <p className="text-sm text-gray-900">
                      {client.nationalite}
                    </p>
                  </div>
                )}

                {client.dateNaissance && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {t("birthDate")}
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(client.dateNaissance).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {client.lieuNaissance && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("birthPlace")}
                    </p>
                    <p className="text-sm text-gray-900">
                      {client.lieuNaissance}
                    </p>
                  </div>
                )}

                {client.idNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("idNumber")}
                    </p>
                    <p className="text-sm text-gray-900">{client.idNumber}</p>
                  </div>
                )}
              </div>
            )}

            {(client.clientType === "personne_morale" ||
              client.clientType === "institution_financiere") && (
              <div className="space-y-3">
                {client.raisonSociale && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("companyName")}
                    </p>
                    <p className="text-sm text-gray-900">
                      {client.raisonSociale}
                    </p>
                  </div>
                )}

                {client.nif && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">NIF</p>
                    <p className="text-sm text-gray-900">{client.nif}</p>
                  </div>
                )}

                {client.regNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("registrationNumber")}
                    </p>
                    <p className="text-sm text-gray-900">{client.regNumber}</p>
                  </div>
                )}

                {client.legalForm && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("legalForm")}
                    </p>
                    <p className="text-sm text-gray-900">{client.legalForm}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("accountInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {t("securitiesAccount")}
              </p>
              <p className="text-sm text-gray-900">
                {client.numeroCompteTitre}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">RIB</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">{t("bankCode")}:</span>
                  <span className="ml-1 text-gray-900">{client.ribBanque}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("agencyCode")}:</span>
                  <span className="ml-1 text-gray-900">{client.ribAgence}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">{t("accountNumber")}:</span>
                  <span className="ml-1 text-gray-900">{client.ribCompte}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("ribKey")}:</span>
                  <span className="ml-1 text-gray-900">{client.ribCle}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-gray-700">
                {t("iobType")}
              </p>
              <Badge variant="outline">
                {client.iobType === "intern" ? t("internal") : t("external")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        {client.observation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("observations")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900">{client.observation}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
