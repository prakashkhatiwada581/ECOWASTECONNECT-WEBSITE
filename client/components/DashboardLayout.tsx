import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "./ProfileDropdown";
import {
  Recycle,
  LayoutDashboard,
  Calendar,
  AlertTriangle,
  History,
  Bell,
  BarChart3,
  Search,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Schedule Pickup", href: "/schedule-pickup", icon: Calendar },
  { name: "Report Issues", href: "/report-issues", icon: AlertTriangle },
  { name: "Pickup History", href: "/pickup-history", icon: History },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-white/95 backdrop-blur-md shadow-xl border-r border-gray-200/50 flex flex-col relative z-10">
        {/* Logo */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg">
            <Recycle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            EcoWasteConnect
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-gray-500"
                )} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50">
          <ProfileDropdown />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-white/70 backdrop-blur-sm border-gray-200 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto relative">
          {/* Content Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-green-50/50"></div>
          
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-green-200/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-blue-100/15 to-transparent rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
