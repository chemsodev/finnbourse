import { TitreDetails } from "@/components/titres/TitreDetails";
import { TitreFormValues } from "@/components/titres/titreSchemaValidation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

// Mock data for testing
const getMockTitre = (id: string): TitreFormValues => ({
  id: id,
  name: "Obligations du Trésor 2024",
  issuer: "company-1",
  isinCode: "DZ000123456789",
  code: "OT2024",
  faceValue: 10000,
  quantity: 1000000,
  emissionDate: new Date("2024-01-15"),
  closingDate: new Date("2024-02-15"),
  enjoymentDate: new Date("2024-03-01"),
  maturityDate: new Date("2029-03-01"),
  marketListing: "primary",
  type: "empruntobligataire",
  status: "activated",
  capitalOperation: "ouverture",
  votingRights: false,
  dividendRate: 5.25,
  durationYears: 5,
  institutions: ["inst-1", "inst-2"],
  stockPrice: {
    price: 10250.5,
    date: new Date(),
    gap: 2.5,
  },
  paymentSchedule: [
    {
      date: new Date("2025-03-01"),
      couponRate: 5.25,
      capitalRate: 0,
    },
    {
      date: new Date("2026-03-01"),
      couponRate: 5.25,
      capitalRate: 0,
    },
    {
      date: new Date("2027-03-01"),
      couponRate: 5.25,
      capitalRate: 0,
    },
    {
      date: new Date("2028-03-01"),
      couponRate: 5.25,
      capitalRate: 0,
    },
    {
      date: new Date("2029-03-01"),
      couponRate: 5.25,
      capitalRate: 100, // Final payment includes capital
    },
  ],
});

const getMockCompanies = () => [
  { id: "company-1", name: "Banque d'Algérie" },
  { id: "company-2", name: "Sonatrach" },
  { id: "company-3", name: "Algeria Telecom" },
  { id: "company-4", name: "Air Algérie" },
];

const getMockInstitutions = () => [
  { id: "inst-1", name: "Crédit Populaire d'Algérie" },
  { id: "inst-2", name: "Banque Nationale d'Algérie" },
  { id: "inst-3", name: "BADR Bank" },
  { id: "inst-4", name: "BEA Bank" },
];

export default async function TitreDetailsPage({
  params,
}: {
  params: { id: string; type: string };
}) {
  // Simulate API calls with mock data
  const titre = getMockTitre(params.id);
  const companies = getMockCompanies();
  const institutions = getMockInstitutions();
  const t = await getTranslations("GestionDesTitres");

  if (!titre) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("ViewTitre.notFound")}
            </h2>
            <p className="text-gray-600">
              {t("ViewTitre.notFoundDescription", { id: params.id })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 motion-preset-focus motion-duration-2000">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href={`/iob-secondary-market/${params.type}`}
          className="inline-flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white  md:mt-10"
        >
          <ArrowLeft className="w-5" /> <div>{t("back")}</div>
        </Link>
        <TitreDetails
          data={titre}
          companies={companies}
          institutions={institutions}
        />
      </div>
    </div>
  );
}
