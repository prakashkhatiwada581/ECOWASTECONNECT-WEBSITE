import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { Calendar, Clock, MapPin, Trash2, Edit, Plus } from "lucide-react";

export default function SchedulePickup() {
  const [pickups, setPickups] = useState([
    {
      id: 1,
      date: "2023-11-05",
      timeSlot: "Morning (8:00 AM - 12:00 PM)",
      wasteType: "Recyclable Waste",
      address: "123 Community St, City, State",
      notes: "Bins are behind the gate",
      status: "Scheduled"
    },
    {
      id: 2,
      date: "2023-11-08",
      timeSlot: "Afternoon (12:00 PM - 4:00 PM)",
      wasteType: "General Waste",
      address: "123 Community St, City, State",
      notes: "",
      status: "Scheduled"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPickup, setEditingPickup] = useState(null);
  const [newPickup, setNewPickup] = useState({
    date: "",
    timeSlot: "",
    wasteType: "",
    address: "123 Community St, City, State",
    notes: ""
  });

  const wasteTypes = [
    "General Waste",
    "Recyclable Waste",
    "Organic Waste",
    "Hazardous Waste",
    "Electronic Waste"
  ];

  const timeSlots = [
    "Morning (8:00 AM - 12:00 PM)",
    "Afternoon (12:00 PM - 4:00 PM)",
    "Evening (4:00 PM - 8:00 PM)"
  ];

  const handleAddPickup = () => {
    const pickup = {
      id: pickups.length + 1,
      ...newPickup,
      status: "Scheduled"
    };
    setPickups([...pickups, pickup]);
    setNewPickup({
      date: "",
      timeSlot: "",
      wasteType: "",
      address: "123 Community St, City, State",
      notes: ""
    });
    setIsDialogOpen(false);
  };

  const handleEditPickup = (pickup) => {
    setEditingPickup(pickup);
    setNewPickup(pickup);
    setIsDialogOpen(true);
  };

  const handleUpdatePickup = () => {
    setPickups(pickups.map(pickup => 
      pickup.id === editingPickup.id ? { ...newPickup, id: editingPickup.id, status: editingPickup.status } : pickup
    ));
    setEditingPickup(null);
    setNewPickup({
      date: "",
      timeSlot: "",
      wasteType: "",
      address: "123 Community St, City, State",
      notes: ""
    });
    setIsDialogOpen(false);
  };

  const handleDeletePickup = (id) => {
    setPickups(pickups.filter(pickup => pickup.id !== id));
  };

  const upcomingPickups = pickups.filter(p => new Date(p.date) >= new Date());
  const pastPickups = pickups.filter(p => new Date(p.date) < new Date());

  return (
    <DashboardLayout title="Schedule Pickup">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Pickups</p>
                  <p className="text-2xl font-bold text-blue-600">{upcomingPickups.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Scheduled</p>
                  <p className="text-2xl font-bold text-purple-600">{pickups.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Pickup Request */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pickup Requests</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-green-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Pickup
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPickup ? "Edit Pickup Request" : "New Pickup Request"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPickup ? "Update your pickup request details." : "Schedule a new waste pickup for your location."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newPickup.date}
                        onChange={(e) => setNewPickup({...newPickup, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="timeSlot">Time Slot</Label>
                      <Select value={newPickup.timeSlot} onValueChange={(value) => setNewPickup({...newPickup, timeSlot: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="wasteType">Waste Type</Label>
                      <Select value={newPickup.wasteType} onValueChange={(value) => setNewPickup({...newPickup, wasteType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select waste type" />
                        </SelectTrigger>
                        <SelectContent>
                          {wasteTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Pickup Address</Label>
                      <Input
                        id="address"
                        value={newPickup.address}
                        onChange={(e) => setNewPickup({...newPickup, address: e.target.value})}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes / Special Instructions</Label>
                      <Textarea
                        id="notes"
                        placeholder="e.g., 'Bins are behind the gate', 'Please ring the bell'"
                        value={newPickup.notes}
                        onChange={(e) => setNewPickup({...newPickup, notes: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => {
                      setIsDialogOpen(false);
                      setEditingPickup(null);
                      setNewPickup({
                        date: "",
                        timeSlot: "",
                        wasteType: "",
                        address: "123 Community St, City, State",
                        notes: ""
                      });
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={editingPickup ? handleUpdatePickup : handleAddPickup}>
                      {editingPickup ? "Update Request" : "Submit Request"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Waste Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickups.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>{pickup.date}</TableCell>
                    <TableCell>{pickup.timeSlot}</TableCell>
                    <TableCell>{pickup.wasteType}</TableCell>
                    <TableCell className="max-w-48 truncate">{pickup.address}</TableCell>
                    <TableCell>
                      <Badge variant={pickup.status === 'Scheduled' ? 'default' : 'secondary'}>
                        {pickup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPickup(pickup)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePickup(pickup.id)}
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
    </DashboardLayout>
  );
}
