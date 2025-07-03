import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

const mockOrders = [
  {
    type: "A",
    nbre: 1,
    titre: "BDL",
    cours: 120.5,
    sens: "Achat",
    nom: "Société Alpha",
    volumedm: 1000,
    validite: "de jour",
    trans: 1,
    volumeaq: 800,
    reliquat: 200,
    statutf: "v1",
  },
  {
    type: "O",
    nbre: 2,
    titre: "MST",
    cours: 98.2,
    sens: "Vente",
    nom: "M. Ben Amar",
    volumedm: 500,
    validite: "de jour",
    trans: 2,
    volumeaq: 500,
    reliquat: 0,
    statutf: "new",
  },
  // Ajoute d'autres lignes mock si besoin
];

const columns = [
  { key: "type", label: "Type" },
  { key: "nbre", label: "Nbre" },
  { key: "titre", label: "Titre" },
  { key: "cours", label: "Cours" },
  { key: "sens", label: "Sens" },
  { key: "nom", label: "Nom/R.social" },
  { key: "volumedm", label: "Volume.dm" },
  { key: "validite", label: "Validité d'ordre" },
  { key: "trans", label: "Trans" },
  { key: "volumeaq", label: "Volume.AQ" },
  { key: "reliquat", label: "Reliquat" },
  { key: "statutf", label: "Statue.F" },
];

type SortField = keyof typeof mockOrders[0];
type SortDirection = 'asc' | 'desc' | null;

export default function CarnetOrdre() {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else setSortDirection('asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    if (sortDirection === 'asc') return <ChevronUp className="ml-1 h-4 w-4 text-blue-600" />;
    if (sortDirection === 'desc') return <ChevronDown className="ml-1 h-4 w-4 text-blue-600" />;
    return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;
  };

  const sortedData = React.useMemo(() => {
    if (!sortField || !sortDirection) return mockOrders;
    return [...mockOrders].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (sortDirection === 'asc') return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      else return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    });
  }, [sortField, sortDirection]);

  return (
    <div className="overflow-x-auto rounded border border-gray-200 bg-white" style={{ height: 315 }}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="cursor-pointer select-none"
                onClick={() => handleSort(col.key as SortField)}
              >
                <div className="flex items-center">
                  {col.label}
                  {getSortIcon(col.key as SortField)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((order, idx) => (
            <TableRow key={idx}>
              <TableCell className="text-center">{order.type}</TableCell>
              <TableCell className="text-center">{order.nbre}</TableCell>
              <TableCell>{order.titre}</TableCell>
              <TableCell className="text-right">{order.cours}</TableCell>
              <TableCell className="text-center">{order.sens}</TableCell>
              <TableCell>{order.nom}</TableCell>
              <TableCell className="text-right">{order.volumedm}</TableCell>
              <TableCell className="text-center">{order.validite}</TableCell>
              <TableCell className="text-center">{order.trans}</TableCell>
              <TableCell className="text-right">{order.volumeaq}</TableCell>
              <TableCell className="text-right">{order.reliquat}</TableCell>
              <TableCell className="text-center">{order.statutf}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
