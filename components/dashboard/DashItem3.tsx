import React from "react";
import StaticDashNews from "./StaticDashNews";
import StaticMessages from "../StaticMessages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, MessageSquare } from "lucide-react";

const DashItem3 = () => {
  return (
    <Card className="w-full bg-gradient-to-br from-white to-slate-100 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-bold">
          <span className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            Actualités & Messages
          </span>
          <Badge variant="outline">News</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Actualités</h4>
          </div>
          <StaticDashNews />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Messages</h4>
          </div>
          <StaticMessages />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashItem3;
