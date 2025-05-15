"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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

import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { preventNonNumericInput } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { LIST_ORDERS_SIMPLE } from "@/graphql/queries";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { CREATE_ORDER_MUTATION } from "@/graphql/mutations";

const formSchema = z.object({
  quantiteValidee: z.number().min(1),
  prixValide: z.number().min(0),
});

export function ValiderPartiellement({ ordreId }: { ordreId: string }) {
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("ValiderPartiellement");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Call the API to suspend the user

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/changestate`,
        {
          method: "POST",
          body: JSON.stringify({
            id: ordreId,
            state: 8,
            validatedQuantity: values.quantiteValidee,
            validatedprice: values.prixValide,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session.data?.user as any)?.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to suspend user");
      }
      let order = null;
      try {
        const data = await fetchGraphQLClient<any>(LIST_ORDERS_SIMPLE, {
          orderId: ordreId,
        });
        order = data.findUniqueOrder ?? null;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      try {
        const retrunedData = await fetchGraphQLClient<any>(
          CREATE_ORDER_MUTATION,
          {
            ordertypes: order.instructionOrdreTemps,
            orderdirection: order.typeTransaction ? 1 : 0,
            securityissuer: order.securityIssuer,
            securityid: order.selectedTitreId,
            quantity: order.quantite - values.quantiteValidee,
            pricelimitmin: order.valeurMin,
            pricelimitmax: order.valeurMax,
            validity: order.validity,
            duration: order.duration,
            orderdate: order.orderDate,
            investorid: order.investorid,
            negotiatorid: order.negotiatorId,
          }
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      router.refresh();
      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      setOpen(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="capitalize w-full">
          {t("validerPartiellement")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("titre")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogDescription className="mt-4">
              <FormField
                control={form.control}
                name="quantiteValidee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("quantiteValidee")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("quantiteValidee")}
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        }
                        onKeyDown={preventNonNumericInput}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("saisirLaQuantiteValidee")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prixValide"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>{t("prixValide")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("prixValide")}
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        }
                        onKeyDown={preventNonNumericInput}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogDescription>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">{t("annuler")}</Button>
              </DialogClose>
              <Button type="submit">
                {t("valider")}
                {isLoading && <Loader2 className="animate-spin mx-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
