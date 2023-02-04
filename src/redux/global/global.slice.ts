import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchResponseError } from 'src/types/fetch.types';
import { GlobalState } from 'src/types/global.types';

const initialState: GlobalState = {
  errors: null,
  errorMessage: null,

  success: false,
  successMessage: null,
};

const global = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setErrors: (
      state: GlobalState,
      { payload }: PayloadAction<FetchResponseError>,
    ) => {
      state.errors = payload;
      state.errorMessage = payload.message;
    },
    clearErrors: (state: GlobalState) => {
      state.errors = null;
      state.errorMessage = null;
    },

    setSuccess: (state: GlobalState, { payload }: PayloadAction<string>) => {
      state.success = true;
      state.successMessage = payload;
    },
    clearSuccess: (state: GlobalState) => {
      state.success = false;
      state.successMessage = null;
    },
  },
});

export const { setErrors, clearErrors, setSuccess, clearSuccess } =
  global.actions;

export default global.reducer;
