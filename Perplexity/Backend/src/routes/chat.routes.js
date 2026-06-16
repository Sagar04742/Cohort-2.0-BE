import express from "express";
import {
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.post("/message", authUser, sendMessage);

chatRouter.get("/", authUser, getChats);

chatRouter.get("/:chatId/messages", authUser, getMessages);

chatRouter.delete("/delete/:chatId", authUser);

export default chatRouter;
