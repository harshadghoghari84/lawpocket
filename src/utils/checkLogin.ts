import { fetch } from 'src/redux/fetch';
import { CurrentUser } from 'src/types/user.types';
import { API } from 'src/constants/apiEndpoints';

export const checkLogin = async (): Promise<boolean> => {
  const { data: currentUser } = await fetch<CurrentUser>({
    url: API.ME,
    method: 'GET',
  });
  return !!currentUser;
};
