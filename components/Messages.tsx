"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SupportQuestion } from "@/lib/interfaces";
import Message from "./Message";
import { useSession } from "next-auth/react";
import { GET_SUPPORT_QUESTIONS_QUERY } from "@/graphql/queries";
import MessagesPagination from "./MessageesPagination";
import { clientFetchGraphQL } from "@/app/actions/fetchGraphQL";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RateLimitReached from "./RateLimitReached";

interface GetSupportQuestionsResponse {
  listSupportqas: SupportQuestion[];
}

// Define proper session user type
interface CustomUser {
  id?: string;
  token?: string;
  roleid?: number;
  name?: string;
  email?: string;
}

const Messages = () => {
  const locale = useLocale().toLowerCase();
  const t = useTranslations("Messages");
  const session = useSession();
  const user = session?.data?.user as CustomUser;
  const accessToken = user?.token || "";
  const [skip, setSkip] = useState(0);

  const take = 5;
  const [messages, setMessages] = useState<GetSupportQuestionsResponse | null>(
    null
  );

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!accessToken) {
          return; // Don't fetch if no token available
        }

        const response = await clientFetchGraphQL<GetSupportQuestionsResponse>(
          GET_SUPPORT_QUESTIONS_QUERY,
          {
            skip: 0,
            take,
            state: 0,
            ispublished: false,
          },
          {},
          accessToken
        );

        setMessages(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchMessages();
  }, [take, accessToken]); // Add accessToken to dependencies

  return (
    <div className="h-full w-full">
      {messages?.listSupportqas.length === 0 ? (
        <div className="flex justify-center items-center h-80">
          <div className="text-gray-500">{t("noMessages")}</div>
        </div>
      ) : (
        <div className="border rounded-md flex flex-col ">
          {messages?.listSupportqas?.map((message: SupportQuestion) => (
            <Message
              key={message.id}
              question={message.question}
              answer={message.answer}
              state={message.state}
              description={message.description}
              id={message.id}
              userid={message.userid}
            />
          ))}
        </div>
      )}

      <div className="flex justify-end mt-2">
        <div className="flex gap-2">
          <button
            onClick={() => setSkip(skip - take)}
            className={`p-1 rounded-md ${
              skip === 0 ? "bg-gray-100 text-gray-300" : "bg-primary text-white"
            }`}
            disabled={skip === 0}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => setSkip(skip + take)}
            className={`p-1 rounded-md ${
              (messages?.listSupportqas?.length || 0) < take
                ? "bg-gray-100 text-gray-300"
                : "bg-primary text-white"
            }`}
            disabled={
              (messages?.listSupportqas?.length || 0) < take ||
              !messages?.listSupportqas
            }
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
