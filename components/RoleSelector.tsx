import { RoleType } from "@/lib/roles";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckboxGroup, CheckboxItem } from "./ui/checkbox-group"; // Changed from '@/components/ui/checkbox-group'
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useTranslations } from "next-intl";
import { Control } from "react-hook-form";
import {
  mapLegacyRoleToNewRole,
  mapNewRoleToLegacyRole,
} from "@/lib/role-utils";

interface RoleSelectorProps {
  roles: RoleType[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  userType?: string; // Added to support legacy mapping
  legacyMode?: boolean; // If true, use legacy role values for compatibility
}

// Simple dropdown selector for roles
export function RoleSelector({
  roles,
  value,
  onChange,
  placeholder = "Sélectionner un rôle",
  label = "Rôle",
  userType = "agency",
  legacyMode = false,
}: RoleSelectorProps) {
  const t = useTranslations();

  // Handle role value conversion for legacy compatibility
  const handleRoleChange = (newRoleId: string) => {
    if (legacyMode) {
      // If we're in legacy mode, convert the new role ID back to a legacy format
      onChange(mapNewRoleToLegacyRole(newRoleId));
    } else {
      // Otherwise just pass the new role ID
      onChange(newRoleId);
    }
  };

  // Convert incoming legacy value to new role ID format if needed
  const currentValue = legacyMode
    ? mapLegacyRoleToNewRole(value, userType)
    : value;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">{label}</label>
      </div>
      <Select value={currentValue} onValueChange={handleRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              <div className="flex items-center justify-between w-full">
                <span>{role.label}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">{role.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface RoleCheckboxGroupProps {
  roles: RoleType[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
}

// Checkbox group for selecting multiple roles
export function RoleCheckboxGroup({
  roles,
  value,
  onChange,
  label = "Rôles",
}: RoleCheckboxGroupProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium">{label}</h3>
      </div>
      <CheckboxGroup
        value={value}
        onValueChange={onChange}
        className="space-y-2"
      >
        {roles.map((role) => (
          <CheckboxItem
            key={role.id}
            id={role.id}
            value={role.id}
            label={
              <div className="flex items-center gap-2">
                <span>{role.label}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">{role.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            }
          />
        ))}
      </CheckboxGroup>
    </div>
  );
}

interface FormRoleSelectorProps {
  control: Control<any>;
  name: string;
  roles: RoleType[];
  label?: string;
  placeholder?: string;
}

// Form-compatible role selector for React Hook Form
export function FormRoleSelector({
  control,
  name,
  roles,
  label = "Rôle",
  placeholder = "Sélectionner un rôle",
}: FormRoleSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{role.label}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              {role.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormRoleCheckboxGroupProps {
  control: Control<any>;
  name: string;
  roles: RoleType[];
  label?: string;
}

// Form-compatible role checkbox group for React Hook Form
export function FormRoleCheckboxGroup({
  control,
  name,
  roles,
  label = "Rôles",
}: FormRoleCheckboxGroupProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <CheckboxGroup
              value={field.value || []}
              onValueChange={field.onChange}
              className="space-y-2"
            >
              {roles.map((role) => (
                <CheckboxItem
                  key={role.id}
                  id={role.id}
                  value={role.id}
                  label={
                    <div className="flex items-center gap-2">
                      <span>{role.label}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              {role.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  }
                />
              ))}
            </CheckboxGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
