import { getServerSession } from "next-auth";
import auth from "@/auth";

import NoAccess from "../navigation/NoAccess";

import OrdresTable from "../OrdresTable";

const DashItem1 = async () => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  return (
    <div className="md:w-[40%] h-full ">
      {(userRole === 1 || userRole === 3 || userRole === 2) && (
        <OrdresTable pageType="dashboard" skip={0} searchquery="" state="99" />
      )}
      {userRole === 0 && <NoAccess />}
    </div>
  );
};

export default DashItem1;
