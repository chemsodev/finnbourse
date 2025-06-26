"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PiChatsCircle } from "react-icons/pi";
import { Button } from "./ui/button";
import { CheckIcon, Loader2, SendHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
// import { clientFetchGraphQL } from "@/app/actions/fetchGraphQL";
// import { DELETE_QUESTION, UPDATE_SUPPORT_MESSAGE } from "@/graphql/mutations";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
// import { FIND_UNIQUE_USER } from "@/graphql/queries";
import { User } from "@/lib/interfaces";
import RateLimitReached from "./RateLimitReached";
import { useSession } from "next-auth/react";

interface CustomUser {
  id?: string;
  token?: string;
  roleid?: number;
  refreshToken?: string;
}

interface MessageProps {
  question: string;
  answer: string;
  description: string;
  state: boolean;
  id: string;
  userid: string;
}

const formSchema = z.object({
  reponseProbleme: z.string(),
});

const Message = ({
  question,
  answer,
  description,
  state,
  id,
  userid,
}: MessageProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("Message");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const session = useSession();
  const currentUser = session?.data?.user as CustomUser;
  const accessToken = currentUser?.token || "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      const fetchUser = async () => {
        try {
          // TODO: Replace with REST API call
          // const response = await clientFetchGraphQL<{ findUniqueUser: User }>(
          //   FIND_UNIQUE_USER,
          //   {
          //     userid,
          //   },
          //   {},
          //   accessToken
          // );

          // Mock user data
          const mockUser: User = {
            id: userid,
            fullname: "User " + userid,
            email: "user@example.com",
            followsbusiness: false,
            roleid: 1,
            phonenumber: "",
            address: "",
            birthdate: "",
            trustnumber: "",
            nationality: "",
            countryofresidence: "",
            negotiatorid: "",
            countryofbirth: "",
            profession: "",
            zipcode: "",
            status: 1,
          };

          setUser(mockUser);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
    }
  }, [userid, open, accessToken]);

  async function onDelete() {
    setIsSubmitting(true);
    try {
      // TODO: Replace with REST API call
      // await clientFetchGraphQL<String>(
      //   DELETE_QUESTION,
      //   {
      //     id: id,
      //   },
      //   {},
      //   accessToken
      // );

      console.log("Question deletion simulated");

      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting message", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // TODO: Replace with REST API call
      // await clientFetchGraphQL<String>(
      //   UPDATE_SUPPORT_MESSAGE,
      //   {
      //     id,
      //     answer: values.reponseProbleme,
      //     state: 1,
      //   },
      //   {},
      //   accessToken
      // );

      console.log("Support message update simulated");
      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className="flex gap-2 p-3 border-b cursor-pointer hover:bg-gray-50 ltr:text-left rtl:text-right items-center">
            <div className="text-primary mx-4">
              <PiChatsCircle size={40} />
            </div>

            <div className="font-semibold text-primary">
              {question.length > 200
                ? `${question.substring(0, 200)}...`
                : question}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-semibold text-2xl text-primary group-hover:text-white text-center mt-4 mb-6">
              <div className="font-semibold text-primary">
                {t("questionDe")}
                <span className="text-secondary capitalize mx-2">
                  {user?.fullname}
                </span>
              </div>
            </DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4 items-baseline">
                        <span className="text-gray-400">
                          {t("telephone")} :
                        </span>
                        <span className="text-black font-semibold">
                          {user?.phonenumber}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4 items-baseline">
                        <span className="text-gray-400">{t("email")} :</span>
                        <span className="text-black font-semibold">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-baseline">
                      <span className="text-gray-400 flex-shrink-0">
                        {t("probleme")} :
                      </span>
                      <span className="text-black font-semibold">
                        {question}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-baseline">
                      <span className="text-gray-400 flex-shrink-0">
                        {t("description")} :
                      </span>
                      <span className="text-black font-semibold">
                        {description}
                      </span>
                    </div>
                  </div>

                  {!state && (
                    <FormField
                      control={form.control}
                      name="reponseProbleme"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel className="text-gray-400 flex-shrink-0">
                            {t("reponse")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Réponse..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {state === true && (
                    <div className="flex flex-col gap-4 mb-4">
                      <span className="text-gray-400 flex-shrink-0">
                        {t("reponse")} :
                      </span>
                      <span className="text-black font-semibold">{answer}</span>
                    </div>
                  )}
                </div>
                {!state && (
                  <DialogFooter className="mt-8">
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex gap-2 items-center"
                      onClick={onDelete}
                      disabled={isSubmitting}
                    >
                      {!isSubmitting && <Trash2 size={20} />}
                      {t("supprimer")}
                      {isSubmitting && (
                        <Loader2 size={20} className="animate-spin" />
                      )}
                    </Button>
                    <Button
                      type="submit"
                      className="flex gap-2 items-center"
                      disabled={isSubmitting}
                    >
                      {t("repondre")}
                      {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <SendHorizontal size={20} />
                      )}
                    </Button>
                  </DialogFooter>
                )}
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Message;
