"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";

const StaticDashNews = () => {
  const t = useTranslations("DashNews");
  const locale = useLocale().toLowerCase();

  // Mock news data with French, English, and Arabic content
  const mockNews = [
    {
      id: "1",
      title: {
        fr: "Mise à jour du marché : Performance exceptionnelle du secteur énergétique",
        en: "Market Update: Strong Performance in Energy Sector",
        ar: "تحديث السوق: أداء قوي في قطاع الطاقة"
      },
      content: {
        fr: "Le secteur énergétique a affiché une croissance remarquable cette semaine avec les grandes entreprises rapportant des profits accrus et des perspectives positives pour le Q4.",
        en: "The energy sector showed remarkable growth this week with major companies reporting increased profits and positive outlook for Q4.",
        ar: "أظهر قطاع الطاقة نمواً ملحوظاً هذا الأسبوع مع تقارير الشركات الكبرى عن أرباح متزايدة وتوقعات إيجابية للربع الرابع."
      },
      publishedAt: new Date().toISOString(),
      category: {
        fr: "Analyse de Marché",
        en: "Market Analysis",
        ar: "تحليل السوق"
      },
      trend: "up",
      readTime: {
        fr: "3 min de lecture",
        en: "3 min read",
        ar: "3 دقائق قراءة"
      }
    },
    {
      id: "2",
      title: {
        fr: "Nouvelles réglementations pour le trading de titres",
        en: "New Regulations for Securities Trading",
        ar: "لوائح جديدة لتداول الأوراق المالية"
      },
      content: {
        fr: "L'autorité de régulation a annoncé de nouvelles directives pour le trading de titres qui entreront en vigueur le mois prochain, améliorant la transparence.",
        en: "The regulatory authority announced new guidelines for securities trading that will take effect next month, improving transparency.",
        ar: "أعلنت السلطة التنظيمية عن إرشادات جديدة لتداول الأوراق المالية ستدخل حيز التنفيذ الشهر المقبل، مما يحسن الشفافية."
      },
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      category: {
        fr: "Réglementation",
        en: "Regulatory",
        ar: "تنظيمي"
      },
      trend: "neutral",
      readTime: {
        fr: "5 min de lecture",
        en: "5 min read",
        ar: "5 دقائق قراءة"
      }
    },
    {
      id: "3",
      title: {
        fr: "La hausse des actions technologiques se poursuit",
        en: "Technology Stocks Rally Continues",
        ar: "استمرار صعود أسهم التكنولوجيا"
      },
      content: {
        fr: "Les entreprises technologiques continuent leur tendance haussière alors que les investisseurs montrent leur confiance dans les initiatives de transformation numérique.",
        en: "Technology companies continue their upward trend as investors show confidence in digital transformation initiatives.",
        ar: "تواصل شركات التكنولوجيا اتجاهها الصاعد بينما يظهر المستثمرون ثقتهم في مبادرات التحول الرقمي."
      },
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      category: {
        fr: "Technologie",
        en: "Technology",
        ar: "تكنولوجيا"
      },
      trend: "up",
      readTime: {
        fr: "4 min de lecture",
        en: "4 min read",
        ar: "4 دقائق قراءة"
      }
    },
    {
      id: "4",
      title: {
        fr: "Le secteur bancaire fait face à des défis",
        en: "Banking Sector Faces Challenges",
        ar: "القطاع المصرفي يواجه تحديات"
      },
      content: {
        fr: "La volatilité récente du marché a impacté les actions bancaires, avec les analystes prédisant une approche prudente dans les mois à venir.",
        en: "Recent market volatility has impacted banking stocks, with analysts predicting a cautious approach in the coming months.",
        ar: "أثرت تقلبات السوق الأخيرة على الأسهم المصرفية، مع توقع المحللين لنهج حذر في الأشهر القادمة."
      },
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      category: {
        fr: "Banque",
        en: "Banking",
        ar: "مصرفي"
      },
      trend: "down",
      readTime: {
        fr: "6 min de lecture",
        en: "6 min read",
        ar: "6 دقائق قراءة"
      }
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      if (locale === "fr") return "Hier";
      if (locale === "ar") return "أمس";
      return "Yesterday";
    }
    if (diffDays === 0) {
      if (locale === "fr") return "Aujourd'hui";
      if (locale === "ar") return "اليوم";
      return "Today";
    }
    if (diffDays < 7) {
      if (locale === "fr") return `Il y a ${diffDays} jours`;
      if (locale === "ar") return `منذ ${diffDays} أيام`;
      return `${diffDays} days ago`;
    }
    
    const localeMap = {
      fr: "fr-FR",
      en: "en-US",
      ar: "ar-SA"
    };
    
    return date.toLocaleDateString(localeMap[locale as keyof typeof localeMap] || "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap = {
      fr: "fr-FR",
      en: "en-US",
      ar: "ar-SA"
    };
    
    return date.toLocaleTimeString(localeMap[locale as keyof typeof localeMap] || "en-US", {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Analyse de Marché":
      case "Market Analysis":
      case "تحليل السوق":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Réglementation":
      case "Regulatory":
      case "تنظيمي":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Technologie":
      case "Technology":
      case "تكنولوجيا":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Banque":
      case "Banking":
      case "مصرفي":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (index: number) => {
    return "bg-white border-gray-200";
  };

  return (
    <Card className="h-full border border-gray-200 bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-900">
          <div className="p-2 bg-gray-100 rounded-lg">
            <ExternalLink className="w-5 h-5 text-gray-600" />
          </div>
          {t?.("title") || (locale === "fr" ? "Dernières Actualités" : locale === "ar" ? "آخر الأخبار" : "Latest News")}
          <Badge variant="secondary" className="ml-auto text-xs bg-gray-100 text-gray-600 border-gray-200">
            {mockNews.length} {locale === "fr" ? "articles" : locale === "ar" ? "مقالات" : "articles"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockNews.map((article, index) => (
            <div
              key={article.id}
              className={`group relative p-4 rounded-lg border bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer ${getPriorityColor(index)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-shrink-0">
                      {getTrendIcon(article.trend)}
                    </div>
                    <h4 className="font-medium text-lg text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200 leading-tight">
                      {article.title[locale as keyof typeof article.title]}
                    </h4>
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {article.content[locale as keyof typeof article.content]}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{formatTime(article.publishedAt)}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 font-medium">{article.readTime[locale as keyof typeof article.readTime]}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${getCategoryColor(article.category[locale as keyof typeof article.category])}`}
                  >
                    {article.category[locale as keyof typeof article.category]}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full py-3 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
            <span className="flex items-center justify-center gap-2">
              {t?.("viewAll") || (locale === "fr" ? "Voir Toutes les Actualités" : locale === "ar" ? "عرض جميع الأخبار" : "View All News")}
              <ExternalLink className="w-4 h-4" />
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaticDashNews;