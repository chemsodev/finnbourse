"use client";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsImages } from "react-icons/bs";
import * as z from "zod";
import { Input } from "./ui/input";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import ReenitialiserMdpDialog from "./ReenitialiserMdpDialog";
import { fr, ar, enUS } from "date-fns/locale";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  fullname: z.string().optional(),
  prenom: z.string().optional(),
  adresse: z.string().optional(),
  email: z.string().email().optional(),
  telephone: z.string().optional(),
  rib: z.string().optional(),
  id: z.string().optional(),
  dateNaissance: z.date().optional(),
  idType: z
    .enum(["Carte Nationale", "Permis de conduite", "Passeport"])
    .optional(),
  profileImage: z.any().optional(),
  nationalite: z.string().optional(),
  paysNaissance: z.string().optional(),
  paysResidence: z.string().optional(),
  codePostal: z.string().optional(),
  profession: z.string().optional(),
  tel: z.string().optional(),
  numConf: z.string().optional(),
  denomination: z.string().optional(),
  siegeSocial: z.string().optional(),
  nif: z.string().optional(),
  nis: z.string().optional(),
  rc: z.string().optional(),
  numeroArticle: z.string().optional(),
  nomRL: z.string().optional(),
  telRL: z.string().optional(),
  nomM: z.string().optional(),
  telM: z.string().optional(),
  idRL: z.string().optional(),
  idTypeRL: z.string().optional(),
  idM: z.string().optional(),
  idTypeM: z.string().optional(),
});

export type ContactFormData = z.infer<typeof formSchema>;

