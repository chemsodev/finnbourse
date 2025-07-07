"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, RefreshCw, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TCCService } from "@/lib/services/tccService";
import { useTCC } from "@/hooks/useTCC";
import { TCC, TCCUser } from "@/lib/types/tcc";

interface TCCUsersPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function TCCUsersPage({ params }: TCCUsersPageProps) {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  // State
  const [tccData, setTCCData] = useState<TCC | null>(null);
  const [users, setUsers] = useState<TCCUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<TCCUser | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  // API hooks
  const { tcc, fetchTCC } = useTCC();

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Fetch the single TCC
      const currentTCC = await fetchTCC();

      // Verify the TCC ID matches the URL parameter or use the single TCC
      if (currentTCC && (currentTCC.id === params.id || !params.id)) {
        setTCCData(currentTCC);

        // Fetch users for TCC (using the standard endpoint)
        try {
          const tccUsers = await TCCService.getUsers();
          setUsers(tccUsers);
        } catch (userError) {
          console.error("Failed to load users:", userError);
          // Don't throw error, just show empty users list
          setUsers([]);
        }
      } else {
        console.error("TCC not found or ID mismatch");
      }
    } catch (error) {
      console.error("Failed to load TCC data:", error);
      toast({
        title: "Error",
        description: "Failed to load TCC data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    // Navigate to add user form with TCC ID
    router.push(`/${params.locale}/tcc/${params.id}/users/add`);
  };

  const handleEditUser = (user: TCCUser) => {
    router.push(`/${params.locale}/tcc/${params.id}/users/${user.id}/edit`);
  };

  const handleViewUser = (user: TCCUser) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Loading...</h1>
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }
  if (!tccData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/tcc")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">TCC Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              The requested TCC could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/tcc")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">
            {tccData.libelle} - Users
          </h1>
          <p className="text-gray-600">Manage users for TCC: {tccData.code}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddUser} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* TCC Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            TCC Information
          </CardTitle>
        </CardHeader>{" "}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Status</div>
              <Badge
                variant={tccData.status === "ACTIVE" ? "default" : "secondary"}
              >
                {tccData.status}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">
                Account Type
              </div>
              <div className="text-sm">
                {tccData.account_type === "DEPOSIT" && "Depot"}
                {tccData.account_type === "SECURITIES" && "Titres"}
                {tccData.account_type === "BOTH" && "Depot et Titres"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Contact</div>
              <div className="text-sm">{tccData.email}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users ({users.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No Users Yet
              </h3>
              <p className="text-gray-600 mb-4">
                This TCC doesn't have any users yet. Add the first user to get
                started.
              </p>
              <Button
                onClick={handleAddUser}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add First User
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.firstname} {user.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.telephone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.positionTcc}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.role.map((role, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {role.replace(/_/g, " ").toUpperCase()}
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
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewUser(user)}
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => handleEditUser(user)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    First Name
                  </div>
                  <div>{selectedUser.firstname}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Last Name
                  </div>
                  <div>{selectedUser.lastname}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Email</div>
                <div>{selectedUser.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Phone</div>
                <div>{selectedUser.telephone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">
                  Position
                </div>
                <div>{selectedUser.positionTcc}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Roles</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedUser.role.map((role, index) => (
                    <Badge key={index} variant="outline">
                      {role.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Status</div>
                <Badge
                  variant={
                    selectedUser.status === "actif" ? "default" : "secondary"
                  }
                >
                  {selectedUser.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
