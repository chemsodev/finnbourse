"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(
  (
    { value = [], onValueChange, disabled = false, className, children },
    ref
  ) => {
    const handleValueChange = React.useCallback(
      (itemValue: string, checked: boolean) => {
        if (checked) {
          onValueChange([...value, itemValue]);
        } else {
          onValueChange(value.filter((v) => v !== itemValue));
        }
      },
      [value, onValueChange]
    );

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          return React.cloneElement(
            child as React.ReactElement<CheckboxItemProps>,
            {
              disabled,
              checked: value?.includes(child.props.value),
              onCheckedChange: (checked: boolean) =>
                handleValueChange(child.props.value, checked),
            }
          );
        })}
      </div>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

interface CheckboxItemProps {
  id: string;
  value: string;
  label: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export const CheckboxItem = React.forwardRef<HTMLDivElement, CheckboxItemProps>(
  (
    { id, value, label, checked, disabled, onCheckedChange, className },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("flex items-center space-x-2", className)}>
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
          value={value}
        />
        <Label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          )}
        >
          {label}
        </Label>
      </div>
    );
  }
);

CheckboxItem.displayName = "CheckboxItem";
