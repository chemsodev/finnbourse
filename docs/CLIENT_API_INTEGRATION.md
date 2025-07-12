# Client API Integration Guide

This guide explains how to use the new Client API service that properly connects your frontend client forms with the backend client DTOs.

## Overview

The Client API service provides:

- **Proper DTO transformation** between frontend and backend formats
- **Type-safe API calls** with proper error handling
- **React hook integration** for easy use in components
- **Support for both individual and company clients**
- **Client user management** functionality

## Key Files

- `lib/services/client-api.ts` - Main API service and transformation logic
- `hooks/useClientApi.ts` - React hook for client operations
- `components/create-user-forms/EnhancedClientForm.tsx` - Example form implementation

## Backend DTO Structure

The backend expects a discriminated union structure:

```typescript
interface CreateClientDto {
  type: "individual" | "company" | "financial_institution";
  client_code: string;
  email: string;
  phone_number: string;
  id_type: "passport" | "driving_license" | "CN" | "RC";
  // ... other common fields
  client_details?: IndividualClientDetails | CompanyClientDetails;
}

interface IndividualClientDetails {
  type: "individual";
  name: string;
  id_number: string;
  nin: string;
  nationalite: string;
  wilaya: string;
  address: string;
  birth_date: Date;
  lieu_naissance: string;
  employe_a_la_institution_financiere: string | null;
}

interface CompanyClientDetails {
  type: "company";
  raison_sociale: string;
  nif: string;
  reg_number: string;
  legal_form: string;
  lieu_naissance: string;
}
```

## Frontend Form Structure

The frontend uses French terminology and different field names:

```typescript
interface ClientFormValues {
  clientType:
    | "personne_physique"
    | "personne_morale"
    | "institution_financiere";
  clientCode: string;
  email: string;
  phoneNumber: string;
  // ... other fields with French names
}
```

## Transformation Service

The `ClientTransformationService` handles the mapping between frontend and backend formats:

```typescript
// Frontend to Backend
const backendData =
  ClientTransformationService.transformFormToBackend(formData);

// Backend to Frontend
const formData =
  ClientTransformationService.transformBackendToForm(backendData);
```

### Field Mappings

| Frontend Field                    | Backend Field                | Notes                 |
| --------------------------------- | ---------------------------- | --------------------- |
| `clientType: "personne_physique"` | `type: "individual"`         | Type mapping          |
| `clientType: "personne_morale"`   | `type: "company"`            | Type mapping          |
| `clientCode`                      | `client_code`                | Snake case conversion |
| `phoneNumber`                     | `phone_number`               | Snake case conversion |
| `idType: "nin"`                   | `id_type: "CN"`              | ID type mapping       |
| `idType: "permit_conduite"`       | `id_type: "driving_license"` | ID type mapping       |
| `dateNaissance`                   | `birth_date`                 | Date field mapping    |
| `lieuNaissance`                   | `lieu_naissance`             | Place of birth        |
| `raisonSociale`                   | `raison_sociale`             | Company name          |
| `regNumber`                       | `reg_number`                 | Registration number   |

## Using the React Hook

### Basic Usage

```typescript
import { useClientApi } from "@/hooks/useClientApi";

function MyClientForm() {
  const {
    createClient,
    updateClient,
    getClient,
    isCreating,
    isUpdating,
    error,
    clearError,
  } = useClientApi();

  const handleSubmit = async (formData: ClientFormValues) => {
    try {
      if (isEditMode) {
        await updateClient(clientId, formData);
      } else {
        await createClient(formData);
      }
      // Success toast is automatically shown
    } catch (error) {
      // Error toast is automatically shown
      console.error("Form submission failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={isCreating || isUpdating}>
        {isCreating || isUpdating ? "Saving..." : "Save"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Loading Existing Client Data

```typescript
const { getClient, transformBackendToForm } = useClientApi();

useEffect(() => {
  if (clientId) {
    const loadClient = async () => {
      try {
        const clientData = await getClient(clientId);
        const formData = transformBackendToForm(clientData);
        form.reset(formData);
      } catch (error) {
        console.error("Failed to load client:", error);
      }
    };
    loadClient();
  }
}, [clientId]);
```

## Form Validation

Use Zod schema that matches the backend requirements:

```typescript
const clientSchema = z
  .object({
    clientType: z.enum([
      "personne_physique",
      "personne_morale",
      "institution_financiere",
    ]),
    clientCode: z.string().min(1, "Le code client est requis"),
    email: z.string().email("Email invalide"),
    phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
    // ... other fields
  })
  .refine(
    (data) => {
      // Validate individual client required fields
      if (data.clientType === "personne_physique") {
        return !!(data.name && data.idNumber && data.nin);
      }
      return true;
    },
    {
      message: "Tous les champs requis doivent être remplis",
      path: ["name"],
    }
  );
```

## Client User Management

### Creating Client Users

```typescript
const { createClientUser } = useClientApi();

const handleCreateUser = async (
  clientId: string,
  userData: ClientUserFormValues
) => {
  try {
    await createClientUser(clientId, userData);
    // Success toast shown automatically
  } catch (error) {
    // Error toast shown automatically
    console.error("Failed to create user:", error);
  }
};
```

### Client User DTO Structure

```typescript
interface CreateClientUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  status: "actif" | "inactif";
  clientUserType: "proprietaire" | "mandataire" | "tuteur_legal";
  nationalite: string;
  dateNaissance: Date;
  adresse: string;
  wilaya: string;
  typePieceIdentite: "cn" | "passport" | "pc";
  numeroPieceIdentite: string;
  role: string[];
}
```

## Error Handling

The service provides comprehensive error handling:

```typescript
const { error, clearError } = useClientApi();

// Clear errors when form changes
useEffect(() => {
  if (error) {
    clearError();
  }
}, [formData, error, clearError]);

// Display errors in your UI
{
  error && <div className="error-message">{error}</div>;
}
```

## API Endpoints

The service uses the following endpoints:

- `POST /client` - Create client
- `PUT /client/:id` - Update client
- `GET /client/:id` - Get client by ID
- `GET /client` - Get all clients
- `POST /client/:id/users` - Create client user
- `PUT /client/:id/users/:userId` - Update client user
- `GET /client/:id/users` - Get client users

## Example Implementation

Here's how to update your existing form:

```typescript
// Before (old approach)
const handleSubmit = async (data) => {
  const response = await fetch("/api/client", {
    method: "POST",
    body: JSON.stringify(data),
  });
  // Manual error handling, no transformation
};

// After (new approach)
const { createClient } = useClientApi();

const handleSubmit = async (formData: ClientFormValues) => {
  try {
    await createClient(formData);
    // Automatic transformation, error handling, and success toast
  } catch (error) {
    // Error is automatically handled and displayed
  }
};
```

## Migration Steps

1. **Replace direct API calls** with the `useClientApi` hook
2. **Update form schemas** to match the ClientFormValues interface
3. **Use the transformation service** for any manual data manipulation
4. **Update field names** to match the frontend conventions
5. **Add proper validation** for client type-specific fields

## Benefits

- **Type Safety**: Full TypeScript support with proper type checking
- **Automatic Transformation**: No manual field mapping required
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Built-in loading states for better UX
- **Consistent API**: Unified approach across all client operations
- **Backend Compatibility**: Perfect alignment with backend DTO structure

## Testing

Test your integration by:

1. Creating individual clients with all required fields
2. Creating company clients with company-specific fields
3. Testing field validation and error messages
4. Verifying data transformation in network requests
5. Testing edit mode with existing client data

This integration ensures your frontend forms work seamlessly with the backend client DTOs while maintaining a clean, type-safe architecture.
