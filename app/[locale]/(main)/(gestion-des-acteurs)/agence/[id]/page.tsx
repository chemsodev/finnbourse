"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { agencyData } from "@/lib/exportables";
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

export default function AgencyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const t = useTranslations("AgencyDetailsPage");
  const id = Number.parseInt(params.id);

  // Find the agency with the matching ID
  const agency = agencyData.find((a) => a.id === id);

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t("agencyNotFound")}
          </h1>
          <Button onClick={() => router.push("/agence")}>
            {t("backToList")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md shadow-inner bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/agence")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{t("backToList")}</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              {agency.libAgence}
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
                      {t("codeAgence")}
                    </p>
                    <p className="text-base">{agency.agenceCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("codeBanque")}
                    </p>
                    <p className="text-base">{agency.codeBanque || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("libelleAgence")}
                  </p>
                  <p className="text-base">{agency.libAgence}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("codeVille")}
                    </p>
                    <p className="text-base">{agency.codeVille}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("regionAgence")}
                    </p>
                    <p className="text-base">{agency.regionAgence || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("orderDe")}
                    </p>
                    <p className="text-base">{agency.ordreDe}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("parDefault")}
                    </p>
                    <p className="text-base">{agency.parDefault}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("compensation")}
                    </p>
                    <p className="text-base">{agency.compensation}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("codeBC")}
                  </p>
                  <p className="text-base">{agency.codeBC || "-"}</p>
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
                  <p className="text-base">{agency.addresse || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("postalCode")}
                    </p>
                    <p className="text-base">{agency.codePostal || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("phone1")}
                    </p>
                    <p className="text-base">{agency.telephone1 || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("phone2")}
                    </p>
                    <p className="text-base">{agency.telephone2 || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("email")}
                    </p>
                    <p className="text-base">{agency.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("fax")}
                    </p>
                    <p className="text-base">{agency.fax || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("telex")}
                  </p>
                  <p className="text-base">{agency.telex || "-"}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {t("manager")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("name")}
                    </p>
                    <p className="text-base">{agency.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("firstName")}
                    </p>
                    <p className="text-base">{agency.prenom}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("function")}
                  </p>
                  <p className="text-base">{agency.fonction || "-"}</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("correspondent")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("correspondentName")}
                    </p>
                    <p className="text-base">
                      {agency.nomCorrespondant || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("correspondentFirstName")}
                    </p>
                    <p className="text-base">
                      {agency.prenomCorrespondant || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("comment")}
              </h2>
              <div>
                <p className="text-base">
                  {agency.commentaire || t("noComment")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Users Section */}
      <Card className="border-none m-4 p-2">
        <h2 className="text-xl font-semibold m-4">{t("assignedUsers")}</h2>
        <div className="overflow-x-auto m-4 rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>{t("name")}</TableHead>
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
                <TableCell>Négociateur</TableCell>
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
                <TableCell>Négociateur</TableCell>
                <TableCell className="text-gray-500">
                  {t("consultation")}
                </TableCell>
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
