import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, DonutChart } from "@/components/Chart";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Recycle,
  Users,
  Building2,
  Truck
} from "lucide-react";

export default function AdminAnalytics() {
  const kpiData = [
    {
      title: "Total Waste Collected",
      value: "2,847 tons",
      change: "+12%",
      trend: "up",
      period: "vs last month",
      icon: Recycle,
      color: "green"
    },
    {
      title: "Recycling Rate",
      value: "78.5%",
      change: "+5.2%",
      trend: "up",
      period: "vs last month",
      icon: Recycle,
      color: "blue"
    },
    {
      title: "Collection Efficiency",
      value: "94.2%",
      change: "-1.8%",
      trend: "down",
      period: "vs last month",
      icon: Truck,
      color: "purple"
    },
    {
      title: "Community Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      trend: "up",
      period: "vs last month",
      icon: Users,
      color: "orange"
    }
  ];

  const chartData = {
    wasteCollection: [
      { month: "Jan", recycling: 245, general: 387, organic: 123 },
      { month: "Feb", recycling: 267, general: 401, organic: 134 },
      { month: "Mar", recycling: 289, general: 398, organic: 145 },
      { month: "Apr", recycling: 312, general: 420, organic: 156 },
      { month: "May", recycling: 334, general: 445, organic: 167 },
      { month: "Jun", recycling: 356, general: 467, organic: 178 }
    ],
    communityGrowth: [
      { month: "Jan", communities: 42, users: 2150 },
      { month: "Feb", communities: 44, users: 2289 },
      { month: "Mar", communities: 45, users: 2456 },
      { month: "Apr", communities: 46, users: 2578 },
      { month: "May", communities: 47, users: 2734 },
      { month: "Jun", communities: 47, users: 2847 }
    ]
  };

  const topCommunities = [
    { name: "Green Valley Community", wasteCollected: "456 tons", recyclingRate: "85%", efficiency: "97%" },
    { name: "Sunshine Heights", wasteCollected: "389 tons", recyclingRate: "82%", efficiency: "94%" },
    { name: "Oak Park Residents", wasteCollected: "345 tons", recyclingRate: "79%", efficiency: "92%" },
    { name: "River View Estates", wasteCollected: "298 tons", recyclingRate: "76%", efficiency: "89%" },
    { name: "Metro Gardens", wasteCollected: "234 tons", recyclingRate: "74%", efficiency: "87%" }
  ];

  const recentAlerts = [
    { type: "warning", message: "Recycling rate dropped 3% in River View Estates", time: "2 hours ago" },
    { type: "success", message: "New recycling record set by Green Valley Community", time: "4 hours ago" },
    { type: "info", message: "Monthly report generated successfully", time: "6 hours ago" },
    { type: "warning", message: "Vehicle TRK-003 requires maintenance", time: "8 hours ago" }
  ];

  return (
    <AdminDashboardLayout title="System Analytics">
      <div className="space-y-6">
        {/* Analytics Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select defaultValue="6months">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communities</SelectItem>
                <SelectItem value="green-valley">Green Valley Community</SelectItem>
                <SelectItem value="sunshine">Sunshine Heights</SelectItem>
                <SelectItem value="oak-park">Oak Park Residents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => {
            const IconComponent = kpi.icon;
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-${kpi.color}-100 rounded-lg`}>
                      <IconComponent className={`h-6 w-6 text-${kpi.color}-600`} />
                    </div>
                    <div className={`flex items-center space-x-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-medium">{kpi.change}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                    <p className="text-xs text-gray-500">{kpi.period}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Waste Collection Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Waste Collection Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { label: "Jan", value: 755, color: "bg-gradient-to-r from-green-400 to-green-600" },
                  { label: "Feb", value: 802, color: "bg-gradient-to-r from-blue-400 to-blue-600" },
                  { label: "Mar", value: 832, color: "bg-gradient-to-r from-purple-400 to-purple-600" },
                  { label: "Apr", value: 888, color: "bg-gradient-to-r from-orange-400 to-orange-600" },
                  { label: "May", value: 946, color: "bg-gradient-to-r from-teal-400 to-teal-600" },
                  { label: "Jun", value: 1001, color: "bg-gradient-to-r from-indigo-400 to-indigo-600" }
                ]}
                title="Total Waste Collection (tons)"
                maxValue={1200}
              />
            </CardContent>
          </Card>

          {/* Community Growth Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Community Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={[
                  { label: "Jan", value: 42 },
                  { label: "Feb", value: 44 },
                  { label: "Mar", value: 45 },
                  { label: "Apr", value: 46 },
                  { label: "May", value: 47 },
                  { label: "Jun", value: 47 }
                ]}
                title="Communities Growth"
                color="from-purple-500 to-pink-500"
              />
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Performing Communities */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Top Performing Communities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCommunities.map((community, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{community.name}</div>
                      <div className="text-sm text-gray-500">
                        {community.wasteCollected} collected
                      </div>
                    </div>
                    <div className="flex space-x-3 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-green-600">{community.recyclingRate}</div>
                        <div className="text-xs text-gray-500">Recycling</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{community.efficiency}</div>
                        <div className="text-xs text-gray-500">Efficiency</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Recent System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-1 rounded-full ${
                      alert.type === 'success' ? 'bg-green-100' :
                      alert.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        alert.type === 'success' ? 'bg-green-500' :
                        alert.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
