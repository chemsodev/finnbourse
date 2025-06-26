"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink } from "lucide-react";

const StaticDashNews = () => {
  const t = useTranslations("DashNews");

  // Mock news data
  const mockNews = [
    {
      id: "1",
      title: "Market Update: Strong Performance in Energy Sector",
      content:
        "The energy sector showed remarkable growth this week with major companies reporting increased profits...",
      publishedAt: new Date().toISOString(),
      category: "Market Analysis",
      language: "en",
    },
    {
      id: "2",
      title: "New Regulations for Securities Trading",
      content:
        "The regulatory authority announced new guidelines for securities trading that will take effect next month...",
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      category: "Regulatory",
      language: "en",
    },
    {
      id: "3",
      title: "Technology Stocks Rally Continues",
      content:
        "Technology companies continue their upward trend as investors show confidence in digital transformation...",
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      category: "Technology",
      language: "en",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          {t?.("title") || "Latest News"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNews.map((article) => (
            <div
              key={article.id}
              className="border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {article.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(article.publishedAt)}</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(article.publishedAt)}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-xs text-primary hover:underline">
            {t?.("viewAll") || "View All News"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaticDashNews;
