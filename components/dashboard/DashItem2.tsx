import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import NegotiatiorStats from "@/components/NegotiatiorStats";
import { Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashItem2 = async () => {
  const session = (await getServerSession(auth)) as Session & {
    user: {
      roleid?: number;
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      {/* Box 1 : Statistiques négociateur */}
      <div className="lg:col-span-3 h-full">
        <div className="w-full bg-white h-full  flex flex-col">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <NegotiatiorStats />
          </CardContent>
        </div>
      </div>
      {/* Box 2 : Autre Statistique ou contenu */}
      <div className="lg:col-span-2 h-full">
        <div className="w-full bg-white h-full  flex flex-col">
          <CardHeader className="">
            <CardTitle className="text-xl font-semibold text-gray-900">
            Journal & Séance 
            </CardTitle>
          </CardHeader>
          <CardContent className="">
          <div className="flex mb-4 gap-2 w-full">
            <button className="px-4 py-3 rounded bg-primary text-white w-1/2 text-[0.9vw] font-normal">Journal des Opérations</button>
            <button className="px-4 py-3 rounded bg-primary text-white w-1/2 text-[0.9vw] font-normal">Séance résultat</button>
          </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default DashItem2;
