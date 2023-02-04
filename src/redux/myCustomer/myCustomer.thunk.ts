import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const markAsClient = createAsyncThunk<
  string,
  { client: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>('user/markAsClient', async ({ client }, { dispatch, rejectWithValue }) => {
  const { errors, data } = await dispatch(
    fetchAction<MessagePayload>({
      url: API.MARK_MY_CLIENT,
      method: 'POST',
      data: {
        client,
      },
    }),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return data.message;
});
