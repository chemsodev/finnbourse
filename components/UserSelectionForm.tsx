"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  fullname: string;
  email: string;
  phonenumber: string;
  roleid: number;
  status: number | string;
  position?: string;
  organisation?: string;
  matricule?: string;
  positionTcc?: string;
}

interface UserSelectionFormProps {
  selectedUsers: User[];
  onUsersChange: (users: User[]) => void;
  entityType: "IOB" | "TCC" | "AGENCE";
  entityName?: string;
}

// Mock data for available users (this would come from your API)
const mockAvailableUsers: User[] = [
  {
    id: "iob1",
    fullname: "Ahmed Hassan",
    email: "ahmed.hassan@iob.dz",
    phonenumber: "+213 555-123-456",
    roleid: 2,
    status: 1,
    position: "Senior Trader",
    organisation: "IOB Trading",
    matricule: "IOB001",
  },
  {
    id: "iob2",
    fullname: "Fatima Benali",
    email: "fatima.benali@iob.dz",
    phonenumber: "+213 555-234-567",
    roleid: 2,
    status: 1,
    position: "Risk Manager",
    organisation: "IOB Risk",
    matricule: "IOB002",
  },
  {
    id: "tcc1",
    fullname: "Karim Ouali",
    email: "karim.ouali@tcc.dz",
    phonenumber: "+213 555-345-678",
    roleid: 3,
    status: 1,
    positionTcc: "Custodian Manager",
    matricule: "TCC001",
  },
  {
    id: "tcc2",
    fullname: "Amina Cherif",
    email: "amina.cherif@tcc.dz",
    phonenumber: "+213 555-456-789",
    roleid: 3,
    status: 1,
    positionTcc: "Operations Officer",
    matricule: "TCC002",
  },
  {
    id: "agency1",
    fullname: "Omar Djelloul",
    email: "omar.djelloul@agence.dz",
    phonenumber: "+213 555-567-890",
    roleid: 4,
    status: 1,
    position: "Branch Manager",
    organisation: "Agence Central",
  },
  {
    id: "agency2",
    fullname: "Nadia Kaci",
    email: "nadia.kaci@agence.dz",
    phonenumber: "+213 555-678-901",
    roleid: 4,
    status: 1,
    position: "Customer Relations",
    organisation: "Agence Sud",
  },
];

export function UserSelectionForm({
  selectedUsers,
  onUsersChange,
  entityType,
  entityName = "",
}: UserSelectionFormProps) {
  const t = useTranslations("IOBPage");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  // Filter available users based on entity type
  useEffect(() => {
    const roleMap = {
      IOB: 2,
      TCC: 3,
      AGENCE: 4,
    };

    const filteredUsers = mockAvailableUsers.filter(
      (user) => user.roleid === roleMap[entityType]
    );
    setAvailableUsers(filteredUsers);
  }, [entityType]);

  // Filter users based on search and role filter
  const filteredUsers = availableUsers.filter((user) => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phonenumber.includes(searchQuery);

    const matchesRole =
      roleFilter === "all" || user.roleid.toString() === roleFilter;

    // Don't show already selected users
    const notSelected = !selectedUsers.some(
      (selected) => selected.id === user.id
    );

    return matchesSearch && matchesRole && notSelected;
  });

  const handleSelectUser = (user: User) => {
    // Add organisation information when selecting
    const userWithOrg = {
      ...user,
      organisation: entityName || user.organisation,
    };
    onUsersChange([...selectedUsers, userWithOrg]);
  };

  const handleRemoveUser = (userId: string) => {
    onUsersChange(selectedUsers.filter((user) => user.id !== userId));
  };

  const getRoleDisplayName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return "Investisseur";
      case 2:
        return "IOB";
      case 3:
        return "TCC";
      case 4:
        return "Agence";
      default:
        return "Unknown";
    }
  };

  const getStatusText = (status: number | string) => {
    if (typeof status === "number") {
      return status === 1 ? "Actif" : "Inactif";
    }
    return status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {t("relatedUsers")} ({entityType})
        </h3>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Sélectionner des utilisateurs
        </Button>
      </div>

      {/* Selected Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom Complet</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Matricule</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-muted-foreground"
                >
                  Aucun utilisateur sélectionné
                </TableCell>
              </TableRow>
            ) : (
              selectedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phonenumber}</TableCell>
                  <TableCell>
                    {entityType === "TCC"
                      ? user.positionTcc
                      : user.position || "-"}
                  </TableCell>
                  <TableCell>{user.matricule || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (
                          typeof user.status === "number"
                            ? user.status === 1
                            : user.status === "actif"
                        )
                          ? "default"
                          : "secondary"
                      }
                    >
                      {getStatusText(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Sélectionner des utilisateurs {entityType}
            </DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher des utilisateurs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="1">Investisseur</SelectItem>
                <SelectItem value="2">IOB</SelectItem>
                <SelectItem value="3">TCC</SelectItem>
                <SelectItem value="4">Agence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Available Users Table */}
          <div className="border rounded-md max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-4 text-muted-foreground"
                    >
                      {searchQuery
                        ? "Aucun utilisateur trouvé avec ces critères"
                        : "Aucun utilisateur disponible"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phonenumber}</TableCell>
                      <TableCell>
                        {entityType === "TCC"
                          ? user.positionTcc
                          : user.position || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getRoleDisplayName(user.roleid)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            (
                              typeof user.status === "number"
                                ? user.status === 1
                                : user.status === "actif"
                            )
                              ? "default"
                              : "secondary"
                          }
                        >
                          {getStatusText(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleSelectUser(user);
                            // Keep dialog open for multiple selections
                          }}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Sélectionner
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
