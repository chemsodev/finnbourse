import { getServerSession } from "next-auth";
import auth from "@/auth";
import { DashbpardPie } from "./DashboardPie";
import NegotiatiorStats from "./NegotiatiorStats";
import NoAccess from "./NoAccess";

const DashItem2 = async () => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;

  return (
    <div className="md:w-[25%] h-full ">
      {userRole === 1 && <DashbpardPie />}
      {(userRole === 2 || userRole === 3) && <NegotiatiorStats />}
      {userRole === 0 && <NoAccess />}
    </div>
  );
};

export default DashItem2;
