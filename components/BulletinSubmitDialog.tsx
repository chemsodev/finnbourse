"use client";
import { Button } from "./ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { useRouter } from "@/i18n/routing";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CheckIcon,
  CircleAlert,
  CloudUpload,
  Download,
  Loader2,
  Paperclip,
} from "lucide-react";
import { useSession } from "next-auth/react";
// Removed GraphQL dependencies - now using static data
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";

const formSchema = z.object({
  bulletinDeSouscriptionSigneFiles: z.string(),
});

const BulletinSubmitDialog = ({
  createdOrdreId,
  isDialogOpen,
  setIsDialogOpen,
  page,
}: {
  createdOrdreId: string;
  isDialogOpen?: boolean;
  setIsDialogOpen?: (open: boolean) => void;
  page?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const session = useSession();
  const { toast } = useToast();

  const t = useTranslations("FormPassationOrdreObligation");

  const [dialogPage, setDialogPage] = useState(1);

  const [
    bulletinDeSouscriptionSigneFiles,
    setBulletinDeSouscriptionSigneFiles,
  ] = useState<File[] | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bulletinDeSouscriptionSigneFiles: "",
    },
  });

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2, // 2MB limit
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  };

  const handleFileChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = ["application/pdf", "image/png", "image/jpeg"];

      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          action: (
            <div className="w-full flex gap-2">
              <CircleAlert size={40} />
              <span className="first-letter:capitalize text-xs">
                {t("invalidFileType")}
              </span>
            </div>
          ),
        });
        setBulletinDeSouscriptionSigneFiles(null);
        return;
      }

      setBulletinDeSouscriptionSigneFiles(files);
    } else {
      setBulletinDeSouscriptionSigneFiles(null);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (
      !bulletinDeSouscriptionSigneFiles ||
      bulletinDeSouscriptionSigneFiles.length === 0
    ) {
      toast({
        variant: "destructive",
        action: (
          <div className="w-full flex gap-2">
            <CircleAlert size={40} />
            <span className="first-letter:capitalize text-xs">
              {t("erreurFichierManquant")}
            </span>
          </div>
        ),
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", bulletinDeSouscriptionSigneFiles[0]);

    try {
      const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/file-manager/upload/order-${createdOrdreId}`;

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

      const result = await response.json();

      toast({
        variant: "success",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CheckIcon size={40} />
            <span className="first-letter:capitalize text-xs">
              {t("bulletinSoumis")}
            </span>
          </div>
        ),
      });

      router.push(`/passerunordre/congrats`);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        action: (
          <div className="w-full flex gap-2">
            <CircleAlert size={40} />
            <span className="first-letter:capitalize text-xs">
              {t("erreur")}
            </span>
          </div>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {page === "OrdreDrawer" && (
        <DialogTrigger asChild>
          <Button className="w-full">{t("finaliserLaPassation")}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          {page !== "OrdreDrawer" && (
            <DialogTitle>
              <div className="flex justify-center items-center">
                <video width="150" height="150" autoPlay preload="auto">
                  <source src="/1732454382143.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="text-xl font-semibold text-center text-primary">
                {t("ordrePasse")}
              </div>
            </DialogTitle>
          )}{" "}
          <DialogDescription>
            {dialogPage === 1 ? (
              <>
                <div className="my-6"> {t("telechargerBulletinDC")}</div>
                <Link
                  href={`/passerunordre/${createdOrdreId}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className={`bg-primary text-white w-full py-2 rounded-md text-center flex gap-4 justify-center items-center `}
                    onClick={() => setDialogPage(2)}
                  >
                    {t("telechargerBulletin")} <Download />
                  </button>
                </Link>
              </>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 w-full mx-auto pt-10 z-10"
                >
                  <FormField
                    control={form.control}
                    name="bulletinDeSouscriptionSigneFiles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("telechargerBulletinDescription")}
                        </FormLabel>
                        <FormControl>
                          <FileUploader
                            value={bulletinDeSouscriptionSigneFiles}
                            onValueChange={handleFileChange}
                            dropzoneOptions={dropZoneConfig}
                            className="relative bg-background rounded-lg p-2"
                          >
                            <FileInput
                              id="fileInput"
                              className="outline-dashed outline-1 outline-slate-500"
                            >
                              <div className="flex items-center justify-center flex-col p-8 w-full ">
                                {bulletinDeSouscriptionSigneFiles &&
                                bulletinDeSouscriptionSigneFiles.length > 0 ? (
                                  <Check className="text-green-500 w-10 h-10" />
                                ) : (
                                  <CloudUpload className="text-gray-500 w-10 h-10" />
                                )}
                                <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">
                                    {t("cliquerPourUploader")}
                                  </span>
                                  &nbsp; {t("dragDrop")}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  PDF, PNG, JPG
                                </div>
                              </div>
                            </FileInput>
                            <FileUploaderContent>
                              {bulletinDeSouscriptionSigneFiles &&
                                bulletinDeSouscriptionSigneFiles.length > 0 &&
                                bulletinDeSouscriptionSigneFiles?.map(
                                  (file, i) => (
                                    <FileUploaderItem key={i} index={i}>
                                      <Paperclip className="h-4 w-4 stroke-current" />
                                      <span className=" overflow-hidden max-w-80">
                                        {file.name}
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
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDialogPage(1)}
                      className="bg-gray-100 px-4 rounded-md flex justify-center items-center cursor-pointer"
                    >
                      {t("retour")}
                    </button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex gap-2"
                    >
                      {t("valider")}
                      {isSubmitting && <Loader2 className="animate-spin" />}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BulletinSubmitDialog;
