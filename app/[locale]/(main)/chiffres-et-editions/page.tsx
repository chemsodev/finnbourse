import { Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChiffresEtEditions() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-secondary">
        Chiffres et Editions
      </h1>

      {/* Filters Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm mb-8 border bg-primary cursor-pointer hover:scale-105 transition-transform duration-500 ease-in-out">
        <h2 className="text-2xl font-medium mb-4 text-white">Période :</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="debut" className="text-sm font-medium text-white">
              Début:
            </label>
            <Input id="debut" type="date" placeholder="Date de début" />
          </div>
          <div className="space-y-2">
            <label htmlFor="fin" className="text-sm font-medium text-white">
              Fin:
            </label>
            <Input id="fin" type="date" placeholder="Date de fin" />
          </div>
          <div className="space-y-2">
            <label htmlFor="isin" className="text-sm font-medium text-white">
              Code ISIN:
            </label>
            <Select>
              <SelectTrigger id="isin">
                <SelectValue placeholder="Sélectionner un code ISIN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les codes</SelectItem>
                <SelectItem value="fr0000123456">FR0000123456</SelectItem>
                <SelectItem value="us0378331005">US0378331005</SelectItem>
                <SelectItem value="de0007664039">DE0007664039</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Portefeuilles Titres Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-secondary">
          Portefeuilles Titres
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <OptionCard
            title="Historique"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Portefeuilles par Clients"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Historique PRTF par IOB"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Portefeuille"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
        </div>
      </section>

      {/* Pointage A/C Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-secondary">
          Pointage A/C
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <OptionCard
            title="Soldes Compte Propre / Titre"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Solde Avoirs Clientèle/ Titre"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Soldes Avoirs Globaux"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Nbre Operations/ Titres Boursiers"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
        </div>
      </section>

      {/* Transactions Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-secondary">
          Transactions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <OptionCard
            title="Historique des Transactions par titre"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Details Operations/ JC et par séance"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Transactions IOB / Titre"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
        </div>
      </section>

      {/* Autres Activités Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b text-secondary">
          Autres Activités
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <OptionCard
            title="Relevé de compte client/ Agence"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Listing des comptes titre ouverts"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Avoir Agence/ Titre"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="Les Type des Clients"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
          <OptionCard
            title="NB Comptes Titres/Type Client"
            icon={<Folder className="h-6 w-6 text-primary" />}
          />
        </div>
      </section>
    </div>
  );
}

function OptionCard({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <Card className="hover:border-primary/50 transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
        <div className="bg-primary/10 p-4 rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <p className="text-sm font-medium">{title}</p>
      </CardContent>
    </Card>
  );
}
