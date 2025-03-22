import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import auth from "@/auth";
import ProfileForm from "@/components/ProfileForm";
import RateLimitReached from "@/components/RateLimitReached";
import { Separator } from "@/components/ui/separator";
import { FIND_UNIQUE_USER, GET_REST_USER_DATA } from "@/graphql/queries";

import { User } from "@/lib/interfaces";
import { getServerSession } from "next-auth/next";
import { getTranslations } from "next-intl/server";

interface GetUserResponse {
  findUniqueUser: User;
}
const page = async () => {
  const session = await getServerSession(auth);
  const myId = session?.user?.id;
  const t = await getTranslations("Profile");

  let userDetails: GetUserResponse | null = null;
  try {
    userDetails = await fetchGraphQL<GetUserResponse>(FIND_UNIQUE_USER, {
      userid: myId,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    userDetails = null;
  }
  let RestOfUserData: any;
  try {
    RestOfUserData = await fetchGraphQL<any>(GET_REST_USER_DATA, {
      userId: myId,
      type: "userdata",
    });
  } catch (error) {
    if (error === "Too many requests") {
      return <RateLimitReached />;
    }
    console.error("Error fetching orders:", error);
  }

  const transformUserData = (listData: any) => {
    return listData.reduce((acc: any, item: any) => {
      acc[item.name] = item.data;
      return acc;
    }, {});
  };

  const restOfuserData = transformUserData(RestOfUserData?.listData);
  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="flex flex-col gap-1 m-8 text-center md:ltr:text-left md:rtl:text-right">
        <div className="text-3xl font-bold text-primary">{t("profile")}</div>
        <div className="text-xs text-gray-500 md:max-w-[50%]">
          {t("profileDesc")}
        </div>
      </div>
      <Separator />
      <ProfileForm userDetails={userDetails} restOfuserData={restOfuserData} />
    </div>
  );
};

export default page;
