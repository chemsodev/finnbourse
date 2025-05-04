"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

// Mock data for demonstration
const mockSessions = [
  { id: "1", name: "Session Matinale", date: new Date("2025-05-01") },
  { id: "2", name: "Session Après-midi", date: new Date("2025-05-01") },
  { id: "3", name: "Session Spéciale", date: new Date("2025-05-02") },
]

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
]

export default function SessionOrders() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const unprocessedOrders = orders.filter((order) => order.sessionId === null)
  const sessionOrders = selectedSession ? orders.filter((order) => order.sessionId === selectedSession) : []

  const assignOrderToSession = (orderId: string) => {
    if (!selectedSession) return

    setOrders(orders.map((order) => (order.id === orderId ? { ...order, sessionId: selectedSession } : order)))
  }

  const removeOrderFromSession = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, sessionId: null } : order)))
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-gray-600">Brouillon</Badge>
      case 1:
        return <Badge className="bg-yellow-600">En attente</Badge>
      case 2:
        return <Badge className="bg-secondary">En cours</Badge>
      case 3:
        return <Badge className="bg-green-600">Validé</Badge>
      case 4:
        return <Badge className="bg-purple-600">En traitement</Badge>
      case 5:
        return <Badge className="bg-teal-600">Complété</Badge>
      default:
        return <Badge className="bg-gray-700">Inconnu</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-64">
          <Label htmlFor="session-select">Sélectionner une session</Label>
          <Select onValueChange={setSelectedSession} value={selectedSession || undefined}>
            <SelectTrigger id="session-select">
              <SelectValue placeholder="Choisir une session" />
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
            <CardTitle>Ordres non assignés</CardTitle>
            <CardDescription>Ordres en attente d'assignation à une session de bourse</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Sens</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unprocessedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Aucun ordre non assigné
                    </TableCell>
                  </TableRow>
                ) : (
                  unprocessedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium capitalize">{order.securityIssuer}</div>
                          <div className="font-medium text-xs uppercase text-gray-400">{order.securityCode}</div>
                        </div>
                      </TableCell>
                      <TableCell className={order.direction === 1 ? "text-green-500" : "text-red-600"}>
                        {order.direction === 1 ? "Achat" : "Vente"}
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => assignOrderToSession(order.id)} disabled={!selectedSession}>
                          Assigner
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
            <CardTitle>Ordres de la session</CardTitle>
            <CardDescription>
              {selectedSession
                ? `Ordres assignés à la session: ${mockSessions.find((s) => s.id === selectedSession)?.name}`
                : "Sélectionnez une session pour voir les ordres assignés"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Sens</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!selectedSession ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Sélectionnez une session pour voir les ordres
                    </TableCell>
                  </TableRow>
                ) : sessionOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Aucun ordre dans cette session
                    </TableCell>
                  </TableRow>
                ) : (
                  sessionOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium capitalize">{order.securityIssuer}</div>
                          <div className="font-medium text-xs uppercase text-gray-400">{order.securityCode}</div>
                        </div>
                      </TableCell>
                      <TableCell className={order.direction === 1 ? "text-green-500" : "text-red-600"}>
                        {order.direction === 1 ? "Achat" : "Vente"}
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
    </div>
  )
}
