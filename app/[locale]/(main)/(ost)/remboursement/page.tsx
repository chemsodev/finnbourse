import OperationsTable from "@/components/remboursement/operations-table";
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

export default function RemboursementPage() {
  return (
    <Suspense fallback={<Loading className="min-h-[400px]" />}>
      <OperationsTable />
    </Suspense>
  );
}
