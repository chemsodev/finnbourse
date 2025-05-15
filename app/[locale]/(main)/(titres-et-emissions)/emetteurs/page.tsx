"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LIST_LISTED_COMPANIES } from "@/graphql/queries";
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
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [deleteCompany, setDeleteCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchGraphQLClient<{
        listListedCompanies: Company[];
      }>(LIST_LISTED_COMPANIES);

      if (!result || !result.listListedCompanies) {
        throw new Error(t("fetchError"));
      }

      // Process the companies data to ensure contact and extrafields are properly formatted
      const processedCompanies = result.listListedCompanies?.map((company) => {
        // Process contact object
        if (company.contact) {
          // If the contact field contains nested 'set' properties
          if (
            typeof company.contact === "object" &&
            (company.contact.email?.set ||
              company.contact.phone?.set ||
              company.contact.address?.set ||
              company.contact.nom?.set ||
              company.contact.prenom?.set ||
              company.contact.fonction?.set ||
              company.contact.mobile?.set)
          ) {
            company.contact = {
              nom: company.contact.nom?.set || "",
              prenom: company.contact.prenom?.set || "",
              fonction: company.contact.fonction?.set || "",
              email: company.contact.email?.set || "",
              phone: company.contact.phone?.set || "",
              mobile: company.contact.mobile?.set || "",
              address: company.contact.address?.set || "",
            };
          }
          // If contact is a string (JSON), try to parse it
          else if (typeof company.contact === "string") {
            try {
              company.contact = JSON.parse(company.contact);
            } catch (e) {
              company.contact = {
                nom: "",
                prenom: "",
                fonction: "",
                email: "",
                phone: "",
                mobile: "",
                address: "",
              };
            }
          }
        } else {
          company.contact = {
            nom: "",
            prenom: "",
            fonction: "",
            email: "",
            phone: "",
            mobile: "",
            address: "",
          };
        }

        // Process extrafields object
        if (company.extrafields) {
          // If extrafields has a notice with a 'set' property
          if (
            typeof company.extrafields === "object" &&
            company.extrafields.notice
          ) {
            // Handle the case where notice is an object with 'set' property
            if (
              typeof company.extrafields.notice === "object" &&
              company.extrafields.notice.set !== undefined
            ) {
              company.extrafields = {
                notice: company.extrafields.notice.set,
              };
            }
            // Notice is already a string, keep it as is
          }
          // If extrafields is a string (JSON), try to parse it
          else if (typeof company.extrafields === "string") {
            try {
              company.extrafields = JSON.parse(company.extrafields);
            } catch (e) {
              company.extrafields = { notice: "" };
            }
          }
        } else {
          company.extrafields = { notice: "" };
        }

        return company;
      });

      setCompanies(processedCompanies);
      setFilteredCompanies(processedCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError(error instanceof Error ? error.message : t("unknownError"));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

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
