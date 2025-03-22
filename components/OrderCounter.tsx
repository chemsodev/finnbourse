"use client";

import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { COUNT_ORDERS_STATE_ONE_QUERY } from "@/graphql/queries";
import { useToast } from "@/hooks/use-toast";
import useSocket from "@/hooks/useWebSocket";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LogOutAgent from "./LogOutAgent";

const OrderCounter = () => {
  const session = useSession();
  const t = useTranslations("orderCounter");
  const userId = session.data?.user?.id;
  const userRole = session?.data?.user?.roleid || "";
  const token = session?.data?.user?.refreshToken || "";
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const { toast } = useToast();
  const [orderCounter, setOrderCounter] = useState<number>(0);
  const { socket, sendEvent } = useSocket(token);
  const variables = userRole === 2 ? { negotiatorid: userId } : {};

  const countOrders = async () => {
    try {
      const response = await fetchGraphQL<any>(COUNT_ORDERS_STATE_ONE_QUERY, {
        variables,
      });

      setOrderCounter(response.aggregateOrder._count._all);
    } catch (error) {
      setOrderCounter(0);
    }
  };

  useEffect(() => {
    countOrders();
  }, [userId]);

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

  return <>{orderCounter || 0}</>;
};

export default OrderCounter;
