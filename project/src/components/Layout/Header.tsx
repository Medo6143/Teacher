import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar } from '../../store/uiSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="mr-4 text-xl font-semibold text-gray-800">
            مرحباً، {user?.displayName || user?.email}
          </h1>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <Bell className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}