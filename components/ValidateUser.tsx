"use client";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
// Removed GraphQL dependencies - now using static data
// import { UPDATE_USER_ROLE, VALIDATE_USER } from "@/graphql/mutations";
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useToast } from "@/hooks/use-toast";

import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const ValidateUser = (userId: { userId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const negotiatorid = (session.data?.user as any)?.id;

  const t = useTranslations("validateUser");
  const validateUsr = async () => {
    setLoading(true);
    try {
      // Simulate validation - in real app, use REST API
      // await fetchGraphQLClient<String>(VALIDATE_USER, {
      //   roleid: 1,
      //   userid: userId.userId,
      //   negotiatorid,
      // });

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("Erreur"),
        description: t("errorDescription") || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full"> {t("validateUser")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <Button onClick={() => validateUsr()} disabled={loading}>
            {t("confirm")}
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ValidateUser;
