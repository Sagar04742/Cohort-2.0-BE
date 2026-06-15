import { response } from "express";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

export async function sendMessage(req, res) {
  try {
    const { message } = req.body;

    // 1. Run both AI calls concurrently for better performance
    const [title, result] = await Promise.all([
      generateChatTitle(message),
      generateResponse(message)
    ]);
    
    console.log("Generated Title:", title);

    // 2. Create the chat document
    const chat = await chatModel.create({
      user: req.user._id,
      title: title
    });

    // 3. Save the USER'S message to the database
    const userMessage = await messageModel.create({
      chat: chat._id,
      content: message,
      role: "user", // Assuming your schema uses "user" for the human
    });

    // 4. Save the AI'S message to the database
    const aiMessageDoc = await messageModel.create({
      chat: chat._id,
      content: result,
      role: "ai",
    });

    // 5. Send everything back to the client
    res.json({
      title: title,
      chat: chat,
      userMessage: userMessage,
      aiMessage: aiMessageDoc
    });

  } catch (error) {
    // 6. Catch and handle any errors safely
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "An error occurred while processing your message." });
  }
}