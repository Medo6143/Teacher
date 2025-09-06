import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db, timestamp } from '../lib/firebase';
import { Student, Group, Payment, Session, MonthlyStats } from '../types';

// Students service
export const studentsService = {
  async getStudents(ownerUid: string) {
    const q = query(
      collection(db, 'students'),
      where('ownerUid', '==', ownerUid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  },

  async addStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    });
    return docRef.id;
  },

  async updateStudent(id: string, updates: Partial<Student>) {
    await updateDoc(doc(db, 'students', id), {
      ...updates,
      updatedAt: timestamp(),
    });
  },

  async deleteStudent(id: string) {
    await deleteDoc(doc(db, 'students', id));
  },

  onStudentsSnapshot(ownerUid: string, callback: (students: Student[]) => void) {
    const q = query(
      collection(db, 'students'),
      where('ownerUid', '==', ownerUid),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      callback(students);
    });
  },
};

// Groups service
export const groupsService = {
  async getGroups(ownerUid: string) {
    const q = query(
      collection(db, 'groups'),
      where('ownerUid', '==', ownerUid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
  },

  async addGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'groups'), {
      ...groupData,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    });
    return docRef.id;
  },

  async updateGroup(id: string, updates: Partial<Group>) {
    await updateDoc(doc(db, 'groups', id), {
      ...updates,
      updatedAt: timestamp(),
    });
  },

  async deleteGroup(id: string) {
    await deleteDoc(doc(db, 'groups', id));
  },

  onGroupsSnapshot(ownerUid: string, callback: (groups: Group[]) => void) {
    const q = query(
      collection(db, 'groups'),
      where('ownerUid', '==', ownerUid),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
      callback(groups);
    });
  },
};

// Payments service
export const paymentsService = {
  async getPayments(ownerUid: string, month?: string) {
    let q = query(
      collection(db, 'payments'),
      where('ownerUid', '==', ownerUid)
    );
    
    if (month) {
      q = query(q, where('month', '==', month));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  },

  async addPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'payments'), {
      ...paymentData,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    });
    return docRef.id;
  },

  async updatePayment(id: string, updates: Partial<Payment>) {
    await updateDoc(doc(db, 'payments', id), {
      ...updates,
      updatedAt: timestamp(),
    });
  },

  async deletePayment(id: string) {
    await deleteDoc(doc(db, 'payments', id));
  },

  onPaymentsSnapshot(ownerUid: string, month: string, callback: (payments: Payment[]) => void) {
    const q = query(
      collection(db, 'payments'),
      where('ownerUid', '==', ownerUid),
      where('month', '==', month),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
      callback(payments);
    });
  },
};

// Sessions service
export const sessionsService = {
  async getSessions(ownerUid: string) {
    const q = query(
      collection(db, 'sessions'),
      where('ownerUid', '==', ownerUid),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
  },

  async addSession(sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    });
    return docRef.id;
  },

  async updateSession(id: string, updates: Partial<Session>) {
    await updateDoc(doc(db, 'sessions', id), {
      ...updates,
      updatedAt: timestamp(),
    });
  },

  async deleteSession(id: string) {
    await deleteDoc(doc(db, 'sessions', id));
  },

  onSessionsSnapshot(ownerUid: string, callback: (sessions: Session[]) => void) {
    const q = query(
      collection(db, 'sessions'),
      where('ownerUid', '==', ownerUid),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
      callback(sessions);
    });
  },
};

// Stats service
export const statsService = {
  async getMonthlyStats(ownerUid: string, month: string) {
    const q = query(
      collection(db, 'monthlyStats'),
      where('ownerUid', '==', ownerUid),
      where('month', '==', month),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as MonthlyStats;
    }
    return null;
  },

  async getHistoricalStats(ownerUid: string) {
    const q = query(
      collection(db, 'monthlyStats'),
      where('ownerUid', '==', ownerUid),
      orderBy('month', 'desc'),
      limit(12)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MonthlyStats));
  },

  onStatsSnapshot(ownerUid: string, month: string, callback: (stats: MonthlyStats | null) => void) {
    const q = query(
      collection(db, 'monthlyStats'),
      where('ownerUid', '==', ownerUid),
      where('month', '==', month),
      limit(1)
    );
    return onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length > 0) {
        const doc = snapshot.docs[0];
        callback({ id: doc.id, ...doc.data() } as MonthlyStats);
      } else {
        callback(null);
      }
    });
  },
};