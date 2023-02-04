import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'src/constants/apiEndpoints';
import { fetchAction } from 'src/redux/fetch';
import { FetchResponseError } from 'src/types/fetch.types';
import { RootReduxState } from 'src/types/redux.types';
import { MessagePayload } from 'src/types/setProfile.types';

export interface CaseFilePayload {
  code: number;
  message: string;
  data: {
    id: number;
    caseFileType: number;
    state: string;
    city: string;
    caseTitle: string;
    customName: string;
    documents: [];
    pdf: string;
    date: {
      created: string;
      updated: string;
    };
  };
}

export const createCaseFile = createAsyncThunk<
  CaseFilePayload,
  FormData,
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'caseFile/createCaseFile',
  async (formData, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<CaseFilePayload>({
        url: API.CREATE_CASE_FILE,
        method: 'POST',
        data: formData,
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data;
  },
);
export const updateCaseFile = createAsyncThunk<
  string,
  { formData: FormData; caseFileID: string },
  {
    state: RootReduxState;
    rejectValue: FetchResponseError;
  }
>(
  'caseFile/updateCaseFile',
  async ({ formData, caseFileID }, { dispatch, rejectWithValue }) => {
    const { errors, data } = await dispatch(
      fetchAction<MessagePayload>({
        url: `${API.UPDATE_CASE_FILE}/${caseFileID}`,
        method: 'PATCH',
        data: formData,
      }),
    );

    if (errors) {
      return rejectWithValue(errors);
    }

    return data.message;
  },
);
