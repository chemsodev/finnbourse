import React from "react";
import DashNews from "./DashNews";
import Messages from "../Messages";
import NoAccess from "../navigation/NoAccess";
import { getServerSession } from "next-auth";
import auth from "@/auth";

interface DashItem3Props {
  skipNews?: number;
  skipMessages?: number;
}
const DashItem3 = async () => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  return (
    <div className="md:w-[33%] h-full">
      {(userRole === 0 || userRole === 1) && <DashNews />}
      {(userRole === 2 || userRole === 3) && <Messages />}
    </div>
  );
};

export default DashItem3;
