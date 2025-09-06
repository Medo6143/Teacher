import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Student } from '../types';

interface StudentsState {
  students: Student[];
  loading: boolean;
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive' | 'graduated';
  groupFilter: string;
}

const initialState: StudentsState = {
  students: [],
  loading: false,
  searchTerm: '',
  statusFilter: 'all',
  groupFilter: '',
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(s => s.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'inactive' | 'graduated'>) => {
      state.statusFilter = action.payload;
    },
    setGroupFilter: (state, action: PayloadAction<string>) => {
      state.groupFilter = action.payload;
    },
  },
});

export const {
  setStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  setLoading,
  setSearchTerm,
  setStatusFilter,
  setGroupFilter,
} = studentsSlice.actions;
export default studentsSlice.reducer;