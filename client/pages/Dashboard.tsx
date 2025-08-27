import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Flag,
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Bell,
  TrendingUp,
  Users,
  Recycle,
  Award
} from "lucide-react";

export default function Dashboard() {
  const upcomingPickups = [
    {
      type: "Recycling Pickup",
      date: "Oct 26, 2023",
      time: "Morning",
      icon: <Recycle className="h-4 w-4" />,
      status: "confirmed"
    },
    {
      type: "General Waste",
      date: "Oct 28, 2023",
      time: "Afternoon",
      icon: <Calendar className="h-4 w-4" />,
      status: "scheduled"
    },
    {
      type: "Organic Waste",
      date: "Nov 01, 2023",
      time: "Morning",
      icon: <Calendar className="h-4 w-4" />,
      status: "pending"
    }
  ];

  const recentIssues = [
    {
      type: "Missed Pickup",
      date: "Oct 20, 2023",
      status: "Pending",
      icon: <Flag className="h-4 w-4" />,
      priority: "high"
    },
    {
      type: "Damaged Bin", 
      date: "Oct 15, 2023",
      status: "Resolved",
      icon: <Flag className="h-4 w-4" />,
      priority: "medium"
    },
    {
      type: "Illegal Dumping",
      date: "Oct 10, 2023", 
      status: "In Progress",
      icon: <Flag className="h-4 w-4" />,
      priority: "high"
    }
  ];

  const notifications = [
    {
      message: "2 new messages",
      icon: <Bell className="h-4 w-4" />,
      type: "info"
    },
    {
      message: "Pickup reminder for tomorrow",
      icon: <Clock className="h-4 w-4" />,
      type: "reminder"
    },
    {
      message: "Issue #1234 updated to 'Resolved'",
      icon: <CheckCircle className="h-4 w-4" />,
      type: "success"
    }
  ];

  const stats = [
    { label: "Total Pickups", value: "156", change: "+12%", icon: Calendar, colorFrom: "from-blue-500", colorTo: "to-blue-600", bgColor: "from-blue-50", textColor: "text-blue-600" },
    { label: "Issues Resolved", value: "43", change: "+8%", icon: CheckCircle, colorFrom: "from-green-500", colorTo: "to-green-600", bgColor: "from-green-50", textColor: "text-green-600" },
    { label: "Community Rating", value: "4.8", change: "+0.2", icon: Award, colorFrom: "from-yellow-500", colorTo: "to-yellow-600", bgColor: "from-yellow-50", textColor: "text-yellow-600" },
    { label: "Active Members", value: "1,247", change: "+5%", icon: Users, colorFrom: "from-purple-500", colorTo: "to-purple-600", bgColor: "from-purple-50", textColor: "text-purple-600" }
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4 opacity-20">
              <Calendar className="h-20 w-20 text-white" />
            </div>
            <CardContent className="p-8 relative text-white">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-white/20 rounded-xl">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Schedule New Pickup</h3>
                    <p className="text-blue-100 leading-relaxed">
                      Book your next waste collection with smart scheduling
                    </p>
                  </div>
                  <Link to="/schedule-pickup">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Pickup
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4 opacity-20">
              <AlertTriangle className="h-20 w-20 text-white" />
            </div>
            <CardContent className="p-8 relative text-white">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-white/20 rounded-xl">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Report New Issue</h3>
                    <p className="text-orange-100 leading-relaxed">
                      Report any waste management issues quickly
                    </p>
                  </div>
                  <Link to="/report-issues">
                    <Button className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
                      <Flag className="h-4 w-4 mr-2" />
                      Report New Issue
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Pickups */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span>Upcoming Pickups</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingPickups.map((pickup, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                    {pickup.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-900">{pickup.type}</p>
                      <Badge variant={pickup.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                        {pickup.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{pickup.date} ({pickup.time})</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Issues */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Flag className="h-5 w-5 text-white" />
                </div>
                <span>Recent Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentIssues.map((issue, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl border border-orange-100 hover:shadow-md transition-all duration-200">
                  <div className={`p-2 rounded-lg ${
                    issue.priority === 'high' 
                      ? 'bg-gradient-to-r from-red-100 to-red-200' 
                      : 'bg-gradient-to-r from-orange-100 to-orange-200'
                  }`}>
                    {issue.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-900">{issue.type}</p>
                      <Badge 
                        variant={issue.status === "Resolved" ? "default" : 
                                issue.status === "In Progress" ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {issue.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{issue.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl border border-green-100 hover:shadow-md transition-all duration-200">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'success' 
                      ? 'bg-gradient-to-r from-green-100 to-green-200'
                      : notification.type === 'reminder'
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200'
                  }`}>
                    {notification.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{notification.message}</p>
                  </div>
                </div>
              ))}
              
              <Link to="/notifications" className="block">
                <Button variant="outline" className="w-full mt-4 hover:bg-green-50 hover:border-green-200">
                  View All Notifications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
