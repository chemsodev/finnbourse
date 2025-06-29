"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Order } from "@/lib/interfaces";
import OrdreDrawer from "@/components/gestion-des-ordres/OrdreDrawer";

// Mock data for demonstration - adapted to match Order interface
const mockSessions = [
  { id: "1", name: "Session Matinale", date: new Date("2025-05-01") },
  { id: "2", name: "Session Apres-midi", date: new Date("2025-05-01") },
  { id: "3", name: "Session Speciale", date: new Date("2025-05-02") },
];

const mockOrders: Order[] = [
  {
    id: "ord-123",
    securityissuer: "Sonatrach",
    securityid: "STH",
    securitytype: "action",
    securityquantity: 100,
    quantity: 100,
    orderdate: "2025-05-01",
    orderstatus: 2,
    orderdirection: 1,
    investorid: "Ahmed Benali",
    negotiatorid: "Karim Hadj",
    validity: "2025-05-01",
    duration: 1,
    createdat: "2025-05-01T09:30:00",
    payedWithCard: false,
    visaCosob: "VC001",
    isinCode: "DZ0000001234",
    emissionDate: "2025-01-01",
  },
  {
    id: "ord-124",
    securityissuer: "Air Algerie",
    securityid: "ALG",
    securitytype: "obligation",
    securityquantity: 50,
    quantity: 50,
    orderdate: "2025-05-01",
    orderstatus: 3,
    orderdirection: 2,
    investorid: "Fatima Zahra",
    negotiatorid: "Karim Hadj",
    validity: "2025-05-01",
    duration: 1,
    createdat: "2025-05-01T10:15:00",
    payedWithCard: false,
    visaCosob: "VC002",
    isinCode: "DZ0000005678",
    emissionDate: "2025-01-01",
  },
  {
    id: "ord-125",
    securityissuer: "Djezzy",
    securityid: "DJZ",
    securitytype: "action",
    securityquantity: 75,
    quantity: 75,
    orderdate: "2025-05-01",
    orderstatus: 4,
    orderdirection: 1,
    investorid: "Mohamed Amine",
    negotiatorid: "Samira Bouzid",
    validity: "2025-05-01",
    duration: 1,
    createdat: "2025-05-01T11:00:00",
    payedWithCard: false,
    visaCosob: "VC003",
    isinCode: "DZ0000009012",
    emissionDate: "2025-01-01",
  },
  {
    id: "ord-126",
    securityissuer: "Cevital",
    securityid: "CVT",
    securitytype: "action",
    securityquantity: 200,
    quantity: 200,
    orderdate: "2025-05-01",
    orderstatus: 2,
    orderdirection: 1,
    investorid: "Yacine Kaci",
    negotiatorid: "Samira Bouzid",
    validity: "2025-05-01",
    duration: 1,
    createdat: "2025-05-01T14:30:00",
    payedWithCard: false,
    visaCosob: "VC004",
    isinCode: "DZ0000003456",
    emissionDate: "2025-01-01",
  },
];

interface SessionOrdersProps {
  selectedSessionId?: string | null;
}

type SortField = 'id' | 'titre' | 'investisseur' | 'iob' | 'sens' | 'type' | 'quantity' | 'statut' | 'date';
type SortDirection = 'asc' | 'desc' | null;

