"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

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
];

type SortField = 'name' | 'date' | 'status' | 'orders' | 'processed';
type SortDirection = 'asc' | 'desc';

interface SessionManagementProps {
  onSessionSelect?: (sessionId: string) => void;
}

export default function SessionManagement({ onSessionSelect }: SessionManagementProps) {
  const t = useTranslations("bourseSessions.management");
  const [sessions, setSessions] = useState(mockSessions);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [newSession, setNewSession] = useState({
    name: "",
    date: new Date(),
    status: "scheduled",
  });
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const sortSessions = (data: any[]) => {
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'date':
          aValue = a.date;
          bValue = b.date;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'orders':
          aValue = a.ordersCount;
          bValue = b.ordersCount;
          break;
        case 'processed':
          aValue = a.processedCount;
          bValue = b.processedCount;
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

  const sortedSessions = sortSessions(sessions);

  const handleCreateSession = () => {
    const session = {
      id: Date.now().toString(),
      name: newSession.name,
      date: newSession.date,
      status: newSession.status,
      ordersCount: 0,
      processedCount: 0,
    };
    setSessions([...sessions, session]);
    setNewSession({ name: "", date: new Date(), status: "scheduled" });
    setIsCreateOpen(false);
  };

  const handleEditSession = () => {
    const updatedSessions = sessions.map((session) =>
      session.id === currentSession.id ? currentSession : session
    );
    setSessions(updatedSessions);
    setIsEditOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">{t("status.active")}</Badge>;
      case "completed":
        return <Badge className="bg-blue-600">{t("status.completed")}</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-600">{t("status.scheduled")}</Badge>;
      default:
        return <Badge className="bg-gray-600">{t("status.unknown")}</Badge>;
    }
  };

  const handleRowClick = (sessionId: string, event: React.MouseEvent) => {
    // Ne pas déclencher si on clique sur les boutons d'action
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    
    if (onSessionSelect) {
      onSessionSelect(sessionId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              {t("newButton")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("createTitle")}</DialogTitle>
              <DialogDescription>{t("createDescription")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {t("name")}
                </Label>
                <Input
                  id="name"
                  value={newSession.name}
                  onChange={(e) =>
                    setNewSession({ ...newSession, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  {t("date")}
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newSession.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSession.date ? (
                          format(newSession.date, "PPP")
                        ) : (
                          <span>{t("chooseDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSession.date}
                        onSelect={(date) =>
                          setNewSession({
                            ...newSession,
                            date: date || new Date(),
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSession}>
                {t("createButton")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  {t("tableHeaders.name")}
                  {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  {t("tableHeaders.date")}
                  {getSortIcon('date')}
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
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('orders')}
              >
                <div className="flex items-center">
                  {t("tableHeaders.orders")}
                  {getSortIcon('orders')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('processed')}
              >
                <div className="flex items-center">
                  {t("tableHeaders.processed")}
                  {getSortIcon('processed')}
                </div>
              </TableHead>
              <TableHead className="text-right">
                {t("tableHeaders.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSessions.map((session) => (
              <TableRow 
                key={session.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={(e) => handleRowClick(session.id, e)}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSession(session);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("deleteTitle")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteDescription")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("cancelButton")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            {t("deleteButton")}
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
            <DialogTitle>{t("editTitle")}</DialogTitle>
            <DialogDescription>{t("editDescription")}</DialogDescription>
          </DialogHeader>
          {currentSession && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  {t("name")}
                </Label>
                <Input
                  id="edit-name"
                  value={currentSession.name}
                  onChange={(e) =>
                    setCurrentSession({
                      ...currentSession,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  {t("date")}
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(currentSession.date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={currentSession.date}
                        onSelect={(date) =>
                          setCurrentSession({
                            ...currentSession,
                            date: date || new Date(),
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  {t("tableHeaders.status")}
                </Label>
                <select
                  id="edit-status"
                  value={currentSession.status}
                  onChange={(e) =>
                    setCurrentSession({
                      ...currentSession,
                      status: e.target.value,
                    })
                  }
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="scheduled">{t("status.scheduled")}</option>
                  <option value="active">{t("status.active")}</option>
                  <option value="completed">{t("status.completed")}</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditSession}>
              {t("updateButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
