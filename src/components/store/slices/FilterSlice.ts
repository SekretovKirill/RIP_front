import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  search: string | null;
  startDate: string | null;
  endDate: string | null;
  eventStatus: string | null;
  reserveStatus: string | null;
  // Другие поля, если необходимо
}

const storedSearch = localStorage.getItem('search');
const storedStartDate = localStorage.getItem('startDate');
const storedEndDate = localStorage.getItem('endDate');
const storedEventStatus = localStorage.getItem('eventStatus');
const storedReserveStatus = localStorage.getItem('reserveStatus');

const initialState: FilterState = {
  search: storedSearch || null,
  startDate: storedStartDate || null,
  endDate: storedEndDate || null,
  eventStatus: storedEventStatus || null,
  reserveStatus: storedReserveStatus || null,
  // Инициализируйте другие поля, если необходимо
};

const FilterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      localStorage.setItem('search', action.payload);
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
      localStorage.setItem('startDate', action.payload);
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
      localStorage.setItem('endDate', action.payload);
    },
    setEventStatus: (state, action: PayloadAction<string>) => {
      state.eventStatus = action.payload;
      localStorage.setItem('eventStatus', action.payload);
    },
    setReserveStatus: (state, action: PayloadAction<string>) => {
      state.reserveStatus = action.payload;
      localStorage.setItem('reserveStatus', action.payload);
    },
    // Добавьте другие reducers для других полей, если необходимо
  },
});

export const {
  setSearch,
  setStartDate,
  setEndDate,
  setEventStatus,
  setReserveStatus,
} = FilterSlice.actions;

export default FilterSlice.reducer;