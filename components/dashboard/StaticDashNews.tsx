"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

// Add this import for time-based displays
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const StaticDashNews = () => {
  // Create a state to track if we're in client-side rendering
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations("Dashboard");

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock news data uniquement en français
  const mockNews = [
    {
      id: "1",
      title: "Mise à jour du marché ",
      content:
        "Le secteur énergétique a affiché une croissance remarquable cette semaine avec les grandes entreprises rapportant des profits accrus et des perspectives positives pour le Q4.",
      publishedAt: new Date().toISOString(),
      trend: "up",
      readTime: "3 min de lecture",
    },
    {
      id: "2",
      title: "Nouvelles réglementations pour le trading de titres",
      content:
        "L'autorité de régulation a annoncé de nouvelles directives pour le trading de titres qui entreront en vigueur le mois prochain, améliorant la transparence.",
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Hier
      trend: "neutral",
      readTime: "5 min de lecture",
    },
    {
      id: "3",
      title: "Hausse des actions technologiques",
      content:
        "Les entreprises technologiques continuent leur tendance haussière alors que les investisseurs montrent leur confiance dans les initiatives de transformation numérique.",
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // Il y a 2 jours
      trend: "up",
      readTime: "4 min de lecture",
    },
    {
      id: "4",
      title: "Le secteur bancaire fait face à des défis",
      content:
        "La volatilité récente du marché a impacté les actions bancaires, avec les analystes prédisant une approche prudente dans les mois à venir.",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      trend: "down",
      readTime: "6 min de lecture",
    },
  ];

  const displayedNews = mockNews
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 4);

  const formatDate = (dateString: string) => {
    // For server-side rendering, use a basic format to avoid hydration mismatch
    if (!isClient) {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    // Client-side rendering with relative time
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hier";
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getPriorityColor = (index: number) => {
    return "bg-white border-gray-200";
  };

  return (
    <>
      <h2 className="text-[1vw] font-semibold text-gray-900 mb-3">
        {t("derniereActualite")}
      </h2>
      <Card className="border border-gray-200 min-h-[400px] flex-1">
        <CardContent className="p-0">
          <div style={{ maxHeight: "25vw", overflow: "auto" }}>
            <div className="">
              {displayedNews.map((article, index) => (
                <div
                  key={article.id}
                  className={`group w-full relative border-b border-gray-100 transition-all duration-200 cursor-pointer ${getPriorityColor(
                    index
                  )}`}
                >
                  <div className="flex items-start justify-between gap-4 p-[0.5vw]">
                    <div className="flex-1 min-w-0">
                      <div className="flex w-full justify-end mb-1">
                        <span className="font-normal text-[0.5vw] flex justify-end">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-medium text-[0.8vw] text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200 leading-tight">
                          {article.title}
                        </h4>
                      </div>

                      <p className="text-[0.6vw] text-gray-600 line-clamp-2 leading-relaxed">
                        {article.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-[0.5vw]">
            <button className="w-full text-text-[0.7vw] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
              <span className="flex items-center justify-center gap-2 text-[0.7vw]">
                {t("voirAllActualite")}
                <ExternalLink className="w-3 h-3" />
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StaticDashNews;
