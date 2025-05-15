"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { LIST_NEGOCIATEURS_QUERY } from "@/graphql/queries";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useRouter } from "@/i18n/routing";
import { UPDATE_USER_NEGOTIATOR } from "@/graphql/mutations";
import { useToast } from "@/hooks/use-toast";

interface NegociateurGraphQLResponse {
  listUsers: {
    id: string;
    fullname: string;
  }[];
}

const formSchema = z.object({
  NegociatorID: z.string(),
});

const AtribuerNegociateur = ({
  userId,
  oldNegotiatorId,
}: {
  userId: string;
  oldNegotiatorId: string;
}) => {
  const { toast } = useToast();
  const t = useTranslations("attribuerUnNegociateur");
  const router = useRouter();
  const [negociateurs, setNegociateurs] =
    useState<NegociateurGraphQLResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      const fetchNegociateurs = async () => {
        setLoading(true);
        try {
          const data = await fetchGraphQLClient<NegociateurGraphQLResponse>(
            LIST_NEGOCIATEURS_QUERY
          );
          setNegociateurs(data);
        } catch (error) {
          console.error("Error fetching negociateurs:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNegociateurs();
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      NegociatorID: oldNegotiatorId?.toString(),
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);

      await fetchGraphQLClient<String>(UPDATE_USER_NEGOTIATOR, {
        id: userId,
        negotiatorid: values.NegociatorID,
      });

      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });

      form.reset();
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {t("attribuerUnNegociateur")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-10 h-10 text-gray-200 animate-spin fill-secondary"
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
              <span className="sr-only">loading...</span>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-primary text-center">
                {t("attribuerUnNegociateur")}
              </DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 max-w-3xl mx-auto pt-10"
                  >
                    <FormField
                      control={form.control}
                      name="NegociatorID"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>{t("label")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between w-full",
                                    !field.value && "text-muted-foreground "
                                  )}
                                >
                                  {field.value
                                    ? negociateurs?.listUsers.find(
                                        (negociateur: {
                                          id: string;
                                          fullname: string;
                                        }) => negociateur.id === field.value
                                      )?.fullname
                                    : t("selectNegociateur")}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-0">
                              <Command>
                                <CommandInput
                                  placeholder={t("searchNegociateur")}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {t("noNegociateurFound")}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {negociateurs?.listUsers?.map(
                                      (negociateur: {
                                        id: string;
                                        fullname: string;
                                      }) => (
                                        <CommandItem
                                          value={negociateur.fullname}
                                          key={negociateur.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "NegociatorID",
                                              negociateur.id.toString()
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              negociateur.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {negociateur.fullname}
                                        </CommandItem>
                                      )
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>{t("description")}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      {t("attribuer")}
                      {submitting && (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AtribuerNegociateur;
