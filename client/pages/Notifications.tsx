import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIssues } from "@/contexts/IssuesContext";
import { Bell, Check } from "lucide-react";

export default function Notifications() {
  const { getUserNotifications, markNotificationAsRead } = useIssues();
  const [activeTab, setActiveTab] = useState("All");

  const userNotifications = getUserNotifications();

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "Unread":
        return userNotifications.filter(n => !n.isRead);
      case "System":
        return userNotifications.filter(n => n.type === 'info' || n.type === 'warning');
      default:
        return userNotifications;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const tabs = ["All", "Unread", "System"];
  const filteredNotifications = getFilteredNotifications();

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <span>Notification Center</span>
              <Badge variant="secondary" className="ml-auto">
                {userNotifications.filter(n => !n.isRead).length} unread
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={tab === activeTab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={tab === activeTab ? "bg-gradient-to-r from-blue-500 to-green-500" : ""}
            >
              {tab}
              {tab === "Unread" && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {userNotifications.filter(n => !n.isRead).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No notifications found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm border-0 shadow-lg ${
                  !notification.isRead ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <Badge
                          variant={
                            notification.type === "success" ? "default" :
                            notification.type === "warning" ? "secondary" :
                            notification.type === "error" ? "destructive" :
                            "outline"
                          }
                          className="text-xs"
                        >
                          {notification.type}
                        </Badge>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`mb-2 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-4 hover:bg-blue-50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
