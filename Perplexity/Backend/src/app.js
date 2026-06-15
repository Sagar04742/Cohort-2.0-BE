import cookieParser from "cookie-parser";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Removed the trailing slash
    credentials: true,               // ✅ Changed string "true" to boolean true
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use("/api/auth", authRouter);
app.use("/api/chats",chatRouter)


app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});


export default app;
