"use client";
import { useLocale, useTranslations } from "next-intl";

import { CircleHelp } from "lucide-react";
import Question from "./Question";
import { Dialog, DialogContent, DialogDescription } from "./ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import Image from "next/image";
// Removed GraphQL dependencies - now using static data
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
// import { LIST_SUPPORT_QUERY } from "@/graphql/queries";
import { useEffect, useState } from "react";

// Static mock data for support questions
const mockSupportQuestions = {
  listSupportqas: [
    {
      id: 1,
      question: "How do I place an order?",
      answer:
        "You can place an order by navigating to the trading section and selecting your desired security.",
      state: 1,
      language: "en",
    },
    {
      id: 2,
      question: "What are the trading hours?",
      answer: "Trading hours are Monday to Friday, 9:00 AM to 4:00 PM.",
      state: 1,
      language: "en",
    },
    {
      id: 3,
      question: "Comment passer un ordre ?",
      answer:
        "Vous pouvez passer un ordre en naviguant vers la section trading et en sélectionnant votre titre désiré.",
      state: 1,
      language: "fr",
    },
    {
      id: 4,
      question: "Quels sont les horaires de trading ?",
      answer:
        "Les horaires de trading sont du lundi au vendredi, de 9h00 à 16h00.",
      state: 1,
      language: "fr",
    },
  ],
};

interface ListSupportqas {
  listSupportqas: {
    id: number;
    question: string;
    answer: string;
    state: number;
    language: string;
  }[];
}
const SettingsQst = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // No loading needed for static data
  const locale = useLocale();
  const t = useTranslations("settingsQst");

  // Filter mock data by locale
  const filteredQuestions = {
    listSupportqas: mockSupportQuestions.listSupportqas.filter(
      (q) => q.language === locale
    ),
  };
  const [questions] = useState<ListSupportqas>(filteredQuestions);

  // Removed GraphQL fetch logic - using static data instead
  // useEffect(() => {
  //   if (open) {
  //     const fetchQuestions = async () => {
  //       const data = await fetchGraphQLClient<ListSupportqas>(
  //         LIST_SUPPORT_QUERY,
  //         {
  //           take: 5,
  //           language: locale,
  //           state: 1,
  //           ispublished: true,
  //         }
  //       );
  //       setQuestions(data);
  //       setLoading(false);
  //     };
  //     fetchQuestions();
  //   }
  // }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className=" border py-4 px-8 shadow hover:shadow-inner hover:bg-gray-50 rounded-md capitalize md:text-xl mt-10 font-bold flex justify-start gap-4 items-center">
        <CircleHelp size={35} />
        <div className="flex w-full justify-center">
          {t("questionsFrequantes")}
        </div>
      </DialogTrigger>
      <DialogContent>
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-10 h-10 text-gray-200 animate-spin fill-secondary"
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
            <DialogTitle className="font-semibold text-2xl text-primary group-hover:text-white text-center mt-4 mb-6">
              <div className="flex flex-col items-center text-center gap-4">
                <Image src="/favicon.ico" alt="logo" width={100} height={100} />
              </div>
              {t("questionsFrequantes")}
            </DialogTitle>
            <DialogDescription>
              <div className="border rounded-md flex flex-col ">
                {questions?.listSupportqas?.map((question) => (
                  <Question
                    question={question.question}
                    answer={question.answer}
                    type="modification"
                    key={question.id}
                    qstId={question.id}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-6 items-center">
                <Question type="ajout" />
              </div>
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsQst;
