export type UserRole = 'admin' | 'staff' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive?: boolean;
  _id?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: 'sedan' | 'suv' | 'luxury' | 'sports' | 'van';
  image: string;
  dailyRate: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  status: 'available' | 'rented' | 'maintenance';
  location: string;
  rating: number;
  features: string[];
}

export interface Booking {
  id: string;
  vehicleId: string;
  customerId: string;
  pickupDate: Date;
  returnDate: Date;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  location: string;
}

export interface Permission {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}
