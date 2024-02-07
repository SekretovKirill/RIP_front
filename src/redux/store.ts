// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import FilterReducer from './FilterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: FilterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



