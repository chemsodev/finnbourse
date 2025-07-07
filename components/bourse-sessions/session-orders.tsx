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
import {
  mockOrders,
  filterOrdersBySearchQuery,
  filterOrdersByStatus,
  filterOrdersByMarketType,
  paginateOrders,
} from "@/lib/mockData";
import OrdresTable from "@/components/gestion-des-ordres/OrdresTable";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { mockSessions } from "./session-management";
import PDFDropdownMenu from "@/components/gestion-des-ordres/PDFDropdownMenu";

interface SessionOrdersProps {
  selectedSessionId?: string | null;
}

type SortField = 'id' | 'titre' | 'investisseur' | 'iob' | 'sens' | 'type' | 'quantity' | 'statut' | 'date';
type SortDirection = 'asc' | 'desc' | null;

export default function SessionOrders({ selectedSessionId }: SessionOrdersProps) {
  const t = useTranslations("mesOrdres");
  const tStatus = useTranslations("status");
  const session = useSession();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>(
    selectedSessionId || "1"
  );
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [loading, setLoading] = useState(true);
  const [ordersWithResponses, setOrdersWithResponses] = useState<Record<string, boolean>>({});
  const [marketType, setMarketType] = useState<"secondaire" | "primaire">("secondaire");

  const STATUS_SATISFIED = 8; 
  const STATUS_UNSATISFIED = 9; 
  const STATUS_PLANNED = 2;

  // Ajout état pour le tri
  const [sortFieldTerminee, setSortFieldTerminee] = useState<string | null>(null);
  const [sortDirectionTerminee, setSortDirectionTerminee] = useState<'asc' | 'desc' | null>(null);

  // Mettre à jour la session sélectionnée si la prop change
  useEffect(() => {
    if (selectedSessionId) {
      setSelectedSession(selectedSessionId);
    }
  }, [selectedSessionId]);

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

  // Filter orders for the selected session - different logic based on session status
  const filterOrdersByPageAndRole = (orders: Order[], sessionStatus: string) => {
    switch (sessionStatus) {
      case "active":
        return orders.filter((order) => order.orderstatus === 5);
      case "scheduled":
        return orders.filter((order) => order.orderstatus === STATUS_PLANNED);
      case "completed":
        return orders.filter((order) =>
          order.orderstatus === STATUS_SATISFIED || order.orderstatus === STATUS_UNSATISFIED
        );
      default:
        return [];
    }
  };

  useEffect(() => {
    // Simulate API loading
    setLoading(true);

    // Add a small delay to simulate network request
    const timer = setTimeout(() => {
      try {
        // Apply filters in sequence
        let filteredData = [...mockOrders];

        // Get session data
        const selectedSessionData = mockSessions.find(s => s.id === selectedSession);
        
        if (selectedSessionData) {
          // Apply page-specific filters based on session status
          filteredData = filterOrdersByPageAndRole(filteredData, selectedSessionData.status);
          
          // In real implementation, this would filter by sessionId
          // For now, simulate session assignment based on order ID
          filteredData = filteredData.filter((order) => {
            if (selectedSession === "1") {
              return order.id.includes("123") || order.id.includes("124") || order.id.includes("125") || 
                     order.id.includes("456") || order.id.includes("789") || order.id.includes("012");
            } else if (selectedSession === "2") {
              return order.id.includes("126") || order.id.includes("345") || order.id.includes("678");
            } else if (selectedSession === "3") {
              return order.id.includes("999") || order.id.includes("888") || order.id.includes("777");
            }
            return false;
          });
        } else {
          filteredData = [];
        }

        setOrders(filteredData);
      } catch (error) {
        console.error("Error processing orders:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedSession]);

  // Separate effect for sorting
  useEffect(() => {
    if (!loading && orders.length > 0) {
      let sortedData = [...orders];
      
      // Apply sorting
      if (sortField && sortDirection) {
        sortedData = sortData(sortedData, sortField, sortDirection);
      }
      
      setOrders(sortedData);
    }
  }, [sortField, sortDirection, loading]);

  const sortedOrders = orders;

  if (loading) {
    return <div>Loading...</div>;
  }

  const selectedSessionData = mockSessions.find(s => s.id === selectedSession);

  if (selectedSessionData?.status === "active" && selectedSessionData?.id === "2") {
    // On récupère les mêmes paramètres que dans /ordres/execution
    const currentPage = Number(searchParams?.get("page")) || 0;
    const searchquery = searchParams?.get("searchquery") || "";
    const state = searchParams?.get("state") || "99";
    const userRole = (session.data as any)?.user?.roleid;
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ordres de la Session</CardTitle>
              <CardDescription>
                Ordres assignés à la session: {selectedSessionData?.name}
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
            <div className="flex mb-4 items-center justify-between">
              <div className="flex flex-row">
                <Button
                  variant={marketType === "secondaire" ? "default" : "outline"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setMarketType("secondaire")}
                >
                  Carnet d'ordres
                </Button>
                <Button
                  variant={marketType === "primaire" ? "default" : "outline"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setMarketType("primaire")}
                >
                  Souscriptions
                </Button>
              </div>
              <PDFDropdownMenu customTitle="Impression" />
            </div>
            <OrdresTable
              searchquery={searchquery}
              skip={currentPage}
              state={state}
              marketType={marketType}
              pageType="orderExecution"
              userRole={userRole?.toString() || "1"}
              userType="iob"
              activeTab="all"
              showActionColumn={false}
              showResponseButton={false}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pour toutes les autres sessions, on passe le contenu filtré (sortedOrders)
  // Si le tableau est vide, on ajoute une ligne d'exemple factice pour la démo
  const displayOrders = sortedOrders.length > 0 ? sortedOrders : [
    {
      id: 'EXEMPLE-VIDE',
      securityissuer: 'Exemple Société',
      securitytype: 'action',
      securityid: 'EX-000',
      securityquantity: 1000,
      quantity: 10,
      orderdate: new Date().toISOString(),
      orderstatus: 5,
      investorid: 'INV-EX',
      negotiatorid: 'NEG-EX',
      validity: '30',
      duration: 5,
      createdat: new Date().toISOString(),
      payedWithCard: false,
      visaCosob: 'VISA-EX',
      isinCode: 'DZ0000000EX',
      emissionDate: new Date().toISOString(),
      mst: '1000 DA',
      orderdirection: 1,
      priceInstruction: 'au mieux',
      timeInstruction: 'à durée limitée',
      validityDate: new Date().toISOString(),
      totalShares: 10000,
      grossAmount: '10000 DA',
      commission: '1 %',
      netAmount: '10100 DA',
    }
  ];

  // Ajoute l'index et les champs calculés à chaque ligne pour le tri spécial
  type TermineeRow = typeof displayOrders[0] & { idx: number, statut: string, transaction: number, reliquat: number };
  const displayOrdersWithIdx: TermineeRow[] = displayOrders.map((o, idx) => ({
    ...o,
    idx,
    statut: idx % 2 === 0 ? 'Satisfait' : 'Non satisfait',
    transaction: idx % 2 === 0 ? 1 : 0,
    reliquat: idx % 2 !== 0 ? 80 : 0
  }));
  const sortDataTerminee = (data: TermineeRow[], field: string | null, direction: 'asc' | 'desc' | null) => {
    if (!field || !direction) return data;
    return [...data].sort((a, b) => {
      let aValue: any = 0;
      let bValue: any = 0;
      switch (field) {
        case 'idx': aValue = a.idx; bValue = b.idx; break;
        case 'id': aValue = a.id; bValue = b.id; break;
        case 'securityissuer': aValue = a.securityissuer; bValue = b.securityissuer; break;
        case 'orderdirection': aValue = a.orderdirection; bValue = b.orderdirection; break;
        case 'quantity': aValue = a.quantity; bValue = b.quantity; break;
        case 'statut': aValue = a.statut; bValue = b.statut; break;
        case 'transaction': aValue = a.transaction; bValue = b.transaction; break;
        case 'reliquat': aValue = a.reliquat; bValue = b.reliquat; break;
        default: return 0;
      }
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      if (direction === 'asc') return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    });
  };
  const sortedDisplayOrders: TermineeRow[] = sortDataTerminee(displayOrdersWithIdx, sortFieldTerminee, sortDirectionTerminee);

  // Gestion du clic sur l'en-tête
  const handleSortTerminee = (field: string) => {
    if (sortFieldTerminee === field) {
      if (sortDirectionTerminee === 'asc') setSortDirectionTerminee('desc');
      else if (sortDirectionTerminee === 'desc') { setSortDirectionTerminee(null); setSortFieldTerminee(null); }
      else setSortDirectionTerminee('asc');
    } else {
      setSortFieldTerminee(field);
      setSortDirectionTerminee('asc');
    }
  };

  // Icône de tri
  const getSortIconTerminee = (field: string) => {
    if (sortFieldTerminee !== field) return <ChevronsUpDown className="inline ml-1 h-4 w-4 text-gray-400" />;
    if (sortDirectionTerminee === 'asc') return <ChevronUp className="inline ml-1 h-4 w-4 text-blue-600" />;
    if (sortDirectionTerminee === 'desc') return <ChevronDown className="inline ml-1 h-4 w-4 text-blue-600" />;
    return <ChevronsUpDown className="inline ml-1 h-4 w-4 text-gray-400" />;
  };

  // Filtrage optionnel des données (à adapter selon ta logique métier)
  const filteredDisplayOrders = displayOrders.filter(order => {
    if (marketType === "primaire") {
      return order.securitytype === "empruntobligataire" || order.securitytype === "opv";
    } else {
      return order.securitytype !== "empruntobligataire" && order.securitytype !== "opv";
    }
  });
  const filteredSortedDisplayOrders = sortedDisplayOrders.filter(order => {
    if (marketType === "primaire") {
      return order.securitytype === "empruntobligataire" || order.securitytype === "opv";
    } else {
      return order.securitytype !== "empruntobligataire" && order.securitytype !== "opv";
    }
  });

  if (selectedSessionData?.status === "completed") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ordres de la Session</CardTitle>
              <CardDescription>
                Ordres assignés à la session: {selectedSessionData?.name} (Terminée)
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
            <div className="flex mb-4 items-center justify-between">
              <div>
                <Button
                  variant={marketType === "secondaire" ? "default" : "outline"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setMarketType("secondaire")}
                >
                  Carnet d'ordres
                </Button>
                <Button
                  variant={marketType === "primaire" ? "default" : "outline"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setMarketType("primaire")}
                >
                  Souscriptions
                </Button>
              </div>
              <PDFDropdownMenu customTitle="Impression" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSortTerminee('idx')}></TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSortTerminee('id')}>ID {getSortIconTerminee('id')}</TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSortTerminee('securityissuer')}>Titre {getSortIconTerminee('securityissuer')}</TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSortTerminee('orderdirection')}>Sens {getSortIconTerminee('orderdirection')}</TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSortTerminee('quantity')}>Volume {getSortIconTerminee('quantity')}</TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSortTerminee('statut')}>Statut {getSortIconTerminee('statut')}</TableHead>
                  <TableHead colSpan={3} className="p-0 align-middle">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="font-bold uppercase text-xs  w-full text-center">Allocation</div>
                      <div className="flex flex-row w-full pt-1">
                        <span className="flex-1 text-center font-semibold text-xs cursor-pointer" onClick={e => { e.stopPropagation(); handleSortTerminee('transaction'); }}>Transaction {getSortIconTerminee('transaction')}</span>
                        <span className="flex-1 text-center font-semibold text-xs cursor-pointer" onClick={e => { e.stopPropagation(); handleSortTerminee('quantity'); }}>Volume {getSortIconTerminee('quantity')}</span>
                        <span className="flex-1 text-center font-semibold text-xs cursor-pointer" onClick={e => { e.stopPropagation(); handleSortTerminee('reliquat'); }}>Reliquat {getSortIconTerminee('reliquat')}</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSortedDisplayOrders.map((order, idx) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-4 py-2 text-center align-middle">{idx + 1}</TableCell>
                    <TableCell className="px-4 py-2 text-center align-middle" title={order.id}>{order.id?.split("-")[0]}</TableCell>
                    <TableCell className="px-4 py-2 text-center align-middle">{order.securityissuer}</TableCell>
                    <TableCell className={`px-4 py-2 text-center align-middle ${order.orderdirection === 1 ? 'text-green-600' : 'text-red-600'}`}>{order.orderdirection === 1 ? 'Achat' : 'Vente'}</TableCell>
                    <TableCell className="px-4 py-2 text-center align-middle">{order.quantity}</TableCell>
                    <TableCell className="px-4 py-2 text-center align-middle">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.statut === 'Satisfait' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{order.statut}</span>
                    </TableCell>
                    {/* Allocation sous-colonnes */}
                    <TableCell className="px-4 py-2 text-center align-middle">{order.transaction}</TableCell>
                    <TableCell className="px-4 py-2 text-center align-middle">{order.quantity}</TableCell>
                    <TableCell className="px-4 py-2 text-center align-middle">{order.reliquat}</TableCell>
                    <TableCell className="px-4 py-2 text-right align-middle">
                      <OrdreDrawer
                        titreId={order.id}
                        orderData={order}
                        isSouscription={order.securitytype === "empruntobligataire" || order.securitytype === "opv"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ordres de la Session</CardTitle>
            <CardDescription>
              Ordres assignés à la session: {selectedSessionData?.name} ({selectedSessionData?.status})
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
          <div className="flex mb-4 items-center justify-between">
            <div>
              <Button
                variant={marketType === "secondaire" ? "default" : "outline"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setMarketType("secondaire")}
              >
                Carnet d'ordres
              </Button>
              <Button
                variant={marketType === "primaire" ? "default" : "outline"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setMarketType("primaire")}
              >
                Souscriptions
              </Button>
            </div>
            <PDFDropdownMenu customTitle="Impression" />
          </div>
          {(() => {
            const userRole = (session.data as any)?.user?.roleid;
            return (
              <OrdresTable
                searchquery={""}
                skip={0}
                state={"99"}
                marketType={marketType}
                pageType="orderExecution"
                userRole={userRole?.toString() || "1"}
                userType="iob"
                activeTab="all"
                showActionColumn={false}
                showResponseButton={false}
                data={filteredDisplayOrders}
              />
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
