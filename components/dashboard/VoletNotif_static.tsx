"use client";
import React, { useState } from "react";
import { BsBell } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useTranslations } from "next-intl";

interface Notification {
  id: string;
  message: string;
  createdat: string;
  readstatus: boolean;
  url?: string;
}

// Static mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Nouvelle transaction effectuée",
    createdat: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    readstatus: false,
  },
  {
    id: "2",
    message: "Rapport mensuel disponible",
    createdat: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    readstatus: true,
  },
  {
    id: "3",
    message: "Maintenance programmée",
    createdat: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    readstatus: false,
  },
];

const VoletNotif = () => {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const t = useTranslations("voletNotif");

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.readstatus
  );

  return (
    <Popover>
      <PopoverTrigger className="relative items-center flex bg-white w-fit h-fit p-2 rounded-md hover:bg-gray-50">
        <BsBell
          size={18}
          className={`text-primary ${
            hasUnreadNotifications ? "motion-preset-shake" : ""
          }`}
        />
        {hasUnreadNotifications && (
          <div className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold">
            {t("notifications") || "Notifications"}
          </h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {t("noNotifications") || "Aucune notification"}
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                  !notification.readstatus ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdat).toLocaleString()}
                    </p>
                  </div>
                  {!notification.readstatus && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VoletNotif;
