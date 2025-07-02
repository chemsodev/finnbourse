"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import SearchFilter from "../listed-company/search-filter";

const TitreTable = () => {
  const [view, setView] = useState("M.primaire");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock news data en français uniquement
  const mockNews = [
    {
      id: "1",
      titre: "Credit Populaire D'Algérie",
      type: "Action",
      Quantité: "20",
      value: "en attente"
    },
    {
      id: "2",
      titre: "Saidal",
      type: "Sukuk",
      Quantité: "43",
      value: "valide"
    },
    {
      id: "3",
      titre: "Alliance Assurances",
      type: "Sukuk",
      Quantité: "12",
      value: "en cours"
    },
    {
      id: "4",
      titre: "Biopharm",
      type: "Action",
      Quantité: "430",
      value: "fermer"
    },
    {
      id: "1",
      titre: "Credit Populaire D'Algérie",
      type: "Action",
      Quantité: "20",
      value: "en attente"
    },
    {
      id: "2",
      titre: "Saidal",
      type: "Sukuk",
      Quantité: "43",
      value: "valide"
    },
    {
      id: "3",
      titre: "Alliance Assurances",
      type: "Sukuk",
      Quantité: "12",
      value: "en cours"
    },
    {
      id: "2",
      titre: "Saidal",
      type: "Sukuk",
      Quantité: "43",
      value: "valide"
    },
    {
      id: "3",
      titre: "Alliance Assurances",
      type: "Sukuk",
      Quantité: "12",
      value: "en cours"
    },
    {
      id: "3",
      titre: "Alliance Assurances",
      type: "Sukuk",
      Quantité: "12",
      value: "en cours"
    },
    {
      id: "2",
      titre: "Saidal",
      type: "Sukuk",
      Quantité: "43",
      value: "valide"
    },
    {
      id: "3",
      titre: "Alliance Assurances",
      type: "Sukuk",
      Quantité: "12",
      value: "en cours"
    },
    {
      id: "2",
      titre: "Saidal",
      type: "Sukuk",
      Quantité: "43",
      value: "valide"
    },
  ];

  const filteredNews = mockNews.filter(
    (item) =>
      item.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Affiche tous les titres filtrés, mais limite la hauteur du tableau
  const displayedTitles = filteredNews;

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col flex-1">
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-bold text-gray-900">Titres</h2>
      </div>
      {/* Switch Buttons */}
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="inline-flex shadow border border-gray-200">
          <button
            className={`px-4 py-1 text-[0.8vw] font-medium focus:z-10 transition-colors transition-bg duration-200 ${view === "M.primaire" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"} rounded-l`}
            onClick={() => setView("M.primaire")}
          >
            M.primaire
          </button>
          <button
            className={`px-4 py-1 text-[0.8vw] font-medium focus:z-10 transition-colors transition-bg duration-200 ${view === "M.secondaire" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"} rounded-r`}
            onClick={() => setView("M.secondaire")}
          >
            M.secondaire
          </button>
        </div>
        <div className="w-64">
          <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      </div>
      <div style={{ maxHeight: '23vw', overflow: 'auto'}} className="flex-1">
        <Table className="bg-gray-50 w-full">
          <TableHeader className="bg-gray-50">
            <TableRow className="bg-gray-50">
              <TableHead className="bg-gray-50 text-black"></TableHead>
              <TableHead className="bg-gray-50 text-black">Titre</TableHead>
              <TableHead className="bg-gray-50 text-black">Type</TableHead>
              <TableHead className="bg-gray-50 text-black">Quantité</TableHead>
              <TableHead className="bg-gray-50 text-black">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-gray-50 h-full">
            {displayedTitles.map((item) => (
              <TableRow key={item.id} className="bg-gray-50">
                <TableCell>
                  <Image src="/LOGO.png" width={32} height={32} alt="logo" />
                </TableCell>
                <TableCell className="font-medium text-gray-900 max-w-[220px] truncate bg-gray-50">{item.titre}</TableCell>
                <TableCell className="text-gray-700 bg-gray-50">{item.type}</TableCell>
                <TableCell className="text-gray-500 max-w-[300px] truncate bg-gray-50">{item.Quantité}</TableCell>
                <TableCell className="text-gray-900 font-bold bg-gray-50">
                  <span
                    className={`inline-flex items-center justify-center w-16 h-6 rounded-full text-xs font-semibold
                      ${item.value === 'valide' ? 'bg-green-500'
                        : item.value === 'en attente' ? 'bg-yellow-400'
                        : item.value === 'en cours' ? 'bg-blue-500'
                        : item.value === 'fermer' ? 'bg-red-500'
                        : 'bg-gray-300'}
                      ${item.value === 'en attente' ? 'text-gray-900' : 'text-white'}
                    `}
                  >
                    {item.value}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TitreTable;