"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { accountHolderData } from "@/lib/exportables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function TeneurComptesTitresDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const t = useTranslations("TCCDetailsPage");
  const id = parseInt(params.id);

  // Find the account holder with the matching ID
  const holder = accountHolderData.find((h) => h.id === id);

  if (!holder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t("accountHolderNotFound")}
          </h1>
          <Button onClick={() => router.push("/tcc")}>{t("backToList")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/tcc")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{t("back")}</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              {holder.libelle}
            </h1>
          </div>
          <Button className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            {t("edit")}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {t("generalInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("code")}
                    </p>
                    <p className="text-base">{holder.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("type")}
                    </p>
                    <p className="text-base">{holder.typeCompte || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("label")}
                  </p>
                  <p className="text-base">{holder.libelle}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("status")}
                    </p>
                    <p className="text-base">{holder.statut}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("creationDate")}
                    </p>
                    <p className="text-base">{holder.dateCreation || "-"}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("contactInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("address")}
                  </p>
                  <p className="text-base">{holder.adresse}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("postalCode")}
                    </p>
                    <p className="text-base">{holder.codePostal}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("city")}
                    </p>
                    <p className="text-base">{holder.ville}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("country")}
                    </p>
                    <p className="text-base">{holder.pays}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("phone")}
                    </p>
                    <p className="text-base">{holder.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("email")}
                    </p>
                    <p className="text-base">{holder.email}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("primaryContact")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("lastName")}
                    </p>
                    <p className="text-base">{holder.contactNom || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("firstName")}
                    </p>
                    <p className="text-base">{holder.contactPrenom || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("phone")}
                    </p>
                    <p className="text-base">
                      {holder.contactTelephone || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("email")}
                    </p>
                    <p className="text-base">{holder.contactEmail || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {t("bankInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("swiftCode")}
                    </p>
                    <p className="text-base">{holder.swift || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("currency")}
                    </p>
                    <p className="text-base">{holder.devise || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("iban")}
                  </p>
                  <p className="text-base">{holder.iban || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("accountNumber")}
                  </p>
                  <p className="text-base">{holder.numeroCompte || "-"}</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("regulatoryInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("approvalNumber")}
                    </p>
                    <p className="text-base">{holder.numeroAgrement || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("approvalDate")}
                    </p>
                    <p className="text-base">{holder.dateAgrement || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("surveillanceAuthority")}
                  </p>
                  <p className="text-base">
                    {holder.autoriteSurveillance || "-"}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("correspondent")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("correspondentCode")}
                    </p>
                    <p className="text-base">
                      {holder.codeCorrespondant || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("correspondentName")}
                    </p>
                    <p className="text-base">
                      {holder.nomCorrespondant || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("commissions")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("fixedCommission")}
                    </p>
                    <p className="text-base">{holder.commissionFixe || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("variableCommission")}
                    </p>
                    <p className="text-base">
                      {holder.commissionVariable || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("vatRate")}
                    </p>
                    <p className="text-base">{holder.tauxTva || "-"}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("comment")}
              </h2>
              <div>
                <p className="text-base">
                  {holder.commentaire || t("noComment")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Users Section */}
      <Card className="border-none m-4 p-2">
        <h2 className="text-xl font-semibold m-4">{t("affectedUsers")}</h2>
        <div className="overflow-x-auto m-4 rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>{t("lastName")}</TableHead>
                <TableHead>{t("firstName")}</TableHead>
                <TableHead>{t("position")}</TableHead>
                <TableHead>{t("validation")}</TableHead>
                <TableHead>{t("organization")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>sagi</TableCell>
                <TableCell>salim</TableCell>
                <TableCell>DG</TableCell>
                <TableCell className="text-green-500">
                  {t("validator2")}
                </TableCell>
                <TableCell>SLIK PIS</TableCell>
                <TableCell>{t("admin")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>gadh</TableCell>
                <TableCell>mohamed</TableCell>
                <TableCell>DFC</TableCell>
                <TableCell className="text-amber-500">
                  {t("validator1")}
                </TableCell>
                <TableCell>SLIK PIS</TableCell>
                <TableCell>{t("member")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>slmi</TableCell>
                <TableCell>kadour</TableCell>
                <TableCell>{t("trader")}</TableCell>
                <TableCell>{t("initiator")}</TableCell>
                <TableCell>SLIK PIS</TableCell>
                <TableCell>{t("member")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hamid</TableCell>
                <TableCell>Mokrane</TableCell>
                <TableCell>{t("trader")}</TableCell>
                <TableCell className="text-gray-500">{t("viewOnly")}</TableCell>
                <TableCell>SLIK PIS</TableCell>
                <TableCell>{t("member")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
      <div className="h-8"></div>
    </div>
  );
}
