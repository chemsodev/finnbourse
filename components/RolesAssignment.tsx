"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  CLIENT_ROLES,
  AGENCY_ROLES,
  TCC_ROLES,
  IOB_ROLES,
  RoleType,
} from "@/lib/roles";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { HelpCircle } from "lucide-react";

interface RolesAssignmentProps {
  selectedRoles: string[];
  onRolesChange: (roles: string[]) => void;
  userTypes?: string[]; // Which user types to show tabs for: 'client', 'agency', 'tcc', 'iob'
  showTabs?: boolean;
}

export function RolesAssignment({
  selectedRoles,
  onRolesChange,
  userTypes = ["client", "agency", "tcc", "iob"],
  showTabs = true,
}: RolesAssignmentProps) {
  const t = useTranslations("roles");
  const [activeTab, setActiveTab] = useState(userTypes[0] || "client");

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      onRolesChange([...selectedRoles, roleId]);
    } else {
      onRolesChange(selectedRoles.filter((id) => id !== roleId));
    }
  };

  const renderRoleCheckboxes = (roles: RoleType[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="flex items-start space-x-2">
            <Checkbox
              id={role.id}
              checked={selectedRoles.includes(role.id)}
              onCheckedChange={(checked) =>
                handleRoleToggle(role.id, checked === true)
              }
            />
            <div className="grid gap-1">
              <Label
                htmlFor={role.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                {role.label}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="w-[200px] text-xs">{role.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <p className="text-xs text-muted-foreground">
                {role.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Map user types to their roles
  const rolesByType = {
    client: CLIENT_ROLES,
    agency: AGENCY_ROLES,
    tcc: TCC_ROLES,
    iob: IOB_ROLES,
  };

  // Filter user types based on the userTypes prop
  const filteredUserTypes = userTypes.filter((type) =>
    ["client", "agency", "tcc", "iob"].includes(type)
  );

  // Get translated labels for tabs
  const getTabLabel = (type: string) => {
    switch (type) {
      case "client":
        return t("CLIENT");
      case "agency":
        return t("AGENCY");
      case "tcc":
        return t("TCC");
      case "iob":
        return t("IOB");
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("assignRoles")}</CardTitle>
        <CardDescription>{t("selectAppropriateRoles")}</CardDescription>
      </CardHeader>
      <CardContent>
        {showTabs && filteredUserTypes.length > 1 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {filteredUserTypes.map((type) => (
                <TabsTrigger key={type} value={type}>
                  {getTabLabel(type)}
                </TabsTrigger>
              ))}
            </TabsList>
            {filteredUserTypes.map((type) => (
              <TabsContent key={type} value={type}>
                {renderRoleCheckboxes(
                  rolesByType[type as keyof typeof rolesByType]
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          // If only one user type or tabs disabled, show the checkboxes directly
          renderRoleCheckboxes(
            rolesByType[activeTab as keyof typeof rolesByType] || CLIENT_ROLES
          )
        )}
      </CardContent>
    </Card>
  );
}

// Simpler component for use in forms or tables
interface RolesChipSelectProps {
  selectedRoles: string[];
  onRolesChange: (roles: string[]) => void;
  userType: "client" | "agency" | "tcc" | "iob";
}

export function RolesChipSelect({
  selectedRoles,
  onRolesChange,
  userType,
}: RolesChipSelectProps) {
  const rolesByType = {
    client: CLIENT_ROLES,
    agency: AGENCY_ROLES,
    tcc: TCC_ROLES,
    iob: IOB_ROLES,
  };

  const roles = rolesByType[userType];

  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <div
          key={role.id}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors
            ${
              selectedRoles.includes(role.id)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          onClick={() => {
            if (selectedRoles.includes(role.id)) {
              onRolesChange(selectedRoles.filter((id) => id !== role.id));
            } else {
              onRolesChange([...selectedRoles, role.id]);
            }
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{role.label}</span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="w-[200px] text-xs">{role.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
}
