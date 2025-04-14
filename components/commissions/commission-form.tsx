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
import { useTranslations } from "next-intl";

interface CommissionFormProps {
  commission: Commission | null;
  onSave: (commission: Commission) => void;
  onCancel: () => void;
}

export default function CommissionForm({
  commission,
  onSave,
  onCancel,
}: CommissionFormProps) {
  const t = useTranslations("CommissionForm");

  const formSchema = z.object({
    loiDeFrais: z.string().min(1, t("feeRuleRequired")),
    marche: z.string().min(1, t("marketRequired")),
    libelle: z.string().min(1, t("nameRequired")),
    code: z.string().min(1, t("codeRequired")),
    titreType: z.enum(["action", "obligation"]).optional(),
    commissionType: z.enum(["fixed", "percentage", "tiered"]),
    commissionValue: z.number().min(0, t("valueMustBePositive")),
    commissionSGBV: z.number().min(0, t("valueMustBePositive")).optional(),
    tva: z.number().min(0, t("vatMustBePositive")).max(100, t("vatMax")),
    irgType1: z.number().min(0, t("irgMustBePositive")).max(100, t("irgMax")),
    irgType2: z.number().min(0, t("irgMustBePositive")).max(100, t("irgMax")),
  });

  const [commissionType, setCommissionType] = useState<string>(
    commission?.commissionType || "percentage"
  );
  const [tiers, setTiers] = useState<CommissionTier[]>(commission?.tiers || []);
  const [titreType, setTitreType] = useState<
    "action" | "obligation" | undefined
  >(commission?.titreType);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loiDeFrais: commission?.loiDeFrais || "",
      marche: commission?.marche || "",
      libelle: commission?.libelle || "",
      code: commission?.code || "",
      titreType: commission?.titreType,
      commissionType:
        (commission?.commissionType as "fixed" | "percentage" | "tiered") ||
        "percentage",
      commissionValue: commission?.commissionValue || 0,
      commissionSGBV:
        commission?.commissionSGBV ||
        (titreType === "action" ? 0.15 : titreType === "obligation" ? 0.1 : 0),
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
        titreType: commission.titreType,
        commissionType: commission.commissionType as
          | "fixed"
          | "percentage"
          | "tiered",
        commissionValue: commission.commissionValue,
        commissionSGBV: commission.commissionSGBV,
        tva: commission.tva,
        irgType1: commission.irgType1,
        irgType2: commission.irgType2,
      });
      setCommissionType(commission.commissionType);
      setTiers(commission.tiers || []);
      setTitreType(commission.titreType);
    }
  }, [commission, form]);

  useEffect(() => {
    if (titreType === "action") {
      form.setValue("commissionSGBV", 0.15);
    } else if (titreType === "obligation") {
      form.setValue("commissionSGBV", 0.1);
    }
  }, [titreType, form]);

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
                <FormLabel>{t("feeRule")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterFeeRule")} {...field} />
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
                <FormLabel>{t("market")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterMarket")} {...field} />
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
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterName")} {...field} />
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
                <FormLabel>{t("code")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterCode")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="titreType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("securityType")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setTitreType(value as "action" | "obligation");
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectSecurityType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="action">{t("stock")}</SelectItem>
                    <SelectItem value="obligation">{t("bond")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commissionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("commissionType")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setCommissionType(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCommissionType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">{t("fixed")}</SelectItem>
                    <SelectItem value="percentage">
                      {t("percentage")}
                    </SelectItem>
                    <SelectItem value="tiered">{t("tiered")}</SelectItem>
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
                  <FormLabel>{t("commissionValue")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        commissionType === "fixed"
                          ? t("enterFixedAmount")
                          : t("enterPercentage")
                      }
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : parseFloat(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {commissionType === "fixed"
                      ? t("fixedAmountDescription")
                      : t("percentageDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="commissionSGBV"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("commissionSGBV")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={t("enterSGBVPercentage")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : parseFloat(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormDescription>{t("sgbvDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tva"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("vat")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("enterVAT")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : parseFloat(e.target.value)
                      )
                    }
                  />
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
                <FormLabel>{t("irgType1")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("enterIRG")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : parseFloat(e.target.value)
                      )
                    }
                  />
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
                <FormLabel>{t("irgType2")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("enterIRG")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : parseFloat(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {commissionType === "tiered" && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {t("commissionTiers")}
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTier}
                  >
                    <Plus className="h-4 w-4 mr-2" /> {t("addTier")}
                  </Button>
                </div>

                {tiers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {t("noTiersAdded")}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tiers.map((tier, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border p-4 rounded-md"
                      >
                        <div>
                          <FormLabel
                            className="text-sm font-normal"
                            htmlFor={`tier-min-${index}`}
                          >
                            {t("minAmount")}
                          </FormLabel>
                          <Input
                            id={`tier-min-${index}`}
                            type="number"
                            value={tier.minAmount}
                            onChange={(e) =>
                              handleTierChange(
                                index,
                                "minAmount",
                                e.target.value
                              )
                            }
                            placeholder={t("enterMinAmount")}
                          />
                        </div>
                        <div>
                          <FormLabel
                            className="text-sm font-normal"
                            htmlFor={`tier-max-${index}`}
                          >
                            {t("maxAmount")}
                          </FormLabel>
                          <Input
                            id={`tier-max-${index}`}
                            type="number"
                            value={
                              tier.maxAmount === null ? "" : tier.maxAmount
                            }
                            onChange={(e) =>
                              handleTierChange(
                                index,
                                "maxAmount",
                                e.target.value
                              )
                            }
                            placeholder={t("enterMaxAmount")}
                          />
                        </div>
                        <div>
                          <FormLabel
                            className="text-sm font-normal"
                            htmlFor={`tier-value-${index}`}
                          >
                            {t("commissionPercentage")}
                          </FormLabel>
                          <Input
                            id={`tier-value-${index}`}
                            type="number"
                            value={tier.value}
                            onChange={(e) =>
                              handleTierChange(index, "value", e.target.value)
                            }
                            placeholder={t("enterPercentage")}
                          />
                        </div>
                        <div className="flex items-end justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTier(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("remove")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("save")}</Button>
        </div>
      </form>
    </Form>
  );
}
