"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTranslations } from "next-intl";
import {
  List,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  FileText,
} from "lucide-react";
import { Order } from "@/lib/interfaces";
import { useState } from "react";
import { useSession } from "next-auth/react";

// These are the direct component imports rather than importing from the modules
// This avoids any potential circular dependencies
interface ValidateTotalProps {
  ordreId: string;
  quantity: number;
}

interface EchouerOrdreProps {
  ordreId: string;
}

interface ValiderPartProps {
  ordreId: string;
}

interface BulletinProps {
  createdOrdreId: string;
  ispayedWithCard: boolean;
  page: string;
}

interface SupprProps {
  titreId: string;
}

export default function OrdreDrawer({
  titreId,
  orderData,
  isSouscription,
}: {
  titreId: string;
  orderData: Order;
  isSouscription: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("mesOrdres");
  const session = useSession();

  // Handle print for individual souscription
  const handlePrintSouscription = () => {
    // For now, we'll just open the sample PDF file
    window.open("/ordre-achat-opv_action-cpa_15012024.pdf", "_blank");
  };

  // For now, show buttons based on status only, ignoring roles
  const renderActionButtons = () => {
    return (
      <div className="flex gap-2">
        {/* Status-based buttons */}
        {renderStatusBasedButtons()}

        {/* Print button for souscriptions */}
        {isSouscription && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white ml-2"
            onClick={handlePrintSouscription}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        )}
      </div>
    );
  };

  // Render buttons based on order status
  const renderStatusBasedButtons = () => {
    // Show action buttons based on status only
    switch (orderData.orderstatus) {
      case 0: // Draft
        return (
          <>
            <Button className="bg-primary text-white">Soumettre</Button>
            <Button variant="destructive">Supprimer</Button>
          </>
        );

      case 1: // Pending (waiting for agency_first_approver)
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Valider
            </Button>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          </>
        );

      case 2: // In Progress (waiting for agency_final_approver)
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Valider Totalement
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <AlertCircle className="mr-2 h-4 w-4" />
              Valider Partiellement
            </Button>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          </>
        );

      case 3: // Validated (waiting for tcc_first_approver)
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Valider
            </Button>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          </>
        );

      case 4: // Being Processed (waiting for tcc_final_approver)
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Valider Totalement
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <AlertCircle className="mr-2 h-4 w-4" />
              Valider Partiellement
            </Button>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          </>
        );

      case 5: // Completed (waiting for iob_order_executor)
        return <Button className="bg-primary text-white">Exécuter</Button>;

      case 6: // Awaiting Approval (waiting for iob_result_submitter)
        return (
          <Button className="bg-primary text-white">Soumettre Résultats</Button>
        );

      // Add other statuses as needed

      default:
        // For any other status, show generic buttons
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approuver
            </Button>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          </>
        );
    }
  };

  const renderSouscriptionDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Visa COSOB</p>
          <p>{orderData.visaCosob}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Code ISIN</p>
          <p>{orderData.isinCode}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">BDL</p>
          <p>{orderData.bdl}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Quantité</p>
          <p>{orderData.quantity}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Date d'émission</p>
          <p>{new Date(orderData.emissionDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Nombre de titres</p>
          <p>{orderData.totalShares?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Commission</p>
          <p>{orderData.commission}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Montant Net</p>
          <p>{orderData.netAmount}</p>
        </div>
      </div>
    </div>
  );

  const renderOrdreDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Visa COSOB</p>
          <p>{orderData.visaCosob}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Code ISIN</p>
          <p>{orderData.isinCode}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">MST</p>
          <p>{orderData.mst}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            Type de transaction
          </p>
          <p
            className={
              orderData.orderdirection === 1 ? "text-green-600" : "text-red-600"
            }
          >
            {orderData.orderdirection === 1 ? t("achat") : t("vente")}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Quantité</p>
          <p>{orderData.quantity}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            Instruction d'ordre par prix
          </p>
          <p>{orderData.priceInstruction}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            Instruction d'ordre par temps
          </p>
          <p>{orderData.timeInstruction}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Date de validité</p>
          <p>{new Date(orderData.validityDate || "").toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Date d'émission</p>
          <p>{new Date(orderData.emissionDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Nombre d'actions</p>
          <p>{orderData.totalShares?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Montant Brut</p>
          <p>{orderData.grossAmount}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Commission</p>
          <p>{orderData.commission}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Montant Net</p>
          <p>{orderData.netAmount}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <List className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>
              {isSouscription ? t("souscriptionDetails") : t("ordreDetails")}
            </DrawerTitle>
            <DrawerDescription>
              {isSouscription
                ? t("souscriptionDetailsDescription")
                : t("ordreDetailsDescription")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {isSouscription
              ? renderSouscriptionDetails()
              : renderOrdreDetails()}

            {/* Display order status */}
            <div className="mt-4 p-2 bg-gray-100 rounded-md">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div
                className={`mt-1 px-2 py-1 rounded-md text-white text-xs inline-block w-fit ${
                  orderData.orderstatus === 0
                    ? "bg-gray-600"
                    : orderData.orderstatus === 1
                    ? "bg-yellow-600"
                    : orderData.orderstatus === 2
                    ? "bg-secondary"
                    : orderData.orderstatus === 3
                    ? "bg-green-600"
                    : orderData.orderstatus === 4
                    ? "bg-purple-600"
                    : orderData.orderstatus === 5
                    ? "bg-teal-600"
                    : orderData.orderstatus === 6
                    ? "bg-orange-600"
                    : orderData.orderstatus === 7
                    ? "bg-indigo-600"
                    : orderData.orderstatus === 8
                    ? "bg-orange-600"
                    : orderData.orderstatus === 9
                    ? "bg-red-700"
                    : orderData.orderstatus === 10
                    ? "bg-red-600"
                    : orderData.orderstatus === 11
                    ? "bg-gray-700"
                    : "bg-gray-600"
                }`}
              >
                {orderData.orderstatus === 0
                  ? "Brouillon"
                  : orderData.orderstatus === 1
                  ? "En attente"
                  : orderData.orderstatus === 2
                  ? "En cours"
                  : orderData.orderstatus === 3
                  ? "Validé"
                  : orderData.orderstatus === 4
                  ? "En traitement"
                  : orderData.orderstatus === 5
                  ? "Complété"
                  : orderData.orderstatus === 6
                  ? "En attente d'approbation"
                  : orderData.orderstatus === 7
                  ? "En exécution"
                  : orderData.orderstatus === 8
                  ? "Partiellement validé"
                  : orderData.orderstatus === 9
                  ? "Expiré"
                  : orderData.orderstatus === 10
                  ? "Rejeté"
                  : orderData.orderstatus === 11
                  ? "Annulé"
                  : "Inconnu"}
              </div>
            </div>
          </div>
          <DrawerFooter className="border-t pt-4">
            <div className="flex justify-between items-center">
              <DrawerClose asChild>
                <Button variant="outline">{t("close")}</Button>
              </DrawerClose>
              {renderActionButtons()}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
