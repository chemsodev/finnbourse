"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import type { Commission, CommissionTier } from "@/lib/interfaces";

interface CommissionFormProps {
  commission: Commission | null;
  onSave: (commission: Commission) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  loiDeFrais: z.string().min(1, "Loi de frais obligatoire"),
  marche: z.string().min(1, "Marché obligatoire"),
  libelle: z.string().min(1, "Libellé obligatoire"),
  code: z.string().min(1, "Code obligatoire"),
  commissionType: z.enum(["fixed", "percentage", "tiered"]),
  commissionValue: z.number().min(0, "La valeur doit être positive"),
  tva: z
    .number()
    .min(0, "La TVA doit être positive")
    .max(100, "La TVA ne peut pas dépasser 100%"),
  irgType1: z
    .number()
    .min(0, "L'IRG doit être positif")
    .max(100, "L'IRG ne peut pas dépasser 100%"),
  irgType2: z
    .number()
    .min(0, "L'IRG doit être positif")
    .max(100, "L'IRG ne peut pas dépasser 100%"),
});

export default function CommissionForm({
  commission,
  onSave,
  onCancel,
}: CommissionFormProps) {
  const [commissionType, setCommissionType] = useState<string>(
    commission?.commissionType || "percentage"
  );
  const [tiers, setTiers] = useState<CommissionTier[]>(commission?.tiers || []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loiDeFrais: commission?.loiDeFrais || "",
      marche: commission?.marche || "",
      libelle: commission?.libelle || "",
      code: commission?.code || "",
      commissionType:
        (commission?.commissionType as "fixed" | "percentage" | "tiered") ||
        "percentage",
      commissionValue: commission?.commissionValue || 0,
      tva: commission?.tva || 19,
      irgType1: commission?.irgType1 || 0,
      irgType2: commission?.irgType2 || 0,
    },
  });

  useEffect(() => {
    if (commission) {
      form.reset({
        loiDeFrais: commission.loiDeFrais,
        marche: commission.marche,
        libelle: commission.libelle,
        code: commission.code,
        commissionType: commission.commissionType as
          | "fixed"
          | "percentage"
          | "tiered",
        commissionValue: commission.commissionValue,
        tva: commission.tva,
        irgType1: commission.irgType1,
        irgType2: commission.irgType2,
      });
      setCommissionType(commission.commissionType);
      setTiers(commission.tiers || []);
    }
  }, [commission, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const savedCommission: Commission = {
      id: commission?.id || "",
      ...values,
      tiers: commissionType === "tiered" ? tiers : [],
      createdAt: commission?.createdAt || new Date().toISOString(),
    };
    onSave(savedCommission);
  };

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMinAmount = lastTier
      ? lastTier.maxAmount
        ? lastTier.maxAmount + 1
        : 0
      : 0;

    setTiers([
      ...tiers,
      { minAmount: newMinAmount, maxAmount: null, value: 0 },
    ]);
  };

  const handleRemoveTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleTierChange = (
    index: number,
    field: keyof CommissionTier,
    value: any
  ) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]:
        field === "value"
          ? Number.parseFloat(value)
          : value === ""
          ? null
          : Number.parseInt(value),
    };
    setTiers(updatedTiers);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="loiDeFrais"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loi de frais</FormLabel>
                <FormControl>
                  <Input placeholder="Saisir loi de frais" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marche"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marché</FormLabel>
                <FormControl>
                  <Input placeholder="Saisir marché" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="libelle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Libellé</FormLabel>
                <FormControl>
                  <Input placeholder="Saisir libellé" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Saisir code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commissionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de commission</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setCommissionType(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de commission" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="tiered">Par palier</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {commissionType !== "tiered" && (
            <FormField
              control={form.control}
              name="commissionValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {commissionType === "fixed"
                      ? "Montant fixe"
                      : "Pourcentage"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder={
                          commissionType === "fixed"
                            ? "Saisir montant"
                            : "Saisir pourcentage"
                        }
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value) || 0)
                        }
                      />
                      {commissionType === "percentage" && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          %
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {commissionType === "fixed"
                      ? "Saisissez le montant fixe pour cette commission"
                      : "Saisissez le taux de pourcentage pour cette commission"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="tva"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TVA (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Saisir pourcentage TVA"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      %
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="irgType1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IRG Type 1 (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Saisir pourcentage IRG Type 1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      %
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="irgType2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IRG Type 2 (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Saisir pourcentage IRG Type 2"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      %
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {commissionType === "tiered" && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Commission par paliers</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTier}
                >
                  <Plus className="mr-2 h-4 w-4" /> Ajouter palier
                </Button>
              </div>

              {tiers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun palier défini. Cliquez sur "Ajouter palier" pour créer
                  votre premier palier.
                </div>
              ) : (
                <div className="space-y-4">
                  {tiers.map((tier, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 items-center"
                    >
                      <div className="col-span-4">
                        <FormLabel className="text-xs">Montant min</FormLabel>
                        <Input
                          type="number"
                          value={tier.minAmount || ""}
                          onChange={(e) =>
                            handleTierChange(index, "minAmount", e.target.value)
                          }
                          placeholder="Montant min"
                        />
                      </div>
                      <div className="col-span-4">
                        <FormLabel className="text-xs">Montant max</FormLabel>
                        <Input
                          type="number"
                          value={tier.maxAmount === null ? "" : tier.maxAmount}
                          onChange={(e) =>
                            handleTierChange(index, "maxAmount", e.target.value)
                          }
                          placeholder="Sans limite"
                        />
                      </div>
                      <div className="col-span-3">
                        <FormLabel className="text-xs">Taux (%)</FormLabel>
                        <Input
                          type="number"
                          value={tier.value}
                          onChange={(e) =>
                            handleTierChange(index, "value", e.target.value)
                          }
                          placeholder="Taux %"
                        />
                      </div>
                      <div className="col-span-1 pt-6">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTier(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Form>
  );
}
