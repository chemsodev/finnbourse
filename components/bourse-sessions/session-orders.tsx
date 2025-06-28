"use client";

import { useState } from "react";
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
  { id: "2", name: "Session Après-midi", date: new Date("2025-05-01") },
  { id: "3", name: "Session Spéciale", date: new Date("2025-05-02") },
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
    securityIssuer: "Air Algérie",
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

type SortField = 'security' | 'direction' | 'quantity' | 'status';
type SortDirection = 'asc' | 'desc';

export default function SessionOrders() {
  const t = useTranslations("bourseSessions.orders");
  const [orders, setOrders] = useState(mockOrders);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('security');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const unprocessedOrders = orders.filter((order) => order.sessionId === null);
  const sessionOrders = selectedSession
    ? orders.filter((order) => order.sessionId === selectedSession)
    : [];

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

  const sortOrders = (data: typeof orders) => {
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'security':
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

  const sortedUnprocessedOrders = sortOrders(unprocessedOrders);
  const sortedSessionOrders = sortOrders(sessionOrders);

  const assignOrderToSession = (orderId: string) => {
    if (!selectedSession) return;

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
      <div className="flex items-center gap-4">
        <div className="w-64">
          <Label htmlFor="session-select">{t("selectSession")}</Label>
          <Select
            onValueChange={setSelectedSession}
            value={selectedSession || undefined}
          >
            <SelectTrigger id="session-select">
              <SelectValue placeholder={t("chooseSession")} />
            </SelectTrigger>
            <SelectContent>
              {mockSessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {session.name} ({format(session.date, "dd/MM/yyyy")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Unprocessed Orders */}
        <Card>
          <CardHeader>
            <CardTitle>{t("unassignedTitle")}</CardTitle>
            <CardDescription>{t("unassignedDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('security')}
                  >
                    <div className="flex items-center">
                      {t("tableHeaders.security")}
                      {getSortIcon('security')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('direction')}
                  >
                    <div className="flex items-center">
                      {t("tableHeaders.direction")}
                      {getSortIcon('direction')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center">
                      {t("tableHeaders.quantity")}
                      {getSortIcon('quantity')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      {t("tableHeaders.status")}
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    {t("tableHeaders.action")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUnprocessedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      {t("noUnassignedOrders")}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedUnprocessedOrders.map((order) => (
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
                        {order.direction === 1
                          ? t("directions.buy")
                          : t("directions.sell")}
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => assignOrderToSession(order.id)}
                          disabled={!selectedSession}
                        >
                          {t("actions.assign")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Session Orders */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sessionOrdersTitle")}</CardTitle>
            <CardDescription>
              {selectedSession
                ? t("sessionOrdersDescription", {
                    sessionName: mockSessions.find(
                      (s) => s.id === selectedSession
                    )?.name,
                  })
                : t("selectSessionPrompt")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('security')}
                  >
                    <div className="flex items-center">
                      {t("tableHeaders.security")}
                      {getSortIcon('security')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('direction')}
                  >
                    <div className="flex items-center">
                      {t("tableHeaders.direction")}
                      {getSortIcon('direction')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center">
                      {t("tableHeaders.quantity")}
                      {getSortIcon('quantity')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      {t("tableHeaders.status")}
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    {t("tableHeaders.action")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!selectedSession ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      {t("selectSessionPrompt")}
                    </TableCell>
                  </TableRow>
                ) : sortedSessionOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      {t("noSessionOrders")}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedSessionOrders.map((order) => (
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
                        {order.direction === 1
                          ? t("directions.buy")
                          : t("directions.sell")}
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => removeOrderFromSession(order.id)}
                        >
                          {t("actions.remove")}
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
    </div>
  );
}
