"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Phone,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Link, useRouter } from "@/i18n/routing";
import MyPagination from "@/components/navigation/MyPagination";

export default function ClientDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;
  const router = useRouter();

  return (
    <div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-start mb-8 gap-4 bg-slate-100 p-4 rounded-md">
            <Button size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-end gap-3">
              <h1 className="text-3xl font-bold ">Client :</h1>
              <span className="text-2xl text-secondary">SLIK PIS</span>
            </div>
          </div>

          {/* Main Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Type du client
                </label>
                <div className="flex gap-4">
                  <Select defaultValue="C01">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C01">(C01)</SelectItem>
                      <SelectItem value="C02">(C02)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    defaultValue="Institution Financière"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Nom, prénom / Raison social
                </label>
                <Input defaultValue="SLIK PIS" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    pièce d'identité
                  </label>
                  <Select defaultValue="CIN">
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CIN">CIN</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    N° de la pièce
                  </label>
                  <Input />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  N° de NIF
                </label>
                <div className="relative">
                  <Input defaultValue="4235345 343445 4543524" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Adresse
                </label>
                <Input defaultValue="08 DJNENE EL MALIK HYDRA ALGER 08 DJNENE EL MALIK HYDRA ALGER" />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  IOB associé
                </label>
                <div className="flex gap-4">
                  <Select defaultValue="I005">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="IOB" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I005">(I005)</SelectItem>
                      <SelectItem value="I006">(I006)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input defaultValue="INVEST MARKET" className="flex-1" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Forme juridique
                </label>
                <Input defaultValue="SPA" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Délivré le
                </label>
                <div className="relative">
                  <Input />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  N° de Registre
                </label>
                <Input defaultValue="RC 423RC 4235345" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  N° de Téléphone
                </label>
                <div className="relative">
                  <Input defaultValue="045 45656 7547" />
                </div>
              </div>
            </div>
          </div>

          {/* Domiciliation Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Domiciliation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      N° du compte Espèce
                    </label>
                    <Input defaultValue="4235345 343445 4543524" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Agence
                    </label>
                    <Select defaultValue="176">
                      <SelectTrigger>
                        <SelectValue placeholder="Agence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="176">176</SelectItem>
                        <SelectItem value="177">177</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  <Input defaultValue="Birkhsadem" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Commission
                  </label>
                  <Input defaultValue="" />
                </div>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      N° du compte Titre
                    </label>
                    <Input defaultValue="4235345 343445 4543524" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Agence
                    </label>
                    <Select defaultValue="176">
                      <SelectTrigger>
                        <SelectValue placeholder="Agence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="176">176</SelectItem>
                        <SelectItem value="177">177</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  <Input defaultValue="Birkhsadem" />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commission
                    </label>
                    <Select defaultValue="Action">
                      <SelectTrigger>
                        <SelectValue placeholder="Commission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Action">Action</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Type
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="type1">Type 1</SelectItem>
                        <SelectItem value="type2">Type 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      &nbsp;
                    </label>
                    <Input defaultValue="1%" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Utilisateurs affecté</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Nom</TableHead>
                    <TableHead>prenom</TableHead>
                    <TableHead>poste</TableHead>
                    <TableHead>validation</TableHead>
                    <TableHead>Organisme/p.physique</TableHead>
                    <TableHead>statut</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>sagi</TableCell>
                    <TableCell>salim</TableCell>
                    <TableCell>DG</TableCell>
                    <TableCell className="text-green-500">
                      validateur 2
                    </TableCell>
                    <TableCell>SLIK PIS</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        ⋮
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>gadh</TableCell>
                    <TableCell>mohamed</TableCell>
                    <TableCell>DFC</TableCell>
                    <TableCell className="text-amber-500">
                      validateur1
                    </TableCell>
                    <TableCell>SLIK PIS</TableCell>
                    <TableCell>Mbre</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        ⋮
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>slmi</TableCell>
                    <TableCell>kadour</TableCell>
                    <TableCell>Négociateur</TableCell>
                    <TableCell>Initiateur</TableCell>
                    <TableCell>SLIK PIS</TableCell>
                    <TableCell>Mbre</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        ⋮
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hamid</TableCell>
                    <TableCell>Mokrane</TableCell>
                    <TableCell>Négociateur</TableCell>
                    <TableCell className="text-gray-500">
                      Consultation
                    </TableCell>
                    <TableCell>SLIK PIS</TableCell>
                    <TableCell>Mbre</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        ⋮
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-4">
              <Button className="bg-secondary hover:bg-secondary/80">
                Relevé compte titre
              </Button>
              <Button className="bg-secondary hover:bg-secondary/80">
                Relevé compte espèce
              </Button>
            </div>

            <MyPagination />
            <Link href="/clients/create-client/upload-files">
              <Button
                variant="outline"
                className="bg-primary text-white hover:bg-primary/80 flex items-center gap-2"
              >
                Documents & Justificatifs
                <Play className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
