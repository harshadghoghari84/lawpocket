export interface FetchResponse<T> {
  data?: T;
  errorMessage?: string | null;
  method?: string;
  params?: {};
  statusCode?: number | null;
  errors?: FetchResponseError | null;
  headers?: any;
}

export interface FetchResponseError {
  code: number | null;
  message: string;
  errors: ErrorElement[];
}

export interface ErrorElement {
  domain?: string;
  reason?: string;
  message?: string;
}
