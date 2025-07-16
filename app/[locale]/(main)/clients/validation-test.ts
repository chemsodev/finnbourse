/**
 * Test file to validate the new client schema requirements
 * This file demonstrates the new validation structure for clients
 */

import {
  clientSchema,
  individualClientSchema,
  companyClientSchema,
  IndividualClientFormValues,
  CompanyClientFormValues,
} from "./schema";

// Example individual client data that should pass validation
const validIndividualClient: IndividualClientFormValues = {
  // Base client fields
  client_code: "CLI001",
  email: "john.doe@example.com",
  phone_number: "0123456789",
  id_type: "CN",
  cash_account_bank_code: "123",
  cash_account_agency_code: "45678",
  cash_account_number: "1234567890",
  cash_account_rip_key: "99",
  cash_account_rip_full: "12345678901234567890",
  securities_account_number: "SEC123456789",

  // Individual client specific fields
  wilaya: "Algiers",
  address: "123 Main Street, Algiers",
  name: "John Doe",
  id_number: "1234567890123",
  nin: "987654321098765",
  nationalite: "Algerian",
  birth_date: new Date("1990-01-01"),
  lieu_naissance: "Algiers",
  employe_a_la_institution_financiere: null, // Can be null or institution ID
};

// Example company client data that should pass validation
const validCompanyClient: CompanyClientFormValues = {
  // Base client fields
  client_code: "CLI002",
  email: "contact@company.com",
  phone_number: "0123456789",
  id_type: "RC",
  cash_account_bank_code: "123",
  cash_account_agency_code: "45678",
  cash_account_number: "1234567890",
  cash_account_rip_key: "99",
  cash_account_rip_full: "12345678901234567890",
  securities_account_number: "SEC123456789",

  // Company specific fields
  wilaya: "Oran",
  address: "456 Business Avenue, Oran",
  raison_sociale: "Example Corp Ltd",
  nif: "123456789012345",
  reg_number: "RC123456",
  legal_form: "SARL",
};

// Function to test validation
export function testClientValidation() {
  console.log("🧪 Testing new client validation schemas...");

  try {
    // Test individual client validation
    const individualResult = individualClientSchema.safeParse(
      validIndividualClient
    );
    if (individualResult.success) {
      console.log("✅ Individual client validation passed");
    } else {
      console.error(
        "❌ Individual client validation failed:",
        individualResult.error.errors
      );
    }

    // Test company client validation
    const companyResult = companyClientSchema.safeParse(validCompanyClient);
    if (companyResult.success) {
      console.log("✅ Company client validation passed");
    } else {
      console.error(
        "❌ Company client validation failed:",
        companyResult.error.errors
      );
    }

    // Test union schema (should accept both types)
    const unionResult1 = clientSchema.safeParse(validIndividualClient);
    const unionResult2 = clientSchema.safeParse(validCompanyClient);

    if (unionResult1.success && unionResult2.success) {
      console.log("✅ Union client schema validation passed for both types");
    } else {
      console.error("❌ Union client schema validation failed");
    }

    console.log("🎉 Client validation tests completed!");
  } catch (error) {
    console.error("💥 Error during validation testing:", error);
  }
}

// Test validation with invalid data
export function testClientValidationErrors() {
  console.log("🧪 Testing validation error handling...");

  // Invalid individual client (missing required fields)
  const invalidIndividual = {
    client_code: "", // Required but empty
    email: "invalid-email", // Invalid email format
    phone_number: "123", // Too short
    // Missing many required fields
  };

  const result = individualClientSchema.safeParse(invalidIndividual);
  if (!result.success) {
    console.log("✅ Validation correctly caught errors:");
    result.error.errors.forEach((error) => {
      console.log(`  - ${error.path.join(".")}: ${error.message}`);
    });
  } else {
    console.error("❌ Validation should have failed but didn't");
  }
}

// Export test functions for use in components
export { validIndividualClient, validCompanyClient };
