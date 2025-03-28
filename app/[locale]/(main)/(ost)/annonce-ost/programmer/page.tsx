"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

// Algerian market securities
const algeriansecurities = [
  { label: "Biopharm", value: "biopharm" },
  { label: "Alliance Assurances", value: "alliance" },
  { label: "Saidal", value: "saidal" },
  { label: "AOM Invest", value: "aom" },
  { label: "EGH El Aurassi", value: "egh" },
];

export default function OperationsSurTitres() {
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState({
    dateOperation: undefined,
    dateDebut: undefined,
    dateFin: undefined,
    dateRep: undefined,
    dateValeurPaiement: undefined,
    rappel: undefined,
  });

  const form = useForm({
    defaultValues: {
      titrePrincipal: "",
      evenement: "",
      descriptionOst: "",
      typeOst: "",
      titrePrincipalField: "",
      titreResultat: "",
      actionAnc: "",
      nelleAction: "",
      montantUnitaire: "",
      montantBrut: "",
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-8 p-4 pb-8 border-b">
        Programmer une Annonce d'OST
      </h1>

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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? algeriansecurities.find(
                                (security) => security.value === field.value
                              )?.label
                            : "Sélectionner un titre"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[calc(100%+100px)] p-0"
                      align="start"
                    >
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Rechercher un titre..."
                          className="h-9"
                        />
                        <CommandEmpty>Aucun titre trouvé.</CommandEmpty>
                        <CommandGroup>
                          {algeriansecurities?.map((security) => (
                            <CommandItem
                              key={security.value}
                              value={security.value}
                              onSelect={(currentValue) => {
                                field.onChange(
                                  currentValue === field.value
                                    ? ""
                                    : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {security.label}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  field.value === security.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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

            <FormField
              control={form.control}
              name="typeOst"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Type d'OST</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dividendes">
                        Versement de dividendes
                      </SelectItem>
                      <SelectItem value="droits_de_garde">
                        Prélèvement des droits de garde
                      </SelectItem>
                      <SelectItem value="coupon">Paiement de coupon</SelectItem>
                      <SelectItem value="remboursement">
                        Remboursement d'obligation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Row 3 */}
            <FormItem>
              <FormLabel className="text-gray-700">Date de début</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                        !dates.dateDebut && "text-muted-foreground"
                      )}
                    >
                      {dates.dateDebut ? (
                        format(dates.dateDebut, "P", { locale: fr })
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
                    selected={dates.dateDebut}
                    onSelect={(date) => handleDateChange("dateDebut", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            <FormItem>
              <FormLabel className="text-gray-700">Date fin</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                        !dates.dateFin && "text-muted-foreground"
                      )}
                    >
                      {dates.dateFin ? (
                        format(dates.dateFin, "P", { locale: fr })
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
                    selected={dates.dateFin}
                    onSelect={(date) => handleDateChange("dateFin", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            {/* Row 4 */}
            <FormItem>
              <FormLabel className="text-gray-700">Répetition</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                        !dates.dateRep && "text-muted-foreground"
                      )}
                    >
                      {dates.dateRep ? (
                        format(dates.dateRep, "P", { locale: fr })
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
                    selected={dates.dateRep}
                    onSelect={(date) => handleDateChange("dateRep", date)}
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

            <FormItem>
              <FormLabel className="text-gray-700">Rappel</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                        !dates.rappel && "text-muted-foreground"
                      )}
                    >
                      {dates.rappel ? (
                        format(dates.rappel, "P", { locale: fr })
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
                    selected={dates.rappel}
                    onSelect={(date) => handleDateChange("rappel", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            <FormField
              control={form.control}
              name="titrePrincipalField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Titre Principal
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
              name="titreResultat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Titre Résultat
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

            {/* Row 6 */}
            <FormField
              control={form.control}
              name="actionAnc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Action anc</FormLabel>
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
              name="nelleAction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nelle Action</FormLabel>
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

            {/* Row 7 */}
            <FormField
              control={form.control}
              name="montantUnitaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Montant unitaire
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
              name="montantBrut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Montant Brut</FormLabel>
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
            <Button type="submit" className="w-96">
              Valider
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
