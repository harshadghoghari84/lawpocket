import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const notificationRead = createAsyncThunk<
  string,
  { id: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'notification/notificationRead',
  async ({ id }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: `${API.MARK_AS_READ_NOTIFICATION}/${id}`,
        method: 'PATCH',
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
