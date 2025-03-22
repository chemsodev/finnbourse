"use client";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GET_NEWS_QUERY } from "@/graphql/queries";
import { NewsArticle } from "@/lib/interfaces";
import { ChevronLeft, ChevronRight, CircleHelp, Newspaper } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import NewsEdit from "./NewsEdit";

interface GetNewsResponse {
  listNewsArticles: NewsArticle[];
}
const AddNews = () => {
  const t = useTranslations("AddNews");
  const locale = useLocale().toLowerCase();
  const [skip, setSkip] = useState(0);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const take = 5;
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await fetchGraphQL<GetNewsResponse>(GET_NEWS_QUERY, {
          skip,
          take,
          language: locale,
        });
        setNews(news.listNewsArticles);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchNews();
  }, [take, skip, locale]);

  return (
    <Dialog>
      <DialogTrigger className=" border py-4 px-8 shadow hover:shadow-inner hover:bg-gray-50 rounded-md capitalize md:text-xl mt-10 font-bold flex justify-start gap-4 items-center">
        <Newspaper size={35} />
        <div className="flex w-full justify-center">{t("news")}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl text-primary group-hover:text-white text-center mt-4 mb-6">
            <div className="flex flex-col items-center text-center gap-4">
              <Image src="/favicon.ico" alt="logo" width={100} height={100} />
            </div>
            {t("news")}
          </DialogTitle>
          <DialogDescription>
            <div className="border rounded-md">
              {news.map((article, index) => (
                <NewsEdit key={index} article={article} type="modification" />
              ))}
            </div>
          </DialogDescription>
          <div className="w-full flex justify-between items-center">
            <NewsEdit type="ajout" />
            <div className="flex gap-2">
              <button
                onClick={() => setSkip(skip - 5)}
                className={`p-1 rounded-md ${
                  skip === 0 ? "bg-gray-100" : "bg-primary text-white"
                }`}
                disabled={skip === 0}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setSkip(skip + 5)}
                className={`p-1 rounded-md ${
                  news.length < take ? "bg-gray-100" : "bg-primary text-white"
                }`}
                disabled={news.length < take}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddNews;
