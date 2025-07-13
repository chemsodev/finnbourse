"use client";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Package,
  User,
  ArrowLeftRight,
  Building2,
  TrendingUp,
} from "lucide-react";
import { OrderElement } from "@/lib/services/orderService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface OrderTrackProps {
  order: OrderElement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderTrack({ order, open, onOpenChange }: OrderTrackProps) {
  const t = useTranslations("orderHistory.orderDetails");
  const [openRow, setOpenRow] = useState<number | null>(null);

  if (!order) return null;

  // Simple detail renderer conservé
  const renderDetail = (
    label: string,
    value: React.ReactNode,
    icon?: React.ReactNode
  ) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 min-w-0 flex-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>
      <div className="text-sm text-gray-900 font-medium ml-4 text-right">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </div>
    </div>
  );

  return (
    <div>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {t("orderProgress")}
        </CardTitle>
      </CardHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>date</TableHead>
              {/*<TableHead>etat</TableHead>*/}
              <TableHead>Action</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Motif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                date: "2024-06-01 10:00",
                etat: "V1 agence",
                action: "valide",
                nom: "user1",
                motif:
                  "motif1motif1 motif1 motif1 motif1 motif1 motif1 motif1 motif1 motif1 v motif1 motif1 motif1 v motif1 ",
              },
              {
                date: "2024-06-01 12:00",
                etat: "V2 agence",
                action: "rejete",
                nom: "user2",
                motif: "motif2",
              },
            ].map((step, idx) => (
              <TableRow
                key={idx}
                className={openRow === idx ? "bg-gray-50" : ""}
                onClick={() => setOpenRow(openRow === idx ? null : idx)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{step.date}</TableCell>
                {/*<TableCell>{step.etat}</TableCell>*/}
                <TableCell>{step.action}</TableCell>
                <TableCell>{step.nom}</TableCell>
                <TableCell
                  className={
                    openRow === idx
                      ? "whitespace-normal max-w-[200px]"
                      : "max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                  }
                  title={openRow === idx ? undefined : step.motif}
                >
                  {step.motif}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
