import { motion } from 'framer-motion';
import { FaCar, FaCalendarCheck, FaDollarSign, FaUsers, FaChartLine } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockVehicles, mockBookings } from '@/data/mockData';

const stats = [
  { label: 'Total Vehicles', value: '48', icon: FaCar, color: 'text-blue-500', change: '+12%' },
  { label: 'Active Bookings', value: '23', icon: FaCalendarCheck, color: 'text-green-500', change: '+8%' },
  { label: 'Monthly Revenue', value: '$45,230', icon: FaDollarSign, color: 'text-purple-500', change: '+23%' },
  { label: 'Total Customers', value: '1,245', icon: FaUsers, color: 'text-orange-500', change: '+15%' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export default function AdminDashboard() {
  const availableVehicles = mockVehicles.filter(v => v.status === 'available');
  const rentedVehicles = mockVehicles.filter(v => v.status === 'rented');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your fleet.</p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                        <Badge variant="secondary" className="mt-2">
                          <FaChartLine className="mr-1" />
                          {stat.change}
                        </Badge>
                      </div>
                      <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                        <Icon className="text-2xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Fleet Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
              <CardDescription>Real-time vehicle availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-green-600">{availableVehicles.length}</p>
                  </div>
                  <FaCar className="text-3xl text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Rented</p>
                    <p className="text-2xl font-bold text-orange-600">{rentedVehicles.length}</p>
                  </div>
                  <FaCar className="text-3xl text-orange-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <p className="text-2xl font-bold text-red-600">0</p>
                  </div>
                  <FaCar className="text-3xl text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBookings.slice(0, 3).map((booking) => {
                  const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{vehicle?.make} {vehicle?.model}</p>
                        <p className="text-sm text-muted-foreground">{booking.id}</p>
                      </div>
                      <Badge className={
                        booking.status === 'active' ? 'bg-green-500' :
                        booking.status === 'confirmed' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }>
                        {booking.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Bookings</Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button className="admin-gradient text-white">Add Vehicle</Button>
              <Button variant="outline">Manage Users</Button>
              <Button variant="outline">View Reports</Button>
              <Button variant="outline">System Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
