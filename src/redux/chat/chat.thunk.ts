import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const createChat = createAsyncThunk<
  string,
  { fireConsole: string; attorney: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'chat/createChat',
  async ({ fireConsole, attorney }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.CREATE_CHAT,
        method: 'POST',
        data: {
          fireConsole,
          attorney,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
