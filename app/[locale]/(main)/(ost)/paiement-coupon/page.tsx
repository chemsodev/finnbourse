"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCouponPayments, deleteCouponPayment } from "@/lib/coupon-service";
import type { CouponPayment } from "./schema";

export default function CouponPaymentPage() {
  const t = useTranslations("PaiementCoupon");
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<CouponPayment | null>(
    null
  );
  const [payments, setPayments] = useState<CouponPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getCouponPayments();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast({
          title: t("error"),
          description: t("errorFetchingPayments"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [toast, t]);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.titrePrincipal
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.referenceost.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedPayment) return;
    try {
      await deleteCouponPayment(selectedPayment.id);
      setPayments((prev) => prev.filter((p) => p.id !== selectedPayment.id));
      toast({
        title: t("success"),
        description: t("deleteSuccess"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast({
        title: t("error"),
        description: t("deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">{t("title")}</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={t("search")}
              className="pl-10 w-64 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push("/paiement-coupon/nouveau")}
          >
            <Plus className="h-4 w-4" /> {t("add")}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="text-primary-foreground">
                {t("selectionTitrePrincipal")}
              </TableHead>
              <TableHead className="text-primary-foreground">
                {t("referenceOST")}
              </TableHead>
              <TableHead className="text-primary-foreground">
                {t("evenement")}
              </TableHead>
              <TableHead className="text-primary-foreground">
                {t("dateExecution")}
              </TableHead>
              <TableHead className="text-primary-foreground">
                {t("montantUnitaireNet")}
              </TableHead>
              <TableHead className="text-primary-foreground w-[120px]">
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.titrePrincipal}</TableCell>
                <TableCell>{payment.referenceost}</TableCell>
                <TableCell>
                  {payment.evenement === "primaire"
                    ? t("primaire")
                    : t("secondaire")}
                </TableCell>
                <TableCell>
                  {format(new Date(payment.dateExecution), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{payment.prixUnitaireNet}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/paiement-coupon/${payment.id}`)
                      }
                    >
                      <Pencil className="h-4 w-4 text-amber-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPayment(payment);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmation")}{" "}
              <span className="font-medium">
                {selectedPayment?.titrePrincipal}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
