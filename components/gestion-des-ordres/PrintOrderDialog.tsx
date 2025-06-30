"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
// Removed GraphQL dependencies - now using static data
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
// import { LIST_ORDERS_QUERY_ONE_ORDER } from "@/graphql/queries";
import { formatDate } from "@/lib/utils";
import { Loader2, FileText, Printer } from "lucide-react";
import RateLimitReached from "../RateLimitReached";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";

interface PrintOrderDialogProps {
  children: React.ReactNode;
  titreId: string;
}

// Define a type for the order response
interface OrderResponse {
  listOrdersExtended: any[];
}

export default function PrintOrderDialog({
  children,
  titreId,
}: PrintOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const t = useTranslations("OrdreDrawer");
  const tStatus = useTranslations("status");
  const printRef = useRef<HTMLDivElement>(null);

  const fetchOrderData = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with REST API call
      // const result = await fetchGraphQLClient<OrderResponse>(
      //   LIST_ORDERS_QUERY_ONE_ORDER,
      //   {
      //     orderid: titreId,
      //   }
      // );
      // setData(result.listOrdersExtended?.[0] || null);

      // Use mock data for now
      setData(null);
    } catch (error) {
      if (error === "Too many requests") {
        setError("rate-limit");
      } else {
        console.error("Error fetching order data:", error);
        setError(
          "Une erreur s'est produite lors de la récupération des données"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    documentTitle: `Ordre-${titreId.split("-").slice(0, 2).join("-")}`,
    onAfterPrint: () => {
      setOpen(false);
    },
    // @ts-ignore - the react-to-print types are not fully updated
    content: () => printRef.current,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !data) {
      fetchOrderData();
    }
  };

  // Helper function to determine if an order is from primary or secondary market
  const isPrimaryMarket = (securitytype?: string) => {
    if (!securitytype) return false;
    return [
      "empruntobligataire",
      "opv",
      "sukukmp",
      "titresparticipatifsmp",
    ].includes(securitytype);
  };

  // Determine security type name
  const getSecurityTypeName = (type: string | undefined) => {
    if (!type) return t("titre");

    switch (type) {
      case "action":
        return t("action");
      case "obligation":
        return t("obligation");
      case "sukukms":
      case "sukukmp":
        return t("sukuk");
      case "opv":
        return t("opv");
      case "titresparticipatifsmp":
      case "titresparticipatif":
        return t("titre_participatif");
      case "empruntobligataire":
        return t("emprunt_obligataire");
      default:
        return t("titre");
    }
  };

  // Format number with spaces as thousand separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Get current date in DD/MM/YYYY format
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (error === "rate-limit") return <RateLimitReached />;

  // Choose the appropriate template based on order type
  const renderPrintContent = () => {
    if (!data) return null;

    const isSubscription = isPrimaryMarket(data.securitytype);

    if (isSubscription) {
      // SOUSCRIPTION TEMPLATE (similar to mouchiri_model_souscription.pdf)
      return (
        <div className="p-4">
          <div className="print-content">
            {/* Header with Logos */}
            <div className="flex justify-between items-center mb-4">
              <div className="w-1/3">
                <Image
                  src="/LOGO.png"
                  alt="FinnBourse Logo"
                  width={120}
                  height={50}
                  priority
                />
              </div>
              <div className="text-center text-lg font-bold w-1/3">
                BULLETIN DE SOUSCRIPTION
              </div>
              <div className="w-1/3 text-right text-sm">
                Numéro: {titreId.split("-").slice(0, 2).join("-")}
                <br />
                Date: {getCurrentDate()}
              </div>
            </div>

            {/* Security Information */}
            <div className="border border-gray-300 rounded-md p-4 mb-6">
              <div className="text-center font-bold border-b pb-2 mb-3">
                TITRE SOUSCRIT: {data.securityissuer} -{" "}
                {getSecurityTypeName(data.securitytype)}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="font-semibold mb-1">Code ISIN:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.codeIsin || "DZ0000010095"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Visa COSOB:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.visaCosob || "VISA-9237"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Valeur Nominale:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {formatNumber(data.pricelimitmin)} DA
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Date d'Émission:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.dateEmission
                      ? formatDate(data.dateEmission)
                      : formatDate(data.createdat)}
                  </div>
                </div>
              </div>
            </div>

            {/* Subscriber Information */}
            <div className="border border-gray-300 rounded-md p-4 mb-6">
              <div className="text-center font-bold border-b pb-2 mb-3">
                SOUSCRIPTEUR
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="font-semibold mb-1">
                    Nom et Prénom / Raison Sociale:
                  </div>
                  <div className="border border-gray-300 rounded p-2 font-medium">
                    {data.investorid?.fullname || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Type:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.investorid?.followsbusiness === false
                      ? "Particulier"
                      : "Entreprise"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Contact:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.investorid?.email || "N/A"} |{" "}
                    {data.investorid?.phonenumber || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Statut:</div>
                  <div className="border border-gray-300 rounded p-2 font-semibold">
                    {data?.orderstatus === 0 && data?.payedWithCard
                      ? "Brouillon payé"
                      : data?.orderstatus === 0 && !data?.payedWithCard
                      ? tStatus("Draft")
                      : data?.orderstatus === 1
                      ? tStatus("Pending")
                      : data?.orderstatus === 2
                      ? tStatus("In_Progress")
                      : data?.orderstatus === 3
                      ? tStatus("Validated")
                      : data?.orderstatus === 4
                      ? tStatus("Being_Processed")
                      : data?.orderstatus === 5
                      ? tStatus("Completed")
                      : data?.orderstatus === 6
                      ? tStatus("Awaiting_Approval")
                      : data?.orderstatus === 7
                      ? tStatus("Ongoing")
                      : data?.orderstatus === 8
                      ? tStatus("Partially_Validated")
                      : data?.orderstatus === 9
                      ? tStatus("Expired")
                      : data?.orderstatus === 10
                      ? tStatus("Rejected")
                      : data?.orderstatus === 11
                      ? tStatus("Cancelled")
                      : "Unknown"}
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="border border-gray-300 rounded-md p-4 mb-6">
              <div className="text-center font-bold border-b pb-2 mb-3">
                DÉTAILS DE LA SOUSCRIPTION
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="font-semibold mb-1">Nombre de Titres:</div>
                  <div className="border border-gray-300 rounded p-2 text-center font-bold">
                    {formatNumber(data.quantity)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Valeur Nominale:</div>
                  <div className="border border-gray-300 rounded p-2 text-center">
                    {formatNumber(data.pricelimitmin)} DA
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Montant Total:</div>
                  <div className="border border-gray-300 rounded p-2 text-center font-bold">
                    {formatNumber(data.quantity * data.pricelimitmin)} DA
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Commission:</div>
                  <div className="border border-gray-300 rounded p-2 text-center">
                    {data.commission || "Pas de Commission"}
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="border-t border-gray-300 pt-2">
                <div className="text-center mb-16">
                  Signature du Souscripteur
                </div>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="text-center mb-16">
                  Signature et cachet de l'IOB
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-center text-gray-500">
              <p>
                Ce document est généré automatiquement par FINNBOURSE et fait
                office de bulletin de souscription.
              </p>
              <p>
                Pour toute information complémentaire, veuillez contacter votre
                Intermédiaire en Opérations de Bourse.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // REGULAR ORDER TEMPLATE (tabular format)
      return (
        <div className="p-4">
          <div className="print-content">
            {/* Header with Logo */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <Image
                  src="/LOGO.png"
                  alt="FinnBourse Logo"
                  width={120}
                  height={50}
                  priority
                />
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">ORDRE DE BOURSE</div>
                <div className="text-sm text-gray-500">
                  ID: {titreId.split("-").slice(0, 2).join("-")}
                </div>
                <div className="text-sm">Date: {getCurrentDate()}</div>
              </div>
            </div>

            {/* Order Information */}
            <div className="border border-gray-300 rounded-md p-4 mb-6">
              <div className="text-center font-bold border-b pb-2 mb-4">
                INFORMATIONS GÉNÉRALES
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-1">Titre:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.securityissuer} -{" "}
                    {getSecurityTypeName(data.securitytype)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Code:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.securityid?.code || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Direction:</div>
                  <div
                    className={`border border-gray-300 rounded p-2 font-medium ${
                      data.orderdirection === 1
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {data.orderdirection === 1 ? "ACHAT" : "VENTE"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Statut:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data?.orderstatus === 0 && data?.payedWithCard
                      ? "Brouillon payé"
                      : data?.orderstatus === 0 && !data?.payedWithCard
                      ? tStatus("Draft")
                      : data?.orderstatus === 1
                      ? tStatus("Pending")
                      : data?.orderstatus === 2
                      ? tStatus("In_Progress")
                      : data?.orderstatus === 3
                      ? tStatus("Validated")
                      : data?.orderstatus === 4
                      ? tStatus("Being_Processed")
                      : data?.orderstatus === 5
                      ? tStatus("Completed")
                      : data?.orderstatus === 6
                      ? tStatus("Awaiting_Approval")
                      : data?.orderstatus === 7
                      ? tStatus("Ongoing")
                      : data?.orderstatus === 8
                      ? tStatus("Partially_Validated")
                      : data?.orderstatus === 9
                      ? tStatus("Expired")
                      : data?.orderstatus === 10
                      ? tStatus("Rejected")
                      : data?.orderstatus === 11
                      ? tStatus("Cancelled")
                      : "Unknown"}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="border border-gray-300 rounded-md p-4 mb-6">
              <div className="text-center font-bold border-b pb-2 mb-4">
                DÉTAILS DE L'ORDRE
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-1">Quantité:</div>
                  <div className="border border-gray-300 rounded p-2 text-center font-bold">
                    {formatNumber(data.quantity)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Prix:</div>
                  <div className="border border-gray-300 rounded p-2 text-center">
                    {formatNumber(data.pricelimitmin)} DA
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Instruction de Prix:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.instructionOrdrePrix ||
                      data.ordertypetwo ||
                      "Au mieux"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">
                    Instruction de Temps:
                  </div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.instructionOrdreTemps ||
                      data.ordertypeone ||
                      "À durée limitée"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Validité:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.duration || "N/A"}{" "}
                    {data.duration > 1 ? "jours" : "jour"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Date de l'ordre:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {formatDate(data.orderdate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="border border-gray-300 rounded-md p-4 mb-6">
              <div className="text-center font-bold border-b pb-2 mb-4">
                INFORMATIONS DU CLIENT
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-1">Client:</div>
                  <div className="border border-gray-300 rounded p-2 font-medium">
                    {data.investorid?.fullname || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Type:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.investorid?.followsbusiness === false
                      ? "Particulier"
                      : "Entreprise"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Email:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.investorid?.email || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Téléphone:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.investorid?.phonenumber || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Broker Information */}
            <div className="border border-gray-300 rounded-md p-4 mb-6">
              <div className="text-center font-bold border-b pb-2 mb-4">
                INFORMATIONS DU NÉGOCIATEUR
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-1">Négociateur:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.negotiatorid?.fullname || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Contact:</div>
                  <div className="border border-gray-300 rounded p-2">
                    {data.negotiatorid?.email || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="border-t border-gray-300 pt-2">
                <div className="text-center mb-16">Signature du Client</div>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="text-center mb-16">
                  Signature et cachet de l'IOB
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-center text-gray-500">
              <p>
                Ce document est généré automatiquement par FINNBOURSE et fait
                office d'ordre de bourse.
              </p>
              <p>
                Pour toute information complémentaire, veuillez contacter votre
                Intermédiaire en Opérations de Bourse.
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isPrimaryMarket(data?.securitytype)
              ? "Imprimer le Bulletin de Souscription"
              : "Imprimer l'Ordre de Bourse"}
          </DialogTitle>
          <DialogDescription>
            {isPrimaryMarket(data?.securitytype)
              ? "Prévisualisation du bulletin de souscription. Cliquez sur Imprimer pour générer le document."
              : "Prévisualisation de l'ordre de bourse. Cliquez sur Imprimer pour générer le document."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
            <div ref={printRef} className="bg-white p-4 min-h-[600px]">
              {renderPrintContent()}
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">{error}</div>
        ) : null}

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="gap-2"
          >
            <FileText className="h-4 w-4" /> Annuler
          </Button>
          <Button
            onClick={handlePrint}
            disabled={loading || !data}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <Printer className="h-4 w-4" /> Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
