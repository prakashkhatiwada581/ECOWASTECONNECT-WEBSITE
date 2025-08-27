import { useState } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Truck, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2,
  MapPin,
  Clock,
  Users
} from "lucide-react";

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Green Valley Route",
      driver: "Mike Johnson",
      communities: ["Green Valley Community", "Oak Park"],
      schedule: "Mon, Wed, Fri",
      timeSlot: "8:00 AM - 12:00 PM",
      vehicleId: "TRK-001",
      status: "Active",
      lastRun: "2023-11-01",
      efficiency: "94%"
    },
    {
      id: 2,
      name: "Sunshine Heights Route",
      driver: "Sarah Wilson",
      communities: ["Sunshine Heights", "Metro Gardens"],
      schedule: "Tue, Thu, Sat",
      timeSlot: "1:00 PM - 5:00 PM",
      vehicleId: "TRK-002",
      status: "Active",
      lastRun: "2023-11-02",
      efficiency: "87%"
    },
    {
      id: 3,
      name: "River View Route",
      driver: "David Chen",
      communities: ["River View Estates"],
      schedule: "Mon, Wed",
      timeSlot: "9:00 AM - 1:00 PM",
      vehicleId: "TRK-003",
      status: "Maintenance",
      lastRun: "2023-10-28",
      efficiency: "91%"
    }
  ]);

  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [newRoute, setNewRoute] = useState({
    name: "",
    driver: "",
    communities: [],
    schedule: "",
    timeSlot: "",
    vehicleId: "",
    status: "Active"
  });

  const handleAddRoute = () => {
    const route = {
      id: routes.length + 1,
      ...newRoute,
      lastRun: new Date().toISOString().split('T')[0],
      efficiency: "100%"
    };
    setRoutes([...routes, route]);
    setNewRoute({
      name: "",
      driver: "",
      communities: [],
      schedule: "",
      timeSlot: "",
      vehicleId: "",
      status: "Active"
    });
    setIsAddRouteOpen(false);
  };

  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setNewRoute(route);
    setIsAddRouteOpen(true);
  };

  const handleUpdateRoute = () => {
    setRoutes(routes.map(route => 
      route.id === editingRoute.id ? { ...newRoute, id: editingRoute.id } : route
    ));
    setEditingRoute(null);
    setNewRoute({
      name: "",
      driver: "",
      communities: [],
      schedule: "",
      timeSlot: "",
      vehicleId: "",
      status: "Active"
    });
    setIsAddRouteOpen(false);
  };

  const handleDeleteRoute = (id) => {
    setRoutes(routes.filter(route => route.id !== id));
  };

  const routeStats = [
    { label: "Total Routes", value: routes.length.toString(), icon: Truck, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Active Routes", value: routes.filter(r => r.status === "Active").length.toString(), icon: Truck, bgColor: "bg-green-100", iconColor: "text-green-600" },
    { label: "Avg Efficiency", value: "91%", icon: Clock, bgColor: "bg-purple-100", iconColor: "text-purple-600" },
    { label: "Total Drivers", value: "12", icon: Users, bgColor: "bg-orange-100", iconColor: "text-orange-600" }
  ];

  return (
    <AdminDashboardLayout title="Pickup Routes">
      <div className="space-y-6">
        {/* Route Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {routeStats.map((stat, index) => {
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

        {/* Route Management */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Route Management</span>
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
                <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Route
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingRoute ? "Edit Route" : "Add New Route"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingRoute ? "Update the route information below." : "Create a new pickup route for your community."}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="routeName">Route Name</Label>
                        <Input
                          id="routeName"
                          value={newRoute.name}
                          onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                          placeholder="Enter route name"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="driver">Driver</Label>
                        <Input
                          id="driver"
                          value={newRoute.driver}
                          onChange={(e) => setNewRoute({...newRoute, driver: e.target.value})}
                          placeholder="Assign driver"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="vehicleId">Vehicle ID</Label>
                        <Input
                          id="vehicleId"
                          value={newRoute.vehicleId}
                          onChange={(e) => setNewRoute({...newRoute, vehicleId: e.target.value})}
                          placeholder="e.g., TRK-001"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="schedule">Schedule</Label>
                        <Input
                          id="schedule"
                          value={newRoute.schedule}
                          onChange={(e) => setNewRoute({...newRoute, schedule: e.target.value})}
                          placeholder="e.g., Mon, Wed, Fri"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="timeSlot">Time Slot</Label>
                        <Input
                          id="timeSlot"
                          value={newRoute.timeSlot}
                          onChange={(e) => setNewRoute({...newRoute, timeSlot: e.target.value})}
                          placeholder="e.g., 8:00 AM - 12:00 PM"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={newRoute.status} onValueChange={(value) => setNewRoute({...newRoute, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => {
                        setIsAddRouteOpen(false);
                        setEditingRoute(null);
                        setNewRoute({
                          name: "",
                          driver: "",
                          communities: [],
                          schedule: "",
                          timeSlot: "",
                          vehicleId: "",
                          status: "Active"
                        });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={editingRoute ? handleUpdateRoute : handleAddRoute}>
                        {editingRoute ? "Update Route" : "Add Route"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search routes by name, driver, or community..."
                  className="pl-10 bg-white/70"
                />
              </div>
            </div>

            {/* Routes Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Communities</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{route.driver}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {route.communities.map((community, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {community}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{route.schedule}</div>
                        <div className="text-gray-500">{route.timeSlot}</div>
                      </div>
                    </TableCell>
                    <TableCell>{route.vehicleId}</TableCell>
                    <TableCell>
                      <Badge variant={
                        route.status === 'Active' ? 'default' : 
                        route.status === 'Maintenance' ? 'destructive' : 
                        'secondary'
                      }>
                        {route.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{route.efficiency}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditRoute(route)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
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
