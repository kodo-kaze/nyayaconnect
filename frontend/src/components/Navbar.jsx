import React from 'react';
import { Menu, Bell, User, Search, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="text-slate-900 capitalize">{user?.role} Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search cases..." 
            className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-danger"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden text-right lg:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name || user?.username || 'User'}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{user?.role}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-slate-300">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
