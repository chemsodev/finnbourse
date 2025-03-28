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

const UsersTableSkeleton = async () => {
  const t = await getTranslations("clients");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>{t("nom")}</TableHead>
          <TableHead>{t("type")}</TableHead>
          <TableHead>{t("email")}</TableHead>
          <TableHead>{t("telephone")}</TableHead>
          <TableHead>{t("role")}</TableHead>
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

export default UsersTableSkeleton;
