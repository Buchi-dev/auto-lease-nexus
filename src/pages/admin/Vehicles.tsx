import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockVehicles } from '@/data/mockData';

export default function Vehicles() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vehicle Management</h1>
            <p className="text-muted-foreground">Manage your entire fleet</p>
          </div>
          <Button className="admin-gradient text-white">
            <FaPlus className="mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Input placeholder="Search vehicles..." />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="downtown">Downtown Office</SelectItem>
                  <SelectItem value="airport">Airport Terminal</SelectItem>
                  <SelectItem value="north">North Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Vehicles ({mockVehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.category}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={
                          vehicle.status === 'available' ? 'bg-green-500' :
                          vehicle.status === 'rented' ? 'bg-orange-500' :
                          'bg-red-500'
                        }>
                          {vehicle.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{vehicle.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-admin">${vehicle.dailyRate}</p>
                      <p className="text-xs text-muted-foreground">per day</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline">
                        <FaEye />
                      </Button>
                      <Button size="icon" variant="outline">
                        <FaEdit />
                      </Button>
                      <Button size="icon" variant="outline">
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
