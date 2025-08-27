import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Search,
  Filter,
  Download,
  Plus,
  Users,
  MapPin,
  Calendar
} from "lucide-react";

export default function AdminCommunities() {
  const communities = [
    {
      id: 1,
      name: "Green Valley Community",
      address: "123 Valley Street, Green City",
      userCount: 234,
      admin: "Emily Rodriguez",
      status: "Active",
      pickupDays: "Mon, Wed, Fri",
      joinDate: "2023-09-01"
    },
    {
      id: 2,
      name: "Sunshine Heights",
      address: "456 Sun Avenue, Bright Town",
      userCount: 187,
      admin: "Michael Chen",
      status: "Active",
      pickupDays: "Tue, Thu, Sat",
      joinDate: "2023-09-15"
    },
    {
      id: 3,
      name: "Oak Park Residents",
      address: "789 Oak Drive, Park City",
      userCount: 156,
      admin: "Sarah Johnson",
      status: "Active",
      pickupDays: "Mon, Wed, Fri",
      joinDate: "2023-08-20"
    },
    {
      id: 4,
      name: "River View Estates",
      address: "321 River Road, Water City",
      userCount: 143,
      admin: "David Wilson",
      status: "Warning",
      pickupDays: "Tue, Thu",
      joinDate: "2023-08-01"
    },
    {
      id: 5,
      name: "Metro Gardens",
      address: "654 Metro Street, Garden City",
      userCount: 98,
      admin: "Lisa Anderson",
      status: "Pending",
      pickupDays: "Mon, Wed",
      joinDate: "2023-10-20"
    }
  ];

  const communityStats = [
    { label: "Total Communities", value: "47", icon: Building2, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Active", value: "42", icon: Building2, bgColor: "bg-green-100", iconColor: "text-green-600" },
    { label: "Pending Review", value: "3", icon: Building2, bgColor: "bg-yellow-100", iconColor: "text-yellow-600" },
    { label: "Issues", value: "2", icon: Building2, bgColor: "bg-red-100", iconColor: "text-red-600" }
  ];

  return (
    <AdminDashboardLayout title="Manage Communities">
      <div className="space-y-6">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {communityStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                      <IconComponent className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Community Management */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Community Management</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Community
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search communities by name or location..."
                  className="pl-10 bg-white/70"
                />
              </div>
            </div>

            {/* Communities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{community.name}</h3>
                          <Badge 
                            variant={
                              community.status === 'Active' ? 'default' : 
                              community.status === 'Warning' ? 'destructive' : 
                              'secondary'
                            }
                            className="mt-1"
                          >
                            {community.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{community.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{community.userCount} users</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Pickup: {community.pickupDays}</span>
                        </div>
                      </div>

                      {/* Admin Info */}
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Admin:</span> {community.admin}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined: {community.joinDate}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
