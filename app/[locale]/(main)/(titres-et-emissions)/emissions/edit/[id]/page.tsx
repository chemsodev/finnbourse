import { Suspense } from "react";
import EmissionForm from "../../form";

export default function EditEmissionPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EmissionForm />
    </Suspense>
  );
}
