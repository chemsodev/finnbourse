# Actor Creation Validation Summary

## Overview

This document outlines the enhanced actor creation workflow with proper step-by-step validation and creation process.

## Implementation Details

### 1. IOB (Intermediaire d'Opérations de Bourse) Creation

**File**: `app/[locale]/(main)/(gestion-des-acteurs)/iob/form/page.tsx`

**Step 1 - IOB Creation**:

- Form validation using `iobFormSchema.safeParse()`
- Creates IOB via `actorAPI.iob.create(formValues.iob)`
- Stores created IOB ID in `createdIobId` state
- Shows success toast and moves to step 2

**Step 2 - User Creation**:

- Uses stored `createdIobId` or existing `params.id` for edit mode
- Creates users via `actorAPI.iob.createUser(iobId, userData)` for each user
- Shows success toast and redirects to IOB list

**API Endpoints**:

- `POST /iob` - Create IOB
- `POST /iob/{iobId}/users` - Create users for IOB

### 2. Agence (Agency) Creation

**File**: `app/[locale]/(main)/(gestion-des-acteurs)/agence/_components/AgenceFormSteps.tsx`

**Step 1 - Agency Creation**:

- Form validation using `agenceFormSchema.safeParse()`
- Creates Agency via `actorAPI.agence.create(values)`
- Stores created Agency ID in `createdAgenceId` state
- Shows success toast and moves to step 2

**Step 2 - User Creation**:

- Uses stored `createdAgenceId` for user creation
- Creates users via `actorAPI.agence.createUser(createdAgenceId, userData)` for each user
- Shows success toast and completes workflow

**API Endpoints**:

- `POST /agence` - Create Agency
- `POST /agence/{agenceId}/users` - Create users for Agency

### 3. TCC (Teneur de Comptes Conservateur) Creation

**File**: `app/[locale]/(main)/(gestion-des-acteurs)/tcc/form/page.tsx`

**Step 1 - TCC Creation**:

- Form validation using `custodianFormSchema.safeParse()`
- Transforms form data via `TCCService.transformFormDataToAPI()`
- Creates TCC via `TCCService.createOrUpdate(apiData, isEditMode)`
- Stores created TCC ID in `formValues.tccId`
- Shows success toast and moves to step 2

**Step 2 - User Creation**:

- Uses stored `formValues.tccId` for user creation
- Maps status values (`active`/`inactive` → `actif`/`inactif`)
- Creates users via `TCCService.createUser(apiUserData, formValues.tccId)` for each user
- Shows success toast and redirects to TCC list

**API Endpoints**:

- `PUT /tcc` - Create/Update TCC (uses PUT for both operations)
- `POST /tcc/users` - Create users for TCC

## Validation Flow

### Step 1 (Actor Creation)

1. **Form Validation**: Check all required fields using Zod schemas
2. **API Call**: Create the actor entity
3. **Success Handling**: Store actor ID and show success message
4. **Navigation**: Move to step 2 (users)

### Step 2 (User Creation)

1. **User Data Preparation**: Transform form data to API format
2. **Batch Creation**: Create all users for the actor
3. **Error Handling**: Continue even if some users fail
4. **Completion**: Show summary and redirect

## Error Handling

- **Validation Errors**: Show toast with specific field validation messages
- **API Errors**: Log to console and show user-friendly error messages
- **Partial Success**: For user creation, continue even if some fail

## User Experience

- **Step Indicators**: Visual progress indicator showing current step
- **Real-time Validation**: Form validation on change
- **Success Feedback**: Toast notifications for each successful operation
- **Error Recovery**: Clear error messages with actionable guidance

## Data Persistence

- **Actor ID Storage**: Each form stores the created actor ID for user creation
- **Form State**: Maintains form data between steps
- **Edit Mode**: Properly handles both create and edit workflows

## Next Steps

1. **Test API Integration**: Verify all endpoints are working correctly
2. **Add Loading States**: Show spinners during API calls
3. **Enhance Error Messages**: Add more specific error handling
4. **Add Confirmation Dialogs**: For important operations
5. **Implement Bulk Operations**: For multiple user creation optimization
