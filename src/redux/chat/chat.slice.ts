import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { createChat } from 'src/redux/chat/chat.thunk';
import { chatState } from 'src/types/chat.types';
import { LoadingState } from 'src/types/global.types';

const initialState: chatState = {
  loading: null,
};

const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isAnyOf(createChat.pending), state => {
        state.loading = LoadingState.CREATE;
      })
      .addMatcher(isAnyOf(createChat.fulfilled, createChat.rejected), state => {
        state.loading = null;
      });
  },
});

export const {} = chat.actions;

export default chat.reducer;
