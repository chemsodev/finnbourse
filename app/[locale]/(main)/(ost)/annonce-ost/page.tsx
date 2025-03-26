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

export default function OperationsSurTitres() {
  const [dates, setDates] = useState({
    dateExecution: undefined,
    depuisLe: undefined,
    dateFin: undefined,
    dateArrete: undefined,
    dateRep: undefined,
    dateOperation: undefined,
    dateValeurPaiement: undefined,
    rappel: undefined,
  });

  const form = useForm({
    defaultValues: {
      titrePrincipal: "",
      referenceRost: "",
      evenement: "",
      descriptionOst: "",
      typeOst: "",
      titrePrincipalField: "",
      titreResultat: "",
      actionAnc: "",
      nelleAction: "",
      arrondi: "",
      prixUnitaireNet: "",
      prixUnitaireBrut: "",
      extra: "",
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
        Programmer une Annonce d’OST
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
              name="referenceRost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Référence de ROST
                  </FormLabel>
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
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                      <SelectItem value="type3">Type 3</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-gray-700">Date d'exécution</FormLabel>
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
                    onSelect={(date) => handleDateChange("dateExecution", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            {/* Row 3 */}
            <FormItem>
              <FormLabel className="text-gray-700">Depuis le</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                        !dates.depuisLe && "text-muted-foreground"
                      )}
                    >
                      {dates.depuisLe ? (
                        format(dates.depuisLe, "P", { locale: fr })
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
                    selected={dates.depuisLe}
                    onSelect={(date) => handleDateChange("depuisLe", date)}
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

            <FormItem>
              <FormLabel className="text-gray-700">Date d'arrêté</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                        !dates.dateArrete && "text-muted-foreground"
                      )}
                    >
                      {dates.dateArrete ? (
                        format(dates.dateArrete, "P", { locale: fr })
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
                    selected={dates.dateArrete}
                    onSelect={(date) => handleDateChange("dateArrete", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            {/* Row 4 */}
            <FormItem>
              <FormLabel className="text-gray-700">Date Rép</FormLabel>
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
              <FormLabel className="text-gray-700">Date d'Opération</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                        !dates.dateOperation && "text-muted-foreground"
                      )}
                    >
                      {dates.dateOperation ? (
                        format(dates.dateOperation, "P", { locale: fr })
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
                    selected={dates.dateOperation}
                    onSelect={(date) => handleDateChange("dateOperation", date)}
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

            {/* Row 5 */}
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

            <FormField
              control={form.control}
              name="arrondi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Arrondi</FormLabel>
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
              name="prixUnitaireNet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Prix Unitaire Net
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
              name="prixUnitaireBrut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Prix unitaire Brut
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
              name="extra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Extra</FormLabel>
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
