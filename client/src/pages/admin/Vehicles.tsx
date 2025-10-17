import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCar, FaCheckCircle, FaTools, FaArrowUp } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import type { Vehicle } from '@/types';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.listVehicles({ page: 1, limit: 50, sortBy: 'popular' });
        setVehicles(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    {
      title: 'Total Vehicles',
      value: vehicles.length,
      icon: FaCar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+12',
      changePositive: true,
    },
    {
      title: 'Available',
      value: vehicles.filter(v => v.status === 'available').length,
      icon: FaCheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: '+5',
      changePositive: true,
    },
    {
      title: 'Rented',
      value: vehicles.filter(v => v.status === 'rented').length,
      icon: FaCar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      change: '+8',
      changePositive: true,
    },
    {
      title: 'Maintenance',
      value: vehicles.filter(v => v.status === 'maintenance').length,
      icon: FaTools,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      change: '-2',
      changePositive: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      available: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      rented: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
      maintenance: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    };
    return variants[status] || 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Manage your entire fleet and vehicle inventory
          </p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <FaPlus className="mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
                    <stat.icon className={`text-2xl ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Vehicles</CardTitle>
          <CardDescription>Search and filter your vehicle inventory</CardDescription>
        </CardHeader>
        <CardContent>
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

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
          <CardDescription>
            {vehicles.length} vehicle(s) in inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading vehicles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.year} • {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusBadge(vehicle.status)}>
                          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">📍 {vehicle.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-500">${vehicle.dailyRate}</p>
                      <p className="text-xs text-muted-foreground">per day</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FaEye className="mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <FaEdit className="mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500">
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
