import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaUsers, FaCog, FaGasPump, FaStar, FaFilter } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api, type ListVehiclesParams } from '@/lib/api';
import type { Vehicle } from '@/types';

export default function BrowseVehicles() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['all', 'sedan', 'suv', 'luxury', 'sports', 'van'];

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const sortMap: Record<string, ListVehiclesParams['sortBy']> = {
        popular: 'popular',
        rating: 'rating',
        'price-low': 'price_asc',
        'price-high': 'price_desc',
      };
      const params: ListVehiclesParams = { page: 1, limit: 30, sortBy: sortMap[sortBy] || 'popular' };
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const res = await api.listVehicles(params);
      setVehicles(res.data);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vehicles');
      setVehicles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Browse Vehicles</h1>
            <p className="text-muted-foreground">{total} vehicles available</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <FaFilter className="mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="w-64 space-y-6"
              >
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Category</h3>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={selectedCategory === cat}
                              onCheckedChange={() => setSelectedCategory(cat)}
                            />
                            <span className="text-sm capitalize">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Transmission</h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox />
                          <span className="text-sm">Automatic</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox />
                          <span className="text-sm">Manual</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Fuel Type</h3>
                      <div className="space-y-2">
                        {['petrol', 'diesel', 'electric', 'hybrid'].map((fuel) => (
                          <label key={fuel} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox />
                            <span className="text-sm capitalize">{fuel}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full customer-gradient text-white">
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Vehicle Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {loading ? 'Loading…' : `Showing ${vehicles.length} results`}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Cards */}
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden card-hover">
                    <div className="relative">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-48 object-cover"
                      />
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          vehicle.status === 'available' ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{vehicle.make} {vehicle.model}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{vehicle.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-customer">${vehicle.dailyRate}</p>
                          <p className="text-xs text-muted-foreground">per day</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <FaUsers className="mr-1" />
                          <span>{vehicle.seats}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCog className="mr-1" />
                          <span className="capitalize">{vehicle.transmission[0]}</span>
                        </div>
                        <div className="flex items-center">
                          <FaGasPump className="mr-1" />
                          <span className="capitalize">{vehicle.fuelType[0]}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{vehicle.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{vehicle.location}</p>
                      </div>

                      <Button className="w-full customer-gradient text-white">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
