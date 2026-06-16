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

    // Replaces entire chats object (used when loading all chats from backend)
    setChats: (state, action) => {
      state.chats = action.payload;
    },

    // Appends a single message to a specific chat
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      state.chats[chatId].messages.push(message);
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

export const { setChats, addMessage, setCurrentChatId, setLoading, setError } = chatSlice.actions;
export default chatSlice.reducer;