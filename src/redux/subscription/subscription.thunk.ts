import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const verifySubscriptionReceipt = createAsyncThunk<
  string,
  { subscriptionId: number; verifyReceipt: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'subscription/verifySubscriptionReceipt',
  async ({ subscriptionId, verifyReceipt }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.VERIFY_SUBSCRIPTION_RECEIPT,
        method: 'POST',
        data: { subscriptionId, verifyReceipt },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
