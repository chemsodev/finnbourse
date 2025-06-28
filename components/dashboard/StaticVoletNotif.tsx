/**
 * Static version of VoletNotif that uses mock data instead of GraphQL
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, Info, Sparkles } from "lucide-react";
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
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "WARNING":
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    case "ERROR":
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    case "INFO":
      return <Info className="h-5 w-5 text-blue-600" />;
    default:
      return <Bell className="h-5 w-5 text-blue-600" />;
  }
};

const getNotificationColor = (type: string, read: boolean) => {
  if (read) {
    return "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-150";
  }
  
  switch (type) {
    case "SUCCESS":
      return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100";
    case "WARNING":
      return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 hover:from-yellow-100 hover:to-amber-100";
    case "ERROR":
      return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:from-red-100 hover:to-rose-100";
    case "INFO":
      return "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100";
    default:
      return "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100";
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
        <Button 
          variant="outline" 
          size="icon" 
          className="relative hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 transition-all duration-300 shadow-sm hover:shadow-lg border-slate-300 hover:border-slate-400 group"
        >
          <Bell className="h-5 w-5 text-slate-700 group-hover:scale-110 transition-transform duration-200" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-gradient-to-b from-white to-slate-50 w-full h-full">
        <SheetHeader className="border-b shadow-2xl border-slate-200 pb-4 bg-gradient-to-r from-slate-50 to-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              Notifications
            </SheetTitle>
            {/*{unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-primary hover:bg-primary/10 hover:shadow-md transition-all duration-200"
              >
                Tout marquer comme lu
              </Button>
            )}*/}
          </div>
          <SheetDescription className="text-sm text-slate-600">
            {unreadCount > 0
              ? `Vous avez ${unreadCount} notification${
                  unreadCount > 1 ? "s" : ""
                } non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes vos notifications sont à jour"}
          </SheetDescription>
        </SheetHeader>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="relative">
                <Bell className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <Sparkles className="h-6 w-6 absolute top-0 right-1/4 text-primary animate-pulse" />
              </div>
              <p className="text-lg font-medium bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent">
                Aucune notification
              </p>
              <p className="text-sm text-slate-400">Vous êtes à jour !</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`p-2 w-full border cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${getNotificationColor(notification.type, notification.read)}`}
                onClick={() => markAsRead(notification.id)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInFromRight 0.5s ease-out forwards'
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5 p-1.5 bg-transparent rounded-full">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`text-sm font-semibold flex-1 ${
                          notification.read
                            ? "text-slate-600"
                            : "text-slate-900"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatDate(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse shadow-sm" />
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        notification.read
                          ? "text-slate-500"
                          : "text-slate-700"
                      }`}
                    >
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <style jsx>{`
          @keyframes slideInFromRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </SheetContent>
    </Sheet>
  );
}
