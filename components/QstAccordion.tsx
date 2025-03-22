"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { questions } from "@/lib/exportables";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { LIST_SUPPORT_QUERY } from "@/graphql/queries";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import RateLimitReached from "./RateLimitReached";

interface ListSupportqas {
  listSupportqas: {
    id: number;
    question: string;
    answer: string;
    state: number;
    language: string;
  }[];
}
export async function QstAccordion() {
  const locale = useLocale();
  const [questions, setQuestions] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchQuestions = async () => {
      try {
        const data = await fetchGraphQL<ListSupportqas>(LIST_SUPPORT_QUERY, {
          take: 5,
          language: locale,
          state: 1,
          ispublished: true,
        });
        setQuestions(data?.listSupportqas);
        setLoading(false);
      } catch (error) {
        if (error === "Too many requests") {
          return <RateLimitReached />;
        }
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, [locale]);
  return loading ? (
    <div className="flex justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 192 192"
        className="w-20 h-20 fill-current text-primary group-hover:text-white"
      >
        <g fill="none">
          <path
            d="M22 142.576h10.702M22 114.712h10.702M22 22v148h148M21.995 32.934h10.702m-10.702 27.32h10.702M21.995 87.356h10.702"
            className="stroke-primary group-hover:stroke-white"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="6"
          />
          <path
            d="M68.842 128.695a10.782 10.782 0 0 1-10.781 10.781 10.782 10.782 0 0 1-10.782-10.781 10.782 10.782 0 0 1 10.782-10.782 10.782 10.782 0 0 1 10.781 10.782zM95.06 76.358A10.782 10.782 0 0 1 84.277 87.14a10.782 10.782 0 0 1-10.782-10.782 10.782 10.782 0 0 1 10.782-10.782 10.782 10.782 0 0 1 10.781 10.782Zm43.576 36.396a10.782 10.782 0 0 1-10.782 10.781 10.782 10.782 0 0 1-10.781-10.781 10.782 10.782 0 0 1 10.781-10.782 10.782 10.782 0 0 1 10.782 10.782zm21.604-73.396a10.782 10.782 0 0 1-10.782 10.782 10.782 10.782 0 0 1-10.782-10.782 10.782 10.782 0 0 1 10.782-10.781 10.782 10.782 0 0 1 10.781 10.781z"
            className="stroke-primary group-hover:stroke-white"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="6"
          />
          <path
            d="m64.38 118.198 14.117-31.362m15.08-2.424 24.333 21.124m13.668-4.067 15.53-52.393"
            className="stroke-primary group-hover:stroke-white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="6"
          />
        </g>
      </svg>
    </div>
  ) : (
    <Accordion type="single" collapsible className="w-full text-lg">
      {questions.map((question: any) => (
        <AccordionItem value={question.question}>
          <AccordionTrigger>{question.question} </AccordionTrigger>
          <AccordionContent>{question.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
