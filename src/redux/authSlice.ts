// authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

interface AuthState {
  authToken: string | null;
  name: string | null;
  role: string | null;
  isAuthenticated: string | null;
  id: string | null;
}

const initialUsername = localStorage.getItem('name') || null;
const initialUser_role = localStorage.getItem('role') || null;
const initialisAuthenticated = localStorage.getItem('isAuthenticated') || null;
const initialUser_id = localStorage.getItem('id') || null;

const initialState: AuthState = {
  authToken: Cookies.get('session_key') || null,
  name: initialUsername,
  role: initialUser_role,
  isAuthenticated: initialisAuthenticated,
  id: initialUser_id,
};

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.get('/api/auth/logout', {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
      Cookies.set('session_key', action.payload);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      // Update local storage whenever the username changes
      localStorage.setItem('name', action.payload);
    },
    setUser_role: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      // Update local storage whenever the username changes
      localStorage.setItem('role', action.payload);
    },
    setUser_id: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
      // Update local storage whenever the username changes
      localStorage.setItem('id', action.payload);
    },
    clearAuthToken: (state) => {
      state.authToken = null;
      Cookies.remove('session_key');
    },
    setIsAuthenticated: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = action.payload;
      // Сохраняем в localStorage при обновлении состояния
      localStorage.setItem('isAuthenticated', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated=null;
      state.authToken = null;
      state.id = null;
      state.name = null;
      state.role = null;
      Cookies.remove('session_key');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
      localStorage.removeItem('name');
      localStorage.removeItem('isAuthenticated');
    });
  },
});

export const { setAuthToken, setUsername, setUser_role, clearAuthToken , setIsAuthenticated, setUser_id} = authSlice.actions;

export default authSlice.reducer;
