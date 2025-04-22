"use client";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CircleAlert, DollarSign, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { preventNonNumericInput } from "@/lib/utils";

const formSchema = z.object({
  newFaceValue: z.number(),
});

const UpdateFaceValue = ({ securityId }: { securityId: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslations("FormPassationOrdre");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newFaceValue: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitting(true);

    const requestData = {
      newPrice: Number(data.newFaceValue || 0),
      stockId: securityId,
    };
    try {
      const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/upload-rates`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.user.token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      window.location.reload();
      toast({
        variant: "success",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CheckIcon size={40} />
            <span className="first-letter:capitalize text-xs">
              {t("bulletinSoumis")}
            </span>
          </div>
        ),
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        action: (
          <div className="w-full flex gap-2">
            <CircleAlert size={40} />
            <span className="first-letter:capitalize text-xs">
              {t("erreur")}
            </span>
          </div>
        ),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>{t("updateFaceValue")}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>
          <div className="flex items-center justify-center">
            <DollarSign className="h-16 w-16 text-secondary my-4" />
          </div>
          <div className="text-xl font-semibold text-center text-primary">
            {t("updateFaceValue")}
          </div>
        </DialogTitle>
        <DialogHeader>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full mx-auto pt-4 z-10"
              >
                <FormField
                  control={form.control}
                  name="newFaceValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newFaceValue")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterNewFaceValue")}
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => {
                            const value = Math.max(
                              1,
                              parseInt(e.target.value) || 0
                            );
                            field.onChange(value);
                          }}
                          onKeyDown={preventNonNumericInput}
                        />
                      </FormControl>
                      <FormDescription>{t("majdesc")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-gray-100 px-4 rounded-md flex justify-center items-center cursor-pointer"
                  >
                    {t("retour")}
                  </button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex gap-2"
                  >
                    {t("send")}
                    {submitting && <Loader2 className="animate-spin" />}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFaceValue;
