"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { TrendingUp, Users, DollarSign } from "lucide-react";

const NegotiatiorStats = () => {
  const t = useTranslations("HomePage");

  return (
    <Card className="h-full flex flex-col gap-4 w-full bg-transparent border-none">
        <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Active Clients</span>
            </div>
            <span className="font-semibold">247</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm">Total Volume</span>
            </div>
            <span className="font-semibold">2.4M DZD</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Performance</span>
            </div>
            <span className="font-semibold text-green-600">+12.5%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NegotiatiorStats;
