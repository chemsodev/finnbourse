"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Check, CircleAlert, Loader2 } from "lucide-react";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { DialogClose } from "../ui/dialog";
import { useTranslations } from "next-intl";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

// Step 1 Schema
const formOneSchema = z.object({
  denomination: z.string().min(1, "Dénomination is required"),
  siegeSocial: z.string().min(1, "Siege social is required"),
  nif: z.string().min(1, "NIF is required"),
  nis: z.string().min(1, "NIS is required"),
  rc: z.string().min(1, "Numéro RC is required"),
  numeroArticle: z.string().min(1, "Numéro d'article is required"),
  nomRL: z.string().min(1, "Nom & Prénom du représentant légal is required"),
  telRL: z
    .string()
    .min(1, "Numéro de téléphone du représentant légal is required"),
  nomM: z.string().min(1, "Nom et Prénom du mandataire is required"),
  telM: z.string().min(1, "Numéro de téléphone du mandataire is required"),
  idRL: z
    .string()
    .min(1, "Identifiant du représentant légal is required")
    .optional(),
  idTypeRL: z
    .string()
    .min(1, "Type d'identifiant du représentant légal is required"),
  idM: z.string().min(1, "Identifiant du mandataire is required").optional(),
  idTypeM: z.string().min(1, "Type d'identifiant du mandataire is required"),
  nCompteTitres: z.string(),
  rib: z.string(),
});

// Step 2 Schema
const formTwoSchema = z.object({
  copieRCP: z.string().optional(),
  sdm: z.string().optional(),
  copieID: z.string().optional(),
  copieIDM: z.string().optional(),
  copieNIF: z.string().optional(),
  copieNIS: z.string().optional(),
  dps: z.string().optional(),
  specimenSig: z.string().optional(),
  copiePV: z.string().optional(),
  acd: z.string().optional(),
  aupdp: z.string().optional(),
  ctct: z.string().optional(),
  cc: z.string().optional(),
});

