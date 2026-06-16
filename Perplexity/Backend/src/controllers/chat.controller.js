import { response } from "express";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

export async function sendMessage(req, res) {
  try {
    const { message, chat: chatId } = req.body;
    let chat;

    // 1. Resolve the Chat (Create new OR fetch existing)
    if (!chatId) {
      const title = await generateChatTitle(message);
      chat = await chatModel.create({
        user: req.user._id,
        title,
      });
    } else {
      chat = await chatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found." });
      }
    }

    // 2. Save the User's message to the database
    const userMessage = await messageModel.create({
      chat: chat._id || chatId, // This is now safe, as 'chat' is guaranteed to exist
      content: message,
      role: "user",
    });

    // 3. Fetch conversation history (Optional but recommended for AI context)
    // Use .find() instead of .findOne() to get the whole array of previous messages
    const messageHistory = await messageModel
      .find({ chat: chat._id })
      .sort({ createdAt: 1 });

    // 4. Generate AI Response
    // If your AI service supports history, pass 'messageHistory' instead of just 'message'
    const result = await generateResponse(messageHistory);

    // 5. Save the AI's message to the database
    const aiMessageDoc = await messageModel.create({
      chat: chat._id,
      content: result,
      role: "ai",
    });

    // 6. Send everything back to the client
    res.json({
      chat: chat, // Returns the full chat object (whether new or existing)
      userMessage: userMessage,
      aiMessage: aiMessageDoc,
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your message." });
  }
}

export async function getChats(req, res) {
  try {
    const user = req.user;

    // Fetch chats and sort them by the most recently updated first
    const chats = await chatModel
      .find({
        user: user._id,
      })
      .sort({ updatedAt: -1 });

    // Return 200 OK along with the chats array (even if it's empty)
    return res.status(200).json({
      message: "Chats retrieved successfully",
      chats: chats, // Actually sending the data to the client!
    });
  } catch (error) {
    console.error("Error in getChats:", error);
    res.status(500).json({ error: "Failed to retrieve chats." });
  }
}

export async function getMessages(req, res) {
  try {
    const { chatId } = req.params;

    // Verify the chat exists AND belongs to the requesting user (Good security!)
    const chat = await chatModel.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found or unauthorized",
      });
    }

    // Fetch messages and sort chronologically (oldest to newest)
    const messages = await messageModel
      .find({
        chat: chatId,
      })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages retrieved successfully",
      messages: messages, // Actually sending the data!
    });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
}

export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;

    // 1. Securely find and delete the chat
    // Using findOneAndDelete allows us to query by BOTH _id and user
    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user._id,
    });

    // 2. Handle the case where the chat doesn't exist or isn't theirs
    if (!chat) {
      return res.status(404).json({
        error: "Chat not found or unauthorized to delete.",
      });
    }

    // 3. Only delete the messages if the chat was successfully found and deleted
    await messageModel.deleteMany({
      chat: chatId,
    });

    // 4. Send a proper success response back to the client
    return res.status(200).json({
      message: "Chat and all associated messages deleted successfully.",
    });

  } catch (error) {
    // 5. Catch any database errors safely
    console.error("Error in deleteChat:", error);
    res.status(500).json({ error: "An error occurred while deleting the chat." });
  }
}