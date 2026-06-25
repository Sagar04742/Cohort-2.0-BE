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
  const store = useStore(); // ✅ always gives latest state, never stale
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

      dispatch(
        setChats({
          ...getChatsNow(), // ✅ fresh
          [chatId]: {
            ...getChatsNow()[chatId],
            messages: data.messages,
          },
        }),
      );
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
      // Step 1 — show user message immediately, even for new chats
      const tempUserMessage = {
        _id: `temp-${Date.now()}`,
        content: message,
        role: "user",
      };

      // ✅ Use a temporary key for new chats so the message shows right away
      const tempChatKey = chatId || "pending-new-chat";

      const freshChats = getChatsNow();
      dispatch(
        setChats({
          ...freshChats,
          [tempChatKey]: {
            ...(freshChats[tempChatKey] || {}),
            messages: [
              ...(freshChats[tempChatKey]?.messages || []),
              tempUserMessage,
            ],
          },
        }),
      );

      dispatch(setLoading(true));

      // Step 2 — call backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/message`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, chatId }),
        },
      );

      // Step 3 — read chat info from headers
      const newChatId = response.headers.get("X-Chat-Id");
      const newChatTitle = response.headers.get("X-Chat-Title");
      const finalChatId = chatId || newChatId;

      if (!chatId && newChatId) {
        dispatch(setCurrentChatId(newChatId));

        // ✅ Move messages from "pending-new-chat" key to the real chatId
        const freshChatsAfter = getChatsNow();
        const pendingMessages =
          freshChatsAfter["pending-new-chat"]?.messages || [];
        const withoutPending = { ...freshChatsAfter };
        delete withoutPending["pending-new-chat"];

        dispatch(
          setChats({
            ...withoutPending,
            [newChatId]: {
              _id: newChatId,
              title: newChatTitle || "New chat",
              messages: pendingMessages,
            },
          }),
        );
      }

      // Step 4 — add empty AI bubble, stop spinner
      const tempAiId = `ai-temp-${Date.now()}`;
      dispatch(setLoading(false));

      const freshChatsBeforeAi = getChatsNow();
      dispatch(
        setChats({
          ...freshChatsBeforeAi,
          [finalChatId]: {
            ...(freshChatsBeforeAi[finalChatId] || {}),
            messages: [
              ...(freshChatsBeforeAi[finalChatId]?.messages || []),
              { _id: tempAiId, content: "", role: "ai" },
            ],
          },
        }),
      );
      console.log("finalChatId:", finalChatId);
      console.log("chats after moving pending:", getChatsNow());

      // Step 5 — read stream chunk by chunk
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        dispatch(
          updateLastMessage({
            chatId: finalChatId,
            messageId: tempAiId,
            content: accumulatedText,
          }),
        );
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
