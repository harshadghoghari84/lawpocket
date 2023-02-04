import { useQuery, UseQueryOptions } from 'react-query';
import { API } from 'src/constants/apiEndpoints';
import { QueryKeys } from 'src/constants/queryKeys';
import { fetch } from 'src/redux/fetch';
import { City, State } from 'src/types/setProfile.types';

export const useStateOfCountry = (
  options?: UseQueryOptions<State[], unknown, State[], string[]>,
) => {
  return useQuery(
    [QueryKeys.STATE],
    async () => {
      const { data, errors } = await fetch<State[]>({
        url: API.STATE,
        method: 'GET',
      });

      if (errors) {
        throw new Error(errors.message);
      }
      return data;
    },
    options,
  );
};

export const useCityOfState = (
  stateIsoCode: string,
  options?: UseQueryOptions<City[], unknown, City[], string[]>,
) => {
  return useQuery(
    [QueryKeys.CITY_OF_STATE, stateIsoCode],
    async () => {
      const { data, errors } = await fetch<City[]>({
        url: API.CITY_OF_STATE,
        method: 'GET',
        params: { iso: stateIsoCode },
      });

      if (errors) {
        throw new Error(errors.message);
      }

      return data;
    },
    options,
  );
};
