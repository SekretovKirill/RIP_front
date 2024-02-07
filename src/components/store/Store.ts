// store.ts
import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import FilterReducer from './slices/FilterSlice';

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    filter: FilterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
