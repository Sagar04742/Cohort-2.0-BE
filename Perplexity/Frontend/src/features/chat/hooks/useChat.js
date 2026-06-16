import { useDispatch, useSelector } from "react-redux";
import { initializeSocketConnection } from "../service/chat.socket.js";
import { sendMessage, getChats, getMMessages } from "../service/chat.api.js";
import { setChats, addMessage, setCurrentChatId, setLoading, setError } from "../chat.slice.js";
export const useChat = () => {
  const dispatch = useDispatch();
  const { chats, currentChatId } = useSelector((state) => state.chat);

  // ── 1. Load all chats into sidebar on app start ──────────────────
  const handleGetChats = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getChats();
      // data = { message: "...", chats: [ {_id, title, ...}, ... ] }

      const chatsObject = {};
      data.chats.forEach((chat) => {
        chatsObject[chat._id] = {
          ...chat,
          messages: [], // messages loaded separately on click
        };
      });

      dispatch(setChats(chatsObject));

    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── 2. When user clicks a chat in sidebar ────────────────────────
  const handleSelectChat = async (chatId) => {
  try {
    dispatch(setCurrentChatId(chatId));

    // Only fetch if messages aren't already loaded
    if (chats[chatId]?.messages?.length > 0) return;

    dispatch(setLoading(true));
    const data = await getMMessages({ chatId });

    const updatedChats = {
      ...chats,
      [chatId]: {
        ...chats[chatId],
        messages: data.messages,
      },
    };
    dispatch(setChats(updatedChats));

  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

  // ── 3. When user sends a message ─────────────────────────────────
  const handleSendMessage = async ({ message, chatId }) => {
  try {
    dispatch(setLoading(true));

    const data = await sendMessage({ message, chatId });
    const { chat, userMessage, aiMessage } = data;

    if (!chatId) {
      // Brand new chat
      const updatedChats = {
        ...chats,
        [chat._id]: {
          ...chat,
          messages: [userMessage, aiMessage],
        },
      };
      dispatch(setChats(updatedChats));
      dispatch(setCurrentChatId(chat._id));

    } else {
      // ✅ Fix — check if messages are loaded, if not load them first
      const existingMessages = chats[chat._id]?.messages || [];

      const updatedChats = {
        ...chats,
        [chat._id]: {
          ...chats[chat._id],
          messages: [...existingMessages, userMessage, aiMessage],
        },
      };

      dispatch(setChats(updatedChats));
    }

  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

  return {
    initializeSocketConnection,
    handleGetChats,
    handleSelectChat,
    handleSendMessage,
    chats,
    currentChatId,
  };
};