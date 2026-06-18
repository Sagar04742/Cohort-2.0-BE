import { useDispatch, useSelector, useStore } from "react-redux";
import { initializeSocketConnection } from "../service/chat.socket.js";
import { getChats, getMMessages, deleteChat } from "../service/chat.api.js";
import {
  setChats,
  updateLastMessage,
  setCurrentChatId,
  setLoading,
  setError,
} from "../chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();
  const store    = useStore(); // ✅ always gives latest state, never stale
  const { chats, currentChatId } = useSelector((state) => state.chat);

  // helper — always reads FRESH chats from store, not stale closure
  const getChatsNow = () => store.getState().chat.chats;

  // ── 1. Load all chats into sidebar on app start ──────────────────
  const handleGetChats = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getChats();

      const chatsObject = {};
      data.chats.forEach((chat) => {
        chatsObject[chat._id] = { ...chat, messages: [] };
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

      if (getChatsNow()[chatId]?.messages?.length > 0) return;

      dispatch(setLoading(true));
      const data = await getMMessages({ chatId });

      dispatch(setChats({
        ...getChatsNow(), // ✅ fresh
        [chatId]: {
          ...getChatsNow()[chatId],
          messages: data.messages,
        },
      }));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── 3. New chat — reset currentChatId ───────────────────────────
  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
  };

  // ── 4. Delete a chat ─────────────────────────────────────────────
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat({ chatId });

      const updatedChats = { ...getChatsNow() };
      delete updatedChats[chatId];
      dispatch(setChats(updatedChats));

      if (store.getState().chat.currentChatId === chatId) {
        dispatch(setCurrentChatId(null));
      }
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  // ── 5. Send a message ────────────────────────────────────────────
  const handleSendMessage = async ({ message, chatId }) => {
    try {

      // Step 1 — show user message immediately
      const tempUserMessage = {
        _id: `temp-${Date.now()}`,
        content: message,
        role: "user",
      };

      if (chatId) {
        const freshChats = getChatsNow(); // ✅ fresh
        dispatch(setChats({
          ...freshChats,
          [chatId]: {
            ...freshChats[chatId],
            messages: [...(freshChats[chatId]?.messages || []), tempUserMessage],
          },
        }));
      }

      dispatch(setLoading(true));

      // Step 2 — call backend with fetch for streaming
      const response = await fetch("http://localhost:3000/api/chats/message", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, chatId }),
      });

      // Step 3 — read chat info from response headers
      const newChatId   = response.headers.get("X-Chat-Id");
      const newChatTitle = response.headers.get("X-Chat-Title");
      const finalChatId = chatId || newChatId;

      if (!chatId && newChatId) {
        dispatch(setCurrentChatId(newChatId));

        // ✅ Add new chat to sidebar immediately
        const freshChats = getChatsNow();
        dispatch(setChats({
          ...freshChats,
          [newChatId]: {
            _id: newChatId,
            title: newChatTitle || "New chat",
            messages: [],
          },
        }));
      }

      // Step 4 — add empty AI bubble, stop spinner
      const tempAiId = `ai-temp-${Date.now()}`;
      dispatch(setLoading(false));

      // ✅ always read fresh chats before dispatching
      const freshChatsBeforeAi = getChatsNow();
      dispatch(setChats({
        ...freshChatsBeforeAi,
        [finalChatId]: {
          ...(freshChatsBeforeAi[finalChatId] || {}),
          messages: [
            ...(freshChatsBeforeAi[finalChatId]?.messages || []),
            ...(chatId ? [] : [tempUserMessage]),
            { _id: tempAiId, content: "", role: "ai" },
          ],
        },
      }));

      // Step 5 — read stream chunk by chunk
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // ✅ updateLastMessage targets one message by ID — no stale chats needed
        dispatch(updateLastMessage({
          chatId: finalChatId,
          messageId: tempAiId,
          content: accumulatedText,
        }));
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
    handleNewChat,
    handleDeleteChat,
    handleSendMessage,
    chats,
    currentChatId,
  };
};