"use client";

import type React from "react";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function AccountLinking() {
  const t = useTranslations("AccountLinking");

  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<AccountData[]>([
    {
      id: "1",
      codeAgent: "AG001",
      compteEspece: "ESP123456",
      compteTitre: "TTR123456",
      compteBancaire: "BNK789012",
      orderDeTu: "ORD001",
      client: "Jean Dupont",
      type: "Particulier",
    },
    {
      id: "2",
      codeAgent: "AG002",
      compteEspece: "ESP654321",
      compteTitre: "TTR654321",
      compteBancaire: "BNK210987",
      orderDeTu: "ORD002",
      client: "Société ABC",
      type: "Entreprise",
    },
    {
      id: "3",
      codeAgent: "AG003",
      compteEspece: "ESP789012",
      compteTitre: "TTR789012",
      compteBancaire: "BNK345678",
      orderDeTu: "ORD003",
      client: "Banque XYZ",
      type: "Institution Financière",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add new account logic would go here
    setOpen(false);
  };

  return (
    <div className="shadow-inner rounded-md bg-gray-50">
      <div className="container mx-auto py-10 px-4">
        <Card className="border-none  bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="pb-4 border-b bg-primary">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-white">
                {t("pageTitle")}
              </CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="gap-1 bg-white text-indigo-700 hover:bg-indigo-50 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("add")}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl">
                  <DialogHeader className="p-6 bg-gradient-to-r bg-primary text-white">
                    <DialogTitle className="text-xl font-bold">
                      {t("addNewLink")}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="client"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("client")}
                        </label>
                        <Input
                          id="client"
                          placeholder={t("enterClientName")}
                          className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="typeClient"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("type")}
                        </label>
                        <Select>
                          <SelectTrigger
                            id="typeClient"
                            className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder={t("selectType")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800">
                            <SelectItem value="particulier">
                              {t("individual")}
                            </SelectItem>
                            <SelectItem value="entreprise">
                              {t("company")}
                            </SelectItem>
                            <SelectItem value="institution">
                              {t("financialInstitution")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="agent"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("agent")}
                        </label>
                        <Select>
                          <SelectTrigger
                            id="agent"
                            className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder={t("selectAgent")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800">
                            <SelectItem value="agent1">Agent 1</SelectItem>
                            <SelectItem value="agent2">Agent 2</SelectItem>
                            <SelectItem value="agent3">Agent 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="codeBanque"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("bankCode")}
                        </label>
                        <Input
                          id="codeBanque"
                          placeholder={t("enterBankCode")}
                          className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="compteEspece"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("cashAccount")}
                        </label>
                        <Select>
                          <SelectTrigger
                            id="compteEspece"
                            className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder={t("selectAccount")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800">
                            <SelectItem value="esp1">ESP001</SelectItem>
                            <SelectItem value="esp2">ESP002</SelectItem>
                            <SelectItem value="esp3">ESP003</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="compteTitre"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("securitiesAccount")}
                        </label>
                        <Select>
                          <SelectTrigger
                            id="compteTitre"
                            className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder={t("selectAccount")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800">
                            <SelectItem value="ttr1">TTR001</SelectItem>
                            <SelectItem value="ttr2">TTR002</SelectItem>
                            <SelectItem value="ttr3">TTR003</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="compteBancaire"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("bankAccount")}
                        </label>
                        <Select>
                          <SelectTrigger
                            id="compteBancaire"
                            className="border-slate-300  dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder={t("selectAccount")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800">
                            <SelectItem value="bnk1">BNK001</SelectItem>
                            <SelectItem value="bnk2">BNK002</SelectItem>
                            <SelectItem value="bnk3">BNK003</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="submit" className="bg-primary text-white">
                        {t("validate")}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <div className="p-4 border-b bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("search")}
                className="pl-9 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Filter className="h-4 w-4 mr-1" />
                {t("filter")}
              </Button>
              <Select>
                <SelectTrigger className="w-[180px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("newest")}</SelectItem>
                  <SelectItem value="oldest">{t("oldest")}</SelectItem>
                  <SelectItem value="agent">{t("agentCode")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("client")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("agentCode")}</TableHead>
                  <TableHead>{t("cashAccount")}</TableHead>
                  <TableHead>{t("securitiesAccount")}</TableHead>
                  <TableHead>{t("bankAccount")}</TableHead>
                  <TableHead>{t("tuOrder")}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts?.map((account, index) => (
                  <TableRow
                    key={account.id}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50 dark:bg-slate-800/50"
                    }
                  >
                    <TableCell className="font-medium">
                      {account.client}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          account.type === "Particulier"
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                            : account.type === "Entreprise"
                            ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                            : "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                        }
                      >
                        {account.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800"
                      >
                        {account.codeAgent}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.compteEspece}</TableCell>
                    <TableCell>{account.compteTitre}</TableCell>
                    <TableCell>{account.compteBancaire}</TableCell>
                    <TableCell>{account.orderDeTu}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-blue-600"
                          onClick={() => {}}
                        >
                          <Eye className="h-5 w-5" />
                          <span className="sr-only">{t("view")}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-amber-600"
                          onClick={() => {}}
                        >
                          <Edit className="h-5 w-5" />
                          <span className="sr-only">{t("edit")}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-red-600"
                          onClick={() => {}}
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">{t("delete")}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div>
                {t("showing", {
                  from: 1,
                  to: accounts.length,
                  total: accounts.length,
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-8 px-3 border-slate-300 dark:border-slate-700"
                >
                  {t("previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-8 px-3 border-slate-300 dark:border-slate-700"
                >
                  {t("next")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface AccountData {
  id: string;
  codeAgent: string;
  compteEspece: string;
  compteTitre: string;
  compteBancaire: string;
  orderDeTu: string;
  client: string;
  type: string;
}
