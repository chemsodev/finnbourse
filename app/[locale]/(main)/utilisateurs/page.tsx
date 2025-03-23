import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserTypeSwitch from "@/components/UserTypeSwitch";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import MyPagination from "@/components/navigation/MyPagination";
import TabSearch from "@/components/TabSearch";
import { LIST_NEGOCIATEURS_QUERY, LIST_USERS_QUERY } from "@/graphql/queries";
import { User } from "@/lib/interfaces";
import UserFilter from "@/components/UserFilter";
import StatusFilter from "@/components/StatusFilter";
import UsersTableSkeleton from "@/components/UsersTableSkeleton";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";

import { getServerSession } from "next-auth";
import auth from "@/auth";
import { Suspense } from "react";
import LogOutAgent from "@/components/LogOutAgent";
import RateLimitReached from "@/components/RateLimitReached";

interface NegociateurGraphQLResponse {
  listUsers: {
    id: string;
    fullname: string;
  }[];
}

interface GetUsersResponse {
  listUsers: User[];
}

const page = async (props: {
  searchParams?: Promise<{
    searchquery?: string;
    page?: string;
    userType?: string;
    status?: string;
  }>;
}) => {
  const t = await getTranslations("clients");
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 0;
  const searchquery = searchParams?.searchquery || "";
  const roleid = Number(searchParams?.userType) || 1;
  const status =
    Number(searchParams?.status) === 0 || Number(searchParams?.status) === 1
      ? Number(searchParams?.status)
      : 1;
  const roleSwitcher = roleid;
  const take = 6;

  const getRoleIdFilter = () => {
    if (status === 1) {
      return userRole === 3 ? roleSwitcher : 1;
    } else if (status === 0) {
      return 0;
    }
    return {};
  };
  //comment
  const roleIdFilter = getRoleIdFilter();
  let users;
  try {
    users = await fetchGraphQL<GetUsersResponse>(
      LIST_USERS_QUERY,
      {
        skip: currentPage,
        take,
        searchquery,
        roleid: roleIdFilter,
        ...(userRole === 2 && { negotiatorid: session?.user.negotiatorId }),
      },
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    if (error === "Token is revoked") {
      return <LogOutAgent />;
    }
  }
  let negociateurs;
  try {
    negociateurs = await fetchGraphQL<NegociateurGraphQLResponse>(
      LIST_NEGOCIATEURS_QUERY
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    negociateurs = null;
  }
  const tableHeaders = [
    t("nom"),
    t("type"),
    t("email"),
    t("telephone"),
    ...(roleIdFilter === 1 ? [t("negociateur")] : []),
  ];
  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="mt-3"></div>
      <div className="flex items-center mt-16 mb-8 ml-8 gap-3">
        <div className="text-3xl font-bold text-primary md:text-left text-center">
          {t("ajoutUtilisateur")}
        </div>
        <UserTypeSwitch />
      </div>

      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <div className="flex justify-center gap-4 items-center md:justify-between flex-col md:flex-row">
          {userRole === 3 && <UserFilter />}
          {status === 2 && <div className="md:w-72"></div>}
          <StatusFilter />
          <div className="w-full md:w-fit">
            <TabSearch />
          </div>
        </div>
        <div className="my-4">
          <Suspense
            key={`users-${currentPage}`}
            fallback={<UsersTableSkeleton />}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users &&
                  users?.listUsers.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullname}</TableCell>
                      <TableCell className={"capitalize"}>
                        {user.followsbusiness
                          ? t("entreprise")
                          : t("particulier")}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phonenumber}</TableCell>
                      {user.roleid === 1 && (
                        <TableCell>
                          {
                            negociateurs?.listUsers.find(
                              (negociateur) =>
                                negociateur.id === user.negotiatorid
                            )?.fullname
                          }
                        </TableCell>
                      )}
                      <TableCell className="flex justify-center items-center">
                        <Link
                          href={`/utilisateurs/${user.id}`}
                          className=" rounded-md bg-primary py-1 px-4 text-white hover:bg-primary/80 shadow"
                        >
                          {t("plus")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                {users?.listUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t("noUsers")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Suspense>
        </div>
        <div className="flex justify-end">
          <MyPagination />
        </div>
      </div>
    </div>
  );
};

export default page;
