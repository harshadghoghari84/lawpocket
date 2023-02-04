import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const feedsCreate = createAsyncThunk<
  string,
  FormData,
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>('feeds/feedsCreate', async (formData, { dispatch, rejectWithValue }) => {
  const { errors, data } = await dispatch(
    fetchAction<MessagePayload>({
      url: API.CREATE_FEEDS,
      method: 'POST',
      data: formData,
      headers: {
        'content-type': 'application/json',
      },
    }),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return data.message;
});
export const feedsLikeUnlike = createAsyncThunk<
  string,
  { feedId: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'feeds/feedsLikeUnlike',
  async ({ feedId }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.LIKE_UNLIKE_FEED,
        method: 'POST',
        data: { feedId: feedId },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const feedComment = createAsyncThunk<
  string,
  { feedId: number; comment: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'feeds/feedComment',
  async ({ feedId, comment }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.COMMENT_ON_FEED,
        method: 'POST',
        data: { feedId: feedId, comment: comment },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);

export const feedsUpdate = createAsyncThunk<
  string,
  { formData: FormData; id: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'feeds/feedsUpdate',
  async ({ formData, id }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: `${API.UPDATE_FEEDS}/${id}`,
        method: 'PATCH',
        data: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const removefeedsMedia = createAsyncThunk<
  string,
  { id: number,key:string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>('feeds/feedsUpdate', async ({ id ,key}, { dispatch, rejectWithValue }) => {
  const { errors, data } = await dispatch(
    fetchAction<MessagePayload>({
      url: `${API.DELETE_FEEDS_MEDIA}/${id}`,
      method: 'POST',
        data:{mediaKey:key}
    }),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return data.message;
});

export const feedsDelete = createAsyncThunk<
  string,
  { id: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>('feeds/feedsDelete', async ({ id }, { dispatch, rejectWithValue }) => {
  const { errors, data } = await dispatch(
    fetchAction<MessagePayload>({
      url: `${API.DELETE_FEEDS}/${id}`,
      method: 'DELETE',
    }),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return data.message;
});
