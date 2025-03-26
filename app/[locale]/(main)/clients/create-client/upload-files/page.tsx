"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Download,
  Upload,
  Check,
  Clock,
  User,
  Play,
  CheckCheck,
  PenBoxIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useRouter } from "@/i18n/routing";
import PdfDialog from "@/components/PdfDialog";
import MyPagination from "@/components/navigation/MyPagination";

export default function AdminDocuments() {
  const router = useRouter();

  const [documents, setDocuments] = useState([
    {
      id: 1,
      description: "Atts conservation des docs",
      poste: "DG",
      status: "valide",
      statusColor: "success",
      icon: <Check className="h-4 w-4" />,
    },
    {
      id: 2,
      description: "Conventione de courtage",
      poste: "DFC",
      status: "Disponible",
      statusColor: "warning",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 3,
      description: "Atts d'utilisation et de protection donnees personnelles",
      poste: "Négociateur",
      status: "Initiateur",
      statusColor: "info",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: 4,
      description: "fff",
      poste: "DG",
      status: "valide",
      statusColor: "success",
      icon: <Check className="h-4 w-4" />,
    },
    {
      id: 5,
      description: "Conventione de tenue de compte titre",
      poste: "DFC",
      status: "nd",
      statusColor: "default",
      icon: null,
    },
    {
      id: 6,
      description: "Atts. IOB",
      poste: "Négociateur",
      status: "nd",
      statusColor: "default",
      icon: null,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valide":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Disponible":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Initiateur":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-start my-8 gap-4 bg-slate-100 p-4 rounded-md">
        <Button size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">
          Documents Administratifs /
          <span className="text-secondary dark:text-gray-400"> SLIK PIS</span>
        </h1>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-gray-100 rounded-t-md dark:bg-gray-800">
          <CardTitle className="text-2xl">Documents Administratifs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary/90 ">
                <TableHead className="font-semibold text-white">
                  Description
                </TableHead>
                <TableHead className="font-semibold text-white">
                  poste
                </TableHead>
                <TableHead className="font-semibold text-white">
                  piece joint PDF
                </TableHead>
                <TableHead className="font-semibold text-center text-white">
                  TELECHARGEMENT
                </TableHead>
                <TableHead className="font-semibold text-center text-white">
                  UPLOAD
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc, index) => (
                <TableRow
                  key={doc.id}
                  className={
                    index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""
                  }
                >
                  <TableCell className="font-medium">
                    {doc.description}
                  </TableCell>
                  <TableCell>{doc.poste}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {doc.icon && <span className="mr-1">{doc.icon}</span>}
                      {doc.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <span className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        telecharger
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <span className="flex items-center gap-1">
                        <Upload className="h-4 w-4" />
                        Upload
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex flex-wrap justify-between items-center gap-4 mt-10">
        <div className="flex gap-4">
          <Button className="bg-secondary hover:bg-secondary/80">
            Relevé compte titre
          </Button>
          <Button className="bg-secondary hover:bg-secondary/80">
            Relevé compte espèce
          </Button>
        </div>

        <MyPagination />
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            Enregister brouillant
            <PenBoxIcon className="h-4 w-4" />
          </Button>
          <Button className="flex items-center gap-2">
            Valider
            <CheckCheck className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
