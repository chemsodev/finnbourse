"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useRouter } from "@/i18n/routing";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";
import FloatingShapes from "@/components/FloatingShapes";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Login() {
  const t = useTranslations("Login");
  const { toast } = useToast();
  const [error, setError] = useState<string>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resendTimer, setResendTimer] = useState<number | null>(90);

  const handleResendCode = () => {
    setResendTimer(90); // Set the timer to 10 seconds
    // Add logic for resending the email here
  };

  useEffect(() => {
    if (resendTimer === null) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(timer);
          return null;
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [resendTimer]);
  const formSchema = z.object({
    email: z.string().email({ message: t("invalidEmail") }),
    password: z
      .string()
      .min(6, { message: t("passwordMinLength") })
      .regex(/[a-zA-Z0-9]/, { message: t("passwordAlphanumeric") }),
    twoFactorCode: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/twofactorauth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }
      );

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t("wrongEmailOrPassword"));
      } else {
        await response.json();
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("failedToSubmitTheForm"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  async function onSubmitWith2FA(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        twoFactorCode: values.twoFactorCode,
        redirect: false,
      });

      setLoading(false);
      router.push("/");
      if (result?.error) {
        setError(result.error);
        console.error("Login error:", result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("failedToSubmitTheForm"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  return (
    <>
      <FloatingShapes />

      <div className="bg-primary h-screen w-screen flex justify-center items-center">
        <Card className="mx-auto z-50 md:w-[70%] px-6 hover:scale-105 transition-all duration-300 border-none">
          <CardHeader className="flex justify-center items-center">
            <Image src="/favicon.ico" alt="logo" width={100} height={100} />
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-20">
            <div className="flex flex-col justify-center items-center md:w-1/2">
              <div className=" text-xl font-semibold text-primary mb-4  ">
                {t("bienvenue")} Invest
                <span className="text-orange-500"> Market</span>.
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 w-full p-4"
                >
                  <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogContent className="w-fit">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-center font-bold text-xl text-primary">
                          {t("enterTheVerificationCode")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="mt-8">
                            {t("verificationCodeSent")}
                          </div>
                          <div>
                            <FormField
                              control={form.control}
                              name="twoFactorCode"
                              render={({ field }) => (
                                <FormItem className="grid gap-2 mt-4 w-full justify-center">
                                  <FormControl>
                                    <InputOTP
                                      type="text"
                                      maxLength={6}
                                      {...field}
                                    >
                                      <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                      </InputOTPGroup>
                                      <InputOTPSeparator />
                                      <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                      </InputOTPGroup>
                                    </InputOTP>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button
                          type="submit"
                          variant="secondary"
                          className="capitalize"
                          onClick={() => {
                            handleResendCode(); // Start the timer
                            form.handleSubmit(onSubmit)(); // Submit the main form
                          }}
                          disabled={resendTimer !== null}
                        >
                          {resendTimer !== null
                            ? `${t("sendEmailAgain")} (${resendTimer}s)`
                            : t("sendEmailAgain")}
                        </Button>
                        <Button
                          type="submit"
                          onClick={() => {
                            form.handleSubmit(onSubmitWith2FA)();
                            setDialogOpen(false);
                          }}
                          className="capitalize"
                        >
                          {t("validate")}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <FormLabel htmlFor="password">
                            {t("password")}
                          </FormLabel>
                          <Link
                            href="/motdepasseoublie"
                            className="ml-auto inline-block text-sm underline"
                          >
                            {t("forgotPassword")}
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && (
                    <div className="text-red-500 text-center">
                      {error && error}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <button
                      disabled={loading}
                      type="submit"
                      className={`rounded-md py-1 text-white shadow-md ${
                        loading ? "bg-primary/90 cursor-wait" : "bg-primary"
                      }`}
                    >
                      {loading ? (
                        <div
                          role="status"
                          className="flex gap-2 justify-center items-center"
                        >
                          {t("submit")}
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
                          <span className="sr-only">Chargement...</span>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center group gap-2">
                          {t("submit")}
                          <ArrowRight className="hidden group-hover:block text-white " />
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                {t("noAccount")}
                <Link href="/inscription" className="underline mx-1 capitalize">
                  {t("signUp")}
                </Link>
              </div>
            </div>
            <div className="hidden md:flex object-cover w-1/2 flex-col gap-4">
              <div className="text-orange-500 uppercase text-sm">
                INVEST MARKET spa
              </div>
              <div className="font-semibold text-primary text-2xl uppercase">
                INVEST IN GROWTH...
              </div>
              <div className="text-sm text-gray-500">
                Invest Market, filiale de RMGC Spa Holding, est un Intermédiaire
                en Opérations de Bourse (IOB) agréé par la Commission
                d’Organisation et de Surveillance des Opérations de Bourse
                (COSOB)
                <ul className="list-disc ml-4 my-4">
                  <li>Négociation pour compte propre</li>
                  <li>Négociation pour compte de tiers</li>
                  <li>Conseil en placement de valeurs mobilières</li>
                  <li>
                    Placement de valeurs mobilières et produits financiers
                  </li>
                  <li>Gestion individuelle de portefeuille sous mandat</li>
                  <li>
                    Conseil aux entreprises en matière de structure de capital,
                    fusion et rachat d’entreprises
                  </li>
                </ul>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  href="https://investmarket-dz.com/"
                  className="flex gap-2 bg-primary hover:bg-primary/80 text-white w-fit items-center py-2 px-4 rounded-md"
                >
                  Site Officiel
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center items-center mt-6">
            <div className="flex gap-2 text-sm">
              Powered by
              <span className="font-bold text-blue-800">
                Finnetude<span className="text-yellow-500">.</span>
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
