import { motion } from 'framer-motion';
import { FaCar, FaCalendarCheck, FaDollarSign, FaUsers, FaChartLine, FaArrowUp } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockVehicles, mockBookings } from '@/data/mockData';

const stats = [
  { 
    title: 'Total Vehicles', 
    value: '48', 
    icon: FaCar, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    change: '+12%',
    changePositive: true
  },
  { 
    title: 'Active Bookings', 
    value: '23', 
    icon: FaCalendarCheck, 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    change: '+8%',
    changePositive: true
  },
  { 
    title: 'Monthly Revenue', 
    value: '$45,230', 
    icon: FaDollarSign, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    change: '+23%',
    changePositive: true
  },
  { 
    title: 'Total Customers', 
    value: '1,245', 
    icon: FaUsers, 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    change: '+15%',
    changePositive: true
  },
];

export default function AdminDashboard() {
  const availableVehicles = mockVehicles.filter(v => v.status === 'available');
  const rentedVehicles = mockVehicles.filter(v => v.status === 'rented');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your fleet.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <FaArrowUp className={`text-xs ${stat.changePositive ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-xs ${stat.changePositive ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`text-2xl ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Fleet Overview */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Real-time vehicle availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{availableVehicles.length}</p>
                </div>
                <FaCar className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div>
                  <p className="text-sm text-muted-foreground">Rented</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{rentedVehicles.length}</p>
                </div>
                <FaCar className="text-3xl text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">0</p>
                </div>
                <FaCar className="text-3xl text-red-600 dark:text-red-400" />
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
            <div className="space-y-3">
              {mockBookings.slice(0, 3).map((booking) => {
                const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{vehicle?.make} {vehicle?.model}</p>
                      <p className="text-sm text-muted-foreground">#{booking.id}</p>
                    </div>
                    <Badge className={
                      booking.status === 'active' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                      booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' :
                      'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
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
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Add Vehicle
            </Button>
            <Button variant="outline">Manage Users</Button>
            <Button variant="outline">View Reports</Button>
            <Button variant="outline">System Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
