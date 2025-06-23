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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useTCC } from "@/hooks/useTCC";
import { useRestToken } from "@/hooks/useRestToken";
import { Badge } from "@/components/ui/badge";

export default function TCCPage() {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  // API hooks - now expecting single TCC
  const { tcc, isLoading, fetchTCC, hasTCC } = useTCC();
  const { hasRestToken, isLoading: tokenLoading } = useRestToken();

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
    router.push("/tcc/form");
  };
  const handleEditTCC = () => {
    if (tcc) {
      router.push(`/tcc/form/${tcc.id}`);
    }
  };
  const handleManageUsers = () => {
    if (tcc) {
      // Since we only have one TCC, we can navigate to users without specific ID
      router.push(`/tcc/users`);
    }
  };

  // Show loading state
  if (isLoading || tokenLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">TCC Management</h1>
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
  } // Show empty state if no TCC exists and token is ready
  const shouldShowEmpty =
    !isLoading && !tokenLoading && hasRestToken && !hasTCC();
  console.log("🔍 Empty state check:", {
    isLoading,
    tokenLoading,
    hasRestToken,
    hasTCC: hasTCC(),
    tcc,
    shouldShowEmpty,
  });

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
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">TCC Management</h1>
        <div className="flex gap-2">
          <Button onClick={loadTCCData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Single TCC Card */}
      <div className="max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{tcc!.libelle}</CardTitle>
                <Badge
                  variant={tcc!.status === "ACTIVE" ? "default" : "secondary"}
                  className="mb-2"
                >
                  {tcc!.status}
                </Badge>
              </div>
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>
          </CardHeader>{" "}
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-sm font-medium text-gray-600">Code</div>
                <div className="text-lg font-semibold">{tcc!.code}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">
                  Account Type
                </div>
                <div className="text-sm">
                  {tcc!.account_type === "DEPOSIT" && "Depot"}
                  {tcc!.account_type === "SECURITIES" && "Titres"}
                  {tcc!.account_type === "BOTH" && "Depot et Titres"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Email</div>
                <div className="text-sm">{tcc!.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Phone</div>
                <div className="text-sm">{tcc!.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Address</div>
                <div className="text-sm text-gray-500">
                  {tcc!.address}
                  <br />
                  {tcc!.postal_code} {tcc!.city}
                  <br />
                  {tcc!.country}
                </div>
              </div>
              {tcc!.agreement_number && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Agreement Number
                  </div>
                  <div className="text-sm">{tcc!.agreement_number}</div>
                </div>
              )}
              {tcc!.agreement_date && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Agreement Date
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(tcc!.agreement_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              {tcc!.surveillance_authority && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Surveillance Authority
                  </div>
                  <div className="text-sm">{tcc!.surveillance_authority}</div>
                </div>
              )}
              {tcc!.name_correspondent && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Correspondent Name
                  </div>
                  <div className="text-sm">{tcc!.name_correspondent}</div>
                </div>
              )}
              {tcc!.code_correspondent && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Correspondent Code
                  </div>
                  <div className="text-sm">{tcc!.code_correspondent}</div>
                </div>
              )}{" "}
              {(tcc as any).financialInstitution && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Financial Institution
                  </div>
                  <div className="text-sm">
                    {(tcc as any).financialInstitution.institutionName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Tax ID:{" "}
                    {(tcc as any).financialInstitution.taxIdentificationNumber}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t">
              <Button
                onClick={handleEditTCC}
                variant="default"
                className="flex-1 min-w-[200px]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit TCC Configuration
              </Button>
              <Button
                onClick={handleManageUsers}
                variant="outline"
                className="flex-1 min-w-[200px]"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </CardContent>
        </Card>{" "}
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Users</p>
                  <p className="text-2xl font-bold">{tcc!.users?.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-2xl font-bold">{tcc!.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
