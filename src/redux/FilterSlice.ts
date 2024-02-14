import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  search: string | null;
  startDate: string | null;
  endDate: string | null;
  eventStatus: string | null;
  reserveStatus: string | null;
  user: string | null;
  status: string | null;
  sortOrder:'desc' | 'asc';
}

const storedSearch = localStorage.getItem('search');
const storedStartDate = localStorage.getItem('startDate');
const storedEndDate = localStorage.getItem('endDate');
const storedEventStatus = localStorage.getItem('eventStatus');
const storedReserveStatus = localStorage.getItem('reserveStatus');
const storedSortOrder = localStorage.getItem('sortOrder');
const storedUser = localStorage.getItem('user');
const storedStatus = localStorage.getItem('status');

const initialState: FilterState = {
  user: storedUser || null,
  status: storedStatus || null,
  search: storedSearch || null,
  startDate: (storedStartDate as string) || null,
  endDate: (storedEndDate as string) || null,
  eventStatus: storedEventStatus || null,
  reserveStatus: storedReserveStatus || null,
  sortOrder: (storedSortOrder as 'desc' | 'asc') || 'asc',
  // Инициализируйте другие поля, если необходимо
};

const FilterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      localStorage.setItem('user', action.payload);
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
      localStorage.setItem('status', action.payload);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      localStorage.setItem('search', action.payload);
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
      localStorage.setItem('sortOrder', action.payload);
    },
    setStartDate: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload;
      localStorage.setItem('startDate', action.payload || ''); 
    },
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
      localStorage.setItem('endDate', action.payload || '');
    },
    setEventStatus: (state, action: PayloadAction<string>) => {
      state.eventStatus = action.payload;
      localStorage.setItem('eventStatus', action.payload);
    },
    setReserveStatus: (state, action: PayloadAction<string>) => {
      state.reserveStatus = action.payload;
      localStorage.setItem('reserveStatus', action.payload);
    },
    resetFilter: (state) => {
      // Reset all filter states to their initial values
      Object.assign(state, initialState);
      state.search=null;
      state.startDate = null;
      state.endDate = null;
      state.eventStatus = null;
      state.reserveStatus = null;
      state.user = null;
      state.status = null;
      state.sortOrder = 'asc';
      // Also clear the local storage
      localStorage.removeItem('user');
      localStorage.removeItem('status');
      localStorage.removeItem('search');
      localStorage.removeItem('startDate');
      localStorage.removeItem('endDate');
      localStorage.removeItem('eventStatus');
      localStorage.removeItem('reserveStatus');
      localStorage.removeItem('sortOrder');
    },
  },
});

export const {
  setUser,
  setStatus,
  setSearch,
  setStartDate,
  setEndDate,
  setEventStatus,
  setReserveStatus,
  setSortOrder,
  resetFilter,
} = FilterSlice.actions;

export default FilterSlice.reducer;