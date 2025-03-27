import CommissionManagement from "@/components/commissions/commission-management";
export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-secondary">
        Gestion des Commissions
      </h1>
      <CommissionManagement />
    </main>
  );
}
