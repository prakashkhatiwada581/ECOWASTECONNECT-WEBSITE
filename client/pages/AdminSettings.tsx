import { useState } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Shield,
  Bell,
  Mail,
  Database,
  Users,
  Building,
  Truck,
  Save
} from "lucide-react";

export default function AdminSettings() {
  const [systemSettings, setSystemSettings] = useState({
    siteName: "EcoWasteConnect",
    siteDescription: "Smart Waste Management for Connected Communities",
    adminEmail: "admin@ecowasteconnect.com",
    defaultTimezone: "UTC",
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    pickupReminders: true,
    issueAlerts: true,
    systemUpdates: true,
    communityNews: false,
    emailFrequency: "immediate",
    smsFrequency: "urgent"
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    maxLoginAttempts: "5",
    requireStrongPasswords: true,
    allowPasswordReset: true
  });

  const handleSaveSettings = (settingsType: string) => {
    console.log(`Saving ${settingsType} settings...`);
    // In a real app, this would save to backend
  };

  return (
    <AdminDashboardLayout title="System Settings">
      <div className="space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Backup</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="grid gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>General System Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={systemSettings.adminEmail}
                        onChange={(e) => setSystemSettings({...systemSettings, adminEmail: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Default Timezone</Label>
                      <Select value={systemSettings.defaultTimezone} onValueChange={(value) => setSystemSettings({...systemSettings, defaultTimezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="CST">Central Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenance">Maintenance Mode</Label>
                        <p className="text-sm text-gray-500">Temporarily disable public access</p>
                      </div>
                      <Switch
                        id="maintenance"
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoBackup">Auto Backup</Label>
                        <p className="text-sm text-gray-500">Automatically backup system data daily</p>
                      </div>
                      <Switch
                        id="autoBackup"
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={() => handleSaveSettings('general')} className="bg-gradient-to-r from-blue-500 to-green-500">
                    <Save className="h-4 w-4 mr-2" />
                    Save General Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <div className="grid gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Email Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pickupReminders">Pickup Reminders</Label>
                        <p className="text-sm text-gray-500">Send pickup reminder emails to users</p>
                      </div>
                      <Switch
                        id="pickupReminders"
                        checked={notificationSettings.pickupReminders}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pickupReminders: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="issueAlerts">Issue Alerts</Label>
                        <p className="text-sm text-gray-500">Email alerts for reported issues</p>
                      </div>
                      <Switch
                        id="issueAlerts"
                        checked={notificationSettings.issueAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, issueAlerts: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="systemUpdates">System Updates</Label>
                        <p className="text-sm text-gray-500">Notifications about system maintenance and updates</p>
                      </div>
                      <Switch
                        id="systemUpdates"
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemUpdates: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailFreq">Email Frequency</Label>
                      <Select value={notificationSettings.emailFrequency} onValueChange={(value) => setNotificationSettings({...notificationSettings, emailFrequency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smsFreq">SMS Frequency</Label>
                      <Select value={notificationSettings.smsFrequency} onValueChange={(value) => setNotificationSettings({...notificationSettings, smsFrequency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent Only</SelectItem>
                          <SelectItem value="important">Important</SelectItem>
                          <SelectItem value="all">All Notifications</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={() => handleSaveSettings('notifications')} className="bg-gradient-to-r from-blue-500 to-green-500">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security & Access Control</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                      </div>
                      <Switch
                        id="twoFactor"
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="strongPasswords">Require Strong Passwords</Label>
                        <p className="text-sm text-gray-500">Enforce strong password requirements</p>
                      </div>
                      <Switch
                        id="strongPasswords"
                        checked={securitySettings.requireStrongPasswords}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireStrongPasswords: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                      className="max-w-24"
                    />
                  </div>
                  
                  <Button onClick={() => handleSaveSettings('security')} className="bg-gradient-to-r from-blue-500 to-green-500">
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Backup Settings */}
          <TabsContent value="backup">
            <div className="grid gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Backup & Recovery</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Automatic Daily Backup</h3>
                        <p className="text-sm text-gray-500">Last backup: 2 hours ago</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Weekly Full Backup</h3>
                        <p className="text-sm text-gray-500">Next backup: Tomorrow 2:00 AM</p>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Create Manual Backup
                    </Button>
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Restore from Backup
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Backup History</h3>
                    <div className="space-y-2">
                      {[
                        { date: "2023-11-02 02:00", type: "Auto", size: "245 MB", status: "Success" },
                        { date: "2023-11-01 02:00", type: "Auto", size: "243 MB", status: "Success" },
                        { date: "2023-10-31 02:00", type: "Auto", size: "241 MB", status: "Success" },
                        { date: "2023-10-30 02:00", type: "Manual", size: "240 MB", status: "Success" }
                      ].map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                          <span>{backup.date}</span>
                          <span>{backup.type}</span>
                          <span>{backup.size}</span>
                          <Badge variant={backup.status === 'Success' ? 'default' : 'destructive'}>
                            {backup.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
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
