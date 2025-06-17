import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import { DashbpardPie } from "./DashboardPie";
import NegotiatiorStats from "../NegotiatiorStats";
import { Session } from "next-auth";

const DashItem2 = async () => {
  const session = (await getServerSession(auth)) as Session & {
    user: {
      roleid?: number;
    };
  };

  return (
    <div className="md:w-[25%] h-full">
      <NegotiatiorStats />
    </div>
  );
};

export default DashItem2;
