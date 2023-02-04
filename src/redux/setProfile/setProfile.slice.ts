import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  studentSendEmailVerification,
  studentVerifyOTPForEmail,
  updateLocationStateCity,
  updateMissingEmail,
  updateRegisterType,
  updateStudentEmail,
  updateUserAssociationNumber,
  updateUserPracticeArea,
  updateUserProfilePhoto,
} from 'src/redux/setProfile/setProfile.thunk';
import { LoadingState } from 'src/types/global.types';
import { setProfileState } from 'src/types/setProfile.types';

const initialState: setProfileState = {
  loading: null,
};

const setProfile = createSlice({
  name: 'setProfile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(
          updateMissingEmail.pending,
          updateRegisterType.pending,
          updateLocationStateCity.pending,
          updateUserPracticeArea.pending,
          updateUserProfilePhoto.pending,
          updateUserAssociationNumber.pending,
          updateStudentEmail.pending,
          studentSendEmailVerification.pending,
          studentVerifyOTPForEmail.pending,
        ),
        state => {
          state.loading = LoadingState.CREATE;
        },
      )
      .addMatcher(
        isAnyOf(
          updateMissingEmail.fulfilled,
          updateRegisterType.fulfilled,
          updateLocationStateCity.fulfilled,
          updateUserPracticeArea.fulfilled,
          updateUserProfilePhoto.fulfilled,
          updateUserAssociationNumber.fulfilled,
          updateStudentEmail.fulfilled,
          studentSendEmailVerification.fulfilled,
          studentVerifyOTPForEmail.fulfilled,
          updateMissingEmail.rejected,
          updateRegisterType.rejected,
          updateLocationStateCity.rejected,
          updateUserPracticeArea.rejected,
          updateUserProfilePhoto.rejected,
          updateUserAssociationNumber.rejected,
          updateStudentEmail.rejected,
          studentSendEmailVerification.rejected,
          studentVerifyOTPForEmail.rejected,
        ),
        state => {
          state.loading = null;
        },
      );
  },
});

export const {} = setProfile.actions;

export default setProfile.reducer;
