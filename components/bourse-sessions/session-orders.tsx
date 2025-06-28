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
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { ChevronUp, ChevronDown } from "lucide-react";

// Mock data for demonstration
const mockSessions = [
  { id: "1", name: "Session Matinale", date: new Date("2025-05-01") },
  { id: "2", name: "Session Apres-midi", date: new Date("2025-05-01") },
  { id: "3", name: "Session Speciale", date: new Date("2025-05-02") },
];

const mockOrders = [
  {
    id: "ord-123",
    securityIssuer: "Sonatrach",
    securityCode: "STH",
    direction: 1, // 1 for buy, 2 for sell
    type: "stock",
    quantity: 100,
    status: 2, // In progress
    createdat: new Date("2025-05-01T09:30:00"),
    investorName: "Ahmed Benali",
    negotiatorName: "Karim Hadj",
    sessionId: null,
  },
  {
    id: "ord-124",
    securityIssuer: "Air Algerie",
    securityCode: "ALG",
    direction: 2,
    type: "bond",
    quantity: 50,
    status: 3, // Validated
    createdat: new Date("2025-05-01T10:15:00"),
    investorName: "Fatima Zahra",
    negotiatorName: "Karim Hadj",
    sessionId: "1",
  },
  {
    id: "ord-125",
    securityIssuer: "Djezzy",
    securityCode: "DJZ",
    direction: 1,
    type: "stock",
    quantity: 75,
    status: 4, // Being processed
    createdat: new Date("2025-05-01T11:00:00"),
    investorName: "Mohamed Amine",
    negotiatorName: "Samira Bouzid",
    sessionId: "1",
  },
  {
    id: "ord-126",
    securityIssuer: "Cevital",
    securityCode: "CVT",
    direction: 1,
    type: "stock",
    quantity: 200,
    status: 2, // In progress
    createdat: new Date("2025-05-01T14:30:00"),
    investorName: "Yacine Kaci",
    negotiatorName: "Samira Bouzid",
    sessionId: null,
  },
];

interface SessionOrdersProps {
  selectedSessionId?: string | null;
}

type SortField = 'securityIssuer' | 'direction' | 'quantity' | 'status' | 'investorName' | 'negotiatorName' | 'createdat';
type SortDirection = 'asc' | 'desc';

export default function SessionOrders({ selectedSessionId }: SessionOrdersProps) {
  const t = useTranslations("bourseSessions.orders");
  const [orders, setOrders] = useState(mockOrders);
  const [selectedSession, setSelectedSession] = useState<string>(
    selectedSessionId || "1" // Session actuelle par défaut
  );
  const [sortField, setSortField] = useState<SortField>('createdat');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Mettre à jour la session sélectionnée si la prop change
  useEffect(() => {
    if (selectedSessionId) {
      setSelectedSession(selectedSessionId);
    }
  }, [selectedSessionId]);

  const sessionOrders = orders.filter((order) => order.sessionId === selectedSession);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const sortOrders = (data: any[]) => {
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'securityIssuer':
          aValue = a.securityIssuer;
          bValue = b.securityIssuer;
          break;
        case 'direction':
          aValue = a.direction;
          bValue = b.direction;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'investorName':
          aValue = a.investorName;
          bValue = b.investorName;
          break;
        case 'negotiatorName':
          aValue = a.negotiatorName;
          bValue = b.negotiatorName;
          break;
        case 'createdat':
          aValue = a.createdat;
          bValue = b.createdat;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedOrders = sortOrders(sessionOrders);

  const assignOrderToSession = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, sessionId: selectedSession } : order
      )
    );
  };

  const removeOrderFromSession = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, sessionId: null } : order
      )
    );
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-gray-600">{t("status.draft")}</Badge>;
      case 1:
        return <Badge className="bg-yellow-600">{t("status.pending")}</Badge>;
      case 2:
        return <Badge className="bg-secondary">{t("status.inProgress")}</Badge>;
      case 3:
        return <Badge className="bg-green-600">{t("status.validated")}</Badge>;
      case 4:
        return (
          <Badge className="bg-purple-600">{t("status.processing")}</Badge>
        );
      case 5:
        return <Badge className="bg-teal-600">{t("status.completed")}</Badge>;
      default:
        return <Badge className="bg-gray-700">{t("status.unknown")}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ordres de la Session</CardTitle>
            <CardDescription>
              Ordres assignes a la session: {mockSessions.find(s => s.id === selectedSession)?.name}
            </CardDescription>
          </div>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('securityIssuer')}
                >
                  <div className="flex items-center">
                    Titre
                    {getSortIcon('securityIssuer')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('direction')}
                >
                  <div className="flex items-center">
                    Sens
                    {getSortIcon('direction')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantite
                    {getSortIcon('quantity')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Statut
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('investorName')}
                >
                  <div className="flex items-center">
                    Investisseur
                    {getSortIcon('investorName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('negotiatorName')}
                >
                  <div className="flex items-center">
                    Negociateur
                    {getSortIcon('negotiatorName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('createdat')}
                >
                  <div className="flex items-center">
                    Date
                    {getSortIcon('createdat')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Aucun ordre trouve pour cette session
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium capitalize">
                          {order.securityIssuer}
                        </div>
                        <div className="font-medium text-xs uppercase text-gray-400">
                          {order.securityCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={
                        order.direction === 1
                          ? "text-green-500"
                          : "text-red-600"
                      }
                    >
                      {order.direction === 1 ? "Achat" : "Vente"}
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{order.investorName}</TableCell>
                    <TableCell>{order.negotiatorName}</TableCell>
                    <TableCell>{format(order.createdat, "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => removeOrderFromSession(order.id)}
                      >
                        Retirer
                      </Button>
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
