"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/routing";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FloatingShapes from "@/components/FloatingShapes";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckIcon } from "lucide-react";
import { useState } from "react";

// Schema for email validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function MotDePasseOublie() {
  const t = useTranslations("MotDePasseOublie");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-validation-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      router.push("/congrats");

      toast({
        variant: "success",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CheckIcon size={40} />
            <span className="first-letter:capitalize text-xs">
              {t("emailSentSuccessfully")}
            </span>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error sending password reset email", error);
      toast({
        variant: "destructive",
        title: t("errorSendingPasswordResetEmail"),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <FloatingShapes />
      <div className="bg-primary h-screen w-screen flex justify-center items-center">
        <div className="flex min-h-[40vh] h-full w-full items-center justify-center px-4 ">
          <Card className="mx-auto max-w-sm z-50  hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">{t("title")}</CardTitle>
              <CardDescription>{t("description")} </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid gap-4">
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel htmlFor="email">{t("email")}</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              placeholder="johndoe@mail.com"
                              type="email"
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between mt-4 gap-4">
                      <button
                        className="bg-secondary text-primary p-2 px-3 text-sm font-medium rounded-md"
                        onClick={() => router.back()}
                      >
                        {t("cancel")}
                      </button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex gap-2"
                      >
                        {t("sendResetLink")}
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
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
