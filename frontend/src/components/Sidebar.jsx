import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  Briefcase, 
  Bell, 
  Search, 
  FileText, 
  Upload, 
  Scale, 
  ShieldCheck, 
  Users, 
  History,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'CITIZEN':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/citizen' },
          { icon: FilePlus, label: 'File Complaint', path: '/citizen/file' },
          { icon: Briefcase, label: 'My Cases', path: '/citizen/cases' },
          { icon: Bell, label: 'Notifications', path: '/citizen/notifications' },
        ];
      case 'POLICE':
        return [
          { icon: LayoutDashboard, label: 'Assigned Cases', path: '/police' },
          { icon: Search, label: 'Investigation Panel', path: '/police/investigation' },
          { icon: Upload, label: 'Upload Evidence', path: '/police/evidence' },
        ];
      case 'LAWYER':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/lawyer' },
          { icon: FileText, label: 'Case Documents', path: '/lawyer/documents' },
          { icon: Scale, label: 'Arguments Submission', path: '/lawyer/arguments' },
        ];
      case 'JUDGE':
        return [
          { icon: LayoutDashboard, label: 'Case Viewer', path: '/judge' },
          { icon: FileText, label: 'Orders & Decisions', path: '/judge/orders' },
        ];
      case 'ADMIN':
        return [
          { icon: ShieldCheck, label: 'Verification Queue', path: '/admin' },
          { icon: Users, label: 'Assign Authorities', path: '/admin/assign' },
          { icon: History, label: 'Audit Logs', path: '/admin/logs' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-blue-950 border-b border-blue-900">
            <span className="text-xl font-bold tracking-tight">NyayaConnect</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-800 text-white' 
                      : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-blue-900">
            <button 
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-100 rounded-md hover:bg-red-900/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
