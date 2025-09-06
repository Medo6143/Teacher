import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Payment } from '../types';

interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  statusFilter: 'all' | 'paid' | 'pending' | 'overdue';
}

const initialState: PaymentsState = {
  payments: [],
  loading: false,
  statusFilter: 'all',
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    deletePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'paid' | 'pending' | 'overdue'>) => {
      state.statusFilter = action.payload;
    },
  },
});

export const { setPayments, addPayment, updatePayment, deletePayment, setLoading, setStatusFilter } = paymentsSlice.actions;
export default paymentsSlice.reducer;