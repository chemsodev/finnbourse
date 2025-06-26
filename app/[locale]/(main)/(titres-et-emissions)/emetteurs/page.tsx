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
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AjoutSocieteEmettrice from "@/components/listed-company/AjoutSocieteEmettrice";
import EditCompanyDialog from "@/components/listed-company/edit-company-dialog";
import DeleteCompanyDialog from "@/components/listed-company/delete-company-dialog";
import SearchFilter from "@/components/listed-company/search-filter";
// Removed GraphQL client - now using static data
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import { ExportButton } from "@/components/ExportButton";

// Static mock data for listed companies
const mockListedCompanies = [
  {
    id: "1",
    nom: "AlphaStock Corporation",
    secteuractivite: "Technology",
    capitalisationboursiere: "1250000000",
    siteofficiel: "https://alphastock.com",
    contact: {
      email: "investor@alphastock.com",
      website: "https://alphastock.com",
      phone: "+1-555-0101",
      nom: "John",
      prenom: "Doe",
      fonction: "Investor Relations",
      mobile: "+1-555-0101",
      address: "123 Tech Street",
    },
    extrafields: {
      notice: "Leading technology company",
    },
    description: "Leading technology company",
    dateCreation: "2020-01-15",
    statut: "Active",
  },
  {
    id: "2",
    nom: "BetaFinance Ltd",
    secteuractivite: "Finance",
    capitalisationboursiere: "890000000",
    siteofficiel: "https://betafinance.com",
    contact: {
      email: "info@betafinance.com",
      website: "https://betafinance.com",
      phone: "+1-555-0102",
      nom: "Jane",
      prenom: "Smith",
      fonction: "Public Relations",
      mobile: "+1-555-0102",
      address: "456 Finance Ave",
    },
    extrafields: {
      notice: "Financial services provider",
    },
    description: "Financial services provider",
    dateCreation: "2019-03-22",
    statut: "Active",
  },
  {
    id: "3",
    nom: "GammaInvest SA",
    secteuractivite: "Investment",
    capitalisationboursiere: "675000000",
    siteofficiel: "https://gammainvest.com",
    contact: {
      email: "contact@gammainvest.com",
      website: "https://gammainvest.com",
      phone: "+1-555-0103",
      nom: "Mike",
      prenom: "Johnson",
      fonction: "Investment Director",
      mobile: "+1-555-0103",
      address: "789 Investment Blvd",
    },
    extrafields: {
      notice: "Investment management firm",
    },
    description: "Investment management firm",
    dateCreation: "2018-07-10",
    statut: "Active",
  },
  {
    id: "4",
    nom: "DeltaTech Inc",
    secteuractivite: "Technology",
    capitalisationboursiere: "560000000",
    siteofficiel: "https://deltatech.com",
    contact: {
      email: "hello@deltatech.com",
      website: "https://deltatech.com",
      phone: "+1-555-0104",
      nom: "Sarah",
      prenom: "Wilson",
      fonction: "Communications Manager",
      mobile: "+1-555-0104",
      address: "321 Software St",
    },
    extrafields: {
      notice: "Software development company",
    },
    description: "Software development company",
    dateCreation: "2021-11-05",
    statut: "Active",
  },
];

type Company = {
  id: string;
  nom: string;
  secteuractivite: string;
  capitalisationboursiere: string;
  contact: any;
  siteofficiel: string;
  extrafields?: any;
};

export default function CompaniesPage() {
  const t = useTranslations("Companies");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] =
    useState<Company[]>(mockListedCompanies);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [deleteCompany, setDeleteCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(false); // No loading needed for static data
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use static mock data instead of GraphQL
  const companies = mockListedCompanies;

  const fetchCompanies = async () => {
    // Static data - no fetching needed
    // Simulate refresh for static data
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = companies.filter(
        (company) =>
          company.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.secteuractivite
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchTerm, companies]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCompanies();
  };

  const prepareExportData = (companies: Company[]) => {
    return companies.map((company) => ({
      [t("name")]: company.nom,
      [t("sector")]: company.secteuractivite,
      [t("capital")]: formatPrice(company.capitalisationboursiere),
      [t("contactName")]: `${company.contact?.prenom || ""} ${
        company.contact?.nom || ""
      }`.trim(),
      [t("contactFunction")]: company.contact?.fonction || "",
      [t("contactEmail")]: company.contact?.email || "",
      [t("contactPhone")]: company.contact?.phone || "",
      [t("contactMobile")]: company.contact?.mobile || "",
      [t("contactAddress")]: company.contact?.address || "",
      [t("website")]: company.siteofficiel || "",
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
            disabled={isRefreshing || loading}
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

          {loading && (
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

          {!loading && !error && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("sector")}</TableHead>
                    <TableHead>{t("capital")}</TableHead>
                    <TableHead>{t("contactInfo")}</TableHead>
                    <TableHead>{t("website")}</TableHead>
                    <TableHead>{t("notice")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchTerm ? t("noCompaniesFound") : t("noCompanies")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies?.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          {company.nom}
                        </TableCell>
                        <TableCell>{company.secteuractivite}</TableCell>
                        <TableCell>
                          {formatPrice(company.capitalisationboursiere)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {typeof company.contact === "object" && (
                              <>
                                {(company.contact.nom ||
                                  company.contact.prenom) && (
                                  <span className="font-medium">
                                    {company.contact.prenom}{" "}
                                    {company.contact.nom}
                                  </span>
                                )}
                                {company.contact.fonction && (
                                  <span className="text-sm">
                                    {company.contact.fonction}
                                  </span>
                                )}
                                {company.contact.email && (
                                  <span>Email: {company.contact.email}</span>
                                )}
                                {company.contact.phone && (
                                  <span>Tél: {company.contact.phone}</span>
                                )}
                                {company.contact.mobile && (
                                  <span>Mobile: {company.contact.mobile}</span>
                                )}
                                {company.contact.address && (
                                  <span className="text-xs text-muted-foreground">
                                    Adresse: {company.contact.address}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {company.siteofficiel ? (
                            <a
                              href={company.siteofficiel}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              {t("visit")}{" "}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">
                              {t("notAvailable")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {company.extrafields && company.extrafields.notice ? (
                            <div className="flex items-center">
                              <span className="line-clamp-1 max-w-[200px]">
                                {typeof company.extrafields.notice ===
                                  "object" && company.extrafields.notice.set
                                  ? company.extrafields.notice.set
                                  : company.extrafields.notice}
                              </span>
                              {((typeof company.extrafields.notice ===
                                "string" &&
                                company.extrafields.notice.length > 30) ||
                                (typeof company.extrafields.notice ===
                                  "object" &&
                                  company.extrafields.notice.set &&
                                  company.extrafields.notice.set.length >
                                    30)) && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-1 h-6 w-6"
                                      >
                                        <Info className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p>
                                        {typeof company.extrafields.notice ===
                                          "object" &&
                                        company.extrafields.notice.set
                                          ? company.extrafields.notice.set
                                          : company.extrafields.notice}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              {t("notAvailable")}
                            </span>
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
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setDeleteCompany({
                                  id: company.id,
                                  name: company.nom,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
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
          company={editCompany}
          open={!!editCompany}
          onOpenChange={(open) => !open && setEditCompany(null)}
          onSuccess={handleRefresh}
        />
      )}

      {deleteCompany && (
        <DeleteCompanyDialog
          companyId={deleteCompany.id}
          companyName={deleteCompany.name}
          open={!!deleteCompany}
          onOpenChange={(open) => !open && setDeleteCompany(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
