import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from '../types';

interface GroupsState {
  groups: Group[];
  loading: boolean;
}

const initialState: GroupsState = {
  groups: [],
  loading: false,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      const index = state.groups.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(g => g.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setGroups, addGroup, updateGroup, deleteGroup, setLoading } = groupsSlice.actions;
export default groupsSlice.reducer;