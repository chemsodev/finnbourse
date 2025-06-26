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
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  CheckIcon,
  CircleAlert,
  CircleHelp,
  Loader2,
  PencilLine,
  Plus,
  SendHorizonal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
// import { CREATE_SUPPORT_MESSAGE, DELETE_QUESTION } from "@/graphql/mutations";
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { TbSquareRoundedPlus } from "react-icons/tb";
const formSchema = z.object({
  qst: z.string(),
  answer: z.string(),
});

export default function Question({
  type,
  question,
  qstId,
  answer,
}: {
  type: string;
  question?: string;
  qstId?: any;
  answer?: string;
}) {
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();
  const locale = useLocale();
  const userId = (session?.data?.user as any)?.id;
  const t = useTranslations("SupportDialog");
  const [open, setOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qst: type === "modification" ? question : "",
      answer: type === "modification" ? answer : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // TODO: Replace with REST API call
      // await fetchGraphQLClient<string>(CREATE_SUPPORT_MESSAGE, {
      //   userid: userId,
      //   question: values.qst,
      //   description: "",
      //   answer: values.answer,
      //   state: 1,
      //   language: locale,
      //   ispublished: true,
      // });

      console.log("Support message creation simulated");

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
      router.refresh();
      setIsSubmitting(false);
    }
  }

  const onEdit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const updatedData: any = {};

      if (data.qst !== question) {
        updatedData.question = data.qst;
      }
      if (data.answer !== answer) {
        updatedData.answer = data.answer;
      }

      if (Object.keys(updatedData).length > 0) {
        // TODO: Replace with REST API call
        // await fetchGraphQLClient<String>(
        //   `
        // mutation updateQas {
        // updateQas(
        //   where: { id: ${qstId} }
        //   data: {
        //     ${
        //       updatedData.question
        //         ? `question: { set: "${updatedData.question}" },`
        //         : ""
        //     }
        //     ${updatedData.answer ? `answer: { set: "${updatedData.answer}" },` : ""}
        //   }
        // ) {
        //   id
        // }
        // }
        // `
        // );

        console.log("QAS update simulated");
      }

      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });

      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with REST API call
      // await fetchGraphQLClient<string>(DELETE_QUESTION, {
      //   id: qstId,
      // });

      console.log("Question deletion simulated");
      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      setOpen(false);
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: t("pleaseTryAgain"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "ajout" ? (
          <Button className="flex gap-2 items-center">
            {t("ajouterQst")} <TbSquareRoundedPlus size={20} />
          </Button>
        ) : (
          <div className="flex gap-2 p-3 border-b cursor-pointer hover:bg-gray-50 ltr:text-left rtl:text-right items-center">
            <div className="text-primary mx-4">
              <CircleHelp size={40} />
            </div>
            <div className="flex flex-col ">
              <div className="font-semibold text-primary">{question}</div>
            </div>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex justify-center">
          <DialogTitle className="flex flex-col justify-center items-center">
            <Image src="/favicon.ico" width={90} height={90} alt="logo" />
            <div className="text-center font-bold text-xl text-primary">
              {type === "ajout"
                ? t("publierQstDescription")
                : t("modifierQstDescription")}
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
                  name="qst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("qst")}</FormLabel>
                      <FormControl>
                        <Input type="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("reponse")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      {type === "ajout" && (
                        <FormDescription>
                          {t("descriptionPlus")}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-4">
                  {type === "modification" && (
                    <Button
                      disabled={isSubmitting}
                      variant="destructive"
                      onClick={handleDeleteQuestion}
                      className="flex gap-2 items-center"
                    >
                      <Trash2 size={20} />
                      {t("supprimer")}
                      {isSubmitting && (
                        <Loader2 size={20} className="animate-spin" />
                      )}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex gap-2 items-center ${
                      type === "modification" &&
                      "bg-orange-400 hover:bg-orange-300"
                    }`}
                  >
                    {type === "ajout" ? t("ajouter") : t("modifier")}
                    {type === "ajout" ? (
                      <SendHorizonal size={20} />
                    ) : (
                      <PencilLine size={20} />
                    )}
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
