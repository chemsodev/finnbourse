"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  Edit,
  RefreshCw,
  Building2,
  Settings,
  ArrowLeft,
  Phone,
  Mail,
  Eye,
  EyeOff,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useTCC } from "@/hooks/useTCC";
import { useRestToken } from "@/hooks/useRestToken";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { getRoleById } from "@/lib/roles";

interface TCCPageProps {
  params: {
    locale: string;
  };
}

export default function TCCPage({ params }: TCCPageProps) {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  // API hooks - now expecting single TCC
  const { tcc, isLoading, fetchTCC, hasTCC } = useTCC();
  const { hasRestToken, isLoading: tokenLoading } = useRestToken();
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});

  // Load TCC data on mount and when token becomes available
  useEffect(() => {
    if (hasRestToken && !tokenLoading) {
      loadTCCData();
    }
  }, [hasRestToken, tokenLoading]);

  const loadTCCData = async () => {
    try {
      const result = await fetchTCC();
      console.log("🔍 TCC fetch result:", result);
      console.log("🔍 hasTCC():", hasTCC());
      console.log("🔍 tcc state:", tcc);
    } catch (error) {
      console.error("Failed to load TCC data:", error);
      toast({
        title: "Error",
        description: "Failed to load TCC data",
        variant: "destructive",
      });
    }
  };

  const handleCreateTCC = () => {
    router.push(`/${params.locale}/tcc/form`);
  };

  const handleEditTCC = () => {
    // No need for TCC ID in the URL since there's only one TCC
    router.push(`/${params.locale}/tcc/form`);
  };

  const handleManageUsers = () => {
    if (tcc) {
      // Navigate to the users tab in the same page
      const tabsElement = document.querySelector(
        '[data-value="users"]'
      ) as HTMLElement;
      if (tabsElement) {
        tabsElement.click();
      }
    }
  };

  const handleToggleStatus = async (userId: string) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggleStatus || !tcc?.id) return;

    try {
      const users = tcc.users || [];
      const userToUpdate = users.find((user) => user.id === userToToggleStatus);
      if (!userToUpdate) return;

      const updatedStatus =
        userToUpdate.status === "actif" ? "inactif" : "actif";

      // Update user via API
      const { actorAPI } = await import("@/app/actions/actorAPI");
      await actorAPI.tcc.updateUser(userToToggleStatus, {
        ...userToUpdate,
        status: updatedStatus,
      });

      // Refresh TCC data to get updated users
      await loadTCCData();

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

  // Toggle password visibility for a user
  const togglePasswordVisibility = (userId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Handle view user details
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  // Show loading state
  if (isLoading || tokenLoading) {
    return <Loading className="min-h-[400px]" />;
  }

  // Show empty state if no TCC exists and token is ready
  const shouldShowEmpty =
    !isLoading && !tokenLoading && hasRestToken && !hasTCC();

  if (shouldShowEmpty) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">TCC Management</h1>
          <Button onClick={loadTCCData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-gray-100 rounded-full p-6 mb-6">
            <Building2 className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No TCC Configured
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            You haven't set up your TCC (Teneur de Comptes Conservateur) yet.
            Create your TCC configuration to get started with account
            management.
          </p>
          <Button
            onClick={handleCreateTCC}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create TCC Configuration
          </Button>
        </div>
      </div>
    );
  }

  // Show existing TCC (single instance)
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8 bg-slate-100 p-4 rounded-md">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">{t("detailsTCC")}</h1>
          {tcc!.code && (
            <p className="text-lg text-primary ml-4">
              {t("codeTCC")}: <span className="font-semibold">{tcc!.code}</span>
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={loadTCCData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">{t("refresh")}</span>
          </Button>
          <Button
            onClick={handleEditTCC}
            variant="default"
            className="bg-primary hover:bg-primary/90"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t("editTCC")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info" data-value="info">
            <Building2 className="h-4 w-4 mr-2" />
            {t("generalInformation")}
          </TabsTrigger>
          <TabsTrigger value="users" data-value="users">
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
                    {t("tccDetails")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <p className="font-semibold">Code</p>
                      <p className="font-medium text-primary">{tcc!.code}</p>
                    </div>
                    <div>
                      <p className="font-semibold">{t("name")}</p>
                      <p>{tcc!.libelle}</p>
                    </div>
                    <div>
                      <p className="font-semibold">{t("email")}</p>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{tcc!.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{t("phone")}</p>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{tcc!.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{t("address")}</p>
                      <p>
                        {tcc!.address}
                        <br />
                        {tcc!.postal_code} {tcc!.city}
                        <br />
                        {tcc!.country}
                      </p>
                    </div>
                    {tcc!.agreement_number && (
                      <div>
                        <p className="font-semibold">{t("agreementNumber")}</p>
                        <p>{tcc!.agreement_number}</p>
                      </div>
                    )}
                    {tcc!.agreement_date && (
                      <div>
                        <p className="font-semibold">{t("agreementDate")}</p>
                        <p>
                          {new Date(tcc!.agreement_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {tcc!.surveillance_authority && (
                      <div>
                        <p className="font-semibold">
                          {t("surveillanceAuthority")}
                        </p>
                        <p>{tcc!.surveillance_authority}</p>
                      </div>
                    )}
                    {(tcc as any).financialInstitution && (
                      <div>
                        <p className="font-semibold">
                          {t("financialInstitution")}
                        </p>
                        <p>
                          {(tcc as any).financialInstitution.institutionName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t("taxId")}:{" "}
                          {
                            (tcc as any).financialInstitution
                              .taxIdentificationNumber
                          }
                        </p>
                      </div>
                    )}
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
              <Button
                onClick={() =>
                  router.push(`/${params.locale}/tcc/form/users/add`)
                }
                variant="default"
              >
                <User className="h-4 w-4 mr-2" />
                {t("addUser")}
              </Button>
            </CardHeader>
            <CardContent>
              {!tcc?.users || tcc.users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Users className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {t("noUsersFound")}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    {t("noUsersDescription")}
                  </p>
                  <Button
                    onClick={() =>
                      router.push(`/${params.locale}/tcc/form/users/add`)
                    }
                    variant="outline"
                  >
                    {t("addUser")}
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("name")}</TableHead>
                        <TableHead>{t("email")}</TableHead>
                        <TableHead>{t("phone")}</TableHead>
                        <TableHead>{t("position")}</TableHead>
                        <TableHead>{t("role")}</TableHead>
                        <TableHead>{t("createdAt")}</TableHead>
                        <TableHead className="text-right">
                          {t("actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tcc!.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstname} {user.lastname}
                          </TableCell>
                          <TableCell>{user.email || "N/A"}</TableCell>
                          <TableCell>{user.telephone || "N/A"}</TableCell>
                          <TableCell>{user.positionTcc || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.role?.map((roleId: string) => (
                                <Badge
                                  key={roleId}
                                  variant="outline"
                                  className="text-xs mr-1"
                                >
                                  {getRoleById(roleId)?.label || roleId}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">{t("viewUser")}</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/${params.locale}/tcc/form/users/${user.id}`
                                  )
                                }
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">{t("editUser")}</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View User Dialog */}
      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("userDetails")}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {t("name")}
                  </p>
                  <p className="text-lg">
                    {selectedUser.firstname} {selectedUser.lastname}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {t("email")}
                  </p>
                  <p className="text-lg">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {t("phone")}
                  </p>
                  <p className="text-lg">{selectedUser.telephone || "-"}</p>
                </div>
                {selectedUser.poste && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {t("position")}
                    </p>
                    <p className="text-lg">{selectedUser.poste}</p>
                  </div>
                )}
                {selectedUser.matricule && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {t("matricule")}
                    </p>
                    <p className="text-lg">{selectedUser.matricule}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-500">
                    {t("roles")}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedUser.role?.map((roleId: string) => (
                      <Badge key={roleId} variant="secondary">
                        {getRoleById(roleId)?.label || roleId}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Toggle Confirmation Dialog */}
      <AlertDialog
        open={statusConfirmDialog}
        onOpenChange={setStatusConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmStatusChange")}</AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggleStatus &&
              tcc?.users?.find((user) => user.id === userToToggleStatus)
                ?.status === "actif"
                ? t("deactivateUserConfirmation")
                : t("activateUserConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelToggleStatus}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
