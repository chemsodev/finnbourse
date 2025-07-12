/**
 * DynamicSidebar.tsx
 * -----------------------
 * Dynamic sidebar component that uses menu data stored during login
 */

"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeconnexionDialog } from "../DeconnexionDialog";
import LocaleButton from "../Locales/LocaleButton";
import { Settings } from "lucide-react";
import { HiOutlineSupport } from "react-icons/hi";
import { ImStatsBars } from "react-icons/im";
import { useMenu } from "@/hooks/useMenu";
import DynamicMenuItems from "./DynamicMenuItems";

const DynamicSidebar = () => {
  const { data: session } = useSession();
  const t = useTranslations("SideBar");
  const { menu, isLoading, error } = useMenu();
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("DynamicSidebar - Menu data:", menu);
    console.log("DynamicSidebar - Is loading:", isLoading);
    console.log("DynamicSidebar - Error:", error);
    console.log("DynamicSidebar - Menu elements:", menu?.elements);
  }, [menu, isLoading, error]);
  if (!isHydrated || isLoading) {
    return (
      <div className="hidden md:flex bg-gray-50 w-1/6 px-3 py-5 shadow-inner h-screen overflow-scroll flex-col justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col items-center mb-4 px-2">
            <div className="relative w-40 h-20">
              <Image
                src="/cpaLogo.png"
                alt="CPA Logo"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100px, 150px"
              />
            </div>
          </div>
          <div className="flex justify-center items-center py-8">
            <div className="text-sm text-gray-500">Loading menu...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex bg-gray-50 w-1/6 px-3 py-5 shadow-inner h-screen overflow-scroll flex-col justify-between">
      <div className="flex flex-col gap-1">
        {/* Logo and brand */}
        <div className="flex flex-col items-center mb-4 px-2">
          <div className="relative w-40 h-20  ">
            <Image
              src="/cpaLogo.png"
              alt="CPA Logo"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100px, 150px"
            />
          </div>
        </div>
        {/* Dynamic menu items */}
        <div className="flex flex-col gap-2">
          {menu?.elements && menu.elements.length > 0 ? (
            <DynamicMenuItems elements={menu.elements} />
          ) : (
            <div className="text-sm text-gray-500 p-4">
              No menu items available
              {error && (
                <div className="text-red-500 text-xs mt-2">Error: {error}</div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Bottom section - matching original sidebar */}
      <div className="flex flex-col gap-2">
        <DeconnexionDialog />

        <div className="flex">
          <Link
            href="/profile"
            className="flex bg-white shadow-sm items-center gap-4 hover:shadow-inner p-2 w-full ltr:rounded-l-xl rtl:rounded-r-xl"
          >
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                {session?.user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-xs">
              <div className="font-medium capitalize text-sm">
                {session?.user?.name}
              </div>
              <div className="text-[8px] text-gray-500">
                {session?.user?.email}
              </div>
            </div>{" "}
          </Link>
          <LocaleButton />
        </div>
      </div>
    </div>
  );
};

export default DynamicSidebar;
