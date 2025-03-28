import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";
import { useTranslations } from "next-intl";
import TabSearch from "./TabSearch";
import { Button } from "react-day-picker";

const TitresTableSkeleton = () => {
  const t = useTranslations("TitresTable");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className=" border rounded-md bg-white h-9 w-72 "></div>
        <button className="w-28 h-10 bg-primary shadow text-white rounded-md"></button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("logo")}</TableHead>
              <TableHead>{t("titre")}</TableHead>
              <TableHead>{t("ouverture")}</TableHead>
              <TableHead>{t("cloture")}</TableHead>
              <TableHead>{t("variation")}</TableHead>
              <TableHead>{t("plusInfo")}</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TitresTableSkeleton;
