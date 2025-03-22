"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useTranslations } from "next-intl";

const permissions = [
  {
    id: "id",
    label: "ID",
  },
  {
    id: "ajouter un titre",
    label: "Ajouter un titre",
  },
  {
    id: "bannir un utilisateur",
    label: "Bannir un utilisateur",
  },
  {
    id: "consulter les ordres",
    label: "Consulter les ordres",
  },
  {
    id: "imprimer les ordres",
    label: "Imprimer les ordres",
  },
  {
    id: "modifier les roles",
    label: "Modifier les roles",
  },
] as const;

const FormSchema = z.object({
  roleName: z.string().min(2, {
    message: "Role Name must be at least 2 characters.",
  }),
  permissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

export function FormAjoutRole() {
  const t = useTranslations("formAjoutRole");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { roleName: "", permissions: [] },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="roleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nomRole")}</FormLabel>
              <FormControl>
                <Input placeholder="Entrer le nom du Role" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="permissions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">{t("permissions")}</FormLabel>
                <FormDescription>{t("permissionsDescription")}</FormDescription>
              </div>
              {permissions.map((permission) => (
                <FormField
                  key={permission.id}
                  control={form.control}
                  name="permissions"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={permission.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...field.value,
                                    permission.id,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== permission.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {permission.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {t("ajouter")}
        </Button>
      </form>
    </Form>
  );
}