export default function ProfileForm(props: {
  userDetails: any;
  restOfuserData: any;
}) {
  const { userDetails, restOfuserData } = props;
  const locale = useLocale();
  const t = useTranslations("profileForm");
  const p = useTranslations("finalisationInscriptionParticulier");
  const e = useTranslations("FinalisationInscriptionEntreprise");
  const session = useSession();
  const userId = (session.data?.user as any)?.id;
  const clientType = (session.data?.user as any)?.followsbusiness;
  const { toast } = useToast();
  const router = useRouter();
  const userObject = userDetails.findUniqueUser;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const userid = (session.data?.user as any)?.id;
  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: userObject?.fullname || "",
      dateNaissance: restOfuserData.dateNaissance
        ? new Date(restOfuserData.dateNaissance)
        : undefined,
      email: userObject?.email || "",
      telephone: userObject?.phonenumber || "",
      adresse: restOfuserData.adresse || "",
      id: restOfuserData.id || "",
      idType: restOfuserData.idType || "Carte Nationale",
      profileImage: restOfuserData.profileImage || undefined,
      nationalite: restOfuserData.nationalite || "",
      paysNaissance: restOfuserData.paysNaissance || "",
      paysResidence: restOfuserData.paysResidence || "",
      codePostal: restOfuserData.codePostal || "",
      profession: restOfuserData.profession || "",
      numConf: restOfuserData.numConf || "",
      denomination: restOfuserData.denomination || "",
      siegeSocial: restOfuserData.siegeSocial || "",
      nif: restOfuserData.nif || "",
      nis: restOfuserData.nis || "",
      rc: restOfuserData.rc || "",
      numeroArticle: restOfuserData.numeroArticle || "",
      nomRL: restOfuserData.nomRL || "",
      telRL: restOfuserData.telRL || "",
      nomM: restOfuserData.nomM || "",
      telM: restOfuserData.telM || "",
      idRL: restOfuserData.idRL || "",
      idTypeRL: restOfuserData.idTypeRL || "",
      idM: restOfuserData.idM || "",
      idTypeM: restOfuserData.idTypeM || "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitting(true);

      const updatedUserDetails: any = {};
      const restOfUserUpdatedData: any = {};

      // Compare and prepare updated user details (fullname, email, phonenumber)
      if (data.fullname !== userObject.fullname) {
        updatedUserDetails.fullname = data.fullname;
      }
      if (data.email !== userObject.email) {
        updatedUserDetails.email = data.email;
      }
      if (data.telephone !== userObject.phonenumber) {
        updatedUserDetails.phonenumber = data.telephone;
      }

      // Update user details (fullname, email, phonenumber) if needed
      if (Object.keys(updatedUserDetails).length > 0) {
        await fetchGraphQLClient<String>(
          `
          mutation updateUser {
            updateUser(
              where: { id: "${userId}" }
              data: {
                ${
                  updatedUserDetails.fullname
                    ? `fullname: { set: "${updatedUserDetails.fullname}" },`
                    : ""
                }
                ${
                  updatedUserDetails.email
                    ? `email: { set: "${updatedUserDetails.email}" },`
                    : ""
                }
                ${
                  updatedUserDetails.phonenumber
                    ? `phonenumber: { set: "${updatedUserDetails.phonenumber}" },`
                    : ""
                }
              }
            ) {
              id
            }
          }
          `
        );
      }

      const excludedFields = ["fullname", "email", "telephone", "profileImage"];

      const createUpdateManyMutation = `
      mutation createOrUpdateManyData {
        createOrUpdateManyData(
          items: [
            ${Object.entries(data)
              .filter(([name]) => !excludedFields.includes(name))
              ?.map(
                ([name, data]) => `
              {
                createArgs: {
                  data: {
                    userid: "${userid}",
                    data: ${JSON.stringify(data)},
                    name: "${name}",
                    type: "userdata",
                  }
                },
                condition: {
                  where: {
                    userid: {
                      equals: "${userid}"
                    },
                    name: {
                      equals: "${name}"
                    }
                  }
                }
              }
            `
              )
              .join(",")}
          ]
        ) {
          id
        }
      }
    `;

      // Call the GraphQL mutation
      const result = await fetchGraphQLClient<string>(createUpdateManyMutation);

      // Show success toast
      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });

      window.location.reload();
    } catch (error) {
      console.error("Form submission error", error);

      // Show error toast
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" m-4 md:my-14 md:mx-40"
      >
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => {
              return (
                <FormItem className="text-xl items-baseline">
                  <FormLabel className="text-gray-400">{t("nom")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("nom")}
                      type="text"
                      className="w-80"
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
                <FormItem className="text-xl items-baseline">
                  <FormLabel className="text-gray-400">
                    {t("telephone")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("telephone")}
                      type="text"
                      className="w-80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem className="text-xl items-baseline mt-4">
                  <FormLabel className="text-gray-400">{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("email")}
                      type="text"
                      className="w-80"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex flex-col gap-2  w-fit mt-6">
            <div className=" text-gray-600">{p("id")}</div>
            <div className="flex">
              <FormField
                control={form.control}
                name="idType"
                render={({ field }) => {
                  return (
                    <FormItem className="flex justify-between text-xl items-end">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="rounded-r-none text-gray-400 w-40">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("selectionnezUneInstruction")}
                            ></SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Carte Nationale">
                            {p("carteNationale")}
                          </SelectItem>
                          <SelectItem value="Permis de conduite">
                            {p("permisDeConduite")}
                          </SelectItem>
                          <SelectItem value="Passeport">
                            {p("passeport")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => {
                  return (
                    <FormItem className="text-xl items-end">
                      <FormControl className="rounded-l-none">
                        <Input
                          placeholder={p("id")}
                          type="text"
                          className="w-40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
        </div>
        {clientType ? (
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="denomination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{e("denomination")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={e(
                            "entrezLaDenominationDeVotreStructure"
                          )}
                          type="text"
                          className="w-80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="siegeSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{e("siegeSocial")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e("entrezLeSiegeSocialDeVotreStructure")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 justify-between items-end">
              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{e("nif")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e("entrezVotreNIF")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{e("nis")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e("entrezVotreNIS")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 justify-between items-end">
              <FormField
                control={form.control}
                name="rc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{e("rc")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e("entrezVotreNumeroRC")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroArticle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{e("numeroArticle")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e("entrezVotreNumeroDArticle")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="flex flex-col gap-2">
                <div className=" text-gray-600">{e("identifiantRL")}</div>
                <div className="flex ju">
                  <FormField
                    control={form.control}
                    name="idTypeRL"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex justify-between text-xl items-end">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl className="rounded-r-none text-gray-400 w-40">
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={e("selectionnezUneInstruction")}
                                ></SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Carte Nationale">
                                {t("carteNationale")}
                              </SelectItem>
                              <SelectItem value="Permis de conduite">
                                {t("permisDeConduite")}
                              </SelectItem>
                              <SelectItem value="Passeport">
                                {t("passeport")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="idRL"
                    render={({ field }) => {
                      return (
                        <FormItem className="text-xl items-end">
                          <FormControl className="rounded-l-none">
                            <Input
                              placeholder={e("identifiant")}
                              type="text"
                              className="w-54 md:w-40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="nomRL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{e("nomEtPrenomDuRepresentantLegal")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e(
                          "entrezLeNomEtLePrenomDuRepresentantLegal"
                        )}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 justify-between items-end">
              <FormField
                control={form.control}
                name="telRL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {e("numeroDeTelephoneDuRepresentantLegal")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e(
                          "entrezLeNumeroDeTelephoneDuRepresentantLegal"
                        )}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="telM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{e("numeroDeTelephoneDuMandataire")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e("entrezLeNumeroDeTelephoneDuMandataire")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 justify-between items-end">
              <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-2">
                  <div className=" text-gray-600">
                    {e("identifiantMandataire")}
                  </div>
                  <div className="flex">
                    <FormField
                      control={form.control}
                      name="idTypeM"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex justify-between text-xl items-end">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl className="rounded-r-none text-gray-400  w-40">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={e(
                                      "selectionnezUneInstruction"
                                    )}
                                  ></SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Carte Nationale">
                                  {e("carteNationale")}
                                </SelectItem>
                                <SelectItem value="Permis de conduite">
                                  {e("permisDeConduite")}
                                </SelectItem>
                                <SelectItem value="Passeport">
                                  {e("passeport")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="idM"
                      render={({ field }) => {
                        return (
                          <FormItem className="text-xl items-end">
                            <FormControl className="rounded-l-none">
                              <Input
                                placeholder="Identifiant"
                                type="text"
                                className="w-54 md:w-40"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="nomM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{e("nomEtPrenomDuMandataire")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={e("entrezLeNomEtLePrenomDuMandataire")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row  gap-8 md:justify-between  md:items-end mt-6">
              <FormField
                control={form.control}
                name="numConf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{p("numConf")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={p("numConf")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {!clientType ? (
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{p("profession")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={p("profession")}
                          type="text"
                          className="w-80"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-8 justify-between w-full">
              <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{p("adresse")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={p("adresse")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationalite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{p("nationalite")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={p("nationalite")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex  flex-col md:flex-row gap-8 justify-between ">
              <FormField
                control={form.control}
                name="paysNaissance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{p("paysNaissance")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={p("paysNaissance")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paysResidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{p("paysResidence")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={p("paysResidence")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row  gap-8 justify-between md:items-end">
              <FormField
                control={form.control}
                name="dateNaissance"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{p("dateNaissance")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal w-80",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(
                                field.value,
                                locale === "ar" ? "dd/MM/yyyy" : "PPP",
                                {
                                  locale:
                                    locale === "fr"
                                      ? fr
                                      : locale === "en"
                                      ? enUS
                                      : ar,
                                }
                              )
                            ) : (
                              <span className="overflow-hidden mr-8">
                                {t("pickADate")}
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1950}
                          toYear={2050}
                          locale={
                            locale === "fr" ? fr : locale === "en" ? enUS : ar
                          }
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codePostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{p("codePostal")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={p("codePostal")}
                        type="text"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-2 justify-between mt-14">
          <ReenitialiserMdpDialog />

          <div className="flex flex-col md:flex-row gap-2">
            <Link
              href="/"
              className="py-2 bg-gray-100 rounded-md flex justify-center items-center w-full md:w-32 "
            >
              {t("annuler")}
            </Link>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full md:w-52 flex gap-2 "
            >
              {t("modifier")}
              {submitting && <Loader2 className="animate-spin" />}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
