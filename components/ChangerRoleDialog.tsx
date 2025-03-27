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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { UPDATE_USER_ROLE } from "@/graphql/mutations";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";

const formSchema = z.object({
  role: z.string(),
});

const ChangerRoleDialog = ({
  userId,
  role,
}: {
  userId: string;
  role: number;
}) => {
  const roleName =
    role === 0
      ? "visiteur"
      : role === 1
      ? "investisseur"
      : role === 2
      ? "IOB"
      : role === 3
      ? "TCC"
      : "agence";
  const t = useTranslations("clients");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: roleName,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await fetchGraphQL<String>(UPDATE_USER_ROLE, {
        roleid:
          values.role === "visiteur"
            ? 0
            : values.role === "investisseur"
            ? 1
            : values.role === "IOB"
            ? 2
            : values.role === "TCC"
            ? 3
            : values.role === "agence"
            ? 4
            : 0,
        userid: userId,
      });

      toast({
        variant: "success",
        title: "Succès",
        description: "Le rôle a été changé avec succès.",
      });

      form.reset();
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-semibold shadow-inner">
          {t("changerRole")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary font-sans text-xl text-center">
            {t("changerRole")}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-3xl mx-auto pt-10"
              >
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("roleUsr")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="visiteur">
                            {t("visiteur")}
                          </SelectItem>
                          <SelectItem value="investisseur">
                            {t("investisseur")}
                          </SelectItem>
                          <SelectItem value="IOB">{t("IOB")}</SelectItem>
                          <SelectItem value="TCC">{t("TCC")}</SelectItem>
                          <SelectItem value="agence">{t("agence")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>{t("descriptionRole")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {t("valider")}
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChangerRoleDialog;
