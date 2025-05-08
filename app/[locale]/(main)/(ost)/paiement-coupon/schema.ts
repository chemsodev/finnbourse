import * as z from "zod";

export const couponPaymentSchema = z.object({
  titrePrincipal: z.string().min(1, "Le titre principal est requis"),
  referenceost: z.string().min(1, "La référence OST est requise"),
  evenement: z.string().min(1, "Le type d'événement est requis"),
  dateExecution: z.date({ required_error: "La date d'exécution est requise" }),
  dateValeurPaiement: z.date({
    required_error: "La date de valeur de paiement est requise",
  }),
  prixUnitaireNet: z.string().min(1, "Le prix unitaire net est requis"),
  descriptionOst: z.string().min(1, "La description OST est requise"),
  commentaire: z.string().optional(),
});

export type CouponPaymentFormValues = z.infer<typeof couponPaymentSchema>;

export interface CouponPayment extends CouponPaymentFormValues {
  id: number;
}
