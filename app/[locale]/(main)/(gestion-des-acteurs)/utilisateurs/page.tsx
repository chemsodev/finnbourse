"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Search, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserFilter from "@/components/UserFilter";
import UsersTableSkeleton from "@/components/UsersTableSkeleton";
import { Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

// Define our own User interface instead of importing
interface BaseUser {
  id: string;
  fullname: string;
  followsbusiness: boolean;
  roleid: number;
  phonenumber: string;
  email: string;
  address: string;
  birthdate: string;
  trustnumber: string;
  nationality: string;
  countryofresidence: string;
  negotiatorid: string;
  countryofbirth: string;
  profession: string;
  zipcode: string;
  status: number | string; // Support both number and string status
}

// Extend User type to include password and fields for all user types
interface ExtendedUser extends BaseUser {
  password?: string;
  // Client specific fields
  maidenName?: string;
  role?: string;
  wilaya?: string;
  idNumber?: string;
  // New client user fields with proper types
  userType?: "proprietaire" | "mandataire" | "tuteur_legal";
  // TCC fields
  position?: string;
  type?: string;
  // IOB fields
  matricule?: string;
  organisation?: string;
  // Agence fields
  agenceCode?: string;
  libAgence?: string;
  codeVille?: string;
  ordreDe?: string;
  parDefault?: string;
  compensation?: string;
  // Parent entity information
  parentEntityId?: string;
  parentEntityName?: string;
}

// Mock data for users
const mockUsers: ExtendedUser[] = [
  {
    id: "1",
    fullname: "Mohammed Ali",
    followsbusiness: false,
    roleid: 1, // Investisseur
    phonenumber: "+213 555-123-456",
    email: "mohammed.ali@example.com",
    address: "456 Business Ave, Oran",
    birthdate: "1985-06-20",
    trustnumber: "TR12345",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n1",
    countryofbirth: "Algeria",
    profession: "Financial Analyst",
    zipcode: "16000",
    status: 1,
    password: "Password123",
    // Client specific fields
    maidenName: "",
    role: "initiator",
    wilaya: "Oran",
    idNumber: "EF345678",
    userType: "proprietaire",
    // Parent entity information
    parentEntityId: "CL001",
    parentEntityName: "Ahmed Khalil",
  },
  {
    id: "2",
    fullname: "Sarah Ahmed",
    followsbusiness: false,
    roleid: 1, // Investisseur
    phonenumber: "+213 555-789-123",
    email: "sarah.ahmed@example.com",
    address: "45 Rue des Oliviers, Constantine",
    birthdate: "1990-11-23",
    trustnumber: "TR67890",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n2",
    countryofbirth: "Algeria",
    profession: "Investment Banker",
    zipcode: "31000",
    status: 1,
    password: "SecurePass456!",
    // Client specific fields
    maidenName: "Benali",
    role: "validator",
    wilaya: "Constantine",
    idNumber: "GH123456",
    userType: "mandataire",
    // Parent entity information
    parentEntityId: "CL002",
    parentEntityName: "Sonatrach Corp",
  },
  {
    id: "3",
    fullname: "John Doe",
    followsbusiness: true,
    roleid: 2, // IOB
    phonenumber: "+213 555-456-789",
    email: "john.doe@example.com",
    address: "78 Boulevard des Martyrs, Alger",
    birthdate: "1982-03-10",
    trustnumber: "TR54321",
    nationality: "Algerian",
    countryofresidence: "Algeria",
    negotiatorid: "n1",
    countryofbirth: "Algeria",
    profession: "IOB Manager",
    zipcode: "25000",
    status: 1,
    password: "StrongPwd789@",
    // IOB specific fields
    position: "DG",
    matricule: "",
    role: "Valideur 2",
    type: "IOBPage",
    organisation: "SGA",
    // Parent entity information
    parentEntityId: "IOB001",
    parentEntityName: "SGA Finance",
  },
  {
    id: "4",
    fullname: "John Doe",
    followsbusiness: false,
    roleid: 3, // TCC
    phonenumber: "123-456-7890",
    email: "john.doe@example.com",
    address: "12 Rue de la Liberté, Annaba",
    birthdate: "1988-07-20",
    trustnumber: "TR98765",
    nationality: "Algerian",
    countryofresidence: "Algeria",
    negotiatorid: "",
    countryofbirth: "Algeria",
    profession: "Financial Consultant",
    zipcode: "23000",
    status: 1,
    password: "LeiBen123#",
    position: "Manager",
    role: "initiator",
    type: "admin",
  },
  {
    id: "5",
    fullname: "Sagi Salim",
    followsbusiness: true,
    roleid: 4, // Agence
    phonenumber: "+213 555-876-543",
    email: "sagi.salim@example.com",
    address: "34 Avenue des Frères, Sétif",
    birthdate: "1975-12-05",
    trustnumber: "TR13579",
    nationality: "Algerian",
    countryofresidence: "Algeria",
    negotiatorid: "n3",
    countryofbirth: "Algeria",
    profession: "Agency Director",
    zipcode: "19000",
    status: 1,
    password: "SagiPassword123",
    // Agence specific fields
    position: "DG",
    matricule: "M001",
    role: "Validator 2",
    type: "admin",
    organisation: "SLIK PIS",
    // Parent entity information
    parentEntityId: "AG001",
    parentEntityName: "Agence Principale Sétif",
  },
  // New users below
  {
    id: "6",
    fullname: "Fatima Bensalem",
    followsbusiness: false,
    roleid: 1, // Investisseur
    phonenumber: "+213 555-222-333",
    email: "fatima.bensalem@example.com",
    address: "123 Avenue Larbi Ben M'hidi, Alger",
    birthdate: "1992-04-15",
    trustnumber: "TR54876",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n1",
    countryofbirth: "Algeria",
    profession: "Entrepreneur",
    zipcode: "16010",
    status: "inactif", // String status
    password: "Fatima2023!",
    maidenName: "Kaddour",
    role: "manager",
    wilaya: "Alger",
    idNumber: "JK987654",
    userType: "proprietaire",
    // Parent entity information
    parentEntityId: "CL003",
    parentEntityName: "BenTech Solutions",
  },
  {
    id: "7",
    fullname: "Karim Boudiaf",
    followsbusiness: true,
    roleid: 1, // Investisseur
    phonenumber: "+213 555-444-555",
    email: "karim.boudiaf@example.com",
    address: "87 Rue Didouche Mourad, Alger",
    birthdate: "1980-08-12",
    trustnumber: "TR65432",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n2",
    countryofbirth: "Algeria",
    profession: "Business Owner",
    zipcode: "16000",
    status: 0, // Numeric inactive
    password: "Karim@1980",
    maidenName: "",
    role: "approver",
    wilaya: "Alger",
    idNumber: "LM123456",
    userType: "tuteur_legal",
    // Parent entity information
    parentEntityId: "CL004",
    parentEntityName: "Société Générale Algérie",
  },
  {
    id: "8",
    fullname: "Nassima Rahmani",
    followsbusiness: false,
    roleid: 2, // IOB
    phonenumber: "+213 555-666-777",
    email: "nassima.rahmani@example.com",
    address: "45 Rue des Frères Boughadou, Blida",
    birthdate: "1986-12-23",
    trustnumber: "TR87654",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n3",
    countryofbirth: "Algeria",
    profession: "Investment Analyst",
    zipcode: "09000",
    status: "inactif", // String inactive
    password: "Nassima@2023",
    position: "Analyste",
    matricule: "IOB202",
    role: "Valideur 1",
    type: "IOBPage",
    organisation: "Invest Market",
    // Parent entity information
    parentEntityId: "IOB002",
    parentEntityName: "Invest Market Algeria",
  },
  {
    id: "9",
    fullname: "Ahmed Bouzid",
    followsbusiness: true,
    roleid: 2, // IOB
    phonenumber: "+213 555-888-999",
    email: "ahmed.bouzid@example.com",
    address: "22 Boulevard des Martyrs, Oran",
    birthdate: "1979-05-17",
    trustnumber: "TR43215",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n1",
    countryofbirth: "Algeria",
    profession: "Senior Broker",
    zipcode: "31000",
    status: 0, // Numeric inactive
    password: "Ahmed2023!",
    position: "Directeur Commercial",
    matricule: "IOB101",
    role: "Valideur 3",
    type: "IOBPage",
    organisation: "SGA",
    // Parent entity information
    parentEntityId: "IOB001",
    parentEntityName: "SGA Finance",
  },
  {
    id: "10",
    fullname: "Amina Khelif",
    followsbusiness: false,
    roleid: 3, // TCC
    phonenumber: "+213 555-111-222",
    email: "amina.khelif@example.com",
    address: "56 Rue Abane Ramdane, Constantine",
    birthdate: "1991-03-28",
    trustnumber: "TR12356",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "",
    countryofbirth: "Algeria",
    profession: "Compliance Officer",
    zipcode: "25000",
    status: "inactif", // String inactive
    password: "Amina2023!",
    position: "Manager Compliance",
    role: "validator",
    type: "compliance",
  },
  {
    id: "11",
    fullname: "Omar Benali",
    followsbusiness: true,
    roleid: 3, // TCC
    phonenumber: "+213 555-333-444",
    email: "omar.benali@example.com",
    address: "33 Boulevard Zighout Youcef, Alger",
    birthdate: "1984-09-14",
    trustnumber: "TR65478",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "",
    countryofbirth: "Algeria",
    profession: "Risk Analyst",
    zipcode: "16000",
    status: 1, // Numeric active
    password: "Omar@1984",
    position: "Analyste Senior",
    role: "auditor",
    type: "risk",
  },
  {
    id: "12",
    fullname: "Leila Messaoudi",
    followsbusiness: false,
    roleid: 4, // Agence
    phonenumber: "+213 555-555-666",
    email: "leila.messaoudi@example.com",
    address: "78 Avenue de l'ALN, Tlemcen",
    birthdate: "1982-11-05",
    trustnumber: "TR98754",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n2",
    countryofbirth: "Algeria",
    profession: "Branch Manager",
    zipcode: "13000",
    status: "actif", // String active
    password: "Leila2023!",
    position: "Directrice d'Agence",
    matricule: "A0023",
    role: "Manager",
    type: "agency",
    organisation: "Agence Tlemcen",
    // Parent entity information
    parentEntityId: "AG002",
    parentEntityName: "Agence Tlemcen Centre",
  },
  {
    id: "13",
    fullname: "Younes Cherif",
    followsbusiness: true,
    roleid: 4, // Agence
    phonenumber: "+213 555-777-888",
    email: "younes.cherif@example.com",
    address: "15 Boulevard Mohamed V, Annaba",
    birthdate: "1977-07-22",
    trustnumber: "TR36547",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n3",
    countryofbirth: "Algeria",
    profession: "Financial Advisor",
    zipcode: "23000",
    status: 0, // Numeric inactive
    password: "Younes@1977",
    position: "Conseiller Financier",
    matricule: "A0045",
    role: "Advisor",
    type: "agency",
    organisation: "Agence Annaba",
    // Parent entity information
    parentEntityId: "AG003",
    parentEntityName: "Agence Annaba Port",
  },
  {
    id: "14",
    fullname: "Samira Hadjadj",
    followsbusiness: false,
    roleid: 1, // Investisseur
    phonenumber: "+213 555-999-000",
    email: "samira.hadjadj@example.com",
    address: "43 Avenue Mustapha Ben Boulaid, Batna",
    birthdate: "1989-02-18",
    trustnumber: "TR78965",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "n2",
    countryofbirth: "Algeria",
    profession: "Doctor",
    zipcode: "05000",
    status: "actif", // String active
    password: "Samira@1989",
    maidenName: "Boukhalfa",
    role: "investor",
    wilaya: "Batna",
    idNumber: "NO123456",
    userType: "proprietaire",
    // Parent entity information
    parentEntityId: "CL005",
    parentEntityName: "Clinique El Shifa",
  },
  {
    id: "15",
    fullname: "Mustapha Benhamida",
    followsbusiness: true,
    roleid: 3, // TCC
    phonenumber: "+213 555-123-987",
    email: "mustapha.benhamida@example.com",
    address: "66 Rue Larbi Ben M'hidi, Sidi Bel Abbès",
    birthdate: "1983-06-30",
    trustnumber: "TR45698",
    nationality: "Algérienne",
    countryofresidence: "Algeria",
    negotiatorid: "",
    countryofbirth: "Algeria",
    profession: "IT Manager",
    zipcode: "22000",
    status: "actif", // String active
    password: "Mustapha@1983",
    position: "IT Director",
    role: "system admin",
    type: "tech",
  },
];

// Mock data for negociateurs
const mockNegociateurs = {
  listUsers: [
    { id: "n1", fullname: "Ibrahim Negotiator" },
    { id: "n2", fullname: "Fatima Negotiator" },
    { id: "n3", fullname: "Yousef Negotiator" },
  ],
};

export default function UtilisateursPage({
  searchParams,
}: {
  searchParams?: {
    searchquery?: string;
    userType?: string;
    status?: string;
  };
}) {
  const router = useRouter();
  const t = useTranslations("UtilisateursPage");
  const [searchQuery, setSearchQuery] = useState("");

  // Get values from URL parameters
  const roleId = Number(searchParams?.userType) || 1;
  const currentStatusFilter = searchParams?.status || "all";

  const userRole = 3; // Use a fixed role for demo - this would come from auth
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // For status change confirmation
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<string | null>(null);

  // For user details dialog
  const [userDetailDialog, setUserDetailDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);

  // Filter users based on search query and other filters
  const filteredUsers = mockUsers.filter((user: ExtendedUser) => {
    // Filter by role
    if (user.roleid !== roleId) {
      return false;
    }

    // Filter by status
    const userStatus = user.status;
    if (currentStatusFilter === "1" || currentStatusFilter === "actif") {
      // Filter for active users
      if (typeof userStatus === "number" && userStatus !== 1) return false;
      if (typeof userStatus === "string" && userStatus !== "actif")
        return false;
    } else if (
      currentStatusFilter === "0" ||
      currentStatusFilter === "inactif"
    ) {
      // Filter for inactive users
      if (typeof userStatus === "number" && userStatus !== 0) return false;
      if (typeof userStatus === "string" && userStatus !== "inactif")
        return false;
    }
    // If statusFilter is 'all', don't filter by status

    // Filter by search query
    if (
      searchQuery &&
      !user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.phonenumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Use filtered users for display
  const usersData = {
    listUsers: filteredUsers,
  };

  const togglePasswordVisibility = (userId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleToggleStatus = (userId: string) => {
    setUserToToggle(userId);
    setConfirmDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (!userToToggle) return;

    const userId = userToToggle;

    // Update the users directly in state by creating a new filtered list
    const updatedUsers = filteredUsers.map((user: ExtendedUser) => {
      if (user.id === userId) {
        // Determine the new status based on current type
        let newStatus;
        if (typeof user.status === "number") {
          newStatus = user.status === 1 ? 0 : 1;
        } else {
          newStatus = user.status === "actif" ? "inactif" : "actif";
        }

        console.log(
          `Toggling user ${user.fullname} status from ${user.status} to ${newStatus}`
        );

        // Return updated user
        return {
          ...user,
          status: newStatus,
        };
      }
      return user;
    });

    // Update original array to maintain reference
    mockUsers.length = 0;
    mockUsers.push(...updatedUsers);

    // Reset the confirmation dialog
    setConfirmDialogOpen(false);
    setUserToToggle(null);
  };

  const cancelToggleStatus = () => {
    setConfirmDialogOpen(false);
    setUserToToggle(null);
  };

  // Get table headers based on role ID
  const getTableHeaders = (roleId: number) => {
    switch (roleId) {
      case 1: // Investisseur (Client)
        return [
          "Nom/Prénom",
          "Email",
          "Mot de passe",
          "Type d'utilisateur",
          "Rôle",
          "Client",
          "Statut",
          "Actions",
        ];
      case 2: // IOB
        return [
          "Nom Complet",
          "Position",
          "Email",
          "Mot de passe",
          "Organisation",
          "Téléphone",
          "Statut",
          "Actions",
        ];
      case 3: // TCC
        return [
          "Nom Complet",
          "Position",
          "Matricule",
          "Rôle",
          "Type",
          "Email",
          "Mot de passe",
          "Statut",
          "Actions",
        ];
      case 4: // Agence
        return [
          "Nom Complet",
          "Position",
          "Email",
          "Mot de passe",
          "Organisation",
          "Téléphone",
          "Statut",
          "Actions",
        ];
      default:
        return [
          "Nom Complet",
          "Email",
          "Mot de passe",
          "Organisation",
          "Téléphone",
          "Statut",
          "Actions",
        ];
    }
  };

  // Get status text based on numeric or string status
  const getStatusText = (status: number | string) => {
    if (typeof status === "number") {
      return status === 1 ? "actif" : "inactif";
    }
    return status; // If it's already a string like "actif" or "inactif"
  };

  // Adjust the StatusFilter component to work with our local state
  const StatusFilterWrapper = () => {
    const handleStatusChange = (value: string) => {
      // Update URL with new status filter
      const params = new URLSearchParams(searchParams);
      if (value === "all") {
        params.delete("status");
      } else {
        params.set("status", value);
      }
      router.push(`?${params.toString()}`);
    };

    return (
      <div className="relative rounded-md w-48">
        <select
          className="w-full border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-primary focus:border-primary"
          value={currentStatusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>
    );
  };

  // Handle view user details
  const handleViewUserDetails = (user: ExtendedUser) => {
    setSelectedUser(user);
    setUserDetailDialog(true);
  };

  return (
    <div className="shadow-inner bg-gray-50 rounded-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-3xl font-bold text-secondary">
            {t("utilisateurs")}
          </h1>
          <div className="text-xs text-gray-500">{t("expl")}</div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {userRole === 3 && <UserFilter />}
            <StatusFilterWrapper />
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t("search")}
                className="pl-10 w-64 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <Suspense key={`users-table`} fallback={<UsersTableSkeleton />}>
            <Table>
              <TableHeader className="bg-primary">
                <TableRow>
                  {getTableHeaders(roleId).map((header, index: number) => (
                    <TableHead
                      key={index}
                      className="text-primary-foreground font-medium"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData && usersData.listUsers.length > 0 ? (
                  usersData.listUsers.map(
                    (user: ExtendedUser, index: number) => {
                      const isVisible = passwordVisibility[user.id] || false;
                      const password = user.password || "StrongPassword123";

                      // Status comes directly from the user object now
                      const userStatus = user.status;
                      const isActive =
                        typeof userStatus === "number"
                          ? userStatus === 1
                          : userStatus === "actif";

                      return (
                        <TableRow
                          key={user.id}
                          className={index % 2 === 1 ? "bg-gray-100" : ""}
                        >
                          {/* Investisseur (Client) fields */}
                          {roleId === 1 && (
                            <>
                              <TableCell className="whitespace-nowrap">
                                {user.fullname}
                              </TableCell>
                              <TableCell className="whitespace-nowrap max-w-[150px] truncate">
                                {user.email}
                              </TableCell>
                              <TableCell className="relative whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="truncate max-w-[80px]">
                                    {isVisible ? password : "••••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 ml-1 p-0"
                                    onClick={() =>
                                      togglePasswordVisibility(user.id)
                                    }
                                  >
                                    {isVisible ? (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                      <Eye className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.userType === "proprietaire"
                                  ? "Propriétaire"
                                  : user.userType === "mandataire"
                                  ? "Mandataire"
                                  : user.userType === "tuteur_legal"
                                  ? "Tuteur Légal"
                                  : "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.role || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <span className="font-medium text-primary">
                                  {user.parentEntityName || "-"}
                                </span>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center">
                                  <span
                                    className={`text-sm mr-2 font-medium ${
                                      isActive
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {getStatusText(userStatus)}
                                  </span>
                                  <Switch
                                    checked={isActive}
                                    onCheckedChange={() =>
                                      handleToggleStatus(user.id)
                                    }
                                    className={
                                      isActive
                                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                                    }
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleViewUserDetails(user)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </>
                          )}

                          {/* IOB fields */}
                          {roleId === 2 && (
                            <>
                              <TableCell className="whitespace-nowrap">
                                {user.fullname}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.position || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap max-w-[150px] truncate">
                                {user.email}
                              </TableCell>
                              <TableCell className="relative whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="truncate max-w-[80px]">
                                    {isVisible ? password : "••••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 ml-1 p-0"
                                    onClick={() =>
                                      togglePasswordVisibility(user.id)
                                    }
                                  >
                                    {isVisible ? (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                      <Eye className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.organisation || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.phonenumber}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center">
                                  <span
                                    className={`text-sm mr-2 font-medium ${
                                      isActive
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {getStatusText(userStatus)}
                                  </span>
                                  <Switch
                                    checked={isActive}
                                    onCheckedChange={() =>
                                      handleToggleStatus(user.id)
                                    }
                                    className={
                                      isActive
                                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                                    }
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleViewUserDetails(user)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </>
                          )}

                          {/* TCC fields */}
                          {roleId === 3 && (
                            <>
                              <TableCell className="whitespace-nowrap">
                                {user.fullname}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.position || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.matricule || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.role || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.type || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap max-w-[150px] truncate">
                                {user.email}
                              </TableCell>
                              <TableCell className="relative whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="truncate max-w-[80px]">
                                    {isVisible ? password : "••••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 ml-1 p-0"
                                    onClick={() =>
                                      togglePasswordVisibility(user.id)
                                    }
                                  >
                                    {isVisible ? (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                      <Eye className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center">
                                  <span
                                    className={`text-sm mr-2 font-medium ${
                                      isActive
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {getStatusText(userStatus)}
                                  </span>
                                  <Switch
                                    checked={isActive}
                                    onCheckedChange={() =>
                                      handleToggleStatus(user.id)
                                    }
                                    className={
                                      isActive
                                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                                    }
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleViewUserDetails(user)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </>
                          )}

                          {/* Agence fields */}
                          {roleId === 4 && (
                            <>
                              <TableCell className="whitespace-nowrap">
                                {user.fullname}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.position || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap max-w-[150px] truncate">
                                {user.email}
                              </TableCell>
                              <TableCell className="relative whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="truncate max-w-[80px]">
                                    {isVisible ? password : "••••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 ml-1 p-0"
                                    onClick={() =>
                                      togglePasswordVisibility(user.id)
                                    }
                                  >
                                    {isVisible ? (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                      <Eye className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.organisation || "-"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {user.phonenumber}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center">
                                  <span
                                    className={`text-sm mr-2 font-medium ${
                                      isActive
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {getStatusText(userStatus)}
                                  </span>
                                  <Switch
                                    checked={isActive}
                                    onCheckedChange={() =>
                                      handleToggleStatus(user.id)
                                    }
                                    className={
                                      isActive
                                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                                    }
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleViewUserDetails(user)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      );
                    }
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={getTableHeaders(roleId).length}
                      className="text-center"
                    >
                      {t("noUsers")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Suspense>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer le changement de statut</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir changer le statut de cet utilisateur ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-5">
            <Button variant="outline" onClick={cancelToggleStatus}>
              Annuler
            </Button>
            <Button onClick={confirmToggleStatus} variant="default">
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={userDetailDialog} onOpenChange={setUserDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Informations de base pour tous les types d'utilisateurs */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Informations Principales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nom complet
                    </p>
                    <p className="text-base">{selectedUser.fullname}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{selectedUser.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Téléphone
                    </p>
                    <p className="text-base">
                      {selectedUser.phonenumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Mot de passe
                    </p>
                    <p className="text-base">{selectedUser.password || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <p className="text-base">{selectedUser.address || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <p className="text-base">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          typeof selectedUser.status === "number"
                            ? selectedUser.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            : selectedUser.status === "actif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStatusText(selectedUser.status)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations spécifiques au client (Investisseur) */}
              {selectedUser.roleid === 1 && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    Informations Client
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Type d'utilisateur
                      </p>
                      <p className="text-base">
                        {selectedUser.userType === "proprietaire"
                          ? "Propriétaire"
                          : selectedUser.userType === "mandataire"
                          ? "Mandataire"
                          : selectedUser.userType === "tuteur_legal"
                          ? "Tuteur Légal"
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Nom de jeune fille
                      </p>
                      <p className="text-base">
                        {selectedUser.maidenName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rôle</p>
                      <p className="text-base">{selectedUser.role || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Client
                      </p>
                      <p className="text-base">
                        {selectedUser.parentEntityName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Wilaya
                      </p>
                      <p className="text-base">{selectedUser.wilaya || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Numéro d'identité
                      </p>
                      <p className="text-base">
                        {selectedUser.idNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date de naissance
                      </p>
                      <p className="text-base">
                        {selectedUser.birthdate || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Nationalité
                      </p>
                      <p className="text-base">
                        {selectedUser.nationality || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations spécifiques à l'IOB */}
              {selectedUser.roleid === 2 && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    Informations IOB
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Position
                      </p>
                      <p className="text-base">
                        {selectedUser.position || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Matricule
                      </p>
                      <p className="text-base">
                        {selectedUser.matricule || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rôle</p>
                      <p className="text-base">{selectedUser.role || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="text-base">{selectedUser.type || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Organisation
                      </p>
                      <p className="text-base">
                        {selectedUser.organisation || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date de naissance
                      </p>
                      <p className="text-base">
                        {selectedUser.birthdate || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Nationalité
                      </p>
                      <p className="text-base">
                        {selectedUser.nationality || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Profession
                      </p>
                      <p className="text-base">
                        {selectedUser.profession || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations spécifiques au TCC */}
              {selectedUser.roleid === 3 && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    Informations TCC
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Position
                      </p>
                      <p className="text-base">
                        {selectedUser.position || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rôle</p>
                      <p className="text-base">{selectedUser.role || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="text-base">{selectedUser.type || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Matricule
                      </p>
                      <p className="text-base">
                        {selectedUser.matricule || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date de naissance
                      </p>
                      <p className="text-base">
                        {selectedUser.birthdate || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Nationalité
                      </p>
                      <p className="text-base">
                        {selectedUser.nationality || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Profession
                      </p>
                      <p className="text-base">
                        {selectedUser.profession || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Trust Number
                      </p>
                      <p className="text-base">
                        {selectedUser.trustnumber || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations spécifiques à l'Agence */}
              {selectedUser.roleid === 4 && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    Informations Agence
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Position
                      </p>
                      <p className="text-base">
                        {selectedUser.position || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Matricule
                      </p>
                      <p className="text-base">
                        {selectedUser.matricule || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rôle</p>
                      <p className="text-base">{selectedUser.role || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="text-base">{selectedUser.type || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Organisation
                      </p>
                      <p className="text-base">
                        {selectedUser.organisation || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Agence Code
                      </p>
                      <p className="text-base">
                        {selectedUser.agenceCode || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Libellé Agence
                      </p>
                      <p className="text-base">
                        {selectedUser.libAgence || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Code Ville
                      </p>
                      <p className="text-base">
                        {selectedUser.codeVille || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Ordre De
                      </p>
                      <p className="text-base">{selectedUser.ordreDe || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Par Défaut
                      </p>
                      <p className="text-base">
                        {selectedUser.parDefault || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Compensation
                      </p>
                      <p className="text-base">
                        {selectedUser.compensation || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations complémentaires pour tous les utilisateurs */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Informations Complémentaires
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Pays de résidence
                    </p>
                    <p className="text-base">
                      {selectedUser.countryofresidence || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Pays de naissance
                    </p>
                    <p className="text-base">
                      {selectedUser.countryofbirth || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Code postal
                    </p>
                    <p className="text-base">{selectedUser.zipcode || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Trust Number
                    </p>
                    <p className="text-base">
                      {selectedUser.trustnumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      ID Négociateur
                    </p>
                    <p className="text-base">
                      {selectedUser.negotiatorid || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Suit l'entreprise
                    </p>
                    <p className="text-base">
                      {selectedUser.followsbusiness ? "Oui" : "Non"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
