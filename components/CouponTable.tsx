import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

interface CouponSchedule {
  year: number;
  rate: string;
}

interface CouponTableProps {
  couponschedule: CouponSchedule[];
  facevalue: number;
}

const CouponTable: React.FC<CouponTableProps> = ({
  couponschedule,
  facevalue,
}) => {
  const t = useTranslations("CouponTable");
  return (
    <>
      <div className=" text-gray-400 capitalize">{t("couponRatePerYear")}:</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">{t("year")}</TableHead>
            <TableHead className="text-xs">{t("couponRate")}</TableHead>
            <TableHead className=" text-xs">{t("annualCoupon")}</TableHead>
            <TableHead className=" text-xs">{t("cumulativeCoupons")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {couponschedule?.map((coupon) => (
            <TableRow key={coupon.year}>
              <TableCell className="font-medium">{coupon.year}</TableCell>
              <TableCell>{coupon.rate} %</TableCell>
              <TableCell>
                {(facevalue * parseFloat(coupon.rate)) / 100}
              </TableCell>
              <TableCell>
                {(facevalue * parseFloat(coupon.rate) * coupon.year) / 100}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CouponTable;
