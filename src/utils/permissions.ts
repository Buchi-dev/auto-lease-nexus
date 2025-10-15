import { UserRole } from '@/types';

export const permissions: Record<UserRole, string[]> = {
  admin: [
    'view_dashboard',
    'manage_users',
    'manage_vehicles',
    'manage_bookings',
    'view_reports',
    'manage_settings',
    'manage_pricing',
  ],
  staff: [
    'view_dashboard',
    'view_vehicles',
    'update_vehicle_status',
    'manage_bookings',
    'view_customers',
    'process_payments',
  ],
  customer: [
    'view_dashboard',
    'browse_vehicles',
    'create_booking',
    'view_bookings',
    'manage_profile',
  ]
};

export const hasPermission = (role: UserRole, permission: string): boolean => {
  return permissions[role]?.includes(permission) ?? false;
};

export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'bg-admin text-white',
    staff: 'bg-staff text-white',
    customer: 'bg-customer text-white',
  };
  return colors[role];
};

export const getRoleGradient = (role: UserRole): string => {
  const gradients: Record<UserRole, string> = {
    admin: 'admin-gradient',
    staff: 'staff-gradient',
    customer: 'customer-gradient',
  };
  return gradients[role];
};
