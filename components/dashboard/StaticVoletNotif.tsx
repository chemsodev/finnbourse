/**
 * Static version of VoletNotif that uses mock data instead of GraphQL
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle, AlertCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    title: "Ordre exécuté",
    message:
      "Votre ordre d'achat de 100 actions TOTAL a été exécuté au prix de 52.30€",
    type: "SUCCESS",
    read: false,
    createdAt: "2024-12-16T10:30:00Z",
  },
  {
    id: "2",
    title: "Nouvelle actualité",
    message: "Publication des résultats trimestriels de BNP Paribas",
    type: "INFO",
    read: false,
    createdAt: "2024-12-16T09:15:00Z",
  },
  {
    id: "3",
    title: "Alerte prix",
    message: "L'action Orange a atteint votre seuil d'alerte de 45€",
    type: "WARNING",
    read: true,
    createdAt: "2024-12-15T16:45:00Z",
  },
  {
    id: "4",
    title: "Ordre rejeté",
    message: "Votre ordre de vente n'a pas pu être traité - solde insuffisant",
    type: "ERROR",
    read: true,
    createdAt: "2024-12-15T14:20:00Z",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "SUCCESS":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "WARNING":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "ERROR":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-blue-500" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function StaticVoletNotif() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4 text-black hover:text-black" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Tout marquer comme lu
              </Button>
            )}
          </div>
          <SheetDescription>
            {unreadCount > 0
              ? `Vous avez ${unreadCount} notification${
                  unreadCount > 1 ? "s" : ""
                } non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes vos notifications sont à jour"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  notification.read
                    ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-sm font-medium ${
                          notification.read
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        notification.read
                          ? "text-slate-500 dark:text-slate-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
