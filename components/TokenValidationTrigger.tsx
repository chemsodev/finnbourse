/**
 * TokenValidationTrigger.tsx
 * Utility component to manually trigger token validation
 * Useful for debugging or emergency validation
 */

"use client";

import { useManualTokenValidation } from "@/hooks/useManualTokenValidation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Shield, ShieldCheck, ShieldX } from "lucide-react";

interface TokenValidationTriggerProps {
  showStatus?: boolean;
  className?: string;
}

export default function TokenValidationTrigger({
  showStatus = true,
  className = "",
}: TokenValidationTriggerProps) {
  const { validateToken, isTokenValid, hasValidSession } =
    useManualTokenValidation();
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<{
    success: boolean;
    timestamp: Date;
  } | null>(null);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const isValid = await validateToken();
      setLastValidation({
        success: isValid,
        timestamp: new Date(),
      });
    } catch (error) {
      setLastValidation({
        success: false,
        timestamp: new Date(),
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = () => {
    if (!hasValidSession) return <ShieldX className="h-4 w-4 text-red-500" />;
    if (isTokenValid())
      return <ShieldCheck className="h-4 w-4 text-green-500" />;
    return <Shield className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (!hasValidSession) return "No Session";
    if (isTokenValid()) return "Valid";
    return "Unknown";
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={handleValidate}
        disabled={isValidating}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isValidating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            Validating...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            Validate Token
          </>
        )}
      </Button>

      {showStatus && (
        <div className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
          {lastValidation && (
            <span className="text-gray-500 text-xs">
              (checked {lastValidation.timestamp.toLocaleTimeString()})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
