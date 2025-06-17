# Dynamic Menu System Implementation

## Overview

The dynamic menu system fetches menu structure from the REST API at `192.168.0.128/api/v1/menu/list` using the REST token generated during GraphQL login. This allows for flexible, server-controlled navigation while maintaining the existing two-factor authentication flow.

## Architecture

### Authentication Flow

1. **Primary Login**: GraphQL backend with 2FA (unchanged)
2. **Background Token**: REST API token generated for actor management
3. **Menu Fetching**: Uses REST token to fetch dynamic menu from 192.168.0.128

### Key Components

#### 1. Menu Service (`app/actions/menuService.ts`)

- Fetches menu from REST API endpoint
- Provides fallback menu structure
- Maps menu IDs to navigation info (labels, icons, routes)

#### 2. Authentication Integration

- **auth.ts**: Modified to generate REST token alongside GraphQL token
- **useRestToken.ts**: Hook to access tokens on client side
- **fetchREST.ts**: Updated to use REST token for API calls

#### 3. Dynamic Navigation Components

- **DynamicSidebar.tsx**: Server-side dynamic sidebar
- **DynamicMobileNav.tsx**: Client-side mobile navigation
- **DynamicBottomNav.tsx**: Client-side bottom navigation
- **DynamicMenuItems.tsx**: Renders menu items recursively
- **DynamicNavbarLink.tsx**: Individual navigation links
- **DynamicDropdownMenu.tsx**: Dropdown menus with children

## Usage

### Testing the System

1. Navigate to `/menu-demo` to see:
   - Authentication status
   - Token availability
   - Menu structure
   - API configuration

### Replacing Current Navigation

To use the dynamic navigation system:

1. **Replace Sidebar** in `app/[locale]/(main)/layout.tsx`:

```tsx
// Replace this:
import SideBar from "@/components/navigation/SideBar";

// With this:
import DynamicSidebar from "@/components/navigation/DynamicSidebar";

// And update the component:
<DynamicSidebar />;
```

2. **Replace Mobile Navigation**:

```tsx
// Replace this:
import BottomNavMobile from "@/components/navigation/BottomNavMobile";

// With this:
import DynamicBottomNav from "@/components/navigation/DynamicBottomNav";

// And update the component:
<DynamicBottomNav />;
```

### Expected API Response Format

```json
{
  "elements": [
    {
      "id": "dashboard"
    },
    {
      "id": "place-order"
    },
    {
      "id": "orders-dropdown",
      "children": [
        {
          "id": "my-orders"
        },
        {
          "id": "order-history"
        }
      ]
    }
  ]
}
```

### Menu Item Configuration

Menu items are mapped in `menuService.ts`:

```typescript
const menuItemMap = {
  dashboard: {
    label: "Dashboard",
    href: "/",
    icon: "Home",
    translationKey: "dashboard",
  },
  "place-order": {
    label: "Place Order",
    href: "/passer-un-ordre",
    icon: "Plus",
    translationKey: "placeOrder",
  },
  // ... more items
};
```

## Features

### 1. Fallback System

- Uses fallback menu if REST API is unavailable
- Graceful degradation ensures app continues to work

### 2. Role-Based Access Control

- Ready for implementation in `hasMenuAccess()` function
- Can filter menu items based on user roles

### 3. Translation Support

- Integration with next-intl for internationalization
- Supports translation keys for menu labels

### 4. Icon Support

- Dynamic icon loading from Lucide React
- Fallback to simple shapes if icon not found

### 5. Active State Management

- Automatic highlighting of active menu items
- Works with nested routes

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_REST_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=your_graphql_backend_url
```

## Token Flow

1. **Login**: User logs in via GraphQL (2FA flow maintained)
2. **Background Token**: System attempts to generate REST token
3. **Menu Fetch**: Client uses REST token to fetch menu
4. **Actor Management**: REST token used for actor management operations

## Gestion des Acteurs Integration

The REST token is specifically designed for use in the "gestion des acteurs" (actor management) pages. These pages can now use:

- `useRestToken()` hook to access the REST token
- `actorAPI.ts` service for REST API operations
- Full CRUD operations for IOB, TCC, Agence, Client, and Issuer entities

## Next Steps

1. **Test the Implementation**: Visit `/menu-demo` to verify token generation and menu fetching
2. **Configure Backend**: Ensure the menu endpoint at 192.168.0.128 is properly configured
3. **Update Layout**: Replace the static navigation components with dynamic ones
4. **Customize Menu Mapping**: Update `menuItemMap` to match your specific routes and labels
5. **Implement Role-Based Access**: Add logic to `hasMenuAccess()` function based on your requirements

## Troubleshooting

### Menu Not Loading

- Check if REST token is being generated (visible in `/menu-demo`)
- Verify the menu API endpoint is accessible
- Check browser console for network errors

### Authentication Issues

- Ensure GraphQL login works normally
- Verify REST API credentials match GraphQL credentials
- Check that both backends are running

### Navigation Issues

- Verify route mappings in `menuItemMap`
- Check for typos in menu IDs returned by API
- Ensure translation keys exist in your translation files
