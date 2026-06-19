import { log } from "console";
import { Server, Socket } from "socket.io";

let io;

export function initServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  console.log("Socket.io server is running");
  

  io.on('connection',(socket) => {
    console.log("A user connected: " + socket.id);
    
  })
}

export function getIO(){
    if(!io){
        throw new Error("Socket.io not initialised")
    }
    
    return io
}
