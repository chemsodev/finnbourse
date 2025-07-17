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
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  EyeOff,
  User,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { IOB, IOBUser } from "@/lib/types/actors";
import { useIOB } from "@/hooks/useIOB";
import { getRoleById } from "@/lib/roles";

export interface ExtendedIOBUser extends IOBUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  status: "actif" | "inactif";
  posteIob?: string;
  matriculeIob?: string;
  role: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function ViewIOBPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const t = useTranslations("IOBPage");
  const [isLoading, setIsLoading] = useState(true);
  const [iob, setIOB] = useState<IOB | null>(null);
  const [financialInstitution, setFinancialInstitution] = useState<any | null>(
    null
  );
  const [users, setUsers] = useState<ExtendedIOBUser[]>([]);
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedIOBUser | null>(
    null
  );
  const { getIOB } = useIOB();

  // Function to fetch and refresh IOB data
  const fetchIOBData = async () => {
    try {
      if (!params.id || typeof params.id !== "string") {
        throw new Error("Invalid IOB ID");
      }

      const iobId = params.id;

      // Load IOB data from API
      const { actorAPI } = await import("@/app/actions/actorAPI");
      const iobData = await actorAPI.iob.getOne(iobId);
      if (!iobData) {
        toast({
          title: t("error"),
          description: t("iobNotFound"),
          variant: "destructive",
        });
        router.push("/iob");
        return;
      }

      console.log("IOB Data:", iobData);
      setIOB(iobData);

      // Extract financial institution data
      if (iobData.financialInstitution) {
        setFinancialInstitution(iobData.financialInstitution);
      }

      // Users are now included in the IOB response
      if (iobData.users && Array.isArray(iobData.users)) {
        setUsers(iobData.users);
      }
    } catch (error) {
      console.error("Error fetching IOB data:", error);
      toast({
        title: t("error"),
        description: t("errorLoadingData"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIOBData();
  }, [params.id, router, toast, t]);

  const handleToggleStatus = async (userId: string) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggleStatus || !iob?.id) return;

    try {
      setIsLoading(true);

      // Find the user to toggle
      const userToUpdate = users.find((user) => user.id === userToToggleStatus);
      if (!userToUpdate) return;

      // Prepare updated user data
      const updatedStatus =
        userToUpdate.status === "actif" ? "inactif" : "actif";

      // Update user via API
      const { actorAPI } = await import("@/app/actions/actorAPI");
      await actorAPI.iob.updateUser(iob.id, userToToggleStatus, {
        ...userToUpdate,
        status: updatedStatus,
      });

      // Refresh IOB data to get updated users
      await fetchIOBData();

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
      setIsLoading(false);
      setStatusConfirmDialog(false);
      setUserToToggleStatus(null);
    }
  };

  const cancelToggleStatus = () => {
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  // Toggle password visibility for a user
  const togglePasswordVisibility = (userId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Handle view user details
  const handleViewUser = (user: ExtendedIOBUser) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  if (isLoading) return <Loading className="min-h-[400px]" />;
  if (!iob) return <div>{t("iobNotFound")}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8 bg-slate-100 p-4 rounded-md">
        <div className="flex items-center">
          <Button
            onClick={() => router.push("/iob")}
            variant="outline"
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("backToList")}
          </Button>
          <h1 className="text-3xl font-bold">{t("detailsIob")}</h1>
          {iob.code && (
            <p className="text-lg text-primary ml-4">
              {t("code")}: <span className="font-semibold">{iob.code}</span>
            </p>
          )}
        </div>

        <Button
          onClick={() => router.push(`/iob/form/${iob.id}`)}
          variant="default"
          className="bg-primary hover:bg-primary/90"
        >
          <Edit className="h-4 w-4 mr-2" />
          {t("editIOB")}
        </Button>
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
              <div className="space-y-6">
                {/* Main Information */}
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    {t("iobDetails")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold">{t("code")}</p>
                      <p className="font-medium text-primary">{iob.code}</p>
                    </div>
                    {financialInstitution && (
                      <>
                        <div>
                          <p className="font-semibold">
                            {t("financialInstitution")}
                          </p>
                          <p>{financialInstitution.institutionName}</p>
                        </div>
                        <div>
                          <p className="font-semibold">
                            {t("agreementNumber")}
                          </p>
                          <p>{financialInstitution.agreementNumber}</p>
                        </div>
                        <div>
                          <p className="font-semibold">{t("legalForm")}</p>
                          <p>{financialInstitution.legalForm}</p>
                        </div>
                        <div>
                          <p className="font-semibold">
                            {t("taxIdentificationNumber")}
                          </p>
                          <p>{financialInstitution.taxIdentificationNumber}</p>
                        </div>
                        <div>
                          <p className="font-semibold">
                            {t("establishmentDate")}
                          </p>
                          <p>
                            {financialInstitution.establishmentDate
                              ? new Date(
                                  financialInstitution.establishmentDate
                                ).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    {t("contactInformation")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold">{t("address")}</p>
                      <p>{iob.address || "-"}</p>
                    </div>
                    {financialInstitution?.fullAddress && (
                      <div>
                        <p className="font-semibold">{t("fullAddress")}</p>
                        <p>{financialInstitution.fullAddress}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{t("phone")}</p>
                      <p>{iob.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">{t("email")}</p>
                      <p>{iob.email || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">{t("fax")}</p>
                      <p>{iob.fax || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("associatedUsers")}</CardTitle>
              <Button onClick={() => router.push(`/iob/form/${iob.id}`)}>
                <Users className="h-4 w-4 mr-2" />
                Edit Users
              </Button>
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
                      {t("email")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("phone")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Roles</TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("status")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {t("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-4 text-muted-foreground"
                      >
                        {t("noUsers")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="whitespace-nowrap">
                          {`${user.firstname || ""} ${user.lastname || ""}`}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.posteIob || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.matriculeIob || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap max-w-[150px] truncate">
                          {user.email || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {user.telephone || "-"}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {user.role && user.role.length > 0 ? (
                              user.role.map((roleId, index) => {
                                const roleInfo = getRoleById(roleId);
                                return (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {roleInfo?.label || roleId}
                                  </Badge>
                                );
                              })
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            variant={
                              user.status === "actif" ? "outline" : "secondary"
                            }
                            className={
                              user.status === "actif"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {user.status === "actif"
                              ? t("active")
                              : t("inactive")}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUser(user)}
                              className="h-7 w-7 p-0"
                              title="View details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Switch
                              checked={user.status === "actif"}
                              onCheckedChange={() =>
                                handleToggleStatus(user.id)
                              }
                              className={
                                user.status === "actif"
                                  ? "bg-green-500 data-[state=checked]:bg-green-500"
                                  : "bg-red-500 data-[state=unchecked]:bg-red-500"
                              }
                            />
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

      {/* User Details Dialog */}
      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="text-base">
                      {selectedUser.firstname} {selectedUser.lastname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{selectedUser.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Position
                    </p>
                    <p className="text-base">{selectedUser.posteIob || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Matricule
                    </p>
                    <p className="text-base">
                      {selectedUser.matriculeIob || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-base">{selectedUser.telephone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-base">
                      <Badge
                        variant={
                          selectedUser.status === "actif"
                            ? "outline"
                            : "secondary"
                        }
                        className={
                          selectedUser.status === "actif"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {selectedUser.status === "actif"
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Roles & Permissions */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Roles & Permissions
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Roles</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedUser.role && selectedUser.role.length > 0 ? (
                        selectedUser.role.map((roleId, index) => {
                          const roleInfo = getRoleById(roleId);
                          return (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-sm"
                            >
                              {roleInfo?.label || roleId}
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-gray-500">No roles assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Dates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Created At
                    </p>
                    <p className="text-base">
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Last Updated
                    </p>
                    <p className="text-base">
                      {selectedUser.updatedAt
                        ? new Date(selectedUser.updatedAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <AlertDialog
        open={statusConfirmDialog}
        onOpenChange={setStatusConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user's status? This will
              affect their ability to access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelToggleStatus}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleStatus}
              className="bg-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
