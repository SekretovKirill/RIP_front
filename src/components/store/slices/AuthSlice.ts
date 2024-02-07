// AuthSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  role: string | null;
  login: string | null;
  hasDraft: string | null;
  isAuthenticated: string | null;
}

// Получаем сохраненные значения из localStorage при инициализации состояния
const storedRole = localStorage.getItem('role');
const storedLogin = localStorage.getItem('login');
const storedHasDraft = localStorage.getItem('hasDraft');
const storedIsAuthenticated = localStorage.getItem('isAuthenticated');

const initialState: UserState = {
  role: storedRole || null,
  login: storedLogin || null,
  hasDraft: storedHasDraft || null,
  isAuthenticated: storedIsAuthenticated || null,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
      // Сохраняем в localStorage при обновлении состояния
      localStorage.setItem('login', action.payload);
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      // Сохраняем в localStorage при обновлении состояния
      localStorage.setItem('role', action.payload);
    },
    setDraft: (state, action: PayloadAction<string>) => {
      state.hasDraft = action.payload;
      localStorage.setItem('hasDraft', action.payload);
    },
    setIsAuthenticated: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = action.payload;
      // Сохраняем в localStorage при обновлении состояния
      localStorage.setItem('isAuthenticated', action.payload);
    },
    setLogout: (state) => {
      state.role = null;
      state.login = null;
      state.hasDraft = null;
      state.isAuthenticated = null;
      // Удаляем данные из localStorage при выходе
      localStorage.removeItem('hasDraft');
      localStorage.removeItem('role');
      localStorage.removeItem('login');
      localStorage.removeItem('isAuthenticated');
    },
  },
});

export const { setUsername, setRole, setIsAuthenticated, setDraft, setLogout } = AuthSlice.actions;

export default AuthSlice.reducer;
