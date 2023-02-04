import { LoadingState } from 'src/types/global.types';

export interface MyCustomer {
  loading: LoadingState;
}

export interface MyCustomersProps {
  id: number;
  date: { updated: string };
  client: {
    id: number;
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
}
