import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // If no token, disconnect immediately
    if (!token) {
      console.warn("Token is missing. WebSocket will not connect.");
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/websocket`, {
      auth: { token },
      transports: ["websocket"],
      // Prevent automatic reconnection with invalid tokens
      autoConnect: true,
      reconnection: false, // Disable auto-reconnection to prevent rate limiting
    });

    setSocket(newSocket);

    // Debugging connection events
    newSocket.on("connect", () => console.log("Connected to WebSocket"));
    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setSocket(null);
    });
    newSocket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
      // Don't retry on auth errors to prevent rate limiting
      if (err.message.includes("unauthorized") || err.message.includes("401")) {
        newSocket.disconnect();
      }
    });

    // Cleanup on unmount or token change
    return () => {
      console.log("Cleaning up WebSocket connection");
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token]);

  const sendEvent = (event: string, payload: any) => {
    if (!socket || !socket.connected) {
      console.warn("Socket not connected. Cannot send event.");
      return;
    }
    socket.emit(event, payload);
  };

  return { socket, sendEvent };
};

export default useSocket;
