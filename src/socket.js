import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3001";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
});

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  socket.onAny((event, ...args) => {
    console.log(`[Socket Event] ${event}:`, args);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket Error] Connection failed:", error);
  });

  socket.on("error", (error) => {
    console.error("[Socket Error] General error:", error);
  });
}

export default socket;
