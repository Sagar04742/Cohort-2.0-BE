// server.js
import "dotenv/config";// ← must be the VERY FIRST import
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import dns from "dns";
import { testAi } from "./src/services/ai.service.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
connectDB();

testAi()

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
