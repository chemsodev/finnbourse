"use client";

import { clientFetchGraphQL } from "@/app/actions/fetchGraphQL";
import { COUNT_ORDERS_STATE_ONE_QUERY } from "@/graphql/queries";
import { useToast } from "@/hooks/use-toast";
import useSocket from "@/hooks/useWebSocket";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LogOutAgent from "../LogOutAgent";

// Define proper session user type
interface CustomUser {
  id?: string;
  token?: string;
  roleid?: number;
  refreshToken?: string;
}

const OrderCounter = () => {
  const session = useSession();
  const t = useTranslations("orderCounter");
  // Use type assertion to access custom fields
  const user = session?.data?.user as CustomUser;
  const userId = user?.id;
  const userRole = user?.roleid || "";
  const accessToken = user?.token || "";
  const refreshToken = user?.refreshToken || "";
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const { toast } = useToast();
  const [orderCounter, setOrderCounter] = useState<number>(0);
  const { socket, sendEvent } = useSocket(refreshToken);
  const variables = userRole === 2 ? { negotiatorid: userId } : {};

  const countOrders = async () => {
    try {
      const response = await clientFetchGraphQL<any>(
        COUNT_ORDERS_STATE_ONE_QUERY,
        {
          variables,
        },
        {},
        accessToken
      );

      setOrderCounter(response.aggregateOrder._count._all);
    } catch (error) {
      console.error("Error counting orders:", error);
      setOrderCounter(0);
    }
  };

  useEffect(() => {
    if (accessToken) {
      countOrders();
    }
  }, [userId, accessToken]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: any) => {
      if (data.message !== "joined room ") {
        setOrderCounter((prevCount) => prevCount + 1);
        toast({
          title: t("nouvelOrdre"),
          description: t("nouvelOrdreDescription"),
          action: <Link href="/carnetordres">{t("voir")}</Link>,
        });
      }
    };

    socket.on("newOrder", handleNotification);
    socket.on("exception", (data) =>
      console.error("Exception received:", data)
    );

    // Emit after joining the room
    socket.emit("event", { event: "join", room: "newOrder" });
    socket.emit("event", {
      event: "command",
      room: "newOrder",
    });

    return () => {
      socket.off("newOrder", handleNotification);
      socket.off("exception");
    };
  }, [socket, toast, t]);

  useEffect(() => {
    if (!refreshToken) {
      console.warn(
        "Token is missing. WebSocket connection will not be established."
      );
      return;
    }

    if (!socket) {
      console.warn("WebSocket instance is not available.");
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

    // Clean up listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [socket, sendEvent, refreshToken]);

  return <>{orderCounter || 0}</>;
};

export default OrderCounter;
