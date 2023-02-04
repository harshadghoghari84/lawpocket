import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/root.reducer';

export const store = configureStore({
  reducer: rootReducer,
});
