import { ModifierOperationsSurTitres } from "@/components/operations-sur-titres/modifier-operations-sur-titres"

export const metadata = {
  title: "Opérations Sur Titres | Modifier",
  description: "Modifier une annonce d'opération sur titres",
}

export default function ModifierOstPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <ModifierOperationsSurTitres id={params.id} />
    </div>
  )
}

