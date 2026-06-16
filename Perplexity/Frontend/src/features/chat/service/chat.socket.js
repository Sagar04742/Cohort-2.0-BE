import { io } from "socket.io-client";

let socket = null; // lives here, outside everything

export const initializeSocketConnection = () => {

  // Don't create a new connection if one already exists
  if (socket) return socket;

  socket = io("http://localhost:3000", {
    withCredentials: true, // sends your auth cookie
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket; // always return it
};

// Call this anywhere you need to emit or listen to events
export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized yet");
  return socket;
};