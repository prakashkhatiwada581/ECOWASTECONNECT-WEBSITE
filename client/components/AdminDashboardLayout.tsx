import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "./ProfileDropdown";
import {
  Recycle,
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Settings,
  Shield,
  Search,
  Truck,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface AdminDashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manage Communities", href: "/admin/communities", icon: Building2 },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Pickup Routes", href: "/admin/routes", icon: Truck },
  { name: "Service Areas", href: "/admin/areas", icon: MapPin },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardLayout({ children, title }: AdminDashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DC2626' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Admin Sidebar */}
      <div className="w-64 bg-white/95 backdrop-blur-md shadow-xl border-r border-red-200/50 flex flex-col relative z-10">
        {/* Admin Logo */}
        <div className="flex items-center space-x-3 p-6 border-b border-red-200/50 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              EcoWasteConnect
            </span>
            <div className="text-xs font-semibold text-red-600 uppercase tracking-wide">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-gray-900"
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

        {/* Admin Profile */}
        <div className="p-4 border-t border-red-200/50 bg-gradient-to-r from-gray-50 to-red-50">
          <ProfileDropdown isAdmin />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Admin Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-red-200/50 px-6 py-4">
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
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                  Administrator
                </span>
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
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-rose-50/30 to-orange-50/50"></div>
          
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-red-200/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-orange-200/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-red-100/15 to-transparent rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
