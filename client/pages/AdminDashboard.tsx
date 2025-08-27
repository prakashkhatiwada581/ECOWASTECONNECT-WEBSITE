import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIssues } from "@/contexts/IssuesContext";
import {
  Users,
  Building2,
  Truck,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  MapPin,
  Clock,
  Settings,
  Bell
} from "lucide-react";

export default function AdminDashboard() {
  const { getAdminNotifications, markNotificationAsRead, issues } = useIssues();
  const adminStats = [
    { label: "Total Communities", value: "47", change: "+3", icon: Building2, colorFrom: "from-blue-500", colorTo: "to-blue-600", bgColor: "from-blue-50", textColor: "text-blue-600" },
    { label: "Active Users", value: "2,847", change: "+127", icon: Users, colorFrom: "from-green-500", colorTo: "to-green-600", bgColor: "from-green-50", textColor: "text-green-600" },
    { label: "Pickup Routes", value: "89", change: "+5", icon: Truck, colorFrom: "from-purple-500", colorTo: "to-purple-600", bgColor: "from-purple-50", textColor: "text-purple-600" },
    { label: "System Alerts", value: "12", change: "-3", icon: AlertTriangle, colorFrom: "from-red-500", colorTo: "to-red-600", bgColor: "from-red-50", textColor: "text-red-600" }
  ];

  const communityStats = [
    { name: "Green Valley Community", users: 234, issues: 2, status: "Active" },
    { name: "Sunshine Heights", users: 187, issues: 0, status: "Active" },
    { name: "Oak Park Residents", users: 156, issues: 1, status: "Active" },
    { name: "River View Estates", users: 143, issues: 4, status: "Warning" },
    { name: "Metro Gardens", users: 98, issues: 0, status: "Active" }
  ];

  const recentActivity = [
    { action: "New community registered", detail: "Maple Street Community", time: "2 hours ago", type: "success" },
    { action: "Pickup route updated", detail: "Route #23 - Green Valley", time: "4 hours ago", type: "info" },
    { action: "System maintenance completed", detail: "Database optimization", time: "6 hours ago", type: "success" },
    { action: "Multiple missed pickups reported", detail: "River View Estates", time: "8 hours ago", type: "warning" },
    { action: "New admin user added", detail: "Sarah Johnson", time: "1 day ago", type: "info" }
  ];

  return (
    <AdminDashboardLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Admin Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} to-transparent opacity-60`}></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <span className={`text-sm font-medium ${stat.textColor}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 bg-gradient-to-r ${stat.colorFrom} ${stat.colorTo} rounded-xl shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Admin Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4 opacity-20">
              <Users className="h-16 w-16 text-white" />
            </div>
            <CardContent className="p-6 relative text-white">
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-white/20 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Manage Users</h3>
                  <p className="text-indigo-100 text-sm">
                    View and manage all user accounts and permissions
                  </p>
                </div>
                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4 opacity-20">
              <Building2 className="h-16 w-16 text-white" />
            </div>
            <CardContent className="p-6 relative text-white">
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-white/20 rounded-xl">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Communities</h3>
                  <p className="text-emerald-100 text-sm">
                    Oversee community registrations and configurations
                  </p>
                </div>
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg">
                  <Building2 className="h-4 w-4 mr-2" />
                  View Communities
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4 opacity-20">
              <BarChart3 className="h-16 w-16 text-white" />
            </div>
            <CardContent className="p-6 relative text-white">
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-white/20 rounded-xl">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Analytics</h3>
                  <p className="text-amber-100 text-sm">
                    View system-wide performance and usage analytics
                  </p>
                </div>
                <Button className="bg-white text-amber-600 hover:bg-amber-50 shadow-lg">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Notifications */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <span>Issue Notifications</span>
              </div>
              <Badge variant="destructive" className="text-xs">
                {getAdminNotifications().filter(n => !n.isRead).length} new
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getAdminNotifications().length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No new notifications</p>
              ) : (
                getAdminNotifications().slice(0, 3).map((notification) => (
                  <div key={notification.id} className={`p-4 rounded-lg border ${!notification.isRead ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          {!notification.isRead && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="ml-2 hover:bg-red-100"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
              {getAdminNotifications().length > 3 && (
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View All Notifications
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Community Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span>Community Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {communityStats.map((community, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-900">{community.name}</p>
                      <Badge variant={community.status === 'Active' ? 'default' : 'destructive'} className="text-xs">
                        {community.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{community.users} users</span>
                      <span>{community.issues} active issues</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl border border-green-100">
                  <div className={`p-2 rounded-lg mt-1 ${
                    activity.type === 'success' 
                      ? 'bg-gradient-to-r from-green-100 to-green-200' 
                      : activity.type === 'warning'
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200'
                      : 'bg-gradient-to-r from-blue-100 to-blue-200'
                  }`}>
                    {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {activity.type === 'info' && <Settings className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
