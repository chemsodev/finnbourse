"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IobFormValues, iobFormSchema } from "./schema";

interface IobFormProps {
  defaultValues: IobFormValues;
  onFormChange: (values: IobFormValues) => void;
}

export function IobForm({ defaultValues, onFormChange }: IobFormProps) {
  const t = useTranslations("IOBPage");

  const form = useForm<IobFormValues>({
    resolver: zodResolver(iobFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Update parent form when this form changes
  const handleFormChange = () => {
    const values = form.getValues();
    onFormChange(values);
  };

  return (
    <Form {...form}>
      <form onChange={handleFormChange} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="codeIob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("codeIOB")}</FormLabel>
                  <FormControl>
                    <Input id="codeIob" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="libelleCourt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("shortLabel")}</FormLabel>
                  <FormControl>
                    <Input id="libelleCourt" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="libelleLong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("longLabel")}</FormLabel>
                  <FormControl>
                    <Input id="libelleLong" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="correspondant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("correspondent")}</FormLabel>
                  <FormControl>
                    <Input id="correspondant" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="fax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fax")}</FormLabel>
                  <FormControl>
                    <Input id="fax" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input id="telephone" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="addresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input id="addresse" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="ordreDeTu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("orderTu")}</FormLabel>
                  <FormControl>
                    <Input id="ordreDeTu" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
