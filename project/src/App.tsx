import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAppDispatch, useAppSelector } from './store';
import { setUser } from './store/authSlice';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';

function App() {
  const dispatch = useAppDispatch();
  const { user, loading, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="groups" element={<div className="p-6">المجموعات - قيد التطوير</div>} />
          <Route path="sessions" element={<div className="p-6">الجدول الزمني - قيد التطوير</div>} />
          <Route path="payments" element={<div className="p-6">المدفوعات - قيد التطوير</div>} />
          <Route path="stats" element={<div className="p-6">الإحصائيات - قيد التطوير</div>} />
          <Route path="settings" element={<div className="p-6">الإعدادات - قيد التطوير</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;