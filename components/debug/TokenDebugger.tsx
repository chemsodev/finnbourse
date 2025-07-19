"use client";

import { useRestToken } from "@/hooks/useRestToken";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TokenDebugger() {
  const {
    restToken,
    graphqlToken,
    loginSource,
    isLoading,
    isAuthenticated,
    hasRestToken,
    hasGraphqlToken,
    fetchAndStoreRestToken,
    clearStoredToken,
  } = useRestToken();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Token Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? "✅" : "❌"}
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? "⏳" : "✅"}
        </div>
        <div>
          <strong>Login Source:</strong> {loginSource || "Unknown"}
        </div>
        <div>
          <strong>Has REST Token:</strong> {hasRestToken ? "✅" : "❌"}
        </div>
        <div>
          <strong>Has GraphQL Token:</strong> {hasGraphqlToken ? "✅" : "❌"}
        </div>
        <div>
          <strong>REST Token (first 20 chars):</strong>{" "}
          {restToken ? `${restToken.substring(0, 20)}...` : "None"}
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={fetchAndStoreRestToken} size="sm">
            Refresh Token
          </Button>
          <Button onClick={clearStoredToken} variant="outline" size="sm">
            Clear Token
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
