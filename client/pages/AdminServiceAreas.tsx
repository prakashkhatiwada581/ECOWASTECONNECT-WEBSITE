import { useState } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Users,
  Building2,
  Truck,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Map
} from "lucide-react";

interface ServiceArea {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
    radius: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  coverage: {
    households: number;
    communities: number;
    squareMiles: number;
  };
  services: {
    general: boolean;
    recycling: boolean;
    organic: boolean;
    hazardous: boolean;
    bulky: boolean;
  };
  schedule: {
    general: { days: string[]; time: string };
    recycling: { days: string[]; time: string };
    organic: { days: string[]; time: string };
  };
  routes: {
    id: string;
    name: string;
    driver: string;
    vehicle: string;
  }[];
  metrics: {
    efficiency: number;
    satisfaction: number;
    issueCount: number;
    lastUpdated: string;
  };
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  updatedAt: string;
}

export default function AdminServiceAreas() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data for service areas
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([
    {
      id: "1",
      name: "Downtown District",
      description: "Central business district covering downtown area with high-density residential and commercial buildings",
      coordinates: { lat: 40.7589, lng: -73.9851, radius: 2.5 },
      address: {
        street: "Manhattan District",
        city: "New York",
        state: "NY",
        zipCode: "10001-10199"
      },
      coverage: {
        households: 15420,
        communities: 8,
        squareMiles: 6.2
      },
      services: {
        general: true,
        recycling: true,
        organic: true,
        hazardous: false,
        bulky: true
      },
      schedule: {
        general: { days: ["monday", "wednesday", "friday"], time: "06:00" },
        recycling: { days: ["tuesday", "saturday"], time: "07:00" },
        organic: { days: ["thursday"], time: "08:00" }
      },
      routes: [
        { id: "R001", name: "Downtown Express", driver: "Mike Johnson", vehicle: "TRK-001" },
        { id: "R002", name: "Central Loop", driver: "Sarah Wilson", vehicle: "TRK-002" }
      ],
      metrics: {
        efficiency: 94.2,
        satisfaction: 4.6,
        issueCount: 3,
        lastUpdated: "2024-01-15"
      },
      status: "active",
      createdAt: "2023-06-01",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Suburban North",
      description: "Residential suburban area with family homes and local shopping centers",
      coordinates: { lat: 40.8176, lng: -73.9782, radius: 4.1 },
      address: {
        street: "North Bronx Area",
        city: "Bronx",
        state: "NY",
        zipCode: "10451-10475"
      },
      coverage: {
        households: 8750,
        communities: 12,
        squareMiles: 18.5
      },
      services: {
        general: true,
        recycling: true,
        organic: false,
        hazardous: true,
        bulky: true
      },
      schedule: {
        general: { days: ["tuesday", "friday"], time: "07:30" },
        recycling: { days: ["wednesday"], time: "08:00" },
        organic: { days: [], time: "" }
      },
      routes: [
        { id: "R003", name: "North Circle", driver: "David Brown", vehicle: "TRK-003" },
        { id: "R004", name: "Suburban Sweep", driver: "Lisa Garcia", vehicle: "TRK-004" },
        { id: "R005", name: "Family Route", driver: "Tom Anderson", vehicle: "TRK-005" }
      ],
      metrics: {
        efficiency: 89.7,
        satisfaction: 4.3,
        issueCount: 7,
        lastUpdated: "2024-01-14"
      },
      status: "active",
      createdAt: "2023-07-15",
      updatedAt: "2024-01-14"
    },
    {
      id: "3",
      name: "Industrial Zone",
      description: "Heavy industrial area with warehouses, factories, and commercial waste generation",
      coordinates: { lat: 40.6892, lng: -74.0445, radius: 3.8 },
      address: {
        street: "Industrial District",
        city: "Jersey City",
        state: "NJ",
        zipCode: "07030-07099"
      },
      coverage: {
        households: 2340,
        communities: 3,
        squareMiles: 12.7
      },
      services: {
        general: true,
        recycling: true,
        organic: false,
        hazardous: true,
        bulky: true
      },
      schedule: {
        general: { days: ["monday", "wednesday", "friday"], time: "05:00" },
        recycling: { days: ["tuesday", "thursday"], time: "05:30" },
        organic: { days: [], time: "" }
      },
      routes: [
        { id: "R006", name: "Industrial Heavy", driver: "Robert Martinez", vehicle: "TRK-006" }
      ],
      metrics: {
        efficiency: 97.1,
        satisfaction: 4.1,
        issueCount: 1,
        lastUpdated: "2024-01-16"
      },
      status: "maintenance",
      createdAt: "2023-08-20",
      updatedAt: "2024-01-16"
    }
  ]);

  const [newArea, setNewArea] = useState<Partial<ServiceArea>>({
    name: "",
    description: "",
    address: { street: "", city: "", state: "", zipCode: "" },
    services: {
      general: true,
      recycling: true,
      organic: false,
      hazardous: false,
      bulky: false
    },
    status: "active"
  });

  const filteredAreas = serviceAreas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || area.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalStats = {
    totalAreas: serviceAreas.length,
    activeAreas: serviceAreas.filter(a => a.status === "active").length,
    totalHouseholds: serviceAreas.reduce((sum, area) => sum + area.coverage.households, 0),
    totalCommunities: serviceAreas.reduce((sum, area) => sum + area.coverage.communities, 0),
    averageEfficiency: serviceAreas.reduce((sum, area) => sum + area.metrics.efficiency, 0) / serviceAreas.length,
    totalIssues: serviceAreas.reduce((sum, area) => sum + area.metrics.issueCount, 0)
  };

  const handleAddArea = () => {
    if (newArea.name && newArea.address?.city) {
      const area: ServiceArea = {
        id: Date.now().toString(),
        name: newArea.name,
        description: newArea.description || "",
        coordinates: { lat: 0, lng: 0, radius: 5 },
        address: newArea.address as ServiceArea['address'],
        coverage: { households: 0, communities: 0, squareMiles: 0 },
        services: newArea.services as ServiceArea['services'],
        schedule: {
          general: { days: ["monday", "wednesday", "friday"], time: "08:00" },
          recycling: { days: ["tuesday"], time: "09:00" },
          organic: { days: [], time: "" }
        },
        routes: [],
        metrics: { efficiency: 0, satisfaction: 0, issueCount: 0, lastUpdated: new Date().toISOString().split('T')[0] },
        status: newArea.status as ServiceArea['status'],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      setServiceAreas([...serviceAreas, area]);
      setNewArea({
        name: "",
        description: "",
        address: { street: "", city: "", state: "", zipCode: "" },
        services: { general: true, recycling: true, organic: false, hazardous: false, bulky: false },
        status: "active"
      });
      setIsAddDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceIcon = (service: string, enabled: boolean) => {
    const iconClass = enabled ? "text-green-600" : "text-gray-400";
    switch (service) {
      case "general": return <Trash2 className={`h-4 w-4 ${iconClass}`} />;
      case "recycling": return <Truck className={`h-4 w-4 ${iconClass}`} />;
      case "organic": return <Truck className={`h-4 w-4 ${iconClass}`} />;
      case "hazardous": return <AlertTriangle className={`h-4 w-4 ${iconClass}`} />;
      case "bulky": return <Building2 className={`h-4 w-4 ${iconClass}`} />;
      default: return null;
    }
  };

  return (
    <AdminDashboardLayout title="Service Areas Management">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Areas</p>
                  <p className="text-2xl font-bold text-blue-900">{totalStats.totalAreas}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Areas</p>
                  <p className="text-2xl font-bold text-green-900">{totalStats.activeAreas}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Households</p>
                  <p className="text-2xl font-bold text-purple-900">{totalStats.totalHouseholds.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Communities</p>
                  <p className="text-2xl font-bold text-orange-900">{totalStats.totalCommunities}</p>
                </div>
                <Building2 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600">Avg Efficiency</p>
                  <p className="text-2xl font-bold text-teal-900">{totalStats.averageEfficiency.toFixed(1)}%</p>
                </div>
                <Truck className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Open Issues</p>
                  <p className="text-2xl font-bold text-red-900">{totalStats.totalIssues}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-3 w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="coverage">Coverage Map</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-green-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Area
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Service Area</DialogTitle>
                    <DialogDescription>
                      Create a new service area to manage waste collection coverage.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Area Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter area name"
                        value={newArea.name}
                        onChange={(e) => setNewArea({...newArea, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the service area"
                        value={newArea.description}
                        onChange={(e) => setNewArea({...newArea, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={newArea.address?.city}
                          onChange={(e) => setNewArea({
                            ...newArea, 
                            address: {...(newArea.address || {}), city: e.target.value} as ServiceArea['address']
                          })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                          value={newArea.address?.state}
                          onChange={(e) => setNewArea({
                            ...newArea, 
                            address: {...(newArea.address || {}), state: e.target.value} as ServiceArea['address']
                          })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Services Offered</Label>
                      <div className="flex flex-wrap gap-4">
                        {['general', 'recycling', 'organic', 'hazardous', 'bulky'].map(service => (
                          <div key={service} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={service}
                              checked={newArea.services?.[service as keyof ServiceArea['services']] || false}
                              onChange={(e) => setNewArea({
                                ...newArea,
                                services: {
                                  ...(newArea.services || {}),
                                  [service]: e.target.checked
                                } as ServiceArea['services']
                              })}
                            />
                            <label htmlFor={service} className="text-sm capitalize">{service}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddArea}>
                        Create Area
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              {filteredAreas.map((area) => (
                <Card key={area.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <span>{area.name}</span>
                          <Badge className={getStatusColor(area.status)}>{area.status}</Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{area.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {area.address.city}, {area.address.state} • {area.coverage.squareMiles} sq mi
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedArea(area)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Coverage Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-blue-900">{area.coverage.households.toLocaleString()}</div>
                        <div className="text-xs text-blue-600">Households</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Building2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-green-900">{area.coverage.communities}</div>
                        <div className="text-xs text-green-600">Communities</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Truck className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-purple-900">{area.routes.length}</div>
                        <div className="text-xs text-purple-600">Routes</div>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Services Offered</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(area.services).map(([service, enabled]) => (
                          <div key={service} className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                            enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {getServiceIcon(service, enabled)}
                            <span className="capitalize">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{area.metrics.efficiency}%</div>
                        <div className="text-xs text-gray-500">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{area.metrics.satisfaction}/5</div>
                        <div className="text-xs text-gray-500">Satisfaction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{area.metrics.issueCount}</div>
                        <div className="text-xs text-gray-500">Open Issues</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coverage" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="h-5 w-5 text-blue-600" />
                  <span>Service Coverage Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Interactive Coverage Map</h3>
                    <p className="text-gray-500 max-w-md">
                      This would display an interactive map showing all service areas with their boundaries, 
                      routes, and real-time vehicle locations. Integration with mapping services like Google Maps 
                      or Mapbox would provide detailed geographical visualization.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Area Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceAreas.map((area) => (
                      <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{area.name}</div>
                          <div className="text-sm text-gray-500">{area.coverage.households} households</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{area.metrics.efficiency}%</div>
                          <div className="text-xs text-gray-500">Efficiency</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Service Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['general', 'recycling', 'organic', 'hazardous', 'bulky'].map((service) => {
                      const enabledCount = serviceAreas.filter(area => area.services[service as keyof ServiceArea['services']]).length;
                      const percentage = (enabledCount / serviceAreas.length) * 100;
                      
                      return (
                        <div key={service} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize font-medium">{service} Waste</span>
                            <span className="text-sm text-gray-600">{enabledCount}/{serviceAreas.length} areas</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}
