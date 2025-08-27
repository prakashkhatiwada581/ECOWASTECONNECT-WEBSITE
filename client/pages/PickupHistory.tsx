import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PickupHistory() {
  const pickupHistory = [
    {
      date: "2023-10-26",
      type: "Recyclables",
      location: "123 Main St",
      status: "COMPLETED"
    },
    {
      date: "2023-10-19",
      type: "General Waste",
      location: "123 Main St",
      status: "COMPLETED"
    },
    {
      date: "2023-10-12",
      type: "Organic Waste",
      location: "123 Main St",
      status: "COMPLETED"
    },
    {
      date: "2023-10-05",
      type: "Recyclables",
      location: "123 Main St",
      status: "CANCELLED"
    },
    {
      date: "2023-09-28",
      type: "General Waste",
      location: "123 Main St",
      status: "COMPLETED"
    },
    {
      date: "2023-09-21",
      type: "Organic Waste",
      location: "123 Main St",
      status: "PENDING"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <DashboardLayout title="Pickup History">
      <Card>
        <CardHeader>
          <CardTitle>Your Pickup History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickupHistory.map((pickup, index) => (
                <TableRow key={index}>
                  <TableCell>{pickup.date}</TableCell>
                  <TableCell>{pickup.type}</TableCell>
                  <TableCell>{pickup.location}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(pickup.status)}>
                      {pickup.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
