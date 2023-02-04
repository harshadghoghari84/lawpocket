import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { updateProfilePhoto } from 'src/redux/updateProfile/updateProfile.thunk';
import { LoadingState } from 'src/types/global.types';
import { updateProfileState } from 'src/types/updateProfile';

const initialState: updateProfileState = {
  loading: null,
};

const updateProfile = createSlice({
  name: 'updateProfile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isAnyOf(updateProfilePhoto.pending), state => {
        state.loading = LoadingState.CREATE;
      })
      .addMatcher(
        isAnyOf(updateProfilePhoto.fulfilled, updateProfilePhoto.rejected),
        state => {
          state.loading = null;
        },
      );
  },
});

export const {} = updateProfile.actions;

export default updateProfile.reducer;
