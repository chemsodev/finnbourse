"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateClientSchema, CreateClientDtoType } from "./schema.zod";
import { useState } from "react";

// A custom hook for client validation
export function useClientValidation(clientType: "individual" | "company") {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Create a form with the appropriate schema based on client type
  const form = useForm<CreateClientDtoType>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: {
      type: clientType,
      client_code: "",
      email: "",
      phone_number: "",
      id_type: "passport",
      cash_account_bank_code: "",
      cash_account_agency_code: "",
      cash_account_number: "",
      cash_account_rip_key: "",
      cash_account_rip_full: "",
      securities_account_number: "",
      address: "",
      wilaya: "",
      // Individual fields
      ...(clientType === "individual" && {
        name: "",
        id_number: "",
        nin: "",
        nationalite: "",
        birth_date: new Date(),
        lieu_naissance: "",
        employe_a_la_institution_financiere: null,
      }),
      // Company fields
      ...(clientType === "company" && {
        raison_sociale: "",
        nif: "",
        reg_number: "",
        legal_form: "",
      }),
    },
  });

  // Function to validate a client object against our schema
  const validateClient = (client: any): boolean => {
    try {
      // First add the client type
      const clientWithType = { ...client, type: clientType };

      // Parse the object using the appropriate schema
      CreateClientSchema.parse(clientWithType);

      // If we get here, validation succeeded
      setValidationErrors([]);
      return true;
    } catch (error: any) {
      // Extract and set validation errors
      if (error.errors) {
        setValidationErrors(
          error.errors.map(
            (err: any) => `${err.path.join(".")}: ${err.message}`
          )
        );
      } else {
        setValidationErrors(["An unknown validation error occurred"]);
      }
      return false;
    }
  };

  return { form, validateClient, validationErrors };
}
