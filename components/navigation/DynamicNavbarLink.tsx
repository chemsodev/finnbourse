/**
 * DynamicNavbarLink.tsx
 * -----------------------
 * Dynamic navbar link component that renders menu items with icons
 */

"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";

interface DynamicNavbarLinkProps {
  href: string;
  icon?: string;
  label: string;
}

const DynamicNavbarLink = ({ href, icon, label }: DynamicNavbarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  // Dynamically get the icon component
  const IconComponent =
    icon && (Icons as any)[icon] ? (Icons as any)[icon] : null;
  return (
    <Link
      href={href}
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
    </Link>
  );
};

export default DynamicNavbarLink;
