import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";

import { AIMessage, HumanMessage, SystemMessage } from "langchain";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages, streaming = false) {
  const formattedMessages = messages.map((msg) => {
    if (msg.role === "user") return new HumanMessage(msg.content);
    if (msg.role === "ai") return new AIMessage(msg.content);
  });

  if (streaming) {
    const stream = await geminiModel.stream(formattedMessages);
    return stream;
  }

  const response = await geminiModel.invoke(formattedMessages);
  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that     generates concise and descriptive titles for chat conversations.
       A user will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in two to four words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic. `),
    new HumanMessage(`
        Generate a title for a chat conversation based on the following first message: ${message}`),
  ]);

  return response.text;
}
