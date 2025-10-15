import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCar, FaChartBar, FaUsers, FaCog, FaFileInvoiceDollar, 
  FaTachometerAlt, FaCalendarAlt, FaUserCircle, FaSignOutAlt,
  FaBars, FaTimes, FaClipboardList, FaTools
} from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { hasPermission, getRoleColor } from '@/utils/permissions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  permission: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt, permission: 'view_dashboard' },
  { label: 'Vehicles', path: '/vehicles', icon: FaCar, permission: 'manage_vehicles' },
  { label: 'Bookings', path: '/bookings', icon: FaCalendarAlt, permission: 'manage_bookings' },
  { label: 'Customers', path: '/customers', icon: FaUsers, permission: 'view_customers' },
  { label: 'Reports', path: '/reports', icon: FaChartBar, permission: 'view_reports' },
  { label: 'Settings', path: '/settings', icon: FaCog, permission: 'manage_settings' },
];

const customerNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt, permission: 'view_dashboard' },
  { label: 'Browse Vehicles', path: '/browse', icon: FaCar, permission: 'browse_vehicles' },
  { label: 'My Bookings', path: '/my-bookings', icon: FaCalendarAlt, permission: 'view_bookings' },
  { label: 'Profile', path: '/profile', icon: FaUserCircle, permission: 'manage_profile' },
];

const staffNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt, permission: 'view_dashboard' },
  { label: 'Vehicles', path: '/vehicles', icon: FaCar, permission: 'view_vehicles' },
  { label: 'Bookings', path: '/bookings', icon: FaClipboardList, permission: 'manage_bookings' },
  { label: 'Customers', path: '/customers', icon: FaUsers, permission: 'view_customers' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const items = user.role === 'customer' ? customerNavItems : 
                user.role === 'staff' ? staffNavItems : navItems;
  const filteredItems = items.filter(item => hasPermission(user.role, item.permission));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <FaCar className="text-2xl text-primary" />
            {!collapsed && <span className="text-xl font-bold">RentDrive</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="lg:flex hidden"
          >
            <FaBars />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <FaTimes />
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <Badge className={cn("text-xs mt-1", getRoleColor(user.role))}>
                {user.role.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-accent text-foreground",
                collapsed && "justify-center"
              )}
            >
              <Icon className="text-lg" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn("w-full", collapsed && "px-2")}
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50"
      >
        <FaBars />
      </Button>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block fixed left-0 top-0 h-screen transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
