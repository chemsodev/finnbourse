/**
 * TCC Form Integration Test
 * Test component to verify TCC forms work with backend
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustodianForm } from "../form/custodian-form";
import { RelatedUsersForm } from "../form/related-users-form";
import { CustodianFormValues, RelatedUserFormValues } from "../form/schema";
import { TCCService } from "@/lib/services/tccService";
import { useToast } from "@/hooks/use-toast";

export default function TCCFormTestPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [custodianData, setCustodianData] = useState<CustodianFormValues>({
    code: `TCC-TEST-${Date.now()}`,
    libelle: "Test TCC from Form",
    typeCompte: "BOTH",
    statut: "ACTIVE",
    adresse: "123 Test Street",
    codePostal: "12345",
    ville: "Test City",
    pays: "Algeria",
    telephone: "+213123456789",
    email: "test@tcc.com",
    financialInstitutionId: "",
    dateCreation: new Date().toISOString().split("T")[0],
    numeroAgrement: "TEST-2025-001",
    dateAgrement: "2025-06-17",
    autoriteSurveillance: "COSOB",
    codeCorrespondant: "TC001",
    nomCorrespondant: "Test Correspondent",
    swift: "",
    iban: "",
    numeroCompte: "",
    devise: "DZD",
    commissionFixe: "",
    commissionVariable: "",
    tauxTva: "",
    commentaire: "Test TCC created via form integration",
  });

  const [usersData, setUsersData] = useState<RelatedUserFormValues[]>([]);

  const handleCustodianChange = (values: CustodianFormValues) => {
    setCustodianData(values);
  };

  const handleUsersChange = (values: RelatedUserFormValues[]) => {
    setUsersData(values);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Form Data to Submit:", {
        custodian: custodianData,
        relatedUsers: usersData,
      });

      // Transform custodian data for API
      const tccData = TCCService.transformFormDataToAPI(custodianData);
      console.log("Transformed TCC Data:", tccData);

      // Transform user data for API
      const transformedUsers = usersData.map((user) =>
        TCCService.transformUserFormDataToAPI(user)
      );
      console.log("Transformed Users Data:", transformedUsers);

      toast({
        title: "Success",
        description:
          "Form data prepared successfully! Check console for details.",
      });
    } catch (error) {
      console.error("Form test error:", error);
      toast({
        title: "Error",
        description: "Form test failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">TCC Form Integration Test</h1>
        <p className="text-gray-600">
          Test the TCC forms and data transformation
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 0 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            1
          </div>
          <div
            className={`w-16 h-1 ${step >= 1 ? "bg-blue-500" : "bg-gray-300"}`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            2
          </div>
        </div>
      </div>

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: TCC Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CustodianForm
              defaultValues={custodianData}
              onFormChange={handleCustodianChange}
            />
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(1)}>Next: Add Users</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: TCC Users</CardTitle>
          </CardHeader>
          <CardContent>
            <RelatedUsersForm
              defaultValues={{ users: usersData }}
              onFormChange={handleUsersChange}
            />
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Testing..." : "Test Form Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Custodian Data:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
                {JSON.stringify(custodianData, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium">
                Users Data ({usersData.length} users):
              </h4>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
                {JSON.stringify(usersData, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
