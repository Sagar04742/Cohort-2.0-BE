import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

export async function sendMessage(req, res) {
  try {
    const { message, chatId } = req.body;
    let chat;

    if (!chatId) {
      const title = await generateChatTitle(message);
      chat = await chatModel.create({ user: req.user._id, title });
    } else {
      chat = await chatModel.findById(chatId);
      if (!chat) return res.status(404).json({ error: "Chat not found." });
    }

    const userMessage = await messageModel.create({
      chat: chat._id,
      content: message,
      role: "user",
    });

    const messageHistory = await messageModel
      .find({ chat: chat._id })
      .sort({ createdAt: 1 });

    // ✅ Set headers for streaming
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("X-Chat-Id", chat._id.toString());
    res.setHeader("X-Chat-Title", chat.title.toString());
    res.setHeader("X-User-Message-Id", userMessage._id.toString());

    // ✅ Stream the response chunk by chunk
    let fullResponse = "";
    try {
      const stream = await generateResponse(messageHistory, true);

      for await (const chunk of stream) {
        const text = chunk.content ?? "";
        fullResponse += text;
        res.write(text);
      }
    } catch (streamError) {
      // ✅ If AI fails, write error message into the stream
      const errorMsg =
        streamError.message?.includes("429") ||
        streamError.message?.includes("quota")
          ? "⚠️ You have hit the daily API limit. Please try again tomorrow."
          : "⚠️ Something went wrong while generating a response. Please try again.";

      res.write(errorMsg);
      fullResponse = errorMsg;
    }

    // ✅ Save the complete AI response to DB after streaming finishes
    const aiMessageDoc = await messageModel.create({
      chat: chat._id,
      content: fullResponse,
      role: "ai",
    });

    res.end(); // close the stream
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "An error occurred." });
  }
}

export async function getChats(req, res) {
  try {
    const chats = await chatModel
      .find({ user: req.user._id })
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Chats retrieved successfully",
      chats,
    });
  } catch (error) {
    console.error("Error in getChats:", error);
    res.status(500).json({ error: "Failed to retrieve chats." });
  }
}

export async function getMessages(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found or unauthorized" });
    }

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages retrieved successfully",
      messages,
    });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
}

export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res
        .status(404)
        .json({ error: "Chat not found or unauthorized to delete." });
    }

    await messageModel.deleteMany({ chat: chatId });

    return res.status(200).json({
      message: "Chat and all associated messages deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteChat:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the chat." });
  }
}
