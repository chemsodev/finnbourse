"use client";

import type React from "react";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
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

export default function AccountLinking() {
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
                Lier le compte Espèce au compte Titre
              </CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="gap-1 bg-white text-indigo-700 hover:bg-indigo-50 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl">
                  <DialogHeader className="p-6 bg-gradient-to-r bg-primary text-white">
                    <DialogTitle className="text-xl font-bold">
                      Ajouter une nouvelle liaison
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="client"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Client
                        </label>
                        <Input
                          id="client"
                          placeholder="Entrez le nom du client"
                          className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="typeClient"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Type
                        </label>
                        <Select>
                          <SelectTrigger
                            id="typeClient"
                            className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800">
                            <SelectItem value="particulier">
                              Particulier
                            </SelectItem>
                            <SelectItem value="entreprise">
                              Entreprise
                            </SelectItem>
                            <SelectItem value="institution">
                              Institution Financière
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="agent"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Agent
                        </label>
                        <Select>
                          <SelectTrigger
                            id="agent"
                            className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder="Sélectionnez un agent" />
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
                          Code Banque
                        </label>
                        <Input
                          id="codeBanque"
                          placeholder="Entrez le code banque"
                          className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="compteEspece"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Compte Espèce
                        </label>
                        <Select>
                          <SelectTrigger
                            id="compteEspece"
                            className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder="Sélectionnez un compte" />
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
                          Compte Titre
                        </label>
                        <Select>
                          <SelectTrigger
                            id="compteTitre"
                            className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder="Sélectionnez un compte" />
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
                          Compte Bancaire
                        </label>
                        <Select>
                          <SelectTrigger
                            id="compteBancaire"
                            className="border-slate-300  dark:border-slate-700 dark:bg-slate-800"
                          >
                            <SelectValue placeholder="Sélectionnez un compte" />
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
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-primary text-white">
                        Valider
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
                placeholder="Rechercher..."
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
                Filtrer
              </Button>
              <Select>
                <SelectTrigger className="w-[180px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récent</SelectItem>
                  <SelectItem value="oldest">Plus ancien</SelectItem>
                  <SelectItem value="agent">Code Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-100 dark:bg-slate-800">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Client
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Type
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Code Agent
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Compte Espèce
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Compte Titre
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Compte Bancaire
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Order de Tu
                  </TableHead>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div>
                Affichage de 1 à {accounts.length} sur {accounts.length} entrées
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-8 px-3 border-slate-300 dark:border-slate-700"
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-8 px-3 border-slate-300 dark:border-slate-700"
                >
                  Suivant
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
