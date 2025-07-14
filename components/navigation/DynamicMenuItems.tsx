/**
 * DynamicMenuItems.tsx
 * -----------------------
 * Client-side component to render dynamic menu items
 * Handles both single items and dropdown menus
 */

"use client";

import React from "react";
import {
  MenuElement,
  getMenuItemInfo,
  menuItemMap,
} from "@/app/actions/menuService";
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
    console.log(
      "DynamicMenuItems - Elements received:",
      JSON.stringify(elements, null, 2)
    );
    console.log("DynamicMenuItems - Elements length:", elements?.length);

    // Log all menu item IDs for verification
    const menuIds = elements.map((element) => element.id);
    console.log("Menu IDs in sidebar:", menuIds.join(", "));

    // Check for pages that should be hidden
    elements.forEach((element) => {
      if (element.id === "charts-editions") {
        console.warn(
          "WARNING: charts-editions found in menu elements when it should be removed"
        );
      }

      // Log dropdown children for debugging
      if (element.children && element.children.length > 0) {
        console.log(
          `Children of ${element.id}:`,
          element.children.map((child) => child.id).join(", ")
        );
      }
    });
  }, [elements]);

  if (!elements || elements.length === 0) {
    console.log("DynamicMenuItems - No elements to render");
    return <div className="text-sm text-gray-500 p-4">No menu elements</div>;
  }

  return (
    <>
      {elements
        .filter((element) => menuItemMap[element.id])
        .map((element) => {
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
          return null;
        })}
    </>
  );
};

export default DynamicMenuItems;
