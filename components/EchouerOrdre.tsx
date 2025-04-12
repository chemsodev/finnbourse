"use client";

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

export function EchouerOrdre({ ordreId }: { ordreId: string }) {
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("echouerOrdre");

  async function onSubmit() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/changestate`,
        {
          method: "POST",
          body: JSON.stringify({
            id: ordreId,
            state: 10,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
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
        <Button className="capitalize w-full" variant="destructive">
          {t("echouer")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("echouerOrdre")}</DialogTitle>
        </DialogHeader>

        <DialogDescription className="mt-4">
          {t("description")}
        </DialogDescription>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={() => onSubmit()}
          >
            {t("confirm")}
            {isLoading && <Loader2 className="animate-spin mx-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
