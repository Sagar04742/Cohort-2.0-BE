import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {

    setChats: (state, action) => {
      state.chats = action.payload;
    },

    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].messages.push(message);
      }
    },

    // ✅ New — updates content of one specific message by its ID
    updateLastMessage: (state, action) => {
      const { chatId, messageId, content } = action.payload;
      const chat = state.chats[chatId];
      if (!chat) return;
      const msg = chat.messages.find((m) => m._id === messageId);
      if (msg) msg.content = content;
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

  },
});

export const {
  setChats,
  addMessage,
  updateLastMessage,
  setCurrentChatId,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;