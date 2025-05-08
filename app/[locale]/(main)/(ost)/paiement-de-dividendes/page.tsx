"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
import { useToast } from "@/hooks/use-toast";
import {
  getDividendPayments,
  deleteDividendPayment,
} from "@/lib/dividend-service";
import type { DividendPayment } from "./schema";
import Loading from "@/components/ui/loading";

export default function PaiementDividendePage() {
  const t = useTranslations("PaiementDividende");
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<DividendPayment | null>(null);
  const [payments, setPayments] = useState<DividendPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getDividendPayments();
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

  const handleAddClick = () => {
    router.push("/paiement-de-dividendes/nouveau");
  };

  const handleEditClick = (payment: DividendPayment) => {
    router.push(`/paiement-de-dividendes/${payment.id}`);
  };

  const handleDeleteClick = (payment: DividendPayment) => {
    setSelectedPayment(payment);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPayment) return;

    try {
      await deleteDividendPayment(selectedPayment.id);
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

  if (isLoading) {
    return <Loading className="min-h-[400px]" />;
  }

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
          <Button className="flex items-center gap-2" onClick={handleAddClick}>
            <Plus className="h-4 w-4" /> {t("add")}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="text-primary-foreground font-medium">
                {t("selectionTitrePrincipal")}
              </TableHead>
              <TableHead className="text-primary-foreground font-medium">
                {t("referenceOST")}
              </TableHead>
              <TableHead className="text-primary-foreground font-medium">
                {t("evenement")}
              </TableHead>
              <TableHead className="text-primary-foreground font-medium">
                {t("executionDate")}
              </TableHead>
              <TableHead className="text-primary-foreground font-medium">
                {t("netUnitAmount")}
              </TableHead>
              <TableHead className="text-primary-foreground font-medium w-[120px]">
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  {searchQuery ? t("noSearchResults") : t("noPayments")}
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment, index) => (
                <TableRow
                  key={payment.id}
                  className={index % 2 === 1 ? "bg-gray-100" : ""}
                >
                  <TableCell>{payment.titrePrincipal}</TableCell>
                  <TableCell>{payment.referenceost}</TableCell>
                  <TableCell>
                    {payment.evenement === "primaire"
                      ? t("primary")
                      : t("secondary")}
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
                        className="h-8 w-8 text-amber-600"
                        onClick={() => handleEditClick(payment)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteClick(payment)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t("delete")}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
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
              {t("deleteConfirmation")}
              <span className="font-medium">
                {" "}
                {selectedPayment?.titrePrincipal}
              </span>
              .
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
