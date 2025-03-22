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
  ChartNoAxesCombined,
  Check,
  CheckIcon,
  CircleAlert,
  CloudUpload,
  Download,
  Loader2,
  Paperclip,
} from "lucide-react";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  securiyHisoryFile: z.string(),
});

const AddSecurityHistory = ({ securityId }: { securityId: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslations("FormPassationOrdre");

  const [dialogPage, setDialogPage] = useState(1);

  const [securiyHisoryFile, setSecuriyHisoryFile] = useState<File[] | null>(
    null
  );

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      securiyHisoryFile: "",
    },
  });

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2, // 2MB limit
    multiple: false,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
  };
  const handleFileChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = [
        "application/pdf",
        "application/vnd.ms-excel", // For .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

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
        setSecuriyHisoryFile(null);
        return;
      }

      setSecuriyHisoryFile(files);
    } else {
      setSecuriyHisoryFile(null);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitting(true);
    if (!securiyHisoryFile || securiyHisoryFile.length === 0) {
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
    formData.append("file", securiyHisoryFile[0]);
    formData.append("stockId", securityId);

    try {
      const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/upload-rates`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.data?.user.token}`,
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
      setIsDialogOpen(false);
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
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>{t("AjouterHistorique")}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>
          <div className="flex items-center justify-center">
            <ChartNoAxesCombined className="h-16 w-16 text-secondary my-4" />
          </div>
          <div className="text-xl font-semibold text-center text-primary">
            {t("ImportHistorique")}
          </div>
        </DialogTitle>
        <DialogHeader>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full mx-auto pt-4 z-10"
              >
                <FormField
                  control={form.control}
                  name="securiyHisoryFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploader
                          value={securiyHisoryFile}
                          onValueChange={handleFileChange}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput
                            id="fileInput"
                            className="outline-dashed outline-1 outline-slate-500"
                          >
                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                              {securiyHisoryFile &&
                              securiyHisoryFile.length > 0 ? (
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
                                .XLSX, .XLS, .CSV
                              </div>
                            </div>
                          </FileInput>
                          <FileUploaderContent>
                            {securiyHisoryFile &&
                              securiyHisoryFile.length > 0 &&
                              securiyHisoryFile.map((file, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span className=" overflow-hidden max-w-80">
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
                <div className="flex gap-4">
                  <button
                    onClick={() => setDialogPage(1)}
                    className="bg-gray-100 px-4 rounded-md flex justify-center items-center cursor-pointer"
                  >
                    {t("retour")}
                  </button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex gap-2"
                  >
                    {t("send")}
                    {submitting && <Loader2 className="animate-spin" />}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddSecurityHistory;
