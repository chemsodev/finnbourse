/**
 * DynamicMenuItems.tsx
 * -----------------------
 * Client-side component to render dynamic menu items
 * Handles both single items and dropdown menus
 */

"use client";

import React from "react";
import { MenuElement, getMenuItemInfo } from "@/app/actions/menuService";
import DynamicNavbarLink from "@/components/navigation/DynamicNavbarLink";
import DynamicDropdownMenu from "@/components/navigation/DynamicDropdownMenu";
import { useTranslations } from "next-intl";

interface DynamicMenuItemsProps {
  elements: MenuElement[];
}

const DynamicMenuItems = ({ elements }: DynamicMenuItemsProps) => {
  const t = useTranslations("SideBar");

  // Debug logging
  React.useEffect(() => {
    console.log("DynamicMenuItems - Elements received:", elements);
    console.log("DynamicMenuItems - Elements length:", elements?.length);
  }, [elements]);

  if (!elements || elements.length === 0) {
    console.log("DynamicMenuItems - No elements to render");
    return <div className="text-sm text-gray-500 p-4">No menu elements</div>;
  }

  return (
    <>
      {elements.map((element) => {
        const menuInfo = getMenuItemInfo(element.id);

        // If element has children, render as dropdown
        if (element.children && element.children.length > 0) {
          return (
            <DynamicDropdownMenu
              key={element.id}
              id={element.id}
              label={
                menuInfo.translationKey
                  ? t(menuInfo.translationKey as any)
                  : menuInfo.label
              }
              icon={menuInfo.icon}
              children={element.children}
            />
          );
        }

        // If element has no children, render as simple link
        if (menuInfo.href) {
          return (
            <DynamicNavbarLink
              key={element.id}
              href={menuInfo.href}
              icon={menuInfo.icon}
              label={
                menuInfo.translationKey
                  ? t(menuInfo.translationKey as any)
                  : menuInfo.label
              }
            />
          );
        }

        // Skip elements without href or children
        return null;
      })}
    </>
  );
};

export default DynamicMenuItems;
