import { ListeOperationsSurTitres } from "@/components/operations-sur-titres/liste-operations-sur-titres";

export const metadata = {
  title: "Opérations Sur Titres | Liste",
  description: "Liste des annonces d'opérations sur titres",
};

export default function OperationsSurTitresPage() {
  return (
    <div className="container mx-auto py-6">
      <ListeOperationsSurTitres />
    </div>
  );
}
