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
    <Card className="w-full border border-gray-200 bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
          <div className="p-2 bg-gray-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-gray-600" />
          </div>
          Statistiques
          <Badge variant="secondary" className="ml-auto text-xs bg-gray-100 text-gray-600 border-gray-200">
            Stats
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-auto">
          <NegotiatiorStats />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashItem2;
