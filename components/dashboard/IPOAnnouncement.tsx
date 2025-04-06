"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Bell, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface IPOAnnouncementProps {
  companyName: string;
  endDate: Date;
  description?: string;
  actionUrl?: string;
}

const IPOAnnouncement = ({
  companyName,
  endDate,
  description = "",
  actionUrl = "#",
}: IPOAnnouncementProps) => {
  const t = useTranslations("IPOAnnouncement");
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) {
    return null; // Don't display if subscription period has ended
  }

  return (
    <Card className="w-full mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-blue-800">
              {t("new_ipo")} - {companyName}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center mt-3 md:mt-0 space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border border-blue-100">
            <Clock className="h-4 w-4 text-blue-600" />
            <div className="text-sm">
              <span className="font-medium">{t("closes_in")}: </span>
              <span
                className={cn(
                  "font-bold",
                  timeLeft.days < 2 ? "text-red-600" : "text-blue-600"
                )}
              >
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                {timeLeft.seconds}s
              </span>
            </div>
          </div>

          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full md:w-auto"
            asChild
          >
            <a href={actionUrl}>
              {t("subscribe_now")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default IPOAnnouncement;
