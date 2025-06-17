# TCC REST API Authentication Setup

## 🔐 **How REST Token Authentication Works**

Your TCC requests are already configured to use the REST API token as the authorization bearer. Here's the complete flow:

### **1. Token Flow:**

```
Login → Session → REST Token → TCC Requests → Backend (localhost:3000)
```

### **2. Authentication Headers:**

All TCC API requests include:

```http
Authorization: Bearer <restToken>
Content-Type: application/json
```

## 📋 **Files Involved:**

### **1. `hooks/useRestToken.ts`**

- Extracts `restToken` from NextAuth session
- Provides token to components and hooks
- **Debug logging added** to show token availability

### **2. `app/actions/fetchREST.ts`**

- `clientFetchREST()` function adds `Authorization: Bearer ${token}` header
- **Debug logging added** to show token usage in requests

### **3. `app/actions/actorAPI.ts`**

- TCC endpoints use `getRestToken()` or passed token
- All methods: `getAll()`, `create()`, `createUser()`, etc.

### **4. `hooks/useTCC.ts`**

- Uses `useRestToken()` hook to get token
- Passes token to all TCC service methods

### **5. `lib/services/tccService.ts`**

- Service layer that calls actorAPI with token
- Handles data transformation

## 🔍 **Debug & Testing:**

### **New Test Page: `/tcc/auth-test`**

Visit this page to:

- ✅ Check if REST token exists in session
- ✅ Test Financial Institutions API call
- ✅ Test TCC API call
- ✅ View token information and debug data

### **Console Debug Output:**

When using TCC features, you'll see:

```
🔑 REST Token available: eyJhbGciOiJIUzI1NiI...
📡 Login source: REST
TCC API Request: GET http://localhost:3000/api/v1/tcc
Using REST token: eyJhbGciOiJIUzI1NiI...
```

## 🚀 **Verification Steps:**

### **1. Check Token Availability:**

```javascript
// In browser console
const session = await fetch("/api/auth/session").then((r) => r.json());
console.log("REST Token:", session.user?.restToken ? "Available" : "Missing");
```

### **2. Test TCC Endpoints:**

1. Visit `/tcc/auth-test`
2. Click "Run Auth Test"
3. Check console output for detailed logs
4. Verify API calls succeed

### **3. Monitor Network Tab:**

1. Open browser Dev Tools → Network
2. Make TCC requests (visit `/tcc` or `/tcc/form`)
3. Check request headers include `Authorization: Bearer ...`

## 🔧 **API Endpoints Using REST Token:**

### **Financial Institutions:**

```http
GET /api/v1/financial-institution
Authorization: Bearer <restToken>
```

### **TCC Operations:**

```http
GET /api/v1/tcc
PUT /api/v1/tcc
POST /api/v1/tcc/users
PUT /api/v1/tcc/users/{userId}
PUT /api/v1/tcc/users/{userId}/role
Authorization: Bearer <restToken>
```

## ⚠️ **Troubleshooting:**

### **If No REST Token:**

1. Check login source: Should be "REST" not "GraphQL"
2. Verify session contains `restToken` field
3. Check environment variable: `NEXT_PUBLIC_REST_API_URL`

### **If API Calls Fail:**

1. Check console for debug logs
2. Verify backend is running on `localhost:3000`
3. Check Network tab for request headers
4. Verify token format (JWT starting with `eyJ`)

### **Console Commands for Debug:**

```javascript
// Check current token
tokenDebug.checkSession();

// Monitor all API calls
// Open Network tab and filter by "localhost:3000"
```

## ✅ **Expected Behavior:**

- 🔑 REST token automatically included in all TCC requests
- 📡 No manual token management required
- 🚀 Seamless authentication for TCC operations
- 🔍 Debug logs help troubleshoot issues

**The system is already configured correctly!** All TCC requests use the REST token as authorization bearer. Visit `/tcc/auth-test` to verify everything is working. 🎉
