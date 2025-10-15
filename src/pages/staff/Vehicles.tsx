import { motion } from 'framer-motion';
import { FaCar, FaMapMarkerAlt } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockVehicles } from '@/data/mockData';

export default function StaffVehicles() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vehicle Status</h1>
            <p className="text-muted-foreground">Update and track vehicle availability</p>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="downtown">Downtown Office</SelectItem>
              <SelectItem value="airport">Airport Terminal</SelectItem>
              <SelectItem value="north">North Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={
                        vehicle.status === 'available' ? 'bg-green-500' :
                        vehicle.status === 'rented' ? 'bg-orange-500' :
                        'bg-red-500'
                      }>
                        {vehicle.status}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FaMapMarkerAlt className="mr-1" />
                        {vehicle.location}
                      </div>
                    </div>

                    <Select defaultValue={vehicle.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button className="w-full staff-gradient text-white">
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
