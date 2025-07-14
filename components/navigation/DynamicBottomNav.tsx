/**
 * DynamicBottomNav.tsx
 * -----------------------
 * Dynamic bottom navigation for mobile devices using menu service
 */

"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useMenu } from "@/hooks/useMenu";
import { getMenuItemInfo } from "@/app/actions/menuService";
import * as Icons from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DynamicBottomNav = () => {
  const { menu, isLoading } = useMenu();
  const pathname = usePathname();
  const t = useTranslations("SideBar");

  // Debug the menu items in the bottom nav
  React.useEffect(() => {
    if (menu && menu.elements) {
      console.log(
        "DynamicBottomNav - Menu elements:",
        menu.elements.map((el) => el.id).join(", ")
      );
    }
  }, [menu]);

  // Select first 4 menu items for bottom nav (excluding dropdowns)
  const bottomNavItems = menu.elements
    .filter((element) => !element.children || element.children.length === 0)
    .filter((element) => getMenuItemInfo(element.id).href)
    .slice(0, 4);

  // Get remaining items for the overflow menu
  const overflowItems = menu.elements
    .filter((element) => !bottomNavItems.some((item) => item.id === element.id))
    .slice(0, 6); // Limit overflow items

  if (isLoading) {
    return (
      <div className="md:hidden fixed bg-primary w-screen bottom-0 text-white flex justify-center items-center py-4 z-50">
        <div className="text-sm">Loading...</div>
      </div>
    );
  }

  const renderNavItem = (element: any, isOverflow = false) => {
    const menuInfo = getMenuItemInfo(element.id);
    const IconComponent =
      menuInfo.icon && (Icons as any)[menuInfo.icon]
        ? (Icons as any)[menuInfo.icon]
        : null;
    const isActive =
      pathname === menuInfo.href || pathname.startsWith(menuInfo.href + "/");

    if (!menuInfo.href) return null;

    const content = (
      <>
        {IconComponent ? (
          <IconComponent size={isOverflow ? 16 : 20} />
        ) : (
          <div
            className={`${
              isOverflow ? "w-4 h-4" : "w-5 h-5"
            } rounded-full bg-gray-400`}
          />
        )}{" "}
        <div
          className={`${
            isOverflow ? "text-xs" : "text-[40%]"
          } font-extralight text-center`}
        >
          {menuInfo.translationKey
            ? t(menuInfo.translationKey as any)
            : menuInfo.label}
        </div>
      </>
    );

    if (isOverflow) {
      return (
        <DropdownMenuItem key={element.id} asChild>
          <Link href={menuInfo.href} className="flex items-center gap-2">
            {content}
          </Link>
        </DropdownMenuItem>
      );
    }

    return (
      <Link
        key={element.id}
        href={menuInfo.href}
        className={`flex flex-col items-center gap-1 w-14 ${
          isActive ? "text-secondary" : ""
        }`}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="md:hidden fixed bg-primary border-t-2 border-secondary w-screen bottom-0 text-white flex justify-around items-center py-2 px-6 z-50">
      {/* First 3 navigation items */}
      {bottomNavItems.slice(0, 3).map((element) => renderNavItem(element))}

      {/* Central home button */}
      <Link
        href="/"
        className="flex justify-center items-center gap-1 rounded-full bg-white w-14 h-14 -mt-8 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="text-secondary"
          viewBox="0 0 16 16"
        >
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
        </svg>
      </Link>

      {/* Last navigation item */}
      {bottomNavItems[3] && renderNavItem(bottomNavItems[3])}

      {/* Overflow menu */}
      {overflowItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center gap-1 w-14 z-20">
            <Icons.MoreHorizontal size={20} />{" "}
            <div className="text-[40%] font-extralight text-center">
              {t("more")}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t("moreOptions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {overflowItems.map((element) => {
              // Handle dropdown items
              if (element.children && element.children.length > 0) {
                return element.children.map((child: any) => {
                  const childInfo = getMenuItemInfo(child.id);
                  if (!childInfo.href) return null;
                  return (
                    <DropdownMenuItem key={child.id} asChild>
                      <Link
                        href={childInfo.href}
                        className="flex items-center gap-2"
                      >
                        {" "}
                        <div className="w-4 h-4 rounded-full bg-gray-400" />
                        {childInfo.translationKey
                          ? t(childInfo.translationKey as any)
                          : childInfo.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                });
              }
              return renderNavItem(element, true);
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default DynamicBottomNav;
