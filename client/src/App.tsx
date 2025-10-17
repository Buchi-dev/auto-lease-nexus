import { Suspense, lazy, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// ============================================================================
// Lazy Loaded Components
// ============================================================================

// Public pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminVehicles = lazy(() => import("./pages/admin/Vehicles"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));

// Staff pages
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const StaffVehicles = lazy(() => import("./pages/staff/Vehicles"));
const StaffBookings = lazy(() => import("./pages/staff/Bookings"));

// Customer pages
const CustomerDashboard = lazy(() => import("./pages/customer/CustomerDashboard"));
const CustomerBrowseVehicles = lazy(() => import("./pages/customer/BrowseVehicles"));
const CustomerBookings = lazy(() => import("./pages/customer/MyBookings"));
const CustomerProfile = lazy(() => import("./pages/customer/Profile"));

// ============================================================================
// Configuration
// ============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// ============================================================================
// Components
// ============================================================================

// Minimal loading fallback that doesn't take up space
const LoadingFallback = memo(() => (
  <div className="fixed top-0 left-0 right-0 h-1 z-50">
    <div className="h-full bg-primary animate-pulse" style={{ width: '70%' }} />
  </div>
));
LoadingFallback.displayName = 'LoadingFallback';

// Page-level loading skeleton
const PageLoadingSkeleton = memo(() => (
  <div className="p-6 space-y-4 animate-pulse">
    <div className="h-8 bg-muted rounded w-1/4" />
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="h-4 bg-muted rounded w-2/3" />
    <div className="grid grid-cols-3 gap-4 mt-8">
      <div className="h-32 bg-muted rounded" />
      <div className="h-32 bg-muted rounded" />
      <div className="h-32 bg-muted rounded" />
    </div>
  </div>
));
PageLoadingSkeleton.displayName = 'PageLoadingSkeleton';

// Dashboard router with early return pattern
const DashboardRouter = memo(() => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;
  
  const DASHBOARD_MAP = {
    admin: AdminDashboard,
    staff: StaffDashboard,
    customer: CustomerDashboard,
  } as const;
  
  const DashboardComponent = DASHBOARD_MAP[user.role as keyof typeof DASHBOARD_MAP];
  
  return DashboardComponent ? <DashboardComponent /> : <Navigate to="/login" replace />;
});
DashboardRouter.displayName = 'DashboardRouter';

// Vehicle router for role-based routing
const VehicleRouter = memo(() => {
  const { user } = useAuthStore();
  return user?.role === 'admin' ? <AdminVehicles /> : <StaffVehicles />;
});
VehicleRouter.displayName = 'VehicleRouter';

// Bookings router for admin/staff
const BookingsRouter = memo(() => {
  const { user } = useAuthStore();
  return user?.role === 'admin' ? <AdminBookings /> : <StaffBookings />;
});
BookingsRouter.displayName = 'BookingsRouter';

// Layout wrapper with nested Suspense to prevent layout flicker
const ProtectedLayoutRoute = memo(({ allowedRoles }: { allowedRoles?: UserRole[] }) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    <DashboardLayout>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  </ProtectedRoute>
));
ProtectedLayoutRoute.displayName = 'ProtectedLayoutRoute';

// ============================================================================
// Main App Component
// ============================================================================

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* ========== Public Routes ========== */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route 
                path="/login" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Login />
                  </Suspense>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Register />
                  </Suspense>
                } 
              />
              <Route 
                path="/unauthorized" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Unauthorized />
                  </Suspense>
                } 
              />

              {/* ========== Dashboard Routes (All Roles) ========== */}
              <Route element={<ProtectedLayoutRoute />}>
                <Route path="/dashboard" element={<DashboardRouter />} />
              </Route>

              {/* ========== Customer Routes ========== */}
              <Route element={<ProtectedLayoutRoute allowedRoles={['customer']} />}>
                <Route path="/vehicles" element={<CustomerBrowseVehicles />} />
                <Route path="/bookings" element={<CustomerBookings />} />
                <Route path="/profile" element={<CustomerProfile />} />
              </Route>

              {/* ========== Staff Routes ========== */}
              <Route element={<ProtectedLayoutRoute allowedRoles={['staff']} />}>
                <Route path="/staff/vehicles" element={<StaffVehicles />} />
                <Route path="/staff/bookings" element={<StaffBookings />} />
              </Route>

              {/* ========== Admin Routes ========== */}
              <Route element={<ProtectedLayoutRoute allowedRoles={['admin']} />}>
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/vehicles" element={<AdminVehicles />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              {/* ========== 404 Catch-All ========== */}
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <NotFound />
                  </Suspense>
                } 
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
