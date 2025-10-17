import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVehicles from "./pages/admin/Vehicles";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffVehicles from "./pages/staff/Vehicles";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import BrowseVehicles from "./pages/customer/BrowseVehicles";
import NotFound from "./pages/NotFound";
import Users from "./pages/admin/Users";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/browse" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <BrowseVehicles />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vehicles" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                {useAuthStore.getState().user?.role === 'admin' ? <AdminVehicles /> : <StaffVehicles />}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                {<Users />}
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
