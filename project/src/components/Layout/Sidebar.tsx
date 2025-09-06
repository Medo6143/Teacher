import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  BarChart3,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSidebarOpen } from '../../store/uiSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: Home },
  { name: 'الطلاب', href: '/students', icon: Users },
  { name: 'المجموعات', href: '/groups', icon: UserCheck },
  { name: 'الجدول الزمني', href: '/sessions', icon: Calendar },
  { name: 'المدفوعات', href: '/payments', icon: CreditCard },
  { name: 'الإحصائيات', href: '/stats', icon: BarChart3 },
  { name: 'الإعدادات', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">نظام المدرس</h2>
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4">
          <div className="px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => dispatch(setSidebarOpen(false))}
              >
                <item.icon className="ml-3 h-6 w-6 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="ml-3 h-6 w-6 flex-shrink-0" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </>
  );
}