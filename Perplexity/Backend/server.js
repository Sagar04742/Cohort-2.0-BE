// server.js
import "dotenv/config";// ← must be the VERY FIRST import
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import dns from "dns";
import http from 'http'
import { initServer } from "./src/sockets/server.socket.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const httpServer = http.createServer(app)

initServer(httpServer)
connectDB();

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
