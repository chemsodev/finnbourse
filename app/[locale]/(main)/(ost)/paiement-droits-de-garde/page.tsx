"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { getDroitsGarde, deleteDroitsGarde } from "@/lib/droits-garde-service";
import type { DroitsGarde } from "./schema";
import Loading from "@/components/ui/loading";

export default function PaiementDroitsGardePage() {
  const router = useRouter();
  const t = useTranslations("PaiementDroitsDeGarde");
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<DroitsGarde | null>(
    null
  );
  const [payments, setPayments] = useState<DroitsGarde[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch payments on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getDroitsGarde();
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

  // Filter payments based on search query
  const filteredPayments = payments.filter(
    (payment) =>
      payment.titrePrincipal
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.referenceost.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClick = () => {
    router.push("/paiement-droits-de-garde/nouveau");
  };

  const handleEditClick = (payment: DroitsGarde) => {
    router.push(`/paiement-droits-de-garde/${payment.id}`);
  };

  const handleDeleteClick = (payment: DroitsGarde) => {
    setSelectedPayment(payment);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPayment) return;

    try {
      await deleteDroitsGarde(selectedPayment.id);
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
      setSelectedPayment(null);
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
                {t("descriptionOST")}
              </TableHead>
              <TableHead className="text-primary-foreground font-medium">
                {t("dateExecution")}
              </TableHead>
              <TableHead className="text-primary-foreground font-medium w-[120px]">
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment, index) => (
              <TableRow
                key={payment.id}
                className={index % 2 === 1 ? "bg-gray-100" : ""}
              >
                <TableCell>{payment.titrePrincipal}</TableCell>
                <TableCell>{payment.referenceost}</TableCell>
                <TableCell>{payment.descriptionOst}</TableCell>
                <TableCell>
                  {format(payment.dateExecution, "dd/MM/yyyy", { locale: fr })}
                </TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
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
