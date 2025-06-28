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
  TrendingUp,
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handlePrintSouscription}
          >
            <Printer className="mr-2 h-4 w-4" />
            {t("print")}
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
            <Button className="bg-primary text-white hover:bg-primary/90">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("submit")}
            </Button>
            <Button variant="destructive" className="hover:bg-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              {t("delete")}
            </Button>
          </>
        );

      case 1: // Pending (waiting for agency_first_approver)
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("validate")}
            </Button>
            <Button variant="destructive" className="hover:bg-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              {t("reject")}
            </Button>
          </>
        );

      case 2: // In Progress (waiting for agency_final_approver)
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("validateTotally")}
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <AlertCircle className="mr-2 h-4 w-4" />
              {t("validatePartially")}
            </Button>
            <Button variant="destructive" className="hover:bg-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              {t("reject")}
            </Button>
          </>
        );

      case 3: // Validated (waiting for tcc_first_approver)
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("validate")}
            </Button>
            <Button variant="destructive" className="hover:bg-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              {t("reject")}
            </Button>
          </>
        );

      case 4: // Being Processed (waiting for tcc_final_approver)
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("validateTotally")}
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <AlertCircle className="mr-2 h-4 w-4" />
              {t("validatePartially")}
            </Button>
            <Button variant="destructive" className="hover:bg-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              {t("reject")}
            </Button>
          </>
        );

      case 5: // Completed (waiting for iob_order_executor)
        return (
          <>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <TrendingUp className="mr-2 h-4 w-4" />
              {t("execute")}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("complete")}
            </Button>
          </>
        );

      case 6: // Awaiting Approval (waiting for iob_result_submitter)
        return (
          <Button className="bg-primary text-white hover:bg-primary/90">
            <FileText className="mr-2 h-4 w-4" />
            {t("submitResults")}
          </Button>
        );

      // Add other statuses as needed

      default:
        // For any other status, show generic buttons
        return (
          <>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("approve")}
            </Button>
            <Button variant="destructive" className="hover:bg-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              {t("reject")}
            </Button>
          </>
        );
    }
  };

  const renderSouscriptionDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("visaCosob")}</p>
          <p className="font-semibold">{orderData.visaCosob}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("isinCode")}</p>
          <p className="font-semibold">{orderData.isinCode}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("bdl")}</p>
          <p className="font-semibold">{orderData.bdl}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("quantity")}</p>
          <p className="font-semibold">{orderData.quantity?.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("emissionDate")}</p>
          <p className="font-semibold">{new Date(orderData.emissionDate).toLocaleDateString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("totalShares")}</p>
          <p className="font-semibold">{orderData.totalShares?.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("commission")}</p>
          <p className="font-semibold">{orderData.commission}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("netAmount")}</p>
          <p className="font-semibold">{orderData.netAmount}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("orderStatus")}</p>
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
              ? t("draft")
              : orderData.orderstatus === 1
              ? t("pending")
              : orderData.orderstatus === 2
              ? t("inProgress")
              : orderData.orderstatus === 3
              ? t("validated")
              : orderData.orderstatus === 4
              ? t("beingProcessed")
              : orderData.orderstatus === 5
              ? t("completed")
              : orderData.orderstatus === 6
              ? t("awaitingApproval")
              : orderData.orderstatus === 7
              ? t("inExecution")
              : orderData.orderstatus === 8
              ? t("partiallyValidated")
              : orderData.orderstatus === 9
              ? t("expired")
              : orderData.orderstatus === 10
              ? t("rejected")
              : orderData.orderstatus === 11
              ? t("cancelled")
              : t("unknown")}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrdreDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("visaCosob")}</p>
          <p className="font-semibold">{orderData.visaCosob}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("isinCode")}</p>
          <p className="font-semibold">{orderData.isinCode}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("mst")}</p>
          <p className="font-semibold">{orderData.mst}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">
            {t("transactionType")}
          </p>
          <p
            className={`font-semibold ${
              orderData.orderdirection === 1 ? "text-green-600" : "text-red-600"
            }`}
          >
            {orderData.orderdirection === 1 ? t("achat") : t("vente")}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("quantity")}</p>
          <p className="font-semibold">{orderData.quantity?.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">
            {t("priceInstruction")}
          </p>
          <p className="font-semibold">{orderData.priceInstruction}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">
            {t("timeInstruction")}
          </p>
          <p className="font-semibold">{orderData.timeInstruction}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("validityDate")}</p>
          <p className="font-semibold">{new Date(orderData.validityDate || "").toLocaleDateString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("emissionDate")}</p>
          <p className="font-semibold">{new Date(orderData.emissionDate).toLocaleDateString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("numberOfShares")}</p>
          <p className="font-semibold">{orderData.totalShares?.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("grossAmount")}</p>
          <p className="font-semibold">{orderData.grossAmount}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("commission")}</p>
          <p className="font-semibold">{orderData.commission}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("netAmount")}</p>
          <p className="font-semibold">{orderData.netAmount}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-500">{t("orderStatus")}</p>
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
              ? t("draft")
              : orderData.orderstatus === 1
              ? t("pending")
              : orderData.orderstatus === 2
              ? t("inProgress")
              : orderData.orderstatus === 3
              ? t("validated")
              : orderData.orderstatus === 4
              ? t("beingProcessed")
              : orderData.orderstatus === 5
              ? t("completed")
              : orderData.orderstatus === 6
              ? t("awaitingApproval")
              : orderData.orderstatus === 7
              ? t("inExecution")
              : orderData.orderstatus === 8
              ? t("partiallyValidated")
              : orderData.orderstatus === 9
              ? t("expired")
              : orderData.orderstatus === 10
              ? t("rejected")
              : orderData.orderstatus === 11
              ? t("cancelled")
              : t("unknown")}
          </div>
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
            <DrawerTitle className="text-2xl text-center font-bold">
              {isSouscription ? t("souscriptionDetails") : t("ordreDetails")}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              {isSouscription
                ? t("souscriptionDetailsDescription")
                : t("ordreDetailsDescription")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {isSouscription
              ? renderSouscriptionDetails()
              : renderOrdreDetails()}
          </div>
          <DrawerFooter className="border-t pt-4">
            <div className="flex justify-between items-center">
              <DrawerClose asChild>
                <Button variant="outline" className="hover:bg-gray-100">
                  {t("close")}
                </Button>
              </DrawerClose>
              {renderActionButtons()}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
