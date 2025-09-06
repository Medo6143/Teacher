import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Settings {
  id: string;
  ownerUid: string;
  defaultPaymentAmount: number;
  currency: string;
  schoolName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Student {
  id: string;
  ownerUid: string;
  name: string;
  email?: string;
  phone?: string;
  parentPhone?: string;
  address?: string;
  groupId?: string;
  status: 'active' | 'inactive' | 'graduated';
  customPaymentAmount?: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Group {
  id: string;
  ownerUid: string;
  name: string;
  description?: string;
  color: string;
  paymentAmount?: number;
  maxStudents?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Session {
  id: string;
  ownerUid: string;
  groupId?: string;
  studentIds?: string[];
  title: string;
  date: Timestamp;
  duration: number; // minutes
  recurrence?: 'none' | 'weekly' | 'biweekly' | 'monthly';
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Payment {
  id: string;
  ownerUid: string;
  studentId: string;
  amount: number;
  month: string; // YYYY-MM format
  status: 'paid' | 'pending' | 'overdue';
  dueDate: Timestamp;
  paidDate?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MonthlyStats {
  id: string;
  ownerUid: string;
  month: string; // YYYY-MM
  totalStudents: number;
  activeStudents: number;
  totalRevenue: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  attendanceRate: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}