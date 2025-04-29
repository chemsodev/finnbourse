"use client";

import { useState } from "react";
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
import { Link } from "@/i18n/routing";
import MyPagination from "@/components/navigation/MyPagination";
import { Calendar } from "lucide-react";

export default function ClientDetails() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Formulaire</h1>
              {/* Form Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Type du client
                    </label>
                    <div className="flex gap-4">
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C01">(C01)</SelectItem>
                          <SelectItem value="C02">(C02)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Description" className="flex-1" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Référence unique du client
                    </label>
                    <Input placeholder="Référence client" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Nom, prénom / Raison social
                    </label>
                    <Input placeholder="Nom/Raison sociale" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        pièce d'identité
                      </label>
                      <Select>
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
                      <Input placeholder="Numéro" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      N° de NIF
                    </label>
                    <div className="relative">
                      <Input placeholder="Numéro NIF" />
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
                    <Input placeholder="Adresse complète" />
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      IOB associé
                    </label>
                    <div className="flex gap-4">
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="IOB" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="I005">(I005)</SelectItem>
                          <SelectItem value="I006">(I006)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Nom IOB" className="flex-1" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Compte titre
                    </label>
                    <Input placeholder="Compte titre" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Forme juridique
                    </label>
                    <Input placeholder="SPA, SARL, etc." />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Délivré le
                    </label>
                    <div className="relative">
                      <Input placeholder="Date" />
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
                    <Input placeholder="Numéro de registre" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      N° de Téléphone
                    </label>
                    <div className="relative">
                      <Input placeholder="Numéro de téléphone" />
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
                        <Input placeholder="Numéro du compte espèce" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Agence
                        </label>
                        <Select>
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
                      <Input placeholder="Nom de l'agence" />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Commission
                      </label>
                      <Input placeholder="Commission" />
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          N° du compte Titre
                        </label>
                        <Input placeholder="Numéro du compte titre" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Agence
                        </label>
                        <Select>
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
                      <Input placeholder="Nom de l'agence" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Commission
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
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
                        <Input placeholder="%" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={nextStep} className="bg-primary text-white">
                Suivant
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Documents</h1>
              {/* Upload Documents Section */}
              <Button onClick={prevStep} className="bg-secondary text-white">
                Précédent
              </Button>
              <Button onClick={nextStep} className="bg-primary text-white ml-4">
                Suivant
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Utilisateurs</h1>
              {/* Add Users Section */}
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
                    {/* Empty table - will be populated after client creation */}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" className="mt-4">
                + Ajouter un utilisateur
              </Button>
              <Button
                onClick={prevStep}
                className="bg-secondary text-white mt-4"
              >
                Précédent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
