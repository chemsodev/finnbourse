"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  Edit,
  Eye,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useTCC, useTCCUsers } from "@/hooks/useTCC";
import { useRestToken } from "@/hooks/useRestToken";
import { Badge } from "@/components/ui/badge";
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

interface TCCUsersPageProps {
  params: {
    locale: string;
  };
}

export default function TCCUsersPage({ params }: TCCUsersPageProps) {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();

  // API hooks
  const { tcc, isLoading, fetchTCC } = useTCC();
  const { updateUser } = useTCCUsers();
  const { hasRestToken, isLoading: tokenLoading } = useRestToken();

  // State for dialogs and actions
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Load TCC data on mount and when token becomes available
  useEffect(() => {
    if (hasRestToken && !tokenLoading) {
      loadTCCData();
    }
  }, [hasRestToken, tokenLoading]);

  const loadTCCData = async () => {
    try {
      await fetchTCC();
    } catch (error) {
      console.error("Failed to load TCC data:", error);
      toast({
        title: "Error",
        description: "Failed to load TCC data",
        variant: "destructive",
      });
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  const handleToggleStatus = (userId: string) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggleStatus) return;

    try {
      const user = tcc?.users?.find((u) => u.id === userToToggleStatus);
      if (!user) return;

      const newStatus = user.status === "actif" ? "inactif" : "actif";
      await updateUser(userToToggleStatus, { status: newStatus });

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
      });

      // Refresh TCC data
      await fetchTCC();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setUserToToggleStatus(null);
      setStatusConfirmDialog(false);
    }
  };

  // Loading state
  if (isLoading || tokenLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => router.push(`/${params.locale}/tcc`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t("tccUsers")}</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("associatedUsers")}</CardTitle>
          <Button
            onClick={() => router.push(`/${params.locale}/tcc/form/users/add`)}
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addUser")}
          </Button>
        </CardHeader>
        <CardContent>
          {!tcc?.users || tcc.users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("noUsersFound")}</h3>
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
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("createdAt")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
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
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "actif" ? "default" : "secondary"
                          }
                        >
                          {user.status === "actif"
                            ? t("active")
                            : t("inactive")}
                        </Badge>
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
                          <Button
                            variant={
                              user.status === "actif"
                                ? "destructive"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              user.id ? handleToggleStatus(user.id) : null
                            }
                          >
                            {user.status === "actif" ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {user.status === "actif"
                                ? t("deactivateUser")
                                : t("activateUser")}
                            </span>
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
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {t("status")}
                  </p>
                  <Badge
                    variant={
                      selectedUser.status === "actif" ? "secondary" : "outline"
                    }
                    className={
                      selectedUser.status === "actif"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }
                  >
                    {selectedUser.status === "actif"
                      ? t("active")
                      : t("inactive")}
                  </Badge>
                </div>
                {selectedUser.positionTcc && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {t("position")}
                    </p>
                    <p className="text-lg">{selectedUser.positionTcc}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-500">
                    {t("roles")}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.role?.map((roleId: string) => (
                      <Badge key={roleId} variant="outline">
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

      {/* Status Confirmation Dialog */}
      <AlertDialog
        open={statusConfirmDialog}
        onOpenChange={setStatusConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmStatusChange")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmStatusChangeDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
