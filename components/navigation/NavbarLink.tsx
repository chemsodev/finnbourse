"use client";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import OrderCounter from "../gestion-des-ordres/OrderCounter";
import { useSession } from "next-auth/react";

const NavbarLink = ({
  link,
}: {
  link: { href: string; icon: React.ReactNode; label: string };
}) => {
  const pathname = usePathname();
  const session = useSession();
  const userRole = session?.data?.user?.roleid;
  const normalizedPathname = pathname.replace(/^\/(en|ar)\//, "/");
  const isActive = normalizedPathname === link.href;

  return (
    <Link
      href={link.href}
      className={`flex items-center gap-4 py-2 px-6 w-full rounded-md  ${
        isActive
          ? "bg-secondary/20 shadow-sm"
          : "hover:bg-secondary/20 hover:text-primary hover:shadow-sm"
      }`}
    >
      {link.icon}
      <div className="capitalize text-xs flex justify-between gap-4 items-center">
        {link.label}
        {link.href === "/carnetordres" &&
          (userRole === 2 || userRole === 3) && (
            <span className="text-xs bg-primary text-white h-4 w-4 rounded-full flex justify-center items-center shadow-inner ">
              <OrderCounter />
            </span>
          )}
      </div>
    </Link>
  );
};

export default NavbarLink;
