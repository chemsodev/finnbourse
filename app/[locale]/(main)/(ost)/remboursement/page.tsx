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

export default function OperationsForm() {
  const [dates, setDates] = useState({
    dateExecution: undefined,
    dateOperation: undefined,
    dateValeurPaiement: undefined,
    dateArrete: undefined,
  });

  const form = useForm({
    defaultValues: {
      titrePrincipal: "",
      referenceOst: "",
      evenement: "primaire-secondaire",
      descriptionOst: "",
      typeOst: "",
      titrePrincipalField: "",
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

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8 pb-8 border-b">
          <h1 className="text-3xl font-bold text-secondary">
            programmer un Paiement Droit de garde
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div>
                <FormField
                  control={form.control}
                  name="titrePrincipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Selection du titre principal
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 border-gray-200">
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
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="referenceOst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Reference de l'OST
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 border-gray-200">
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
              </div>

              <div className="md:col-span-1">
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
                          <SelectTrigger className="bg-gray-400 text-white border-gray-400">
                            <SelectValue placeholder="Primaire / Secondaire" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="primaire">Primaire</SelectItem>
                          <SelectItem value="secondaire">Secondaire</SelectItem>
                          <SelectItem value="primaire-secondaire">
                            Primaire / Secondaire
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2 */}
              <div>
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
                          className="bg-gray-50 border-gray-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="typeOst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Type d'OST
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 border-gray-200">
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
              </div>
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          "w-full pl-3 text-left font-normal bg-gray-50 border-gray-200",
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
                  Date d'operation
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-gray-50 border-gray-200",
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
                      onSelect={(date) =>
                        handleDateChange("dateOperation", date)
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
                          "w-full pl-3 text-left font-normal bg-gray-50 border-gray-200",
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
                <FormLabel className="text-gray-700">Date d'arrêté</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-gray-50 border-gray-200",
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
            </div>

            {/* Titre and Prix Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="bg-gray-50 border-gray-200"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prixUnitaireNet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Prix unitaire Net
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="bg-gray-50 border-gray-200"
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
                      className="bg-gray-50 border-gray-200 min-h-[100px]"
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
                Cancel
              </Button>
              <Button type="submit">Valider</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
