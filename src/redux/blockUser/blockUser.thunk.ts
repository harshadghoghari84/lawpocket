import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const blockUser = createAsyncThunk<
  string,
  { forUser: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>('user/blockUser', async ({ forUser }, { dispatch, rejectWithValue }) => {
  const { errors, data } = await dispatch(
    fetchAction<MessagePayload>({
      url: API.BLOCK_USER,
      method: 'POST',
      data: {
        forUser,
      },
    }),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return data.message;
});
export const unBlockUser = createAsyncThunk<
  string,
  { forUser: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>('user/unBlockUser', async ({ forUser }, { dispatch, rejectWithValue }) => {
  const { errors, data } = await dispatch(
    fetchAction<MessagePayload>({
      url: API.UNBLOCK_USER,
      method: 'DELETE',
      data: {
        forUser,
      },
    }),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return data.message;
});
