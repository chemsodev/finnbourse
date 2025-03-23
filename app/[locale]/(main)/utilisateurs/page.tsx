import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserTypeSwitch from "@/components/UserTypeSwitch";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import MyPagination from "@/components/navigation/MyPagination";
import UsersTableSkeleton from "@/components/UsersTableSkeleton";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBarUsers";

const page = async (props: {
  searchParams?: Promise<{
    searchquery?: string;
    page?: string;
    userType?: string;
    status?: string;
  }>[];
}) => {
  const t = await getTranslations("clients");

  // Données fictives en dur
  const users = {
    listUsers: [
      {
        id: "1",
        fullname: "salime Olaoluwah",
        phonenumber: "090090497395",
        email: "salime@finetude.com",
        poste: "CEO",
        clientAffecte: "FINNETUDE",
        validation: "validateur 2",
        status: "Verified",
      },
      {
        id: "2",
        fullname: "chahin oda",
        phonenumber: "090090497395",
        email: "chahin@slikpis.com",
        poste: "DIRECTEUR",
        clientAffecte: "SLIK PIS",
        validation: "validateur 2",
        status: "Not Verified",
      },
      {
        id: "3",
        fullname: "houda slimi",
        phonenumber: "090090497395",
        email: "houda@bessa.com",
        poste: "GERENT",
        clientAffecte: "BESSA",
        validation: "validateur 2",
        status: "Verified",
      },
      {
        id: "4",
        fullname: "sami bikachy",
        phonenumber: "090090497395",
        email: "sami@finlab.com",
        poste: "DFC",
        clientAffecte: "FINLAB",
        validation: "validateur1",
        status: "Verified",
      },
      {
        id: "5",
        fullname: "Adekeye Olaoluwah",
        phonenumber: "090090497395",
        email: "adekeye@bessa.com",
        poste: "DC",
        clientAffecte: "BESSA",
        validation: "validateur1",
        status: "Verified",
      },
      {
        id: "6",
        fullname: "Nihad Olaoluwah",
        phonenumber: "090090497395",
        email: "nihad@bessa.com",
        poste: "Operateur",
        clientAffecte: "BESSA",
        validation: "Initiateur",
        status: "Verified",
      },
      {
        id: "7",
        fullname: "Esma wachdi",
        phonenumber: "090090497395",
        email: "esma@bessa.com",
        poste: "Operateur",
        clientAffecte: "BESSA",
        validation: "Consultation",
        status: "Verified",
      },
      {
        id: "8",
        fullname: "Yanis Toubi",
        phonenumber: "090090497395",
        email: "yanis@bessa.com",
        poste: "Propriétaire",
        clientAffecte: "Yanis toubi",
        validation: "Consultation",
        status: "Verified",
      },
    ],
  };

  const tableHeaders = [
    t("NomClient"),
    t("NTelephoneClient"),
    t("PosteClient"),
    t("ClientAffecteClient"),
    t("ValidationClient"),
    t("StatusClient"),
  ];

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3"></div>
      <div className="flex items-center mt-16 mb-8 ml-8 gap-3">
        <div className="text-3xl font-bold text-primary md:text-left text-center">
          {t("ajoutUtilisateur")}
        </div>
        <UserTypeSwitch />
      </div>
      <SearchBar />
      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <div className="my-4">
          <Suspense key={`users-0`} fallback={<UsersTableSkeleton />}>
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
                {users?.listUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.phonenumber}</TableCell>
                    <TableCell>{user.poste}</TableCell>
                    <TableCell>{user.clientAffecte}</TableCell>
                    <TableCell
                      className={`${
                        user.validation === "validateur 2"
                          ? "text-green-500"
                          : user.validation === "validateur1"
                          ? "text-orange-500"
                          : user.validation === "Initiateur"
                          ? "text-gray-500"
                          : "text-red-500"
                      }`}
                    >
                      {user.validation}
                    </TableCell>
                    <TableCell
                      className={`${
                        user.status === "Verified"
                          ? "text-[#15383E]"
                          : "text-[#D71F1F]"
                      }`}
                    >
                      <div
                        className={`${
                          user.status === "Verified"
                            ? "bg-[#227844] bg-opacity-20"
                            : "bg-[#D71F1F] bg-opacity-20"
                        } px-1 rounded-md py-1 text-center`}
                      >
                        {user.status}
                      </div>
                    </TableCell>

                    <TableCell className="flex justify-center items-center">
                      <Link href={`/utilisateurs/${user.id}`}>
                        <BsThreeDotsVertical />
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
