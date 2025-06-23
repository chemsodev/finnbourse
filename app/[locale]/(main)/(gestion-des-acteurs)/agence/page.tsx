"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Building,
  Eye,
  Search,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgence } from "@/hooks/useAgence";
import { Agence } from "@/lib/types/actors";

export default function AgencePage() {
  const router = useRouter();
  const { toast } = useToast();

  // API hooks
  const { agences, isLoading, fetchAgences, deleteAgence } = useAgence();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgence, setSelectedAgence] = useState<Agence | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [agenceToDelete, setAgenceToDelete] = useState<Agence | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await fetchAgences();
    } catch (error) {
      console.error("Failed to load Agence data:", error);
    }
  };
  // Filter Agences based on search query
  const filteredAgences = agences.filter(
    (agence) =>
      agence.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agence.director_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agence.director_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agence.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Navigates to the Agence creation form page.
   */

  /*******  aa34944a-024b-4d97-917e-97f54f7c7c51  *******/
  const handleCreate = () => {
    router.push("/agence/form");
  };

  const handleEdit = (agence: Agence) => {
    router.push(`/agence/form/${agence.id}`);
  };

  const handleView = (agence: Agence) => {
    setSelectedAgence(agence);
    setShowViewDialog(true);
  };

  const handleDeleteClick = (agence: Agence) => {
    setAgenceToDelete(agence);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!agenceToDelete) return;

    try {
      await deleteAgence(agenceToDelete.id!);
      setShowDeleteDialog(false);
      setAgenceToDelete(null);
    } catch (error) {
      console.error("Failed to delete Agence:", error);
    }
  };

  // Show loading state
  if (isLoading && agences.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Agence Management
          </h1>
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">Loading Agence data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Agence Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={loadData}
            variant="outline"
            size="icon"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Agence
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search Agences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Agence Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Agences ({filteredAgences.length})</span>
            <Building className="h-5 w-5 text-gray-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAgences.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchQuery ? "No Agences found" : "No Agences yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Create your first Agence to get started"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleCreate}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add First Agence
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                {" "}
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Director</TableHead>
                    <TableHead>Director Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {" "}
                  {filteredAgences.map((agence) => (
                    <TableRow key={agence.id}>
                      <TableCell className="font-medium">
                        {agence.code}
                      </TableCell>
                      <TableCell>{agence.director_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {agence.director_name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{agence.director_email}</div>
                          <div className="text-sm text-gray-500">
                            {agence.director_phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{agence.address}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">ACTIVE</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(agence)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(agence)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(agence)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Agence Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agence Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected Agence.
            </DialogDescription>
          </DialogHeader>
          {selectedAgence && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Code</div>
                  <div>{selectedAgence.code}</div>
                </div>{" "}
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Director
                  </div>
                  <div>{selectedAgence.director_name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Director Name
                  </div>
                  <div>{selectedAgence.director_name || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Currency
                  </div>
                  <div>{selectedAgence.currency || "N/A"}</div>
                </div>
              </div>{" "}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Email</div>
                  <div>{selectedAgence.director_email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Phone</div>
                  <div>{selectedAgence.director_phone}</div>
                </div>
              </div>{" "}
              <div>
                <div className="text-sm font-medium text-gray-600">Address</div>
                <div>{selectedAgence.address}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">
                  SWIFT Code
                </div>
                <div>{selectedAgence.code_swift || "N/A"}</div>
              </div>
              {selectedAgence.financialInstitution && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Financial Institution
                  </div>
                  <div>
                    <div className="font-medium">
                      {selectedAgence.financialInstitution.institutionName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Tax ID:{" "}
                      {
                        selectedAgence.financialInstitution
                          .taxIdentificationNumber
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedAgence.financialInstitution.fullAddress}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agence</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Agence? This action cannot be
              undone.
              {agenceToDelete && (
                <div className="mt-2 font-medium">
                  {agenceToDelete.director_name} ({agenceToDelete.code})
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Agence
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
