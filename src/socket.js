import io from 'socket.io-client';

if (!process.env.REACT_APP_BACKEND_URL) {
  throw new Error('REACT_APP_BACKEND_URL is not defined');
}

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

export default socket;

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
