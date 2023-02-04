import { ErrorElement } from 'src/types/fetch.types';

export const formatErrors = (errors: ErrorElement[]) => {
  const result: Record<string, string> = {};

  errors.forEach(error => {
    if (error.domain !== 'global') {
      result[error.domain] = error.message;
    }
  });

  return result;
};
