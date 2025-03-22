"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const OrderStateFilter = () => {
  const t = useTranslations("mesOrdres");
  const tStatus = useTranslations("status");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleOrderStateChange = (state: number) => {
    const newOrderState = state;
    const params = new URLSearchParams(searchParams);
    params.set("state", newOrderState.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const getStatusBgColor = (statut: number) => {
    switch (statut) {
      case 0:
        return "bg-gray-600";
      case 1:
        return "bg-yellow-600";
      case 2:
        return "bg-secondary";
      case 3:
        return "bg-green-600";
      case 4:
        return "bg-purple-600";
      case 5:
        return "bg-teal-600";
      case 6:
        return "bg-orange-600";
      case 7:
        return "bg-indigo-600";
      case 7:
        return "bg-orange-700";
      case 8:
        return "bg-orange-600";
      case 9:
        return "bg-red-700";
      case 10:
        return "bg-red-600";
      case 11:
        return "bg-gray-700";
      default:
        return "bg-gray-700";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        {t("statut")} <ChevronDown className="text-white w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("filterStatut")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Array.from({ length: 12 }, (_, i) => (
          <DropdownMenuItem
            key={i}
            onClick={() => handleOrderStateChange(i)}
            className="text-xs"
          >
            {i === 0
              ? tStatus("Draft")
              : i === 1
              ? tStatus("Pending")
              : i === 2
              ? tStatus("In_Progress")
              : i === 3
              ? tStatus("Validated")
              : i === 4
              ? tStatus("Being_Processed")
              : i === 5
              ? tStatus("Completed")
              : i === 6
              ? tStatus("Awaiting_Approval")
              : i === 7
              ? tStatus("Ongoing")
              : i === 8
              ? tStatus("Partially_Validated")
              : i === 9
              ? tStatus("Expired")
              : i === 10
              ? tStatus("Rejected")
              : i === 11
              ? tStatus("Cancelled")
              : "Unknown"}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleOrderStateChange(99)}>
          {t("Tous")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderStateFilter;
