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

const formSchema = z.object({
  prixValide: z.number().min(0),
});

export function ValiderTotallement({
  ordreId,
  quantity,
}: {
  quantity: number;
  ordreId: string;
}) {
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
            state: 3,
            validatedprice: values.prixValide,
            validatedQuantity: quantity,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        }
      );
      console.log("RESPONSE", response);
      if (!response.ok) {
        throw new Error("Failed to suspend user");
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
        <Button className="capitalize">{t("validerTotallement")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("validerTotallement")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogDescription className="mt-4">
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
                <Button variant="secondary">{t("annuler")}</Button>
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
