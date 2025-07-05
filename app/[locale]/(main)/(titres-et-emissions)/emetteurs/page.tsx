"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  ExternalLink,
  Loader2,
  RefreshCw,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AjoutSocieteEmettrice from "@/components/listed-company/AjoutSocieteEmettrice";
import EditCompanyDialog from "@/components/listed-company/edit-company-dialog";

import SearchFilter from "@/components/listed-company/search-filter";
import { useIssuer } from "@/hooks/useIssuer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import { ExportButton } from "@/components/ExportButton";

type Company = {
  id: string;
  name: string;
  activitySector: string;
  capital: string;
  email: string;
  tel: string;
  address: string;
  website: string;
  extrafields?: any;
};

function mapApiCompanyToDialogCompany(apiCompany: Company): any {
  return {
    id: apiCompany.id,
    nom: apiCompany.name,
    secteuractivite: apiCompany.activitySector,
    capitalisationboursiere: apiCompany.capital,
    contact: {
      nom: "",
      prenom: "",
      fonction: "",
      email: apiCompany.email,
      phone: apiCompany.tel,
      mobile: "",
      address: apiCompany.address,
    },
    siteofficiel: apiCompany.website,
    extrafields: apiCompany.extrafields,
  };
}

export default function CompaniesPage() {
  const t = useTranslations("Companies");
  const [searchTerm, setSearchTerm] = useState("");
  const [editCompany, setEditCompany] = useState<Company | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { issuers, isLoading, fetchIssuers } = useIssuer();

  useEffect(() => {
    fetchIssuers().catch((e) => setError("Erreur lors du chargement des émetteurs"));
  
  }, []);

  const filteredCompanies = issuers
    .filter((company) =>
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.activitySector?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      
      if (a.updatedAt && b.updatedAt) {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      
      if (a.id && b.id) {
        const idA = parseInt(a.id);
        const idB = parseInt(b.id);
        if (!isNaN(idA) && !isNaN(idB)) {
          return idB - idA; 
        }
        return b.id.localeCompare(a.id);
      }
      
      return (a.name || "").localeCompare(b.name || "");
    });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchIssuers();
    } catch (e) {
      setError("Erreur lors du rafraîchissement des émetteurs");
    } finally {
      setIsRefreshing(false);
    }
  };

  const prepareExportData = (companies: Company[]) => {
    return companies.map((company) => ({
      [t("name")]: company.name,
      [t("sector")]: company.activitySector,
      [t("capital")]: formatPrice(company.capital),
      [t("email")]: company.email,
      [t("tel")]: company.tel,
      [t("address")]: company.address,
      [t("website")]: company.website || "",
      [t("notice")]: company.extrafields?.notice || "",
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("listedCompanies")}</CardTitle>
            <CardDescription>{t("listedCompaniesDescription")}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">{t("refresh")}</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <AjoutSocieteEmettrice />
            <div className="flex gap-2">
              <ExportButton data={prepareExportData(filteredCompanies)} />
              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{t("loading")}</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{t("error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <div className="text-sm text-muted-foreground mb-2">
                {t("sortedByCreationDate") || "Triés par date de création (plus récent en premier)"}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("sector")}</TableHead>
                    <TableHead>{t("capital")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("tel")}</TableHead>
                    <TableHead>{t("address")}</TableHead>
                    <TableHead>{t("website")}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {searchTerm ? t("noCompaniesFound") : t("noCompanies")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies?.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.activitySector}</TableCell>
                        <TableCell>{company.capital}</TableCell>
                        <TableCell>{company.email}</TableCell>
                        <TableCell>{company.tel}</TableCell>
                        <TableCell>{company.address}</TableCell>
                        <TableCell>
                          {company.website ? (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              {t("visit")} <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">{t("notAvailable")}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditCompany(company)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {editCompany && (
        <EditCompanyDialog
          company={mapApiCompanyToDialogCompany(editCompany)}
          open={!!editCompany}
          onOpenChange={(open) => !open && setEditCompany(null)}
          onSuccess={handleRefresh}
        />
      )}


    </div>
  );
}
