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

// Bank/IOB data interface
interface BankData {
  id: number;
  codeBank: string;
  shortName: string;
  longName: string;
  correspondent: string;
  address: string;
  phone: string;
  email?: string;
  fax?: string;
  telephone1?: string;
  telephone2?: string;
  telephone3?: string;
  ordreDeTu?: string;
}

// IOB user interface
interface IOBUser {
  id: number;
  fullname: string;
  position: string;
  matricule: string;
  role: string;
  type: string;
  status: "active" | "inactive";
  organisation: string;
  password: string;
  email?: string;
  phone?: string;
}

export default function ViewIOBPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const t = useTranslations("IOBPage");
  const [isLoading, setIsLoading] = useState(true);
  const [iob, setIOB] = useState<BankData | null>(null);
  const [users, setUsers] = useState<IOBUser[]>([]);
  const [userToToggleStatus, setUserToToggleStatus] = useState<number | null>(
    null
  );
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchIOBData = async () => {
      try {
        // Convert ID to number for proper comparison
        const iobId =
          typeof params.id === "string"
            ? parseInt(params.id, 10)
            : Array.isArray(params.id)
            ? parseInt(params.id[0], 10)
            : 0;

        // Mock bank data - in a real app, this would come from an API call
        const bankData: BankData[] = [
          {
            id: 1,
            codeBank: "91001",
            shortName: "SGA",
            longName: "Société Générale Algérie",
            correspondent: "Mohammed Ali",
            address: "123 Rue des Banques, ALGER",
            phone: "021-123-456",
            email: "contact@sga.dz",
            fax: "021-111-222",
            telephone1: "021-333-444",
            telephone2: "021-555-666",
            telephone3: "021-777-888",
            ordreDeTu: "1",
          },
          {
            id: 2,
            codeBank: "91002",
            shortName: "Inv Mart",
            longName: "Invest Market",
            correspondent: "Sarah Benali",
            address: "45 Boulevard des Finances, ALGER",
            phone: "021-987-654",
            email: "contact@invmart.dz",
            fax: "021-875-421",
          },
          {
            id: 3,
            codeBank: "91003",
            shortName: "Tell",
            longName: "Tell Market",
            correspondent: "Karim Hadj",
            address: "78 Avenue de l'Investissement, ALGER",
            phone: "021-741-852",
            email: "info@tellmarket.dz",
          },
          {
            id: 4,
            codeBank: "91004",
            shortName: "CNEP",
            longName: "CAISSE NATIONALE D'EPARGNE ET DE PREVOYANCE",
            correspondent: "Ahmed Messaoudi",
            address: "15 Rue de l'Épargne, ALGER",
            phone: "021-159-753",
            email: "contact@cnep.dz",
          },
          {
            id: 5,
            codeBank: "91005",
            shortName: "BNA",
            longName: "BANQUE NATIONALE D'ALGERIE",
            correspondent: "Leila Khalfi",
            address: "32 Avenue de la Nation, ALGER",
            phone: "021-456-789",
            email: "service@bna.dz",
          },
          {
            id: 6,
            codeBank: "91006",
            shortName: "CPA",
            longName: "Crédit Populair d'Algérie",
            correspondent: "Omar Boudiaf",
            address: "50 Boulevard des Martyrs, ALGER",
            phone: "021-852-963",
            email: "info@cpa.dz",
          },
        ];

        // Find IOB in the mock data
        const foundIOB = bankData.find((bank) => bank.id === iobId);

        if (!foundIOB) {
          toast({
            title: "Erreur",
            description: t("iobNotFound"),
            variant: "destructive",
          });
          router.push("/iob");
          return;
        }
        setIOB(foundIOB);

        // Mock IOB users data - in a real app, this would come from an API call
        const mockIOBUsers: IOBUser[] = [
          {
            id: 1,
            fullname: "John Doe",
            position: "DG",
            matricule: "IOB001",
            role: "Valideur 2",
            type: "admin",
            status: "active",
            organisation: foundIOB.shortName,
            password: "Password123",
            email: `john.doe@${foundIOB.shortName.toLowerCase()}.dz`,
            phone: "+213 555-123-456",
          },
          {
            id: 2,
            fullname: "Maria García",
            position: "Analyste",
            matricule: "IOB002",
            role: "Valideur 1",
            type: "user",
            status: "active",
            organisation: foundIOB.shortName,
            password: "SecurePass456",
            email: `maria.garcia@${foundIOB.shortName.toLowerCase()}.dz`,
            phone: "+213 555-789-012",
          },
          {
            id: 3,
            fullname: "Ahmed Hassan",
            position: "Directeur",
            matricule: "IOB003",
            role: "Initiateur",
            type: "user",
            status: "inactive",
            organisation: foundIOB.shortName,
            password: "StrongPwd789",
            email: `ahmed.hassan@${foundIOB.shortName.toLowerCase()}.dz`,
            phone: "+213 555-345-678",
          },
        ];

        setUsers(mockIOBUsers);
      } catch (error) {
        console.error("Error fetching IOB data:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données de l'IOB",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIOBData();
  }, [params.id, router, toast, t]);

  const handleToggleStatus = (userId: number) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = () => {
    if (!userToToggleStatus) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userToToggleStatus
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );

    toast({
      title: "Statut mis à jour",
      description: "Le statut de l'utilisateur a été mis à jour avec succès",
    });

    // Reset dialog state
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  const cancelToggleStatus = () => {
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  if (isLoading) return <Loading className="min-h-[400px]" />;
  if (!iob) return <div>{t("iobNotFound")}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8 bg-slate-100 p-4 rounded-md">
        <Button
          onClick={() => router.push("/iob")}
          variant="outline"
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("backToList")}
        </Button>
        <h1 className="text-3xl font-bold">{t("detailsIob")}</h1>
        {iob.codeBank && (
          <p className="text-lg text-primary ml-4">
            {t("bankCode")}:{" "}
            <span className="font-semibold">{iob.codeBank}</span>
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
            {t("associatedUsers")}
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
                      {t("bankDetails")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">{t("bankCode")}</p>
                        <p>{iob.codeBank}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("shortName")}</p>
                        <p>{iob.shortName}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("longName")}</p>
                        <p>{iob.longName}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("ordreDeTu")}</p>
                        <p>{iob.ordreDeTu || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("contactInfo")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="font-semibold">{t("address")}</p>
                          <p>{iob.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="font-semibold">{t("mainPhone")}</p>
                          <p>{iob.phone}</p>
                        </div>
                      </div>
                      {iob.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <p className="font-semibold">{t("email")}</p>
                            <p>{iob.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("correspondent")}
                    </h3>
                    <div className="p-4 border rounded-md">
                      <p className="font-medium">{iob.correspondent}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {t("contactPerson")}
                      </p>
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
              <CardTitle>{t("associatedUsers")}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      {t("fullName")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("position")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("matricule")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("role")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("type")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("organisation")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("email")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("phone")}
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
                        {t("noUsers")}
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
                          {user.role}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.type}
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
                              checked={user.status === "active"}
                              onCheckedChange={() =>
                                handleToggleStatus(user.id)
                              }
                              className={
                                user.status === "active"
                                  ? "bg-green-500 data-[state=checked]:bg-green-500"
                                  : "bg-red-500 data-[state=unchecked]:bg-red-500"
                              }
                            />
                            <span
                              className={
                                user.status === "active"
                                  ? "text-green-600 text-sm font-medium"
                                  : "text-red-600 text-sm"
                              }
                            >
                              {user.status === "active"
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
