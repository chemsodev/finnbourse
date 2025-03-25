"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { PasswordInput } from "../ui/password-input";

const FormInscriptionParticulier = () => {
  const submissionLink = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Inscription");
  const { toast } = useToast();
  const formSchema = z
    .object({
      email: z.string().email(),
      nom: z.string(),
      telephone: z.string().min(10, t("telephoneLength")).max(10),

      password: z
        .string()
        .min(8, t("passwordLength"))
        .regex(/(?=.*[a-z])/, t("passwordLowercase"))
        .regex(/(?=.*[A-Z])/, t("passwordUppercase"))
        .regex(/(?=.*[0-9])/, t("passwordNumber"))
        .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, t("passwordSpecial")),
      confirmPassword: z.string().min(8, t("confirmPasswordLength")),
    })
    .refine(
      (data) => {
        return data.password === data.confirmPassword;
      },
      {
        message: "Les mots de passe doivent correspondre.",
        path: ["confirmPassword"],
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      nom: "",
      telephone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formattedData = {
        fullName: data.nom,
        email: data.email,
        phoneNumber: data.telephone,
        password: data.password,
        follows_business: false,
      };

      const response = await fetch(submissionLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      router.push("/login");
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex justify-between gap-10">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem className="w-60">
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("email")}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => {
                  return (
                    <FormItem className="w-60">
                      <FormLabel>{t("telephone")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("telephone")}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => {
                  return (
                    <FormItem className="w-60">
                      <FormLabel>{t("nom")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("nom")} type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-6 gap-10">
            <div className=" w-60">
              {" "}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <FormLabel htmlFor="password">
                        {t("motDePasse")}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput
                        id="password"
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" w-60">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <FormLabel htmlFor="confirmPassword">
                        {t("confirmPassword")}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput
                        id="confirmPassword"
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-between mt-12">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex gap-2"
            >
              {t("creerVotreCompte")}
              {isLoading ? (
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-200 animate-spin fill-gray-400"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                <ArrowRight className="hidden group-hover:block text-white " />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormInscriptionParticulier;
