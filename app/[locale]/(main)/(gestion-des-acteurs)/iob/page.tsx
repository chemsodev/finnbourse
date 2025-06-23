"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Building2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import { useIOB } from "@/hooks/useIOB";
import { IOB } from "@/lib/types/actors";
import { Badge } from "@/components/ui/badge";

export default function IOBPage() {
  const router = useRouter();
  const t = useTranslations("IOBPage");
  const { toast } = useToast();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [iobToDelete, setIOBToDelete] = useState<IOB | null>(null);

  // API hooks
  const { iobs, isLoading, fetchIOBs, deleteIOB } = useIOB();

  // Load IOB data on mount
  useEffect(() => {
    loadIOBData();
  }, []);

  const loadIOBData = async () => {
    try {
      await fetchIOBs();
    } catch (error) {
      console.error("Failed to load IOB data:", error);
      toast({
        title: "Error",
        description: "Failed to load IOB data",
        variant: "destructive",
      });
    }
  };
  // Filter IOBs based on search term
  const filteredIOBs = iobs.filter(
    (iob) =>
      iob.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iob.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iob.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateIOB = () => {
    router.push("/iob/form");
  };

  const handleEditIOB = (iob: IOB) => {
    router.push(`/iob/form/${iob.id}`);
  };

  const handleViewIOB = (iob: IOB) => {
    router.push(`/iob/${iob.id}`);
  };

  const handleDeleteClick = (iob: IOB) => {
    setIOBToDelete(iob);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!iobToDelete) return;

    try {
      await deleteIOB(iobToDelete.id!);
      toast({
        title: "Success",
        description: "IOB deleted successfully",
      });
      setShowDeleteDialog(false);
      setIOBToDelete(null);
      loadIOBData(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete IOB",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IOB Management</h1>
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no IOBs exist
  if (!isLoading && iobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IOB Management</h1>
          <Button onClick={loadIOBData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-gray-100 rounded-full p-6 mb-6">
            <Building2 className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No IOBs Found
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            You haven't created any IOB (Intermediaire en Operations de Bourse)
            yet. Create your first IOB to get started with broker management.
          </p>
          <Button
            onClick={handleCreateIOB}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add First IOB
          </Button>
        </div>
      </div>
    );
  }

  // Show IOBs table
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">IOB Management</h1>
        <div className="flex gap-2">
          <Button onClick={loadIOBData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleCreateIOB} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add IOB
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search IOBs by name, code, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total IOBs</p>
                <p className="text-2xl font-bold">{iobs.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {iobs.filter((iob) => iob.status === "ACTIVE").length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IOBs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>IOBs ({filteredIOBs.length})</span>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredIOBs.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No IOBs Found" : "No IOBs"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Create your first IOB to get started"}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateIOB}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First IOB
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIOBs.map((iob) => (
                  <TableRow key={iob.id}>
                    <TableCell className="font-medium">{iob.code}</TableCell>
                    <TableCell>{iob.name}</TableCell>
                    <TableCell>{iob.email}</TableCell>
                    <TableCell>{iob.phone}</TableCell>
                    <TableCell>{iob.city}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          iob.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {iob.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewIOB(iob)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditIOB(iob)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(iob)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete IOB</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{iobToDelete?.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
