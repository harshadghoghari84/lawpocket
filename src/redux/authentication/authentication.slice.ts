import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import {
  userChangePassword,
  userForgotPassword,
  userLogin,
  userRegistration,
} from 'src/redux/authentication/authentication.thunks';
import { AuthenticationState } from 'src/types/authentication.types';
import { LoadingState } from 'src/types/global.types';

const initialState: AuthenticationState = {
  loading: null,
  oAuthLoading: null,
};

const authentication = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setOAuthLoading: (
      state: AuthenticationState,
      { payload }: PayloadAction<'facebook' | 'linkedin' | 'apple'>,
    ) => {
      state.oAuthLoading = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(
          userLogin.pending,
          userRegistration.pending,
          userForgotPassword.pending,
          userChangePassword.pending,
        ),
        state => {
          state.loading = LoadingState.CREATE;
        },
      )
      .addMatcher(
        isAnyOf(
          userLogin.fulfilled,
          userRegistration.fulfilled,
          userForgotPassword.fulfilled,
          userChangePassword.fulfilled,
          userLogin.rejected,
          userRegistration.rejected,
          userForgotPassword.rejected,
          userChangePassword.rejected,
        ),
        state => {
          state.loading = null;
        },
      );
  },
});

export const { setOAuthLoading } = authentication.actions;

export default authentication.reducer;