export default function SessionOrders({ selectedSessionId }: SessionOrdersProps) {
  const t = useTranslations("mesOrdres");
  const tStatus = useTranslations("status");
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedSession, setSelectedSession] = useState<string>(
    selectedSessionId || "1"
  );
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Mettre à jour la session sélectionnée si la prop change
  useEffect(() => {
    if (selectedSessionId) {
      setSelectedSession(selectedSessionId);
    }
  }, [selectedSessionId]);

  // Filter orders for the selected session
  const sessionOrders = orders.filter((order) => {
    // For now, we'll simulate session assignment based on order ID
    // In real implementation, this would be based on sessionId field
    return selectedSession === "1" ? order.id.includes("123") || order.id.includes("124") || order.id.includes("125") :
           selectedSession === "2" ? order.id.includes("126") :
           selectedSession === "3" ? false : false;
  });

  // Sort function - same as OrdresTable
  const sortData = (data: Order[], field: SortField | null, direction: SortDirection) => {
    if (!direction || !field) return data;

    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'id':
          aValue = a.id || '';
          bValue = b.id || '';
          break;
        case 'titre':
          aValue = (a.securityissuer || '') + (a.securityid || '');
          bValue = (b.securityissuer || '') + (b.securityid || '');
          break;
        case 'investisseur':
          aValue = a.investorid || '';
          bValue = b.investorid || '';
          break;
        case 'iob':
          aValue = a.negotiatorid || '';
          bValue = b.negotiatorid || '';
          break;
        case 'sens':
          aValue = a.orderdirection;
          bValue = b.orderdirection;
          break;
        case 'type':
          aValue = a.securitytype || '';
          bValue = b.securitytype || '';
          break;
        case 'quantity':
          aValue = a.quantity || 0;
          bValue = b.quantity || 0;
          break;
        case 'statut':
          aValue = a.orderstatus || 0;
          bValue = b.orderstatus || 0;
          break;
        case 'date':
          aValue = new Date(a.createdat || '').getTime();
          bValue = new Date(b.createdat || '').getTime();
          break;
        default:
          return 0;
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  // Handle sort click - same as OrdresTable
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon - same as OrdresTable
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  // Get status background color - same as OrdresTable
  const getStatusBgColor = (statut: number) => {
    switch (statut) {
      case 0:
        return "bg-gray-600";
      case 1:
        return "bg-yellow-600";
      case 2:
        return "bg-blue-600";
      case 3:
        return "bg-green-600";
      case 4:
        return "bg-purple-600";
      case 5:
        return "bg-teal-600";
      case 6:
        return "bg-indigo-600";
      case 7:
        return "bg-orange-600";
      case 8:
        return "bg-pink-600";
      case 9:
        return "bg-red-600";
      case 10:
        return "bg-red-800";
      case 11:
        return "bg-gray-800";
      default:
        return "bg-gray-700";
    }
  };

  const sortedOrders = sortData(sessionOrders, sortField, sortDirection);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ordres de la Session</CardTitle>
            <CardDescription>
              Ordres assignés à la session: {mockSessions.find(s => s.id === selectedSession)?.name}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Select
                onValueChange={setSelectedSession}
                value={selectedSession}
              >
                <SelectTrigger id="session-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name} 
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="font-bold uppercase cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {getSortIcon('id')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('titre')}
                >
                  <div className="flex items-center">
                    {t("titre")}
                    {getSortIcon('titre')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('sens')}
                >
                  <div className="flex items-center">
                    {t("sens")}
                    {getSortIcon('sens')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    {t("type")}
                    {getSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center">
                    {t("quantity")}
                    {getSortIcon('quantity')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('statut')}
                >
                  <div className="flex items-center">
                    {t("statut")}
                    {getSortIcon('statut')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    {t("date")}
                    {getSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    Aucun ordre trouvé pour cette session
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order: Order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-bold overflow-x-scroll w-60">
                      {order?.id
                        ? order.id.split("-").slice(0, 2).join("-")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium capitalize">
                          {order?.securityissuer || "N/A"}
                        </div>
                        <div className="font-medium text-xs uppercase text-gray-400">
                          {order?.securityid || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`${
                        order.orderdirection === 1 ? "text-green-500" : "text-red-600"
                      }`}
                    >
                      {order.orderdirection === 1 ? t("achat") : t("vente")}
                    </TableCell>
                    <TableCell>
                      {order.securitytype === "action"
                        ? t("action")
                        : order.securitytype === "obligation"
                        ? t("obligation")
                        : order.securitytype === "sukuk"
                        ? t("sukuk")
                        : order.securitytype === "opv"
                        ? t("opv")
                        : order.securitytype === "titresparticipatifs"
                        ? t("titre_participatif")
                        : order.securitytype === "empruntobligataire"
                        ? t("emprunt_obligataire")
                        : order.securitytype}
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      <div
                        className={`w-fit py-0.5 px-2 rounded-full text-xs text-center text-white ${getStatusBgColor(Number(order.orderstatus))}`}
                      >
                        {order?.orderstatus === 0 && order?.payedWithCard
                          ? "Brouillon payé"
                          : order?.orderstatus === 0 && !order?.payedWithCard
                          ? tStatus("Draft")
                          : order?.orderstatus === 1
                          ? tStatus("Pending")
                          : order?.orderstatus === 2
                          ? tStatus("In_Progress")
                          : order?.orderstatus === 3
                          ? tStatus("Validated")
                          : order?.orderstatus === 4
                          ? tStatus("Being_Processed")
                          : order?.orderstatus === 5
                          ? tStatus("Completed")
                          : order?.orderstatus === 6
                          ? tStatus("Awaiting_Approval")
                          : order?.orderstatus === 7
                          ? tStatus("Ongoing")
                          : order?.orderstatus === 8
                          ? tStatus("Partially_Validated")
                          : order?.orderstatus === 9
                          ? tStatus("Expired")
                          : order?.orderstatus === 10
                          ? tStatus("Rejected")
                          : order?.orderstatus === 11
                          ? tStatus("Cancelled")
                          : "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(order.createdat).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <OrdreDrawer 
                        titreId={order.id} 
                        orderData={order}
                        isSouscription={order.securitytype === "empruntobligataire" || order.securitytype === "opv"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
