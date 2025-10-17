import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClipboardList, FaCar, FaUserFriends } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import type { Vehicle, Booking } from '@/types';

const quickActions = [
  { label: 'New Booking', icon: FaClipboardList, color: 'staff-gradient' },
  { label: 'Check-In Vehicle', icon: FaCheckCircle, color: 'bg-green-500' },
  { label: 'Check-Out Vehicle', icon: FaCar, color: 'bg-orange-500' },
  { label: 'Customer Lookup', icon: FaUserFriends, color: 'bg-blue-500' },
];

export default function StaffDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vehiclesRes, bookingsRes] = await Promise.all([
          api.listVehicles({ page: 1, limit: 100 }),
          api.listBookings({ page: 1, limit: 100 }),
        ]);
        setVehicles(vehiclesRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const todayBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed');
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
          <p className="text-muted-foreground">Manage daily operations and customer service</p>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full ${action.color} flex items-center justify-center mb-3`}>
                      <Icon className="text-2xl text-white" />
                    </div>
                    <p className="font-semibold">{action.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Upcoming pickups and returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : todayBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No bookings for today</div>
              ) : (
                todayBookings.map((booking) => {
                  const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-staff-light/20 rounded-lg border-l-4 border-staff">
                      <div className="flex items-center space-x-4">
                        <img
                          src={vehicle?.image || '/placeholder.jpg'}
                          alt={`${vehicle?.make} ${vehicle?.model}`}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold">{vehicle?.make} {vehicle?.model}</p>
                          <p className="text-sm text-muted-foreground">#{booking.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">{booking.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-staff text-white mb-2">
                          {booking.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Status Board */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
            <CardDescription>Current fleet status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {vehicles.slice(0, 6).map((vehicle) => (
                  <div key={vehicle.id} className="p-4 border rounded-lg">
                    <img
                      src={vehicle.image || '/placeholder.jpg'}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className={
                        vehicle.status === 'available' ? 'bg-green-500' :
                        vehicle.status === 'rented' ? 'bg-orange-500' :
                        'bg-red-500'
                      }>
                        {vehicle.status}
                      </Badge>
                      <Button size="sm" variant="outline">Update</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
