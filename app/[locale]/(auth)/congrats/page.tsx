"use client";

import { useRouter } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FloatingShapes from "@/components/FloatingShapes";
import { useTranslations } from "next-intl";

export default function Congratulation() {
  const t = useTranslations("Congratulation");

  const router = useRouter();

  return (
    <>
      <FloatingShapes />
      <div className="bg-primary h-screen w-screen flex justify-center items-center">
        <div className="flex min-h-[40vh] h-full w-full items-center justify-center px-4">
          <Card className="mx-auto max-w-sm z-50 w-full">
            <CardHeader>
              <div className="flex justify-center items-center">
                <video width="150" height="150" autoPlay preload="auto">
                  <source src="/1732454382143.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <CardTitle className="text-2xl text-center">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/login")} className="w-full">
                {t("goLogin")}
              </Button>
            </CardContent>
            <CardFooter className="flex gap-1 text-[75%] text-gray-400 text-center justify-center">
              {t("noEmail")}
              <div
                onClick={() => router.push("/motdepasseoublie")}
                className="text-primary underline cursor-pointer"
              >
                {t("sendAgain")}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
