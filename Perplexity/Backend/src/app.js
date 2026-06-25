import cookieParser from "cookie-parser";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per 15 minutes
  message: { error: "Too many requests, please try again later." }
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: { error: "Too many messages, please slow down." }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["X-Chat-Id", "X-Chat-Title", "X-User-Message-Id"], // ✅ add this
  })
);

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/chats", chatLimiter, chatRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});


export default app;
