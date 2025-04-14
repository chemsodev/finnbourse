"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  ChevronDown,
  Check,
  X,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default function ClientDashboard() {
  const t = useTranslations("ClientDashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample client data based on the screenshot
  const clients = [
    {
      id: 1,
      name: "FURNITURE SARL",
      type: "Personne Morale",
      date: "8/20/2024",
      accountNumber: "0722323798",
      address: "ALGER",
      status: "verified",
    },
    {
      id: 2,
      name: "HAMID INT",
      type: "personne physique",
      date: "8/20/2024",
      accountNumber: "0722323798",
      address: "ALGER",
      status: "not verified",
    },
    {
      id: 3,
      name: "SLMI PIG",
      type: "Institution financier",
      date: "8/20/2024",
      accountNumber: "0722323798",
      address: "ALGER",
      status: "verified",
    },
    {
      id: 4,
      name: "MOCHIRI R",
      type: "Personne Morale",
      date: "8/20/2024",
      accountNumber: "0722323798",
      address: "ALGER",
      status: "verified",
    },
    {
      id: 5,
      name: "CCI ABOU",
      type: "Personne Morale",
      date: "8/20/2024",
      accountNumber: "0722323798",
      address: "ALGER",
      status: "verified",
    },
    {
      id: 6,
      name: "DENTA JA",
      type: "Personne Morale",
      date: "8/20/2024",
      accountNumber: "0722323798",
      address: "ALGER",
      status: "not verified",
    },
    {
      id: 7,
      name: "INVEST M",
      type: "Institution financier",
      date: "8/20/2024",
      accountNumber: "0722323798",
      address: "ALGER",
      status: "not verified",
    },
  ];

  return (
    <div>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-secondary">
            {t("title")}
          </h1>
          <div className="flex justify-end gap-4">
            <div className="bg-primary justify-between gap-20 p-2 text-sm rounded-md shadow-sm flex text-white">
              <div className="flex flex-col gap-1">
                <div>{t("totalClients")}</div>
                <div className="font-bold text-2xl">11 000</div>
                <div>{t("total")}</div>
              </div>
              <div className="flex flex-col justify-end">
                <Shuffle />
              </div>
            </div>
            <div className="bg-primary justify-between gap-8 p-2 text-sm rounded-md shadow-sm flex text-white">
              <div className="flex flex-col gap-1">
                <div>{t("numberByClientType")}</div>
                <div className="font-bold text-2xl">1 230</div>
                <div>{t("individuals")}</div>
              </div>
              <div className="flex flex-col justify-end">
                <Shuffle />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M4 7V2h10v4a2 2 0 0 0 2 2h4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
                <path d="M10 12h4" />
                <path d="M10 16h4" />
                <path d="M10 8h1" />
              </svg>
              {t("exportExcel")}
            </Button>
            <Link href="/clients/create-client">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> {t("add")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-white font-medium">
                  {t("name")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("type")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("date")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("accountNumber")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("address")}
                </TableHead>
                <TableHead className="text-white font-medium">
                  {t("status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients?.map((client) => (
                <TableRow key={client.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.type}</TableCell>
                  <TableCell>{client.date}</TableCell>
                  <TableCell>{client.accountNumber}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>
                    {client.status === "verified" ? (
                      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full w-fit">
                        <Check className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">
                          {t("verified")}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full w-fit">
                        <X className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">
                          {t("notVerified")}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
