"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format, set } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Check,
  CircleAlert,
  Loader2,
} from "lucide-react";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { DialogClose } from "../ui/dialog";
import { useLocale, useTranslations } from "next-intl";
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useToast } from "@/hooks/use-toast";
import { fr, ar, enUS } from "date-fns/locale";

import { useSession } from "next-auth/react";

const formOneSchema = z.object({
  adresse: z.string(),
  nationalite: z.string(),
  paysNaissance: z.string(),
  paysResidence: z.string(),
  dateNaissance: z.coerce.date(),
  codePostal: z.string(),
  id: z.string(),
  idType: z.enum(["Carte Nationale", "Permis de conduite", "Passeport"]),
  profession: z.string(),
  tel: z.string(),
  numConf: z.string(),
  nCompteTitres: z.string(),
  rib: z.string(),
});

const formTwoSchema = z.object({
  copieID: z.string().optional(),
  residence: z.string().optional(),
  ribDoc: z.string().optional(),
  AttestationConservationDocuments: z.string().optional(),
  aupp: z.union([z.string(), z.date()]).optional(),
  ctct: z.string().optional(),
  conventionCourtage: z.string().optional(),
  ActeNaissance: z.string().optional(),
  spacimen: z.string().optional(),
});

const FinalisationInscriptionParticulier = () => {
  const session = useSession();
  const locale = useLocale();
  const t = useTranslations("finalisationInscriptionParticulier");
  const [step, setStep] = useState(1);
  const [copieIDFiles, setCopieIDFiles] = useState<File[] | null>(null);
  const [residenceFiles, setResidenceFiles] = useState<File[] | null>(null);
  const [ribFiles, setRibFiles] = useState<File[] | null>(null);
  const [attestationFiles, setAttestationFiles] = useState<File[] | null>(null);
  const [auppFiles, setAuppFiles] = useState<File[] | null>(null);
  const [ctctFiles, setCtctFiles] = useState<File[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [conventionCourtageFiles, setConventionCourtageFiles] = useState<
    File[] | null
  >(null);
  const [acteNaissanceFiles, setActeNaissanceFiles] = useState<File[] | null>(
    null
  );
  const [spacimenFiles, setSpacimenFiles] = useState<File[] | null>(null);
  const userid = (session.data?.user as any)?.id;
  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: {
      "image/*": [], // Accept all image types
      "application/pdf": [], // Accept PDF files
    },
  };
  const formOne = useForm<z.infer<typeof formOneSchema>>({
    resolver: zodResolver(formOneSchema),
    defaultValues: {
      dateNaissance: new Date(),
    },
  });

  const formTwo = useForm<z.infer<typeof formTwoSchema>>({
    resolver: zodResolver(formTwoSchema),
  });

  const onSubmitFormOne = async (values: z.infer<typeof formOneSchema>) => {
    setIsSubmitting(true);
    try {
      const createUpdateManyMutation = `
      mutation createOrUpdateManyData {
        createOrUpdateManyData(
          items: [
            ${Object.entries(values)
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

      // TODO: Replace with REST API call
      // const result = await fetchGraphQLClient<string>(createUpdateManyMutation);
      console.log("User creation simulated");
      setStep(2);

      // Show success toast
      toast({
        variant: "success",
        action: (
          <div className="w-full flex gap-6 items-center">
            <Check size={40} />
            <div className="first-letter:capitalize text-xs">
              <span>{t("success")}</span>
              <div>{t("successDescription")}</div>
            </div>
          </div>
        ),
      });
    } catch (error) {
      // Show error toast
      toast({
        variant: "destructive",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CircleAlert size={40} />
            <div className="first-letter:capitalize text-xs">
              <span>{t("pleaseTryAgain")}</span>
              <div>{t("failedToSubmitTheForm")}</div>
            </div>
          </div>
        ),
      });

      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitFormTwo = async (values: z.infer<typeof formTwoSchema>) => {
    setIsSubmitting(true);

    try {
      // Define an array to hold all file upload promises
      const uploadPromises: Promise<any>[] = [];

      // Function to upload a single file
      const uploadFile = async (file: File, fieldName: string) => {
        const formData = new FormData();
        formData.append("file", file);

        const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/file-manager/upload/${fieldName}`;

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(session.data?.user as any)?.token}`, // Replace with your token
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      };

      // Upload files for each field
      if (copieIDFiles && copieIDFiles.length > 0) {
        copieIDFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "copieID"));
        });
      }

      if (residenceFiles && residenceFiles.length > 0) {
        residenceFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "residence"));
        });
      }

      if (ribFiles && ribFiles.length > 0) {
        ribFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "rib"));
        });
      }

      if (attestationFiles && attestationFiles.length > 0) {
        attestationFiles.forEach((file) => {
          uploadPromises.push(
            uploadFile(file, "AttestationConservationDocuments")
          );
        });
      }

      if (auppFiles && auppFiles.length > 0) {
        auppFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "aupp"));
        });
      }

      if (ctctFiles && ctctFiles.length > 0) {
        ctctFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "ctct"));
        });
      }

      if (conventionCourtageFiles && conventionCourtageFiles.length > 0) {
        conventionCourtageFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "conventionCourtage"));
        });
      }

      if (acteNaissanceFiles && acteNaissanceFiles.length > 0) {
        acteNaissanceFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "ActeNaissance"));
        });
      }

      if (spacimenFiles && spacimenFiles.length > 0) {
        spacimenFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "spacimen"));
        });
      }

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);

      // Show success toast
      toast({
        variant: "success",
        action: (
          <div className="w-full flex gap-6 items-center">
            <Check size={40} />
            <div className="first-letter:capitalize text-xs">
              <span>{t("success")}</span>
              <div>{t("successDescription")}</div>
            </div>
          </div>
        ),
      });
    } catch (error) {
      console.error("File upload error:", error);

      // Show error toast
      toast({
        variant: "destructive",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CircleAlert size={40} />
            <div className="first-letter:capitalize text-xs">
              <span>{t("pleaseTryAgain")}</span>
              <div>{t("failedToSubmitTheForm")}</div>
            </div>
          </div>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <div className="flex items-center">
          {/* Step 1 */}
          <div
            className={`bg-primary text-white flex rounded-full text-xs w-5 h-5 items-center justify-center shadow cursor-pointer`}
            onClick={() => setStep(1)}
          >
            1
          </div>
          <div
            className={`${
              step === 2
                ? "border-primary shadow"
                : "border-gray-100 shadow-inner"
            } border-2 border-b mx-1 w-40 rounded-full`}
          ></div>
          {/* Step 2 */}
          <div
            className={`${
              step === 2
                ? "bg-primary text-white shadow"
                : "bg-gray-100 text-primary shadow-inner"
            } flex rounded-full text-xs w-5 h-5 items-center justify-center cursor-pointer`}
            onClick={() => setStep(2)}
          >
            2
          </div>
        </div>
      </div>

      {step === 1 ? (
        <Form {...formOne}>
          <form
            onSubmit={formOne.handleSubmit(onSubmitFormOne)}
            className="space-y-8 max-w-3xl mx-auto pt-10"
          >
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("adresse")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("adresse")}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="nationalite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nationalite")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("nationalite")}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="paysNaissance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("paysNaissance")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("paysNaissance")}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="paysResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("paysResidence")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("paysResidence")}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="dateNaissance"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("dateNaissance")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
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
              </div>

              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="codePostal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("codePostal")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("codePostal")}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="nCompteTitres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nCompteTitres")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("nCompteTitres")}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="rib"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("rib")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("rib")} type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 items-end w-full">
              <div className="flex flex-col gap-2  w-full">
                <div className=" text-gray-600">{t("id")}</div>
                <div className="flex">
                  <FormField
                    control={formOne.control}
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
                    control={formOne.control}
                    name="id"
                    render={({ field }) => {
                      return (
                        <FormItem className="text-xl items-end">
                          <FormControl className="rounded-l-none">
                            <Input
                              placeholder={t("id")}
                              type="text"
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

              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profession")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("profession")}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="tel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("tel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("tel")} type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="numConf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("numConf")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("numConf")}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <Button variant="outline">{t("fermer")}</Button>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full"
              >
                {t("suivant")}
                {isSubmitting && <Loader2 className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...formTwo}>
          <form
            onSubmit={formTwo.handleSubmit(onSubmitFormTwo)}
            className="space-y-8 max-w-3xl mx-auto pt-10"
          >
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="copieID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("copieID")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={copieIDFiles}
                          onValueChange={setCopieIDFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {copieIDFiles ? (
                                <>
                                  <div>{t("pieceIdentite")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterPieceIdentite")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {copieIDFiles &&
                              copieIDFiles.length > 0 &&
                              copieIDFiles?.map((file, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {file.name}
                                  </span>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="residence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("residence")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={residenceFiles}
                          onValueChange={setResidenceFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {residenceFiles ? (
                                <>
                                  <div>{t("residence")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterResidence")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {residenceFiles &&
                              residenceFiles.length > 0 &&
                              residenceFiles?.map((residenceFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {residenceFiles.name}
                                  </span>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="ribDoc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("rib")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={ribFiles}
                          onValueChange={setRibFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {ribFiles ? (
                                <>
                                  <div>{t("rib")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterRIB")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {ribFiles &&
                              ribFiles.length > 0 &&
                              ribFiles?.map((ribFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {ribFiles.name}
                                  </span>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="AttestationConservationDocuments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("attestationConservationDocuments")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={attestationFiles}
                          onValueChange={setAttestationFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {attestationFiles ? (
                                <>
                                  <div>
                                    {t("attestationConservationDocuments")}
                                  </div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterAttestation")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {attestationFiles &&
                              attestationFiles.length > 0 &&
                              attestationFiles?.map((attestationFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {attestationFiles.name}
                                  </span>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="aupp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("aupp")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={auppFiles}
                          onValueChange={setAuppFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {auppFiles ? (
                                <>
                                  <div>{t("aupp")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterAttestation")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {auppFiles &&
                              auppFiles.length > 0 &&
                              auppFiles?.map((auppFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {auppFiles.name}
                                  </span>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="ctct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("ctct")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={ctctFiles}
                          onValueChange={setCtctFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {ctctFiles ? (
                                <>
                                  <div>{t("ctct")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterConvention")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {ctctFiles &&
                              ctctFiles.length > 0 &&
                              ctctFiles?.map((ctctFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {ctctFiles.name}
                                  </span>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="conventionCourtage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("conventionCourtage")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={conventionCourtageFiles}
                          onValueChange={setConventionCourtageFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {conventionCourtageFiles ? (
                                <>
                                  <div>{t("conventionCourtage")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterConvention")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {conventionCourtageFiles &&
                              conventionCourtageFiles.length > 0 &&
                              conventionCourtageFiles?.map(
                                (conventionCourtageFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {conventionCourtageFiles.name}
                                    </span>
                                  </FileUploaderItem>
                                )
                              )}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="ActeNaissance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("acteNaissance")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={acteNaissanceFiles}
                          onValueChange={setActeNaissanceFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {acteNaissanceFiles ? (
                                <>
                                  <div>{t("acteNaissance")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterActeNaissance")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {acteNaissanceFiles &&
                              acteNaissanceFiles.length > 0 &&
                              acteNaissanceFiles?.map(
                                (acteNaissanceFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {acteNaissanceFiles.name}
                                    </span>
                                  </FileUploaderItem>
                                )
                              )}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="spacimen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("spacimen")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={spacimenFiles}
                          onValueChange={setSpacimenFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {spacimenFiles ? (
                                <>
                                  <div>{t("spacimen")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterSpacimen")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {spacimenFiles &&
                              spacimenFiles.length > 0 &&
                              spacimenFiles?.map((spacimenFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {spacimenFiles.name}
                                  </span>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex gap-4  bg-gray-100  text-black rounded-md text-center justify-center items-center py-2 px-4 "
              >
                {t("retour")}
              </button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="flex w-full"
              >
                {t("envoyer")}
                {isSubmitting && <Loader2 className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default FinalisationInscriptionParticulier;
