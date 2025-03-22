import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      console.warn("Token is missing. WebSocket will not connect.");
      return;
    }

    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/websocket`, {
      auth: { token },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // Debugging connection events
    newSocket.on("connect", () => console.log("Connected to WebSocket"));
    newSocket.on("disconnect", () =>
      console.log("Disconnected from WebSocket")
    );
    newSocket.on("connect_error", (err) =>
      console.error("WebSocket connection error:", err)
    );

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token]);

  const sendEvent = (event: string, payload: any) => {
    if (!socket) {
      console.warn("Socket not connected. Cannot send event.");
      return;
    }
    socket.emit(event, payload);
  };

  return { socket, sendEvent };
};

export default useSocket;
