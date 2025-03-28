import { getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";

const OrdersTableSkeleton = async () => {
  const t = await getTranslations("mesOrdres");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>{t("titre")}</TableHead>
          <TableHead>{t("sens")}</TableHead>
          <TableHead>{t("quantity")}</TableHead>
          <TableHead> {t("statut")}</TableHead>
          <TableHead> {t("type")}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 8 })?.map((_, index) => (
          <TableRow key={index}>
            <TableCell className="font-semibold">
              <Skeleton className="h-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-6" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-6" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTableSkeleton;
