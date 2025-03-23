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
import { Textarea } from "@/components/ui/textarea";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  CheckIcon,
  CircleAlert,
  CircleHelp,
  Loader2,
  Newspaper,
  PencilLine,
  Plus,
  SendHorizonal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  CREATE_NEWS_ARTICLE_MUTATION,
  CREATE_SUPPORT_MESSAGE,
  DELETE_NEWS_ARTICLE,
  DELETE_QUESTION,
} from "@/graphql/mutations";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { TbSquareRoundedPlus } from "react-icons/tb";
import { NewsArticle } from "@/lib/interfaces";
const formSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export default function NewsEdit({
  type,
  article,
}: {
  type: string;
  article?: NewsArticle;
}) {
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();
  const locale = useLocale();
  const userId = session?.data?.user?.id;
  const t = useTranslations("AddNews");
  const [open, setOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: type === "modification" ? article?.title : "",
      content: type === "modification" ? article?.content : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await fetchGraphQL<string>(CREATE_NEWS_ARTICLE_MUTATION, {
        writerid: userId,
        ispublished: true,
        title: values.title,
        content: values.content,
        language: locale,
      });
      form.reset();
      setOpen(false);
      window.location.reload();
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

  const onEdit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const updatedData: any = {};

      if (data.title !== article?.title) {
        updatedData.title = data.title;
      }
      if (data.content !== article?.content) {
        updatedData.content = data.content;
      }

      if (Object.keys(updatedData).length > 0) {
        await fetchGraphQL<String>(
          `
    mutation updateNewsArticle {
    updateNewsArticle(
      where: { id: "${article?.id}" }
      data: {
        ${updatedData.title ? `title: { set: "${updatedData.title}" },` : ""}
        ${
          updatedData.content
            ? `content: { set: "${updatedData.content}" },`
            : ""
        }
       
      }
    ) {
      id
    }
  }`
        );
      }

      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });

      form.reset();
      window.location.reload();
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
      await fetchGraphQL<string>(DELETE_NEWS_ARTICLE, {
        id: article?.id,
      });
      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: t("pleaseTryAgain"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "ajout" ? (
          <Button className="flex gap-2 items-center">
            {t("ajouterNews")} <TbSquareRoundedPlus size={20} />
          </Button>
        ) : (
          <div className="flex gap-2 p-3 border-b cursor-pointer hover:bg-gray-50 ltr:text-left rtl:text-right items-center">
            <div className="text-primary mx-4">
              <Newspaper size={40} />
            </div>
            <div className="flex flex-col ">
              <div className="font-semibold text-primary">{article?.title}</div>
              <div className="text-gray-400">{article?.content}</div>
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
                ? t("publierNewsDescription")
                : t("modifierNewsDescription")}
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title")}</FormLabel>
                      <FormControl>
                        <Input type="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("content")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

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
                  {type === "modification" && (
                    <Button
                      type="button"
                      onClick={form.handleSubmit(onEdit)}
                      disabled={isSubmitting}
                      className={`flex gap-2 items-center ${
                        type === "modification" &&
                        "bg-orange-400 hover:bg-orange-300"
                      }`}
                    >
                      {t("modifier")}
                      <PencilLine size={20} />
                      {isSubmitting && (
                        <Loader2 size={20} className="animate-spin" />
                      )}
                    </Button>
                  )}
                  {type === "ajout" && (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex gap-2 items-center `}
                    >
                      {t("ajout")}

                      {isSubmitting && (
                        <Loader2 size={20} className="animate-spin" />
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
