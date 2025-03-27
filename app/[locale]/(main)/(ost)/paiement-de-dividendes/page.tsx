"use client";

import { useState } from "react";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

export default function ProgrammerPaiementDividende() {
  const [dates, setDates] = useState({
    dateExecution: undefined,
    dateValeurPaiement: undefined,
  });

  const form = useForm({
    defaultValues: {
      titrePrincipal: "",
      referenceost: "",
      evenement: "",
      descriptionOst: "",
      prixUnitaireNet: "",
      commentaire: "",
    },
  });

  const handleDateChange = (field: any, value: any) => {
    setDates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = (data: any) => {
    console.log({ ...data, ...dates });
  };

  const algerianSecurities = [
    "Sonatrach Bonds",
    "Air Algérie",
    "Sonelgaz",
    "Cevital",
    "Groupe ETRHB",
    "Société Générale Algérie",
    "BDL (Banque de Développement Local)",
    "CNEP-Banque",
    "BNA (Banque Nationale d'Algérie)",
    "Saidal",
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8 pb-4 border-b">
          <h1 className="text-3xl font-bold text-secondary">
            Programmer un Paiement de Dividende
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <FormField
                control={form.control}
                name="titrePrincipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Sélection du titre principal
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Sélectionner un titre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {algerianSecurities.map((security) => (
                          <SelectItem key={security} value={security}>
                            {security}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Référence d'OST
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evenement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Evènement</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Primaire/ Secondaire" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primaire">Primaire</SelectItem>
                        <SelectItem value="secondaire">Secondaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Row 2 */}
              <FormField
                control={form.control}
                name="descriptionOst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Description de l'OST
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-gray-700">
                  Date d'exécution
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                          !dates.dateExecution && "text-muted-foreground"
                        )}
                      >
                        {dates.dateExecution ? (
                          format(dates.dateExecution, "P", { locale: fr })
                        ) : (
                          <span></span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dates.dateExecution}
                      onSelect={(date) =>
                        handleDateChange("dateExecution", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700">
                  Date Valeur/Paiement
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                          !dates.dateValeurPaiement && "text-muted-foreground"
                        )}
                      >
                        {dates.dateValeurPaiement ? (
                          format(dates.dateValeurPaiement, "P", { locale: fr })
                        ) : (
                          <span></span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dates.dateValeurPaiement}
                      onSelect={(date) =>
                        handleDateChange("dateValeurPaiement", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>

              {/* Row 4 */}
              <FormField
                control={form.control}
                name="prixUnitaireNet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Montant unitaire Net
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Commentaire */}
            <FormField
              control={form.control}
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Commentaire</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      {...field}
                      className="border-gray-300 focus:border-blue-500 min-h-[100px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-none px-6"
              >
                Annuler
              </Button>

              <Button type="submit">Valider</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
