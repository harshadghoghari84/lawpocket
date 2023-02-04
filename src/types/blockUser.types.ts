import { LoadingState } from 'src/types/global.types';

export interface BlockUser {
  loading: LoadingState;
}
interface UserProps {
  id: number;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}
export interface BlockedUserItemProps {
  id: string;
  date: { updated: string };
  forUser: UserProps;
  onPress?: () => void;
}
// export interface BlockedUserProps {
//   data: BlockedUserItemProps[];
// }
