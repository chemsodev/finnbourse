"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for demonstration
const mockSessions = [
  {
    id: "1",
    name: "Session Matinale",
    date: new Date("2025-05-01"),
    status: "active",
    ordersCount: 12,
    processedCount: 8,
  },
  {
    id: "2",
    name: "Session Après-midi",
    date: new Date("2025-05-01"),
    status: "completed",
    ordersCount: 15,
    processedCount: 15,
  },
  {
    id: "3",
    name: "Session Spéciale",
    date: new Date("2025-05-02"),
    status: "scheduled",
    ordersCount: 0,
    processedCount: 0,
  },
]

export default function SessionManagement() {
  const [sessions, setSessions] = useState(mockSessions)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [newSession, setNewSession] = useState({
    name: "",
    date: new Date(),
    status: "scheduled",
  })

  const handleCreateSession = () => {
    const session = {
      id: Date.now().toString(),
      name: newSession.name,
      date: newSession.date,
      status: newSession.status,
      ordersCount: 0,
      processedCount: 0,
    }
    setSessions([...sessions, session])
    setNewSession({ name: "", date: new Date(), status: "scheduled" })
    setIsCreateOpen(false)
  }

  const handleEditSession = () => {
    const updatedSessions = sessions.map((session) => (session.id === currentSession.id ? currentSession : session))
    setSessions(updatedSessions)
    setIsEditOpen(false)
  }

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-600">Terminée</Badge>
      case "scheduled":
        return <Badge className="bg-yellow-600">Planifiée</Badge>
      default:
        return <Badge className="bg-gray-600">Inconnue</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sessions de Bourse</CardTitle>
          <CardDescription>Gérez les sessions de négociation et leurs ordres associés</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle session</DialogTitle>
              <DialogDescription>Définissez les détails de la nouvelle session de bourse</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={newSession.name}
                  onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newSession.date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSession.date ? format(newSession.date, "PPP") : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSession.date}
                        onSelect={(date) => setNewSession({ ...newSession, date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSession}>
                Créer la session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Ordres</TableHead>
              <TableHead>Traités</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.name}</TableCell>
                <TableCell>{format(session.date, "dd/MM/yyyy")}</TableCell>
                <TableCell>{getStatusBadge(session.status)}</TableCell>
                <TableCell>{session.ordersCount}</TableCell>
                <TableCell>
                  {session.processedCount}/{session.ordersCount}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentSession(session)
                        setIsEditOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement la session et pourrait
                            affecter les ordres associés.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Session Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la session</DialogTitle>
            <DialogDescription>Modifiez les détails de la session de bourse</DialogDescription>
          </DialogHeader>
          {currentSession && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="edit-name"
                  value={currentSession.name}
                  onChange={(e) => setCurrentSession({ ...currentSession, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(currentSession.date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={currentSession.date}
                        onSelect={(date) => setCurrentSession({ ...currentSession, date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Statut
                </Label>
                <select
                  id="edit-status"
                  value={currentSession.status}
                  onChange={(e) => setCurrentSession({ ...currentSession, status: e.target.value })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="scheduled">Planifiée</option>
                  <option value="active">Active</option>
                  <option value="completed">Terminée</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditSession}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
