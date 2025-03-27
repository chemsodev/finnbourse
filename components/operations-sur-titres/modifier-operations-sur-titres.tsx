"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ArrowLeft } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  getOstAnnouncementById,
  updateOstAnnouncement,
} from "@/lib/ost-service";
import { toast } from "@/hooks/use-toast";

// Algerian market securities
const algeriansecurities = [
  { label: "Biopharm", value: "biopharm" },
  { label: "Alliance Assurances", value: "alliance" },
  { label: "Saidal", value: "saidal" },
  { label: "AOM Invest", value: "aom" },
  { label: "EGH El Aurassi", value: "egh" },
];

interface ModifierOperationsSurTitresProps {
  id: string;
}

interface DatesState {
  dateOperation: Date | undefined;
  dateDebut: Date | undefined;
  dateFin: Date | undefined;
  dateRep: Date | undefined;
  dateValeurPaiement: Date | undefined;
  rappel: Date | undefined;
}

export function ModifierOperationsSurTitres({
  id,
}: ModifierOperationsSurTitresProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dates, setDates] = useState<DatesState>({
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

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setIsLoading(true);
        const data = await getOstAnnouncementById(id);
        if (data) {
          // Set form values
          form.reset({
            titrePrincipal: data.titrePrincipal,
            evenement: data.evenement,
            descriptionOst: data.descriptionOst,
            typeOst: data.typeOst,
            titrePrincipalField: data.titrePrincipalField,
            titreResultat: data.titreResultat,
            actionAnc: data.actionAnc,
            nelleAction: data.nelleAction,
            montantUnitaire: data.montantUnitaire,
            montantBrut: data.montantBrut,
            commentaire: data.commentaire,
          });

          // Set dates
          setDates({
            dateOperation: new Date(data.dateOperation),
            dateDebut: new Date(data.dateDebut),
            dateFin: new Date(data.dateFin),
            dateRep: data.dateRep ? new Date(data.dateRep) : undefined,
            dateValeurPaiement: data.dateValeurPaiement
              ? new Date(data.dateValeurPaiement)
              : undefined,
            rappel: data.rappel ? new Date(data.rappel) : undefined,
          });
        } else {
          toast({
            title: "Erreur",
            description: "Annonce introuvable",
            variant: "destructive",
          });
          router.push("/annonce-ost");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'annonce OST:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'annonce",
          variant: "destructive",
        });
        router.push("/annonce-ost");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id, router, form]);

  const handleDateChange = (field: any, value: any) => {
    setDates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async (data: any) => {
    // Validate required dates
    if (!dates.dateOperation || !dates.dateDebut || !dates.dateFin) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir toutes les dates obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Combine form data with dates
      const ostData = {
        ...data,
        dateOperation: dates.dateOperation,
        dateDebut: dates.dateDebut,
        dateFin: dates.dateFin,
        dateRep: dates.dateRep,
        dateValeurPaiement: dates.dateValeurPaiement,
        rappel: dates.rappel,
      };

      await updateOstAnnouncement(id, ostData);

      toast({
        title: "Succès",
        description: "L'annonce d'OST a été mise à jour avec succès",
      });

      // Redirect to the list page
      router.push("/annonce-ost");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'annonce:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la mise à jour de l'annonce",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/annonce-ost");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8 p-4 pb-8 border-b">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-secondary">
          Modifier une Annonce d'OST
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form fields similar to the creation form */}
            {/* ... */}

            {/* Just showing a few key fields for brevity */}
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
                        <CommandList>
                          <CommandEmpty>Aucun titre trouvé.</CommandEmpty>
                          <CommandGroup>
                            {algeriansecurities.map((security) => (
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
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

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
              className="w-40"
              onClick={handleBack}
            >
              Annuler
            </Button>
            <Button type="submit" className="w-40" disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
