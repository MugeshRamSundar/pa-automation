'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  AlertCircle,
  User
} from 'lucide-react';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';

// Navigation menu items
const navItems = [
  { 
    name: 'Overview', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    description: 'Dashboard home'
  },
  { 
    name: 'PA Requests', 
    href: '/dashboard/requests', 
    icon: FileText,
    description: 'All prior authorization requests'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart3,
    description: 'Reports and metrics'
  },
  { 
    name: 'Escalations', 
    href: '/dashboard/escalations', 
    icon: AlertCircle,
    description: 'Cases needing attention'
  },
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-10">
        <div className="flex flex-col h-full">
          
          {/* Logo/Brand */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">PA Automation</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section (Bottom) */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500">admin@hospital.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {navItems.find((item) => item.href === pathname)?.name || 'Dashboard'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {navItems.find((item) => item.href === pathname)?.description}
            </p>
          </div>
          
          {/* ONLY Notification Center - Remove duplicate Bell */}
          <NotificationCenter />
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
