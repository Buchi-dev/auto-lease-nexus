import { useState, useMemo, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCar, 
  FaChartBar, 
  FaUsers, 
  FaCog, 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaUserCircle, 
  FaSignOutAlt,
  FaBars, 
  FaTimes, 
  FaClipboardList,
} from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { hasPermission, getRoleColor } from '@/utils/permissions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  permission: string;
}

interface SidebarContentProps {
  collapsed: boolean;
  filteredItems: NavItem[];
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onCloseMobile: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const NAVIGATION_CONFIG = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt, permission: 'view_dashboard' },
    { label: 'Users', path: '/admin/users', icon: FaUsers, permission: 'manage_users' },
    { label: 'Vehicles', path: '/admin/vehicles', icon: FaCar, permission: 'manage_vehicles' },
    { label: 'Bookings', path: '/admin/bookings', icon: FaCalendarAlt, permission: 'manage_bookings' },
    { label: 'Customers', path: '/admin/customers', icon: FaUsers, permission: 'view_customers' },
    { label: 'Reports', path: '/admin/reports', icon: FaChartBar, permission: 'view_reports' },
    { label: 'Settings', path: '/admin/settings', icon: FaCog, permission: 'manage_settings' },
  ],
  customer: [
    { label: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt, permission: 'view_dashboard' },
    { label: 'Vehicles', path: '/vehicles', icon: FaCar, permission: 'browse_vehicles' },
    { label: 'Bookings', path: '/bookings', icon: FaCalendarAlt, permission: 'view_bookings' },
    { label: 'Profile', path: '/profile', icon: FaUserCircle, permission: 'manage_profile' },
  ],
  staff: [
    { label: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt, permission: 'view_dashboard' },
    { label: 'Vehicles', path: '/staff/vehicles', icon: FaCar, permission: 'view_vehicles' },
    { label: 'Bookings', path: '/staff/bookings', icon: FaClipboardList, permission: 'manage_bookings' },
  ],
} as const;

const ANIMATION_VARIANTS = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  sidebar: {
    initial: { x: -280 },
    animate: { x: 0 },
    exit: { x: -280 },
  },
} as const;

// ============================================================================
// Subcomponents
// ============================================================================

const SidebarHeader = memo(({ collapsed, onToggleCollapse, onCloseMobile }: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}) => (
  <div className="p-4 border-b border-border">
    <div className="flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center space-x-2">
        <FaCar className="text-2xl text-primary" />
        {!collapsed && <span className="text-xl font-bold">RentDrive</span>}
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="lg:flex hidden"
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCloseMobile}
        className="lg:hidden"
        aria-label="Close sidebar"
      >
        <FaTimes />
      </Button>
    </div>
  </div>
));
SidebarHeader.displayName = 'SidebarHeader';

const UserInfo = memo(({ collapsed }: { collapsed: boolean }) => {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
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
  );
});
UserInfo.displayName = 'UserInfo';

const NavLink = memo(({ item, isActive, collapsed, onCloseMobile }: NavLinkProps) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.path}
      onClick={onCloseMobile}
      className={cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all",
        isActive 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "hover:bg-accent text-foreground",
        collapsed && "justify-center"
      )}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="text-lg" />
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
    </Link>
  );
});
NavLink.displayName = 'NavLink';

const Navigation = memo(({ items, collapsed, onCloseMobile }: {
  items: NavItem[];
  collapsed: boolean;
  onCloseMobile: () => void;
}) => {
  const location = useLocation();

  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-2" role="navigation">
      {items.map((item) => (
        <NavLink
          key={item.path}
          item={item}
          isActive={location.pathname === item.path}
          collapsed={collapsed}
          onCloseMobile={onCloseMobile}
        />
      ))}
    </nav>
  );
});
Navigation.displayName = 'Navigation';

const LogoutButton = memo(({ collapsed, onLogout }: {
  collapsed: boolean;
  onLogout: () => void;
}) => (
  <div className="p-4 border-t border-border">
    <Button
      variant="ghost"
      onClick={onLogout}
      className={cn("w-full", collapsed && "px-2")}
      aria-label="Logout"
    >
      <FaSignOutAlt className="text-lg" />
      {!collapsed && <span className="ml-2">Logout</span>}
    </Button>
  </div>
));
LogoutButton.displayName = 'LogoutButton';

const SidebarContent = memo(({ 
  collapsed, 
  filteredItems, 
  onToggleCollapse, 
  onCloseMobile, 
  onLogout 
}: SidebarContentProps) => (
  <div className="flex flex-col h-full bg-card border-r border-border">
    <SidebarHeader 
      collapsed={collapsed} 
      onToggleCollapse={onToggleCollapse}
      onCloseMobile={onCloseMobile}
    />
    <UserInfo collapsed={collapsed} />
    <Navigation 
      items={filteredItems} 
      collapsed={collapsed}
      onCloseMobile={onCloseMobile}
    />
    <LogoutButton collapsed={collapsed} onLogout={onLogout} />
  </div>
));
SidebarContent.displayName = 'SidebarContent';

// ============================================================================
// Main Component
// ============================================================================

export const Sidebar = memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Memoize navigation items based on user role
  const navItems = useMemo(() => {
    if (!user) return [];
    return NAVIGATION_CONFIG[user.role as keyof typeof NAVIGATION_CONFIG] || [];
  }, [user?.role]);

  // Memoize filtered items based on permissions
  const filteredItems = useMemo(() => {
    if (!user) return [];
    return navItems.filter(item => hasPermission(user.role, item.permission));
  }, [navItems, user?.role]);

  // Memoized callbacks
  const handleToggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
    setMobileOpen(false);
  }, []);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleOpenMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Early return if no user
  if (!user) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpenMobile}
        className="lg:hidden fixed top-4 left-4 z-50"
        aria-label="Open sidebar"
      >
        <FaBars />
      </Button>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:block fixed left-0 top-0 h-screen transition-all duration-300 z-40",
          collapsed ? "w-20" : "w-64"
        )}
        role="complementary"
        aria-label="Main navigation"
      >
        <SidebarContent
          collapsed={collapsed}
          filteredItems={filteredItems}
          onToggleCollapse={handleToggleCollapse}
          onCloseMobile={handleCloseMobile}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              {...ANIMATION_VARIANTS.overlay}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseMobile}
              aria-hidden="true"
            />
            <motion.aside
              {...ANIMATION_VARIANTS.sidebar}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 z-50"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <SidebarContent
                collapsed={false}
                filteredItems={filteredItems}
                onToggleCollapse={handleToggleCollapse}
                onCloseMobile={handleCloseMobile}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
Sidebar.displayName = 'Sidebar';
