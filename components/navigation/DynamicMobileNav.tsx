/**
 * DynamicMobileNav.tsx
 * -----------------------
 * Dynamic mobile navigation component using the menu service
 */

"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { DeconnexionDialog } from "../DeconnexionDialog";
import LocaleButton from "../Locales/LocaleButton";
import { useMenu } from "@/hooks/useMenu";
import { getMenuItemInfo } from "@/app/actions/menuService";
import DynamicDropdownMenu from "./DynamicDropdownMenu";
import DynamicNavbarLink from "./DynamicNavbarLink";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

interface DynamicMobileNavProps {
  userName?: string;
  userEmail?: string;
}

const DynamicMobileNav: React.FC<DynamicMobileNavProps> = ({
  userName,
  userEmail,
}) => {
  const { menu, isLoading, error } = useMenu();
  const { data: session } = useSession();
  const t = useTranslations("SideBar");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="rounded-md bg-primary text-white p-2">
          <Menu className="h-6 w-6 text-white" />
        </button>
      </SheetTrigger>
      <SheetContent className="p-6 sm:max-w-sm">
        {/* Header with logo and brand */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex items-center z-50">
            <div className="rounded-full bg-white border-secondary border-2 shadow-sm p-2 w-fit">
              <Image
                src="/favicon.ico"
                width={100}
                height={100}
                alt="logo"
                className="w-8 h-8 p-1"
              />
            </div>
          </div>
          <div className="text-primary font-bold text-lg">FinnBourse</div>
        </div>

        {/* Dynamic menu items */}
        <div className="flex flex-col gap-2 mb-6">
          {isLoading ? (
            <div className="text-sm text-gray-500">Loading menu...</div>
          ) : error ? (
            <div className="text-sm text-red-500">Error loading menu</div>
          ) : (
            menu.elements.map((element) => {
              const menuInfo = getMenuItemInfo(element.id); // If element has children, render as dropdown
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
            })
          )}
        </div>

        {/* Language selector */}
        <div className="flex justify-center mb-6">
          <LocaleButton />
        </div>

        {/* User info and logout */}
        <div className="border-t pt-4 mt-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={userName || "User"}
                />
                <AvatarFallback className="bg-primary text-white">
                  {userName
                    ? userName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                    : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-xs">
                <div className="font-medium text-gray-800 truncate max-w-[120px]">
                  {userName || "User"}
                </div>
                <div className="text-gray-600 text-[10px] truncate max-w-[120px]">
                  {userEmail || ""}
                </div>
              </div>
            </div>
            <DeconnexionDialog />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DynamicMobileNav;
