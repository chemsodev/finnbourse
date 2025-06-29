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
import { TCCService } from "@/lib/services/tccService";
import { useTCC } from "@/hooks/useTCC";
import { TCC, TCCUser } from "@/lib/types/tcc";

export default function TCCUsersPage() {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();

  // State
  const [tccData, setTCCData] = useState<TCC | null>(null);
  const [users, setUsers] = useState<TCCUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // API hooks
  const { tcc, fetchTCC } = useTCC();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Fetch the single TCC
      const currentTCC = await fetchTCC();
      if (currentTCC) {
        setTCCData(currentTCC);

        // Users are already included in the TCC response
        const tccWithUsers = currentTCC as any;
        if (tccWithUsers.users && Array.isArray(tccWithUsers.users)) {
          setUsers(tccWithUsers.users);
          console.log("🔍 Loaded users from TCC:", tccWithUsers.users);
        } else {
          setUsers([]);
        }
      } else {
        console.error("No TCC found");
        toast({
          title: "Error",
          description: "No TCC configuration found",
          variant: "destructive",
        });
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
    if (tccData) {
      router.push(`/tcc/${tccData.id}/users/add`);
    }
  };

  const handleEditUser = (user: TCCUser) => {
    if (tccData) {
      router.push(`/tcc/${tccData.id}/users/edit/${user.id}`);
    }
  };

  if (isLoading) {
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
              No TCC configuration found. Please create a TCC first.
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
          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
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
        </CardHeader>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Users
              </h3>
              <p className="text-gray-500 mb-4">
                This TCC doesn't have any users yet.
              </p>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>{user.telephone || "N/A"}</TableCell>
                    <TableCell>{(user as any).positionTcc || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(user as any).roles &&
                        Array.isArray((user as any).roles) ? (
                          (user as any).roles.map(
                            (role: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {role}
                              </Badge>
                            )
                          )
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No roles
                          </span>
                        )}
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
                    <TableCell className="text-sm text-gray-500">
                      {(user as any).createdAt
                        ? new Date((user as any).createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
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
    </div>
  );
}
