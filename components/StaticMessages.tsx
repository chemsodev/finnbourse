"use client";
import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SupportQuestion } from "@/lib/interfaces";
import Message from "./Message";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for messages
const mockMessages: SupportQuestion[] = [
  {
    id: "1",
    question: "Comment puis-je réinitialiser mon mot de passe ?",
    answer: "Vous pouvez utiliser la fonction 'Mot de passe oublié' sur la page de connexion.",
    state: false,
    description: "Question sur la réinitialisation du mot de passe",
    userid: "user1",
    language: "fr"
  },
  {
    id: "2", 
    question: "Comment ajouter un nouveau titre à mon portefeuille ?",
    answer: "Allez dans la section 'Portefeuille' et cliquez sur 'Ajouter un titre'.",
    state: false,
    description: "Question sur l'ajout de titres",
    userid: "user2",
    language: "fr"
  },
  {
    id: "3",
    question: "Quels sont les frais de transaction ?",
    answer: "Les frais varient selon le type de transaction. Consultez notre tarification.",
    state: false,
    description: "Question sur les frais",
    userid: "user3",
    language: "fr"
  },
  {
    id: "4",
    question: "Comment consulter l'historique de mes ordres ?",
    answer: "L'historique est disponible dans la section 'Ordres' de votre tableau de bord.",
    state: false,
    description: "Question sur l'historique",
    userid: "user4",
    language: "fr"
  },
  {
    id: "5",
    question: "Puis-je annuler un ordre en cours ?",
    answer: "Oui, vous pouvez annuler un ordre tant qu'il n'est pas encore exécuté.",
    state: false,
    description: "Question sur l'annulation d'ordres",
    userid: "user5",
    language: "fr"
  }
];

const Messages = () => {
  const locale = useLocale().toLowerCase();
  const t = useTranslations("Messages");
  const [skip, setSkip] = useState(0);
  const take = 5;

  // Get paginated messages
  const paginatedMessages = mockMessages.slice(skip, skip + take);

  return (
    <div className="h-full w-full">
      {paginatedMessages.length === 0 ? (
        <div className="flex justify-center items-center h-80">
          <div className="text-gray-500">{t("noMessages")}</div>
        </div>
      ) : (
        <div className="border rounded-md flex flex-col ">
          {paginatedMessages.map((message: SupportQuestion) => (
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
              paginatedMessages.length < take
                ? "bg-gray-100 text-gray-300"
                : "bg-primary text-white"
            }`}
            disabled={paginatedMessages.length < take}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
