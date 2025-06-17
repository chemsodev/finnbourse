/**
 * TCC API Test Component
 * Simple component to test TCC backend integration
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTCC } from "@/hooks/useTCC";
import { useFinancialInstitutions } from "@/hooks/useFinancialInstitutions";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus } from "lucide-react";

export default function TCCTestPage() {
  const { toast } = useToast();
  const {
    tccs,
    isLoading: isLoadingTCC,
    fetchTCCs,
    createOrUpdateTCC,
  } = useTCC();
  const {
    institutions,
    isLoading: isLoadingInstitutions,
    fetchInstitutions,
  } = useFinancialInstitutions();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTestTCC = async () => {
    if (institutions.length === 0) {
      toast({
        title: "Error",
        description:
          "No financial institutions available. Please create one first.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await createOrUpdateTCC({
        code: `TCC${Date.now()}`,
        libelle: "Test TCC Created via API",
        account_type: "BOTH",
        status: "ACTIVE",
        address: "123 Test Street",
        postal_code: "12345",
        city: "Test City",
        country: "Algeria",
        phone: "+213123456789",
        email: "test@tcc.com",
        agreement_number: "TEST-2025-001",
        agreement_date: "2025-06-17",
        surveillance_authority: "COSOB",
        name_correspondent: "Test Correspondent",
        code_correspondent: "TC001",
        financialInstitutionId: institutions[0].id,
      });

      toast({
        title: "Success",
        description: "Test TCC created successfully!",
      });
    } catch (error) {
      console.error("Test TCC creation failed:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">TCC API Test</h1>
        <div className="flex gap-2">
          <Button onClick={fetchInstitutions} disabled={isLoadingInstitutions}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                isLoadingInstitutions ? "animate-spin" : ""
              }`}
            />
            Refresh Institutions
          </Button>
          <Button onClick={fetchTCCs} disabled={isLoadingTCC}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoadingTCC ? "animate-spin" : ""}`}
            />
            Refresh TCCs
          </Button>
        </div>
      </div>

      {/* Financial Institutions */}
      <Card>
        <CardHeader>
          <CardTitle>
            Financial Institutions ({institutions.length})
            {isLoadingInstitutions && (
              <Badge variant="secondary" className="ml-2">
                Loading...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {institutions.length === 0 ? (
            <p className="text-gray-500">No financial institutions found.</p>
          ) : (
            <div className="space-y-2">
              {institutions.map((institution) => (
                <div key={institution.id} className="p-3 border rounded-lg">
                  <div className="font-medium">
                    {institution.institutionName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Agreement: {institution.agreementNumber} | Form:{" "}
                    {institution.legalForm}
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {institution.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* TCCs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              TCCs ({tccs.length})
              {isLoadingTCC && (
                <Badge variant="secondary" className="ml-2">
                  Loading...
                </Badge>
              )}
            </CardTitle>
            <Button
              onClick={handleCreateTestTCC}
              disabled={isCreating || institutions.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Test TCC
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tccs.length === 0 ? (
            <p className="text-gray-500">No TCCs found.</p>
          ) : (
            <div className="space-y-2">
              {tccs.map((tcc) => (
                <div key={tcc.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{tcc.libelle}</div>
                    <Badge
                      variant={
                        tcc.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {tcc.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Code: {tcc.code} | Type: {tcc.account_type}
                  </div>
                  <div className="text-sm text-gray-500">
                    Contact: {tcc.email} | Phone: {tcc.phone}
                  </div>
                  <div className="text-xs text-gray-400">ID: {tcc.id}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">
                Financial Institutions API
              </div>
              <Badge variant={isLoadingInstitutions ? "secondary" : "default"}>
                {isLoadingInstitutions ? "Loading..." : "Connected"}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium">TCC API</div>
              <Badge variant={isLoadingTCC ? "secondary" : "default"}>
                {isLoadingTCC ? "Loading..." : "Connected"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
