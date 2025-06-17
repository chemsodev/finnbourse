/**
 * DynamicDropdownMenu.tsx
 * -----------------------
 * Dynamic dropdown menu component for menu items with children
 */

"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { MenuElement, getMenuItemInfo } from "@/app/actions/menuService";
import { useTranslations } from "next-intl";

interface DynamicDropdownMenuProps {
  id: string;
  label: string;
  icon?: string;
  children: MenuElement[];
}

const DynamicDropdownMenu = ({
  id,
  label,
  icon,
  children,
}: DynamicDropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("SideBar");

  // Check if any child is active to determine dropdown state
  const isActive = children.some((child) => {
    const childInfo = getMenuItemInfo(child.id);
    return (
      childInfo.href &&
      (pathname === childInfo.href || pathname.startsWith(childInfo.href + "/"))
    );
  });

  // Dynamically get the icon component
  const IconComponent =
    icon && (Icons as any)[icon] ? (Icons as any)[icon] : null;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      {" "}
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-4 py-2 px-6 w-full rounded-md ${
          isActive
            ? "bg-secondary/20 shadow-sm"
            : "hover:bg-secondary/20 hover:text-primary hover:shadow-sm"
        }`}
      >
        {IconComponent ? (
          <IconComponent size={15} />
        ) : (
          <div className="w-[15px] h-[15px] rounded-full bg-gray-400" />
        )}
        <div className="capitalize text-xs flex justify-between gap-4 items-center">
          {label}
        </div>
        {isOpen ? (
          <ChevronDown className="ml-auto" size={15} />
        ) : (
          <ChevronRight className="ml-auto" size={15} />
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col ml-6 mt-1 border-l-[1px] border-dashed border-gray-300 pl-3">
          {children.map((child) => {
            const childInfo = getMenuItemInfo(child.id);
            const isChildActive =
              childInfo.href &&
              (pathname === childInfo.href ||
                pathname.startsWith(childInfo.href + "/"));

            if (!childInfo.href) {
              return null; // Skip items without href
            }

            return (
              <Link
                key={child.id}
                href={childInfo.href}
                className={`flex items-center gap-2 hover:bg-secondary/10 hover:text-primary py-1 px-3 rounded-lg text-sm transition-colors ${
                  isChildActive
                    ? "bg-secondary/10 text-primary"
                    : "text-gray-600"
                }`}
              >
                {childInfo.translationKey
                  ? t(childInfo.translationKey as any)
                  : childInfo.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DynamicDropdownMenu;
