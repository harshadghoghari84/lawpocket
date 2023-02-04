import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/types/redux.types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
