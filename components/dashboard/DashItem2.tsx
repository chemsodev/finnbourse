import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import { DashbpardPie } from "./DashboardPie";
import NegotiatiorStats from "../NegotiatiorStats";
import { Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

const DashItem2 = async () => {
  const session = (await getServerSession(auth)) as Session & {
    user: {
      roleid?: number;
    };
  };

  return (
    <Card className="w-full h-full bg-gradient-to-br from-white to-slate-100 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-bold">
          <span className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Statistiques
          </span>
          <Badge variant="outline">Stats</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <NegotiatiorStats />
      </CardContent>
    </Card>
  );
};

export default DashItem2;
