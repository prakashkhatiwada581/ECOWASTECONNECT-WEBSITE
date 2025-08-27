import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search, Filter, Download, UserPlus, Shield, User } from "lucide-react";

export default function AdminUsers() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@user.com",
      community: "Green Valley Community",
      role: "User",
      status: "Active",
      joinDate: "2023-10-15",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@admin.com",
      community: "System Admin",
      role: "Admin",
      status: "Active",
      joinDate: "2023-09-01",
      lastActive: "30 minutes ago"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@user.com",
      community: "Sunshine Heights",
      role: "User",
      status: "Active",
      joinDate: "2023-10-20",
      lastActive: "1 day ago"
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.r@user.com",
      community: "Oak Park Residents",
      role: "Community Admin",
      status: "Active",
      joinDate: "2023-09-15",
      lastActive: "4 hours ago"
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.w@user.com",
      community: "River View Estates",
      role: "User",
      status: "Inactive",
      joinDate: "2023-08-10",
      lastActive: "2 weeks ago"
    }
  ];

  const userStats = [
    { label: "Total Users", value: "2,847", icon: Users, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Active Today", value: "423", icon: User, bgColor: "bg-green-100", iconColor: "text-green-600" },
    { label: "Admins", value: "12", icon: Shield, bgColor: "bg-purple-100", iconColor: "text-purple-600" },
    { label: "New This Month", value: "89", icon: UserPlus, bgColor: "bg-orange-100", iconColor: "text-orange-600" }
  ];

  return (
    <AdminDashboardLayout title="Manage Users">
      <div className="space-y-6">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, index) => {
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

        {/* User Management Tools */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
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
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add User
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
                  placeholder="Search users by name, email, or community..."
                  className="pl-10 bg-white/70"
                />
              </div>
            </div>

            {/* Users Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.community}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Community Admin' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
