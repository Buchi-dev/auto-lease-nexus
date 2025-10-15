import { motion } from 'framer-motion';
import { FaCar, FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockVehicles, mockBookings } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const myActiveBookings = mockBookings.filter(b => b.status === 'active');
  const myUpcomingBookings = mockBookings.filter(b => b.status === 'confirmed');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="customer-gradient rounded-2xl p-8 text-white"
        >
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Ride</h1>
          <p className="text-lg mb-6 opacity-90">Choose from our premium fleet of vehicles</p>
          
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Pickup Date
                  </label>
                  <Input type="date" className="bg-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Return Date
                  </label>
                  <Input type="date" className="bg-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Location
                  </label>
                  <Input placeholder="Select location" className="bg-white" />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => navigate('/browse')}
                    className="w-full customer-gradient text-white"
                  >
                    Search Vehicles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Rentals */}
        {myActiveBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-customer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaCar className="mr-2 text-customer" />
                  Active Rental
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myActiveBookings.map((booking) => {
                  const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
                  const daysLeft = Math.ceil((booking.returnDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={booking.id} className="flex flex-col md:flex-row gap-6 p-6 bg-customer-light/20 rounded-lg">
                      <img
                        src={vehicle?.image}
                        alt={`${vehicle?.make} ${vehicle?.model}`}
                        className="w-full md:w-64 h-48 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold">{vehicle?.make} {vehicle?.model}</h3>
                            <p className="text-muted-foreground">{booking.id}</p>
                          </div>
                          <Badge className="bg-customer text-white">Active</Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-customer" />
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p className="font-medium">{booking.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-customer" />
                            <div>
                              <p className="text-sm text-muted-foreground">Return Date</p>
                              <p className="font-medium">{booking.returnDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-2 text-customer" />
                            <div>
                              <p className="text-sm text-muted-foreground">Days Left</p>
                              <p className="font-medium text-customer">{daysLeft} days</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button variant="outline">Extend Rental</Button>
                          <Button variant="outline">Contact Support</Button>
                          <Button className="customer-gradient text-white">View Details</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upcoming Reservations */}
        {myUpcomingBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myUpcomingBookings.map((booking) => {
                  const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={vehicle?.image}
                          alt={`${vehicle?.make} ${vehicle?.model}`}
                          className="w-20 h-20 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold">{vehicle?.make} {vehicle?.model}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.pickupDate.toLocaleDateString()} - {booking.returnDate.toLocaleDateString()}
                          </p>
                          <Badge variant="secondary" className="mt-1">{booking.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Modify</Button>
                        <Button variant="outline" size="sm">Cancel</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Vehicles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Featured Vehicles</CardTitle>
                <CardDescription>Popular choices from our fleet</CardDescription>
              </div>
              <Button onClick={() => navigate('/browse')} variant="outline">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {mockVehicles.filter(v => v.status === 'available').slice(0, 3).map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ y: -8 }}
                  className="border rounded-lg overflow-hidden card-hover"
                >
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-customer">${vehicle.dailyRate}</p>
                        <p className="text-xs text-muted-foreground">per day</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <span>{vehicle.seats} seats</span>
                      <span>{vehicle.transmission}</span>
                      <span>⭐ {vehicle.rating}</span>
                    </div>
                    <Button className="w-full mt-4 customer-gradient text-white">
                      Book Now
                    </Button>
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
