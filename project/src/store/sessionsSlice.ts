import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '../types';

interface SessionsState {
  sessions: Session[];
  loading: boolean;
}

const initialState: SessionsState = {
  sessions: [],
  loading: false,
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const index = state.sessions.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = action.payload;
      }
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSessions, addSession, updateSession, deleteSession, setLoading } = sessionsSlice.actions;
export default sessionsSlice.reducer;