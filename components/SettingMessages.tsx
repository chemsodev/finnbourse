"use client";
import { useLocale, useTranslations } from "next-intl";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleHelp,
  MessageCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import Image from "next/image";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { GET_SUPPORT_QUESTIONS_QUERY } from "@/graphql/queries";
import { useEffect, useState } from "react";
import Message from "./Message";
import { SupportQuestion } from "@/lib/interfaces";
import { Button } from "./ui/button";

interface GetSupportQuestionsResponse {
  listSupportqas: SupportQuestion[];
}

const SettingMessages = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<GetSupportQuestionsResponse | null>(
    null
  );
  const [skip, setSkip] = useState(0);
  const t = useTranslations("Messages");
  const locale = useLocale();

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const messages = await fetchGraphQL<GetSupportQuestionsResponse>(
        GET_SUPPORT_QUESTIONS_QUERY,
        {
          skip,
          take: 5,
          // language: locale,
          state: 0,
          ispublished: false,
        }
      );
      setMessages(messages);
      setLoading(false);
    };
    fetchMessages();
  }, [locale, skip]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border py-4 px-8 shadow hover:shadow-inner hover:bg-gray-50 rounded-md capitalize md:text-xl mt-10 font-bold flex justify-start gap-4 items-center">
        <MessageCircle size={35} />
        <div className="flex w-full justify-center">{t("messages")}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-semibold text-2xl text-primary group-hover:text-white text-center mt-4 mb-6">
          <div className="flex flex-col items-center text-center gap-4">
            <Image src="/favicon.ico" alt="logo" width={100} height={100} />
          </div>
          {t("messages")}
        </DialogTitle>
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-10 h-10 text-gray-200 animate-spin fill-orange-500"
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
            <DialogDescription>
              <div className="h-full w-full">
                {messages?.listSupportqas.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-gray-500">{t("noMessages")}</div>
                  </div>
                ) : (
                  <div className="border rounded-md flex flex-col">
                    {messages?.listSupportqas.map(
                      (message: SupportQuestion) => (
                        <Message
                          key={message.id}
                          question={message.question}
                          answer={message.answer}
                          state={message.state}
                          id={message.id}
                          description={message.description}
                          userid={message.userid}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </DialogDescription>
            <DialogFooter className="flex justify-end gap-1">
              <button
                className={`border rounded-md p-1 ${
                  skip === 0 ? "bg-gray-200" : ""
                }`}
                onClick={() => setSkip(skip - 5)}
                disabled={skip === 0}
              >
                <ChevronLeftIcon
                  size={20}
                  className="rtl:rotate-180 ltr:rotate-0"
                />
              </button>
              <button
                className={`border rounded-md p-1 ${
                  messages?.listSupportqas.length === 0 ? "bg-gray-200" : ""
                }`}
                onClick={() => setSkip(skip + 5)}
                disabled={messages?.listSupportqas.length === 0}
              >
                <ChevronRightIcon
                  size={20}
                  className="rtl:rotate-180 ltr:rotate-0"
                />
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingMessages;
