import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const rateReview = createAsyncThunk<
  string,
  { rate: number; review: string; forUser: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'lawyer/rateReview',
  async ({ rate, review, forUser }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.RATE_REVIEW,
        method: 'POST',
        data: {
          rate,
          review,
          forUser,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const closeChat = createAsyncThunk<
  string,
  { id: number; reason: number; reasonText: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'lawyer/closeChat',
  async ({ id, reason, reasonText }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.CHAT_CLOSE,
        method: 'POST',
        data: {
          id,
          reason,
          reasonText,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
