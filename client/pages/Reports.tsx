import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, DonutChart } from "@/components/Chart";
import { Download, Eye, BarChart3, TrendingUp, PieChart, Calendar } from "lucide-react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("analytics");

  const pickupData = [
    { label: "Jan", value: 142, color: "bg-gradient-to-r from-blue-400 to-blue-600" },
    { label: "Feb", value: 158, color: "bg-gradient-to-r from-green-400 to-green-600" },
    { label: "Mar", value: 167, color: "bg-gradient-to-r from-purple-400 to-purple-600" },
    { label: "Apr", value: 189, color: "bg-gradient-to-r from-orange-400 to-orange-600" },
    { label: "May", value: 203, color: "bg-gradient-to-r from-teal-400 to-teal-600" },
    { label: "Jun", value: 198, color: "bg-gradient-to-r from-indigo-400 to-indigo-600" }
  ];

  const wasteVolumeData = [
    { label: "Week 1", value: 850 },
    { label: "Week 2", value: 920 },
    { label: "Week 3", value: 780 },
    { label: "Week 4", value: 1050 },
    { label: "Week 5", value: 1200 },
    { label: "Week 6", value: 980 }
  ];

  const recyclingData = [
    { label: "Recyclables", value: 45, color: "#10b981" },
    { label: "Organic Waste", value: 30, color: "#f59e0b" },
    { label: "General Waste", value: 25, color: "#ef4444" }
  ];

  const issueResolutionData = [
    { label: "Oct", value: 95 },
    { label: "Sep", value: 88 },
    { label: "Aug", value: 92 },
    { label: "Jul", value: 87 },
    { label: "Jun", value: 91 },
    { label: "May", value: 94 }
  ];

  const recentReports = [
    {
      name: "Pickup Summary - Oct 2023",
      generated: "2023-11-01",
      type: "Pickup History Summary"
    },
    {
      name: "Waste Volume - Q3 2023",
      generated: "2023-10-15",
      type: "Waste Volume Analysis"
    },
    {
      name: "Issue Resolution Rate - Sep 2023",
      generated: "2023-10-01",
      type: "Issue Resolution Rate"
    }
  ];

  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Generate</span>
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Monthly Pickup Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={pickupData}
                    title="Pickups Completed"
                    maxValue={250}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Issue Resolution Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={issueResolutionData}
                    title="Resolution Rate (%)"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span>Waste Volume Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={wasteVolumeData}
                  title="Weekly Waste Volume (kg)"
                  color="from-purple-500 to-pink-500"
                />
              </CardContent>
            </Card>

            {/* Trend Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Recycling Rate</p>
                      <p className="text-3xl font-bold text-green-900">45%</p>
                      <p className="text-sm text-green-700">+5% from last month</p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-full">
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Avg Collection Time</p>
                      <p className="text-3xl font-bold text-blue-900">2.3h</p>
                      <p className="text-sm text-blue-700">-0.2h improvement</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-1">Customer Satisfaction</p>
                      <p className="text-3xl font-bold text-orange-900">4.8/5</p>
                      <p className="text-sm text-orange-700">+0.2 rating increase</p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-full">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  <span>Waste Composition Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={recyclingData}
                  title="Waste Type Distribution"
                  centerText="100%"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Reports Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Generate New Report */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Generate New Report</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup-summary">Pickup History Summary</SelectItem>
                        <SelectItem value="waste-volume">Waste Volume Analysis</SelectItem>
                        <SelectItem value="issue-resolution">Issue Resolution Rate</SelectItem>
                        <SelectItem value="recycling-rate">Recycling Rate Report</SelectItem>
                        <SelectItem value="efficiency">Collection Efficiency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-green-600" />
                    <span>Recent Reports</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-500">Generated: {report.generated}</p>
                          <Badge variant="outline" className="mt-1">
                            {report.type}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
