import express from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.post("/message", authUser, sendMessage);

export default chatRouter;
