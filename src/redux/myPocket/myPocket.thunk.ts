import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export const myPocket = createAsyncThunk<
  string,
  FormData,
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>('myPocket/myPocket', async (formData, { dispatch, rejectWithValue }) => {
  const { errors, data } = await dispatch(
    fetchAction<MessagePayload>({
      url: API.MY_POCKET,
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
    }),
  );

  if (errors) {
    return rejectWithValue(errors);
  }

  return data.message;
});

export const shareFile = createAsyncThunk<
  string,
  { document: string; caseFile: string; toUser: number },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'myPocket/shareFile',
  async ({ document, caseFile, toUser }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.SHARE_FILE,
        method: 'POST',
        data: {
          ...(document && {
            document,
          }),
          ...(caseFile && {
            caseFile,
          }),
          toUser,
        },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
export const removeFile = createAsyncThunk<
  string,
  { myPocketArr: number[]; caseFileArr: number[] },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'myPocket/removeFile',
  async ({ myPocketArr, caseFileArr }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: API.DELETE_FILES,
        method: 'DELETE',
        data: { myPocketArr, caseFileArr },
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
