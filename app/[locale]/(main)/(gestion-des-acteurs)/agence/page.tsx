"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgence } from "@/hooks/useAgence";
import { Agence } from "@/lib/types/actors";
import { useTranslations } from "next-intl";

export default function AgencePage() {
  const router = useRouter();
  const t = useTranslations("AgencyPage");
  const { toast } = useToast();

  // API hooks
  const { agences, isLoading, fetchAgences } = useAgence();

  // State
  const [searchQuery, setSearchQuery] = useState("");

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
    router.push(`/agence/${agence.id}/view`);
  };

  // Show loading state
  if (isLoading && agences.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
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
        <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
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
            {t("add")}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("search") + "..."}
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
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t("openMenu")}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(agence)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {t("viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(agence)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t("edit")}
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
    </div>
  );
}
