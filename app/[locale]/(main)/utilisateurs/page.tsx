import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import MyPagination from "@/components/navigation/MyPagination";
import TabSearch from "@/components/TabSearch";
import { LIST_NEGOCIATEURS_QUERY, LIST_USERS_QUERY } from "@/graphql/queries";
import { User } from "@/lib/interfaces";
import UserFilter from "@/components/UserFilter";
import UsersTableSkeleton from "@/components/UsersTableSkeleton";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import Dropdown from "@/components/DropdownAddUsers";
import { getServerSession } from "next-auth";
import auth from "@/auth";
import { Suspense } from "react";
import LogOutAgent from "@/components/LogOutAgent";

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
    "Validation",
    "Statut",
  ];
  // Fonction pour générer des valeurs aléatoires
  const getRandomValidation = () => {
    const validations = [
      "validateur 2",
      "validateur 1",
      "Initiateur",
      "Consultation",
    ];
    return validations[Math.floor(Math.random() * validations.length)];
  };

  const getRandomStatus = () => {
    return Math.random() > 0.5 ? "Verified" : "Not Verified"; // 50% chance pour chaque statut
  };
  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3"></div>
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8 ">
        <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right capitalize">
          {t("utilisateurs")}
        </div>
        <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
          {t("expl")}
        </div>
      </div>
      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <div className="flex justify-center gap-4 items-center md:justify-between flex-col md:flex-row">
          {userRole === 3 && <UserFilter />}
          {status === 2 && <div className="md:w-72"></div>}
          <div className="w-full md:w-fit flex items-center gap-2">
            <TabSearch />
            <Dropdown />
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
                  users?.listUsers.map((user: User) => {
                    const randomValidation = getRandomValidation();
                    const randomStatus = getRandomStatus();
                    return (
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
                        <TableCell>
                          <span
                            className={
                              randomValidation === "validateur 2"
                                ? "text-[#4BB543]"
                                : randomValidation === "validateur 1"
                                ? "text-[#F6A300]"
                                : ""
                            }
                          >
                            {randomValidation}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              randomStatus === "Verified"
                                ? "text-[#15383E] px-2 py-1 rounded-md bg-[rgba(34,120,68,0.14)] min-w-[100px]" // Définit une largeur minimale de 100px
                                : "text-[#D71F1F] px-2 py-1 rounded-md bg-[rgba(215,31,31,0.11)] min-w-[100px]"
                            }
                          >
                            {randomStatus}
                          </span>
                        </TableCell>

                        <TableCell className="flex justify-center items-center">
                          <Link href={`/utilisateurs/${user.id}`}>
                            <BsThreeDotsVertical />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
