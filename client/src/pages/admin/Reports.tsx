import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartBar, FaChartLine, FaChartPie, FaDownload,
  FaDollarSign, FaCar, FaUsers, FaCalendarAlt
} from 'react-icons/fa';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [timeRange, setTimeRange] = useState('month');

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const bookingsData = {
    labels: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [15, 45, 20, 150, 8],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const vehicleUtilizationData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Utilization %',
        data: [75, 82, 88, 79],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: '$123,000',
      change: '+12.5%',
      icon: FaDollarSign,
      color: 'text-green-500',
      changePositive: true,
    },
    {
      title: 'Active Vehicles',
      value: '48',
      change: '+3',
      icon: FaCar,
      color: 'text-blue-500',
      changePositive: true,
    },
    {
      title: 'Total Customers',
      value: '1,234',
      change: '+8.2%',
      icon: FaUsers,
      color: 'text-purple-500',
      changePositive: true,
    },
    {
      title: 'Bookings',
      value: '238',
      change: '+15.3%',
      icon: FaCalendarAlt,
      color: 'text-orange-500',
      changePositive: true,
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive business insights and analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <FaDownload className="mr-2" />
              Export
            </Button>
          </div>
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
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.changePositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from last period
                      </p>
                    </div>
                    <stat.icon className={`text-3xl ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="utilization">Utilization</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue trends over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar data={revenueData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings Distribution</CardTitle>
                  <CardDescription>
                    Current status of all bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="w-full max-w-[300px]">
                      <Pie data={bookingsData} options={chartOptions} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Statistics</CardTitle>
                  <CardDescription>
                    Detailed breakdown of booking metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Average Booking Value', value: '$520' },
                      { label: 'Average Rental Duration', value: '4.2 days' },
                      { label: 'Completion Rate', value: '94%' },
                      { label: 'Cancellation Rate', value: '3.4%' },
                      { label: 'Customer Satisfaction', value: '4.7/5' },
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="font-semibold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="utilization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Utilization Rate</CardTitle>
                <CardDescription>
                  Average fleet utilization over the past month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line data={vehicleUtilizationData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Insights */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Tesla Model 3', bookings: 45 },
                  { name: 'BMW X5', bookings: 38 },
                  { name: 'Mercedes C-Class', bookings: 32 },
                ].map((vehicle) => (
                  <div key={vehicle.name} className="flex items-center justify-between">
                    <span className="text-sm">{vehicle.name}</span>
                    <span className="text-sm font-semibold">{vehicle.bookings} bookings</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Peak Booking Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: 'Weekends', percentage: '42%' },
                  { time: 'Weekdays', percentage: '35%' },
                  { time: 'Holidays', percentage: '23%' },
                ].map((time) => (
                  <div key={time.time} className="flex items-center justify-between">
                    <span className="text-sm">{time.time}</span>
                    <span className="text-sm font-semibold">{time.percentage}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { location: 'Downtown Office', count: 89 },
                  { location: 'Airport Terminal', count: 76 },
                  { location: 'North Branch', count: 54 },
                ].map((loc) => (
                  <div key={loc.location} className="flex items-center justify-between">
                    <span className="text-sm">{loc.location}</span>
                    <span className="text-sm font-semibold">{loc.count} pickups</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
