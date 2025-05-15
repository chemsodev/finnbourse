"use client";
import React, { useEffect, useState } from "react";
import News from "./News";
import { GET_NEWS_QUERY } from "@/graphql/queries";
import { NewsArticle } from "@/lib/interfaces";
import { useLocale, useTranslations } from "next-intl";
import NewsPagination from "./NewsPagination";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RateLimitReached from "../RateLimitReached";

interface DashNewsProps {
  skip?: number;
}

interface GetNewsResponse {
  listNewsArticles: NewsArticle[];
}

const DashNews: React.FC<DashNewsProps> = () => {
  const t = useTranslations("DashNews");
  const locale = useLocale().toLowerCase();
  const take = 5;
  const [skip, setSkip] = useState(0);
  const [news, setNews] = useState<GetNewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetchGraphQLClient<GetNewsResponse>(
          GET_NEWS_QUERY,
          {
            skip,
            take,
            language: locale,
          }
        );
        setNews(response);
      } catch (error) {
        if (error === "Too many requests") {
          return <RateLimitReached />;
        }
        console.error("Error fetching news:", error);
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [skip, locale]);

  return (
    <>
      <div className="border rounded-md flex flex-col h-fit ">
        {loading ? (
          <div className="text-center text-gray-500 h-80 justify-center items-center flex">
            {t("loading")}
          </div>
        ) : news && news.listNewsArticles.length > 0 ? (
          news.listNewsArticles?.map((news: NewsArticle) => (
            <News key={news.id} title={news.title} content={news.content} />
          ))
        ) : (
          <div className="text-center text-gray-500 h-80 justify-center items-center flex">
            {t("noNews")}
          </div>
        )}
      </div>
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
              (news?.listNewsArticles?.length || 0) < take
                ? "bg-gray-100 text-gray-300"
                : "bg-primary text-white"
            }`}
            disabled={
              (news?.listNewsArticles?.length || 0) < take ||
              !news?.listNewsArticles
            }
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default DashNews;
