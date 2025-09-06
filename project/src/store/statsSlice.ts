import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MonthlyStats } from '../types';

interface StatsState {
  currentStats: MonthlyStats | null;
  historicalStats: MonthlyStats[];
  loading: boolean;
}

const initialState: StatsState = {
  currentStats: null,
  historicalStats: [],
  loading: false,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setCurrentStats: (state, action: PayloadAction<MonthlyStats | null>) => {
      state.currentStats = action.payload;
    },
    setHistoricalStats: (state, action: PayloadAction<MonthlyStats[]>) => {
      state.historicalStats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCurrentStats, setHistoricalStats, setLoading } = statsSlice.actions;
export default statsSlice.reducer;