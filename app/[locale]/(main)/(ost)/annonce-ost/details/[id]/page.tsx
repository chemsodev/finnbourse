import { DetailsOperationsSurTitres } from "@/components/operations-sur-titres/details-operations-sur-titres"

export const metadata = {
  title: "Opérations Sur Titres | Détails",
  description: "Détails d'une annonce d'opération sur titres",
}

export default function DetailsOstPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <DetailsOperationsSurTitres id={params.id} />
    </div>
  )
}

