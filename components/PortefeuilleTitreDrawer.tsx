import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { invoices } from "@/lib/exportables";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PortefeuilleTitreDrawer {
  titreId: string;
}

const PortefeuilleTitreDrawer = ({ titreId }: PortefeuilleTitreDrawer) => {
  const t = useTranslations("PortefeuilleTitreDrawer");

  return (
    <Sheet>
      <SheetTrigger className="capitalize rounded-md bg-primary px-4 py-1 hover:bg-primary/90 shadow text-white">
        Info
      </SheetTrigger>
      <SheetContent className="overflow-scroll">
        <SheetHeader>
          <SheetTitle className="bg-gray-50 text-center text-primary font-bold text-2xl uppercase pt-10 flex gap-4 justify-center items-center ">
            <div className="w-12 h-12 bg-primary rounded-md"></div>
            <div>titre</div>
          </SheetTitle>
        </SheetHeader>
        <SheetDescription className="p-6 flex flex-col justify-between h-5/6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="text-gray-500">{t("titre")}</div>
              <div className="text-black font-semibold">Saidal</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("code")}</div>
              <div className="text-black font-semibold">SAI</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("type")}</div>
              <div className="text-black font-semibold">Titre Capital</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("denomination")}</div>
              <div className="text-black font-semibold">
                GROUPE Industriel SAIDAL
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("initiateur")}</div>
              <div className="text-black font-semibold">
                Holding Public Chimie Pharmacie
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("capital")}</div>
              <div className="text-black font-semibold">2.500.000.000DA</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("qte")}</div>
              <div className="text-black font-semibold">1.804.511 actions</div>
            </div>
            <div className="flex items-baseline">
              <div className="text-xs text-black font-semibold">
                {t("tarifs")}
              </div>
              <div className="border-b border-gray-100 w-full ml-4 mr-2"></div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("ouverture")}</div>
              <div className="text-black font-semibold">450,00 DA</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("cloture")}</div>
              <div className="text-black font-semibold">NC</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">{t("variation")}</div>
              <div className="text-black font-semibold">0,00 %</div>
            </div>
            <div className="flex items-baseline">
              <div className="text-xs text-black font-semibold w-full">
                {t("historique")}
              </div>
              <div className="border-b border-gray-100 w-full mr-2"></div>
            </div>
            <div className="border border-gray-100 rounded-md p-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>{t("sens")}</TableHead>
                    <TableHead>{t("quantite")}</TableHead>
                    <TableHead className="text-right">{t("prix")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">12/02/2024</TableCell>
                    <TableCell>{t("achat")}</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell className="text-right">250.00 DA</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1/02/2024</TableCell>
                    <TableCell>{t("vente")}</TableCell>
                    <TableCell>21</TableCell>
                    <TableCell className="text-right">290.00 DA</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default PortefeuilleTitreDrawer;
