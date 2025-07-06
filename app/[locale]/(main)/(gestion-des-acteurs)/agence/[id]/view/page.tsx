"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Building2,
  ArrowLeft,
  Phone,
  Mail,
  Printer,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/ui/loading";
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
import { useTranslations } from "next-intl";
import { agencyData, type AgencyData } from "@/lib/exportables";

// Agency user interface
export interface ExtendedAgencyUser {
  id: string;
  firstname: string;
  lastname: string;
  fullname?: string; // Computed property for display
  email: string;
  telephone: string;
  phone?: string; // Alternative field name
  status: "actif" | "inactif" | "active" | "inactive"; // Supporting both formats
  position?: string;
  matricule?: string;
  role: string[];
  type?: "admin" | "user"; // Role type
  organisation?: string; // Organization info
  createdAt?: string;
  updatedAt?: string;
}

export default function ViewAgencyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const t = useTranslations("AgencyDetailsPage");
  const [isLoading, setIsLoading] = useState(true);
  const [agency, setAgency] = useState<any | null>(null);
  const [financialInstitution, setFinancialInstitution] = useState<any | null>(
    null
  );
  const [users, setUsers] = useState<ExtendedAgencyUser[]>([]);
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedAgencyUser | null>(
    null
  );

  useEffect(() => {
    fetchAgencyData();
  }, [params.id]);

  // Function to fetch and refresh Agency data
  const fetchAgencyData = async () => {
    try {
      setIsLoading(true);

      // In a real implementation, you would fetch the agency from your API
      const { actorAPI } = await import("@/app/actions/actorAPI");

      // Get the agency ID from params
      const agencyId =
        typeof params.id === "string"
          ? params.id
          : Array.isArray(params.id)
          ? params.id[0]
          : "";

      if (!agencyId) {
        toast({
          title: "Error",
          description: t("agencyNotFound"),
          variant: "destructive",
        });
        router.push("/agence");
        return;
      }

      // Fetch agency data
      const agencyData = await actorAPI.agence.getOne(agencyId);

      if (!agencyData) {
        toast({
          title: "Error",
          description: t("agencyNotFound"),
          variant: "destructive",
        });
        router.push("/agence");
        return;
      }

      setAgency(agencyData);

      // If the agency has a financial institution, set it
      if (agencyData.financialInstitution) {
        setFinancialInstitution(agencyData.financialInstitution);
      }

      // Fetch agency users (assuming there's an API for this)
      try {
        const usersData = await actorAPI.agence.getUsers(agencyId);
        setUsers(usersData || []);
      } catch (userError) {
        console.error("Failed to fetch agency users:", userError);
        setUsers([]); // Set empty array if fetch fails
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching agency data:", error);
      toast({
        title: "Error",
        description: t("failedToLoadAgency"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggleStatus || !agency?.id) return;

    try {
      const currentUsers = users;
      const userToUpdate = currentUsers.find(
        (user) => user.id === userToToggleStatus
      );
      if (!userToUpdate) return;

      const updatedStatus =
        userToUpdate.status === "actif" ? "inactif" : "actif";

      // Update user via API
      const { actorAPI } = await import("@/app/actions/actorAPI");
      await actorAPI.agence.updateUser(agency.id, userToToggleStatus, {
        ...userToUpdate,
        status: updatedStatus,
      });

      // Refresh Agency data to get updated users
      await fetchAgencyData();

      toast({
        title: t("success"),
        description: t("userUpdatedSuccessfully"),
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: t("error"),
        description: t("failedToUpdateUser"),
        variant: "destructive",
      });
    } finally {
      setStatusConfirmDialog(false);
      setUserToToggleStatus(null);
    }
  };

  const cancelToggleStatus = () => {
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  if (isLoading) return <Loading className="min-h-[400px]" />;
  if (!agency) return <div>{t("agencyNotFound")}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8 bg-slate-100 p-4 rounded-md">
        <Button
          onClick={() => router.push("/agence")}
          variant="outline"
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("backToList")}
        </Button>
        <h1 className="text-3xl font-bold">{t("generalInformation")}</h1>
        {agency.agenceCode && (
          <p className="text-lg text-primary ml-4">
            {t("codeAgence")}:{" "}
            <span className="font-semibold">{agency.agenceCode}</span>
          </p>
        )}
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">
            <Building2 className="h-4 w-4 mr-2" />
            {t("generalInformation")}
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            {t("assignedUsers")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>{t("generalInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("generalInformation")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">{t("nomBanque")}</p>
                        <p>{agency.nomBanque}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("codeAgence")}</p>
                        <p>{agency.agenceCode}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("codeSwiftBic")}</p>
                        <p>{agency.codeSwiftBic}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("devise")}</p>
                        <p>{agency.devise}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold">{t("adresseComplete")}</p>
                        <p>{agency.adresseComplete}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("directeurAgence")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">{t("directeurNom")}</p>
                        <p>{agency.directeurNom}</p>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {t("directeurTelephone")}
                        </p>
                        <p>{agency.directeurTelephone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold">{t("directeurEmail")}</p>
                        <p>{agency.directeurEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{t("assignedUsers")}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      {t("name")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("position")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Matricule
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("validation")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Type</TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("organization")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Email</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Téléphone
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("status")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-4 text-muted-foreground"
                      >
                        Aucun utilisateur assigné
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="whitespace-nowrap">
                          {user.fullname}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.position}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.matricule}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {Array.isArray(user.role) && user.role.length > 0
                            ? user.role
                                .map((r) =>
                                  r.includes("validator_2") ||
                                  r === "Validator 2"
                                    ? t("validator2")
                                    : r.includes("validator_1") ||
                                      r === "Validator 1"
                                    ? t("validator1")
                                    : r.includes("initiator") ||
                                      r === "Initiator"
                                    ? t("initiator")
                                    : t("consultation")
                                )
                                .join(", ")
                            : t("consultation")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.type === "admin" ? t("admin") : t("member")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.organisation}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.email || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.phone || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={
                                user.status === "active" ||
                                user.status === "actif"
                              }
                              onCheckedChange={() =>
                                handleToggleStatus(user.id)
                              }
                              className={
                                user.status === "active" ||
                                user.status === "actif"
                                  ? "bg-green-500 data-[state=checked]:bg-green-500"
                                  : "bg-red-500 data-[state=unchecked]:bg-red-500"
                              }
                            />
                            <span
                              className={
                                user.status === "active" ||
                                user.status === "actif"
                                  ? "text-green-600 text-sm font-medium"
                                  : "text-red-600 text-sm"
                              }
                            >
                              {user.status === "active" ||
                              user.status === "actif"
                                ? t("active")
                                : t("inactive")}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog
        open={statusConfirmDialog}
        onOpenChange={setStatusConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier le statut</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir changer le statut de cet utilisateur ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelToggleStatus}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
