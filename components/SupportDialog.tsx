"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PiChatsCircleLight } from "react-icons/pi";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { useTranslations } from "next-intl";
import { CheckIcon, CircleAlert, Loader2 } from "lucide-react";
import { useState } from "react";
import { CREATE_SUPPORT_MESSAGE } from "@/graphql/mutations";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
const formSchema = z.object({
  probleme: z.string(),
  description: z.string(),
});

export function SupportDialog() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const t = useTranslations("SupportDialog");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useLocale();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await fetchGraphQL<string>(CREATE_SUPPORT_MESSAGE, {
        userid: userId,
        question: values.probleme,
        description: values.description,
        answer: "",
        state: 0,
        language: locale,
        ispublished: false,
      });
      form.reset();
      setOpen(false);

      toast({
        variant: "success",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CheckIcon size={40} />
            <div className="first-letter:capitalize text-xs">
              <span>{t("success")}</span>
              <div>{t("successDescription")}</div>
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CircleAlert size={40} />
            <div className="first-letter:capitalize text-xs">
              <span>{t("pleaseTryAgain")}</span>
              <div>{t("failedToSubmitTheForm")}</div>
            </div>
          </div>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="md:w-[55%] bg-primary text-white py-4 px-8 rounded-md capitalize md:text-xl mt-10 font-bold flex justify-start gap-4 items-center">
          <PiChatsCircleLight size={35} />
          <div className="flex w-full justify-center">{t("titre")}</div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex justify-center">
          <DialogTitle className="flex flex-col justify-center items-center">
            <Image src="/favicon.ico" width={90} height={90} alt="logo" />
            <div className="text-center font-bold text-xl text-primary">
              {t("titre")}
            </div>
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-3xl mx-auto pt-10"
              >
                <FormField
                  control={form.control}
                  name="probleme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("probleme")}</FormLabel>
                      <FormControl>
                        <Input type="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{t("descriptionPlus")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {t("envoyer")}
                    {isSubmitting && (
                      <Loader2 size={20} className="animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
