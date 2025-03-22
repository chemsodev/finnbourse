"use client";
import React, { useEffect, useState } from "react";
import { BsBell } from "react-icons/bs";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import useSocket from "../../hooks/useWebSocket";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { GET_NOTIFICATIONS_QUERY } from "@/graphql/queries";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { UPDATE_NOTIFICATION_STATUS } from "@/graphql/mutations";

import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  message: string;
  createdat: string;
  readstatus: boolean;
  url?: string;
}
import { useRouter } from "@/i18n/routing";

interface GetNotifsResponse {
  listNotifications: Notification[];
}

const VoletNotif = () => {
  const [voletNotifState, setVoletNotifState] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const take = 5;
  const router = useRouter();
  const { toast } = useToast();
  const [skip, setSkip] = useState(0);
  const [notificationId, setNotificationId] = useState<string>();
  const [notifsPage, setNotifsPage] = useState("notifications");
  const t = useTranslations("voletNotif");
  const [submitting, setSubmitting] = useState(false);
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const token = session?.data?.user.refreshToken || "";
  const { socket, sendEvent } = useSocket(token);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const notifications = await fetchGraphQL<GetNotifsResponse>(
        GET_NOTIFICATIONS_QUERY,
        {
          skip,
          take,
        }
      );
      setNotifications(notifications.listNotifications);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchNotifs();
  }, [take, skip]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: any) => {
      if (
        data.message !== "joined room " &&
        !notifications.some((notification) => notification.id === data.id)
      ) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = [data, ...prevNotifications];
          return updatedNotifications.sort(
            (a, b) =>
              new Date(b.createdat).getTime() - new Date(a.createdat).getTime()
          );
        });

        toast({
          title: t("nouvelleNotification"),
          description: t("nouvelleNotificationDescription"),
          action: <Link href="/">{t("voir")}</Link>,
        });
      }
    };

    socket.on("notification", handleNotification);
    socket.on("exception", (data) =>
      console.error("Exception received:", data)
    );

    // Emit after joining the room
    socket.emit("event", { event: "join", room: "notification" });
    socket.emit("event", {
      event: "command",
      room: "notification",
    });

    return () => {
      socket.off("notification", handleNotification);
      socket.off("exception");
    };
  }, [socket, notifications]);

  useEffect(() => {
    if (!token) {
      console.warn(
        "Token is missing. WebSocket connection will not be established."
      );
      return;
    }

    if (!socket) {
      console.error("WebSocket instance is not available.");
      return;
    }

    // Handle WebSocket events
    socket.on("connect", () => {
      console.log("WebSocket connected.");
      setConnectionStatus("Connected");
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected.");
      setConnectionStatus("Disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setConnectionStatus("Connection Error");
    });

    // Emit a test event to verify the connection
    sendEvent("test_connection", { message: "Testing WebSocket connection" });

    console.log("WebSocket connection test initiated.");

    // Clean up listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [socket, sendEvent, token]);

  async function editReadStatus(notificationid: string) {
    try {
      setSubmitting(true);
      await fetchGraphQL<String>(UPDATE_NOTIFICATION_STATUS, {
        notifid: notificationid,
        readstatus: true,
      });
    } catch (error) {
      console.error("Form submission error", error);
    } finally {
      setSubmitting(false);
      setNotifications([]);
      fetchNotifs();
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        onClick={() => setVoletNotifState(!voletNotifState)}
        className="relative items-center flex bg-white w-fit h-fit p-2 rounded-md hover:bg-gray-50 "
      >
        <BsBell
          size={18}
          className={`text-primary ${
            notifications.some((notification) => !notification.readstatus)
              ? "motion-preset-shake"
              : ""
          }`}
        />
        {notifications.some((notification) => !notification.readstatus) && (
          <div className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </div>
        )}
      </PopoverTrigger>

      {voletNotifState && (
        <PopoverContent className="p-0 ltr:mr-4 rtl:ml-4 w-80">
          <div className="text-center font-semibold text-gray-500 h-10 flex items-center justify-center border-b">
            {t("notifications")}
          </div>
          {notifsPage === "notifications" &&
            (loading ? (
              <div className="flex justify-center items-center h-96 w-full">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 text-gray-200 animate-spin fill-secondary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">loading...</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col overflow-scroll h-fit z-50 text-xs">
                {notifications.map((notification) => (
                  <button
                    onClick={() => {
                      setNotifsPage("oneNotif");
                      setNotificationId(notification.id.toString());
                      if (!notification.readstatus) {
                        editReadStatus(notification.id);
                      }
                    }}
                    key={notification.id}
                  >
                    <div
                      className={`h-20 border-b p-2 flex gap-4 items-center cursor-pointer hover:bg-gray-50 text-left ${
                        notification.readstatus ? "text-gray-400" : ""
                      }`}
                    >
                      <div>
                        <div
                          className={`text-lg w-12 h-12 rounded-full flex justify-center items-center shadow-inner ${
                            notification.readstatus
                              ? "bg-gray-200 text-gray-400"
                              : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          <Bell />
                        </div>
                      </div>
                      <div className="flex flex-col ">
                        <div
                          className={`text-xs rtl:text-right ${
                            notification.readstatus
                              ? "text-gray-400"
                              : "text-orange-600"
                          }`}
                        >
                          {new Date(notification.createdat).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}
                        </div>
                        <div
                          className={`text-xs w-60 truncate ${
                            notification.readstatus
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: notification.message,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          {notifsPage === "oneNotif" &&
            (submitting ? (
              <div className="flex justify-center items-center h-96 w-full">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 text-gray-200 animate-spin fill-secondary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">loading...</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col overflow-scroll h-96 z-50 text-xs">
                <div className="w-ful h-20 bg-gray-50 flex justify-center gap-4 text-lg text-primary py-5 font-bold">
                  {t("notifications")}
                </div>
                <div className=" p-4">
                  {notificationId &&
                    notifications.find(
                      (notification) => notification.id === notificationId
                    )?.message && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            notifications.find(
                              (notification) =>
                                notification.id === notificationId
                            )?.message || "",
                        }}
                      />
                    )}
                </div>
                {notifications.find(
                  (notification) => notification.id === notificationId
                )?.url && (
                  <div className="flex justify-center my-2">
                    <Link
                      href={
                        notifications.find(
                          (notification) => notification.id === notificationId
                        )?.url || ""
                      }
                      className="w-fit"
                    >
                      {t("more")}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          {notifsPage === "notifications" && (
            <div className="flex justify-between mr-4">
              <div className="text-center px-3 rounded-b-md text-xs text-primary h-8 flex items-center justify-center  hover:bg-gray-50 cursor-pointer">
                {/* {t("delete")} */}
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setSkip(skip - 5)}
                  disabled={skip === 0}
                  className={`rounded-md p-1 cursor-pointer ${
                    skip === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-primary hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSkip(skip + 5)}
                  disabled={notifications.length < 5}
                  className={`rounded-md p-1 cursor-pointer ${
                    notifications.length < 5
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-primary hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
          {notifsPage === "oneNotif" && (
            <button
              onClick={() => {
                setNotifsPage("notifications");
                setNotificationId(undefined);
              }}
              className="text-center text-xs text-primary h-8 flex w-full items-center justify-center border-t hover:bg-gray-50 cursor-pointer"
            >
              <FaLongArrowAltLeft width={30} className="text-gray-500" />
            </button>
          )}
        </PopoverContent>
      )}
    </Popover>
  );
};

export default VoletNotif;
