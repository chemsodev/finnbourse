/**
 * TCC Auth Test Component
 * Tests REST token authentication for TCC endpoints
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRestToken } from "@/hooks/useRestToken";
import { useTCC } from "@/hooks/useTCC";
import { useFinancialInstitutions } from "@/hooks/useFinancialInstitutions";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function TCCAuthTestPage() {
  const { toast } = useToast();
  const {
    restToken,
    graphqlToken,
    loginSource,
    isAuthenticated,
    hasRestToken,
    user,
  } = useRestToken();

  const { tccs, isLoading: isLoadingTCC, fetchTCCs } = useTCC();
  const {
    institutions,
    isLoading: isLoadingInstitutions,
    fetchInstitutions,
  } = useFinancialInstitutions();

  const [testResults, setTestResults] = useState<any>({});

  const runAuthTest = async () => {
    console.log("🧪 Starting TCC Auth Test...");
    const results: any = {};

    // Test 1: Check if REST token exists
    results.hasRestToken = !!restToken;
    console.log(`✓ REST Token exists: ${results.hasRestToken}`);

    // Test 2: Test financial institutions endpoint
    try {
      console.log("🏦 Testing Financial Institutions endpoint...");
      const institutionsData = await fetchInstitutions();
      results.financialInstitutionsTest = {
        success: true,
        count: institutionsData.length,
        message: `Successfully fetched ${institutionsData.length} institutions`,
      };
      console.log(
        `✓ Financial Institutions: ${institutionsData.length} records`
      );
    } catch (error) {
      results.financialInstitutionsTest = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to fetch financial institutions",
      };
      console.error("✗ Financial Institutions test failed:", error);
    }

    // Test 3: Test TCC endpoint
    try {
      console.log("🏢 Testing TCC endpoint...");
      const tccData = await fetchTCCs();
      results.tccTest = {
        success: true,
        count: tccData.length,
        message: `Successfully fetched ${tccData.length} TCCs`,
      };
      console.log(`✓ TCC: ${tccData.length} records`);
    } catch (error) {
      results.tccTest = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to fetch TCCs",
      };
      console.error("✗ TCC test failed:", error);
    }

    setTestResults(results);

    toast({
      title: "Auth Test Complete",
      description: "Check console for detailed results",
    });
  };

  const getStatusIcon = (success?: boolean) => {
    if (success === true)
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (success === false) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">TCC REST Auth Test</h1>
        <Button onClick={runAuthTest} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Run Auth Test
        </Button>
      </div>

      {/* Token Information */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Login Source</div>
              <Badge variant={loginSource === "REST" ? "default" : "secondary"}>
                {loginSource || "Unknown"}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium">Authentication</div>
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(hasRestToken)}
              <span className="text-sm">
                REST Token: {hasRestToken ? "Available" : "Not Available"}
              </span>
            </div>
            {restToken && (
              <div className="text-xs text-gray-500 font-mono">
                Token: {restToken.substring(0, 20)}...
              </div>
            )}

            <div className="flex items-center gap-2">
              {getStatusIcon(!!graphqlToken)}
              <span className="text-sm">
                GraphQL Token: {graphqlToken ? "Available" : "Not Available"}
              </span>
            </div>
          </div>

          {user && (
            <div className="text-sm text-gray-600">
              <div>User: {user.email}</div>
              <div>Role ID: {user.roleid}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.hasRestToken)}
              <span>REST Token Check</span>
            </div>

            {testResults.financialInstitutionsTest && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.financialInstitutionsTest.success)}
                  <span>Financial Institutions API</span>
                </div>
                <div className="text-sm text-gray-600 ml-7">
                  {testResults.financialInstitutionsTest.message}
                </div>
                {!testResults.financialInstitutionsTest.success && (
                  <div className="text-sm text-red-600 ml-7">
                    Error: {testResults.financialInstitutionsTest.error}
                  </div>
                )}
              </div>
            )}

            {testResults.tccTest && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.tccTest.success)}
                  <span>TCC API</span>
                </div>
                <div className="text-sm text-gray-600 ml-7">
                  {testResults.tccTest.message}
                </div>
                {!testResults.tccTest.success && (
                  <div className="text-sm text-red-600 ml-7">
                    Error: {testResults.tccTest.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Data Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Data Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Financial Institutions</div>
              <div className="text-2xl font-bold">
                {isLoadingInstitutions ? "Loading..." : institutions.length}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">TCCs</div>
              <div className="text-2xl font-bold">
                {isLoadingTCC ? "Loading..." : tccs.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs font-mono bg-gray-100 p-4 rounded">
            <div>API Base URL: {process.env.NEXT_PUBLIC_REST_API_URL}</div>
            <div>Login Source: {loginSource}</div>
            <div>Has REST Token: {hasRestToken ? "Yes" : "No"}</div>
            <div>Has GraphQL Token: {!!graphqlToken ? "Yes" : "No"}</div>
            <div>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