const FinalisationInscriptionEntreprise = () => {
  const session = useSession();
  const t = useTranslations("FinalisationInscriptionEntreprise");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // File states for Step 2
  const [registreCommerceFiles, setRegistreCommerceFiles] = useState<
    File[] | null
  >(null);
  const [statutModificationFiles, setStatutModificationFiles] = useState<
    File[] | null
  >(null);
  const [identiteGerantFiles, setIdentiteGerantFiles] = useState<File[] | null>(
    null
  );
  const [identiteMandataireFiles, setIdentiteMandataireFiles] = useState<
    File[] | null
  >(null);
  const [nifFiles, setNifFiles] = useState<File[] | null>(null);
  const [nisFiles, setNisFiles] = useState<File[] | null>(null);
  const [delegationSignatureFiles, setDelegationSignatureFiles] = useState<
    File[] | null
  >(null);
  const [specimenSignatureFiles, setSpecimenSignatureFiles] = useState<
    File[] | null
  >(null);
  const [pvAssembleeFiles, setPvAssembleeFiles] = useState<File[] | null>(null);
  const [attestationConservationFiles, setAttestationConservationFiles] =
    useState<File[] | null>(null);
  const [attestationProtectionFiles, setAttestationProtectionFiles] = useState<
    File[] | null
  >(null);
  const [conventionCompteFiles, setConventionCompteFiles] = useState<
    File[] | null
  >(null);
  const [conventionCourtageFiles, setConventionCourtageFiles] = useState<
    File[] | null
  >(null);

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

  // Step 1 Form
  const formOne = useForm<z.infer<typeof formOneSchema>>({
    resolver: zodResolver(formOneSchema),
    defaultValues: {
      idTypeRL: "Carte Nationale",
      idTypeM: "Carte Nationale",
    },
  });

  // Step 2 Form
  const formTwo = useForm<z.infer<typeof formTwoSchema>>({
    resolver: zodResolver(formTwoSchema),
  });

  // Submit Step 1
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
      const result = await fetchGraphQLClient<string>(createUpdateManyMutation);

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
      setStep(2); // Move to Step 2
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

  // Submit Step 2
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
            Authorization: `Bearer ${(session.data?.user as any)?.token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      };

      // Upload files for each field
      if (registreCommerceFiles && registreCommerceFiles.length > 0) {
        registreCommerceFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "copieRCP"));
        });
      }

      if (statutModificationFiles && statutModificationFiles.length > 0) {
        statutModificationFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "sdm"));
        });
      }

      if (identiteGerantFiles && identiteGerantFiles.length > 0) {
        identiteGerantFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "copieID"));
        });
      }

      if (identiteMandataireFiles && identiteMandataireFiles.length > 0) {
        identiteMandataireFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "copieIDM"));
        });
      }

      if (nifFiles && nifFiles.length > 0) {
        nifFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "copieNIF"));
        });
      }

      if (nisFiles && nisFiles.length > 0) {
        nisFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "copieNIS"));
        });
      }

      if (delegationSignatureFiles && delegationSignatureFiles.length > 0) {
        delegationSignatureFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "dps"));
        });
      }

      if (specimenSignatureFiles && specimenSignatureFiles.length > 0) {
        specimenSignatureFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "specimenSig"));
        });
      }

      if (pvAssembleeFiles && pvAssembleeFiles.length > 0) {
        pvAssembleeFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "copiePV"));
        });
      }

      if (
        attestationConservationFiles &&
        attestationConservationFiles.length > 0
      ) {
        attestationConservationFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "acd"));
        });
      }

      if (attestationProtectionFiles && attestationProtectionFiles.length > 0) {
        attestationProtectionFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "aupdp"));
        });
      }

      if (conventionCompteFiles && conventionCompteFiles.length > 0) {
        conventionCompteFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "ctct"));
        });
      }

      if (conventionCourtageFiles && conventionCourtageFiles.length > 0) {
        conventionCourtageFiles.forEach((file) => {
          uploadPromises.push(uploadFile(file, "cc"));
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
            {/* Step 1 Fields */}
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="denomination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("denomination")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "entrezLaDenominationDeVotreStructure"
                          )}
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
                  name="siegeSocial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("siegeSocial")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("entrezLeSiegeSocialDeVotreStructure")}
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
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nif")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("entrezVotreNIF")}
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
                  name="nis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nis")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("entrezVotreNIS")}
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
                  name="rc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("rc")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("entrezVotreNumeroRC")}
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
                  name="numeroArticle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("numeroArticle")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("entrezVotreNumeroDArticle")}
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
              <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-2">
                  <div className=" text-gray-600">{t("identifiant")}</div>
                  <div className="flex">
                    <FormField
                      control={formOne.control}
                      name="idTypeRL"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex justify-between text-xl items-end">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl className="rounded-r-none text-gray-400">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "selectionnezUneInstruction"
                                    )}
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
                      name="idRL"
                      render={({ field }) => {
                        return (
                          <FormItem className="text-xl items-end">
                            <FormControl className="rounded-l-none">
                              <Input
                                placeholder={t("identifiant")}
                                type="text"
                                className="w-54 md:w-60"
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
                    name="nomRL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("nomEtPrenomDuRepresentantLegal")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "entrezLeNomEtLePrenomDuRepresentantLegal"
                            )}
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
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="telRL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("numeroDeTelephoneDuRepresentantLegal")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "entrezLeNumeroDeTelephoneDuRepresentantLegal"
                          )}
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>{" "}
            <div className="flex gap-4 justify-between items-end">
              <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-2">
                  <div className=" text-gray-600">{t("identifiant")}</div>
                  <div className="flex">
                    <FormField
                      control={formOne.control}
                      name="idTypeM"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex justify-between text-xl items-end">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl className="rounded-r-none text-gray-400">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "selectionnezUneInstruction"
                                    )}
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
                      name="idM"
                      render={({ field }) => {
                        return (
                          <FormItem className="text-xl items-end">
                            <FormControl className="rounded-l-none">
                              <Input
                                placeholder="Identifiant"
                                type="text"
                                className="w-54 md:w-60"
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

              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="nomM"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nomEtPrenomDuMandataire")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("entrezLeNomEtLePrenomDuMandataire")}
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
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formOne.control}
                  name="telM"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("numeroDeTelephoneDuMandataire")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "entrezLeNumeroDeTelephoneDuMandataire"
                          )}
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
              <DialogClose asChild>
                <Button variant="outline">{t("fermer")}</Button>
              </DialogClose>
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
            {/* Step 2 Fields */}
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="copieRCP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("copieDuRegistreDeCommercePrincipal")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={registreCommerceFiles}
                          onValueChange={setRegistreCommerceFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {registreCommerceFiles ? (
                                <>
                                  <div>{t("registreDeCommercePrincipal")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterLeRegistreDeCommerce")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {registreCommerceFiles &&
                              registreCommerceFiles.length > 0 &&
                              registreCommerceFiles?.map((file, i) => (
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
                  name="sdm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("copieDuStatutDerniereModification")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={statutModificationFiles}
                          onValueChange={setStatutModificationFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {statutModificationFiles ? (
                                <>
                                  <div>{t("statutDerniereModification")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>
                                    {t("ajouterLeStatutDerniereModification")}
                                  </div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {statutModificationFiles &&
                              statutModificationFiles.length > 0 &&
                              statutModificationFiles?.map((file, i) => (
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
            </div>
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="copieID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("copieDeLaPieceDIdentiteDuGerant")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={identiteGerantFiles}
                          onValueChange={setIdentiteGerantFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {identiteGerantFiles ? (
                                <>
                                  <div>{t("pieceDIdentiteDuGerant")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>
                                    {t("ajouterLaPieceDIdentiteDuGerant")}
                                  </div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {identiteGerantFiles &&
                              identiteGerantFiles.length > 0 &&
                              identiteGerantFiles?.map(
                                (identiteGerantFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {identiteGerantFiles.name}
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
                  name="copieIDM"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("copieDeLaPieceDIdentiteDuMandataire")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={identiteMandataireFiles}
                          onValueChange={setIdentiteMandataireFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {identiteMandataireFiles ? (
                                <>
                                  <div>{t("pieceDIdentiteDuMandataire")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterLIdentiteDuMandataire")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {identiteMandataireFiles &&
                              identiteMandataireFiles.length > 0 &&
                              identiteMandataireFiles?.map(
                                (identiteMandataireFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {identiteMandataireFiles.name}
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
                  name="copieNIF"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("copieCertificatNIF")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={nifFiles}
                          onValueChange={setNifFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {nifFiles ? (
                                <>
                                  <div>{t("certificatNIF")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterLeCertificatNIF")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {nifFiles &&
                              nifFiles.length > 0 &&
                              nifFiles?.map((nifFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {nifFiles.name}
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
                  name="copieNIS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("copieDuCertificatNIS")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={nisFiles}
                          onValueChange={setNisFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {nisFiles ? (
                                <>
                                  <div>
                                    {t("conventionDeTenueDeCompteTitres")}
                                  </div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>
                                    {t(
                                      "ajouterLaConventionDeTenueDeCompteTitres"
                                    )}
                                  </div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {nisFiles &&
                              nisFiles.length > 0 &&
                              nisFiles?.map((nisFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {nisFiles.name}
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
                  name="dps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("copieDeLaDelegationDuPouvoirDeSignature")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={delegationSignatureFiles}
                          onValueChange={setDelegationSignatureFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {delegationSignatureFiles ? (
                                <>
                                  <div>
                                    {t("delegationDuPouvoirDeSignature")}
                                  </div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>
                                    {t(
                                      "ajouterLaDelegationDuPouvoirDeSignature"
                                    )}
                                  </div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {delegationSignatureFiles &&
                              delegationSignatureFiles.length > 0 &&
                              delegationSignatureFiles?.map(
                                (delegationSignatureFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {delegationSignatureFiles.name}
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
                  name="specimenSig"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("specimenDeSignature")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={specimenSignatureFiles}
                          onValueChange={setSpecimenSignatureFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {specimenSignatureFiles ? (
                                <>
                                  <div>{t("specimenDeSignature")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterLeSpecimenDeSignature")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {specimenSignatureFiles &&
                              specimenSignatureFiles.length > 0 &&
                              specimenSignatureFiles?.map(
                                (specimenSignatureFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {specimenSignatureFiles.name}
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
            <div className="flex gap-4 items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="copiePV"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "copieDuPVDeLAsembleeGeneraleDecidentDacheterOuDeVendreDesActions"
                        )}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={pvAssembleeFiles}
                          onValueChange={setPvAssembleeFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {pvAssembleeFiles ? (
                                <>
                                  <div>{t("pv")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterLePV")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {pvAssembleeFiles &&
                              pvAssembleeFiles.length > 0 &&
                              pvAssembleeFiles?.map((pvAssembleeFiles, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className="overflow-hidden mr-8">
                                    {pvAssembleeFiles.name}
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
                  name="acd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("attestationDeLaConservationDesDocuments")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={attestationConservationFiles}
                          onValueChange={setAttestationConservationFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {attestationConservationFiles ? (
                                <>
                                  <div>{t("attestationDeLaConservation")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>
                                    {t("ajouterLAttestationDeLaConservation")}
                                  </div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {attestationConservationFiles &&
                              attestationConservationFiles.length > 0 &&
                              attestationConservationFiles?.map(
                                (attestationConservationFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {attestationConservationFiles.name}
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
                  name="aupdp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "attestationDutilisationEtDeProtectionDesDonneesPersonnelles"
                        )}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={attestationProtectionFiles}
                          onValueChange={setAttestationProtectionFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {attestationProtectionFiles ? (
                                <>
                                  <div>{t("attestation")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterLAttestation")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {attestationProtectionFiles &&
                              attestationProtectionFiles.length > 0 &&
                              attestationProtectionFiles?.map(
                                (attestationProtectionFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {attestationProtectionFiles.name}
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
              </div>{" "}
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="ctct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("conventionDeTenueDeCompteTitresSigneeParLeClient")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={conventionCompteFiles}
                          onValueChange={setConventionCompteFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {conventionCompteFiles ? (
                                <>
                                  <div>{t("conventionDeTenueDeCompte")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterLaConvention")}</div>
                                  <CloudUpload />
                                </>
                              )}
                            </div>
                          </FileInput>
                          <FileUploaderContent className="w-60">
                            {conventionCompteFiles &&
                              conventionCompteFiles.length > 0 &&
                              conventionCompteFiles?.map(
                                (conventionCompteFiles, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span className="overflow-hidden mr-8">
                                      {conventionCompteFiles.name}
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
            </div>{" "}
            <div className="flex gap-4 justify-between items-end">
              <div className="w-full">
                <FormField
                  control={formTwo.control}
                  name="cc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("conventionDeCourtageSigneeParLeClient")}
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={conventionCourtageFiles}
                          onValueChange={setConventionCourtageFiles}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput id="fileInput">
                            <div className="flex gap-4 w-full bg-primary text-white rounded-md text-center justify-center items-center py-2 hover:bg-primary/90">
                              {pvAssembleeFiles ? (
                                <>
                                  <div>{t("conventionDeCourtage")}</div>
                                  <Check />
                                </>
                              ) : (
                                <>
                                  <div>{t("ajouterLaConvention")}</div>
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
              </div>{" "}
            </div>{" "}
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex gap-4 bg-gray-100 text-black rounded-md text-center justify-center items-center py-2 px-4"
              >
                {t("retour")}
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
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

export default FinalisationInscriptionEntreprise;
