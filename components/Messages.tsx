"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SupportQuestion } from "@/lib/interfaces";
import Message from "./Message";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Static mock data for messages
const mockMessages: SupportQuestion[] = [
  {
    id: "1",
    question: "Comment annuler une transaction ?",
    answer:
      "Vous pouvez annuler une transaction en cours depuis votre tableau de bord.",
    language: "fr",
    description: "Question sur l'annulation de transaction",
    userid: "user1",
    state: true,
  },
  {
    id: "2",
    question: "Problème de connexion au compte",
    answer: "Veuillez vérifier vos identifiants et réessayer.",
    language: "fr",
    description: "Problème de connexion",
    userid: "user1",
    state: false,
  },
  {
    id: "3",
    question: "Quels sont les frais de commission ?",
    answer:
      "Les frais de commission sont de 0.9% pour les actions et 0.8% pour les obligations.",
    language: "fr",
    description: "Question sur les frais",
    userid: "user1",
    state: true,
  },
];

interface GetSupportQuestionsResponse {
  listSupportqas: SupportQuestion[];
}

const Messages = () => {
  const t = useTranslations("Messages");
  const [skip, setSkip] = useState(0);
  const take = 5;

  // Use static mock data
  const [messages] = useState<GetSupportQuestionsResponse>({
    listSupportqas: mockMessages,
  });

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
